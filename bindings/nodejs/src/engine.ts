/**
 * OSP Sync Engine - Vector Clock, LWW merge, offline-first storage
 */

import { v7 as uuidv7 } from 'uuid';
import {
  VectorClock,
  FieldMeta,
  Value,
  FieldChange,
  OperationMsg,
  RecordMsg,
  OpKind,
  CollectionId,
  RecordId,
  DeviceId,
  OpId,
  Predicate,
  PredicateKind,
} from './types';

export class VectorClockImpl {
  private entries: Map<DeviceId, number> = new Map();

  constructor(initial?: VectorClock) {
    if (initial) {
      Object.entries(initial.entries).forEach(([k, v]) => this.entries.set(k, v));
    }
  }

  get(deviceId: DeviceId): number {
    return this.entries.get(deviceId) || 0;
  }

  set(deviceId: DeviceId, lamport: number) {
    this.entries.set(deviceId, lamport);
  }

  increment(deviceId: DeviceId): number {
    const current = this.get(deviceId);
    const next = current + 1;
    this.entries.set(deviceId, next);
    return next;
  }

  merge(other: VectorClockImpl) {
    for (const [device, lamport] of other.entries) {
      const current = this.get(device);
      if (lamport > current) {
        this.entries.set(device, lamport);
      }
    }
  }

  dominates(other: VectorClockImpl): boolean {
    for (const [device, lamport] of other.entries) {
      if (this.get(device) < lamport) return false;
    }
    return true;
  }

  toVectorClock(): VectorClock {
    const entries: Record<string, number> = {};
    this.entries.forEach((v, k) => (entries[k] = v));
    return { entries };
  }

  clone(): VectorClockImpl {
    return new VectorClockImpl(this.toVectorClock());
  }
}

interface FieldValue {
  value: Value;
  meta: FieldMeta;
}

interface Record {
  id: RecordId;
  revision: number;
  vectorClock: VectorClockImpl;
  fields: Map<string, FieldValue>;
  tombstone: boolean;
}

interface Collection {
  id: CollectionId;
  records: Map<RecordId, Record>;
}

export class SyncEngine {
  private collections: Map<CollectionId, Collection> = new Map();
  private opLog: Map<OpId, OperationMsg> = new Map();
  private localLamport = 0;
  private deviceId: DeviceId;

  constructor(deviceId: DeviceId) {
    this.deviceId = deviceId;
  }

  private getCollection(id: CollectionId): Collection {
    let coll = this.collections.get(id);
    if (!coll) {
      coll = { id, records: new Map() };
      this.collections.set(id, coll);
    }
    return coll;
  }

  private getRecord(coll: Collection, id: RecordId): Record {
    let rec = coll.records.get(id);
    if (!rec) {
      rec = {
        id,
        revision: 0,
        vectorClock: new VectorClockImpl(),
        fields: new Map(),
        tombstone: false,
      };
      coll.records.set(id, rec);
    }
    return rec;
  }

  localSetField(coll: CollectionId, recordId: RecordId, field: string, value: Value): OperationMsg {
    this.localLamport++;
    const opId = uuidv7() as OpId;
    const collection = this.getCollection(coll);
    const record = this.getRecord(collection, recordId);

    const change: FieldChange = {
      field_name: field,
      new_value: value,
      lamport: this.localLamport,
      writer_device_id: this.deviceId,
    };

    // Apply locally
    record.fields.set(field, {
      value,
      meta: { lamport: this.localLamport, writer_device_id: this.deviceId },
    });
    record.vectorClock.increment(this.deviceId);
    record.revision++;

    const op: OperationMsg = {
      op_id: opId,
      device_id: this.deviceId,
      lamport: this.localLamport,
      collection: coll,
      record_id: recordId,
      kind: OpKind.Update,
      field_changes: [change],
      base_clock: record.vectorClock.toVectorClock(),
      timestamp_ms: Date.now(),
    };

    this.opLog.set(opId, op);
    return op;
  }

  localDelete(coll: CollectionId, recordId: RecordId): OperationMsg {
    this.localLamport++;
    const opId = uuidv7() as OpId;
    const collection = this.getCollection(coll);
    const record = this.getRecord(collection, recordId);

    record.tombstone = true;
    record.vectorClock.increment(this.deviceId);
    record.revision++;

    const op: OperationMsg = {
      op_id: opId,
      device_id: this.deviceId,
      lamport: this.localLamport,
      collection: coll,
      record_id: recordId,
      kind: OpKind.Delete,
      field_changes: [],
      base_clock: record.vectorClock.toVectorClock(),
      timestamp_ms: Date.now(),
    };

    this.opLog.set(opId, op);
    return op;
  }

  localRestore(coll: CollectionId, recordId: RecordId): OperationMsg {
    this.localLamport++;
    const opId = uuidv7() as OpId;
    const collection = this.getCollection(coll);
    const record = this.getRecord(collection, recordId);

    record.tombstone = false;
    record.vectorClock.increment(this.deviceId);
    record.revision++;

    const op: OperationMsg = {
      op_id: opId,
      device_id: this.deviceId,
      lamport: this.localLamport,
      collection: coll,
      record_id: recordId,
      kind: OpKind.Restore,
      field_changes: [],
      base_clock: record.vectorClock.toVectorClock(),
      timestamp_ms: Date.now(),
    };

    this.opLog.set(opId, op);
    return op;
  }

  applyRemote(op: OperationMsg): boolean {
    // Idempotency check
    if (this.opLog.has(op.op_id)) return false;

    const collection = this.getCollection(op.collection);
    const record = this.getRecord(collection, op.record_id);

    // Update local lamport
    this.localLamport = Math.max(this.localLamport, op.lamport);

    // Apply operation
    if (op.kind === OpKind.Delete) {
      record.tombstone = true;
    } else if (op.kind === OpKind.Restore) {
      record.tombstone = false;
    } else {
      // Insert/Update: LWW merge per field
      for (const change of op.field_changes) {
        const existing = record.fields.get(change.field_name);
        const incoming = { lamport: change.lamport, writer_device_id: change.writer_device_id };

        // Compare (lamport, device_id) lexicographically
        if (
          !existing ||
          incoming.lamport > existing.meta.lamport ||
          (incoming.lamport === existing.meta.lamport &&
            incoming.writer_device_id > existing.meta.writer_device_id)
        ) {
          record.fields.set(change.field_name, {
            value: change.new_value,
            meta: incoming,
          });
        }
      }
    }

    // Merge vector clocks
    record.vectorClock.merge(new VectorClockImpl(op.base_clock));
    record.revision++;

    this.opLog.set(op.op_id, op);
    return true;
  }

  getRecord(coll: CollectionId, recordId: RecordId): RecordMsg | null {
    const collection = this.collections.get(coll);
    if (!collection) return null;
    const record = collection.records.get(recordId);
    if (!record) return null;

    const fields: Record<string, Value> = {};
    const fieldMeta: Record<string, FieldMeta> = {};
    for (const [name, fv] of record.fields) {
      fields[name] = fv.value;
      fieldMeta[name] = fv.meta;
    }

    return {
      collection: coll,
      record_id: recordId,
      revision: record.revision,
      vector_clock: record.vectorClock.toVectorClock(),
      tombstone: record.tombstone,
      fields,
      field_meta: fieldMeta,
      updated_at_ms: Date.now(),
    };
  }

  listRecords(coll: CollectionId, predicate?: Predicate): RecordMsg[] {
    const collection = this.collections.get(coll);
    if (!collection) return [];

    const records: RecordMsg[] = [];
    for (const [id, rec] of collection.records) {
      const recMsg = this.getRecord(coll, id);
      if (recMsg && (!predicate || matchesPredicate(recMsg, predicate))) {
        records.push(recMsg);
      }
    }
    return records;
  }

  getOpLog(sinceLamport: number): OperationMsg[] {
    return Array.from(this.opLog.values()).filter((op) => op.lamport > sinceLamport);
  }

  hasOp(opId: OpId): boolean {
    return this.opLog.has(opId);
  }
}

function matchesPredicate(rec: RecordMsg, pred: Predicate): boolean {
  const getValue = (field: string): Value => rec.fields[field];

  switch (pred.kind) {
    case PredicateKind.Eq:
      return getValue(pred.field!) === pred.value;
    case PredicateKind.Ne:
      return getValue(pred.field!) !== pred.value;
    case PredicateKind.Lt:
      return (getValue(pred.field!) as number) < (pred.value as number);
    case PredicateKind.Le:
      return (getValue(pred.field!) as number) <= (pred.value as number);
    case PredicateKind.Gt:
      return (getValue(pred.field!) as number) > (pred.value as number);
    case PredicateKind.Ge:
      return (getValue(pred.field!) as number) >= (pred.value as number);
    case PredicateKind.In:
      return pred.values!.includes(getValue(pred.field!));
    case PredicateKind.And:
      return pred.children!.every((child) => matchesPredicate(rec, child));
    case PredicateKind.Or:
      return pred.children!.some((child) => matchesPredicate(rec, child));
    case PredicateKind.Not:
      return !matchesPredicate(rec, pred.child!);
    default:
      return true;
  }
}
