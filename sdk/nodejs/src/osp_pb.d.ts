import * as $protobuf from "protobufjs";
import Long = require("long");
/** Namespace osp. */
export namespace osp {

    /** Namespace v1. */
    namespace v1 {

        /** Properties of a VClock. */
        interface IVClock {

            /** VClock entries */
            entries?: ({ [k: string]: (number|Long) }|null);
        }

        /** Represents a VClock. */
        class VClock implements IVClock {

            /**
             * Constructs a new VClock.
             * @param [properties] Properties to set
             */
            constructor(properties?: osp.v1.IVClock);

            /** VClock entries. */
            public entries: { [k: string]: (number|Long) };

            /**
             * Creates a new VClock instance using the specified properties.
             * @param [properties] Properties to set
             * @returns VClock instance
             */
            public static create(properties?: osp.v1.IVClock): osp.v1.VClock;

            /**
             * Encodes the specified VClock message. Does not implicitly {@link osp.v1.VClock.verify|verify} messages.
             * @param message VClock message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: osp.v1.IVClock, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified VClock message, length delimited. Does not implicitly {@link osp.v1.VClock.verify|verify} messages.
             * @param message VClock message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: osp.v1.IVClock, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a VClock message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns VClock
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): osp.v1.VClock;

            /**
             * Decodes a VClock message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns VClock
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): osp.v1.VClock;

            /**
             * Verifies a VClock message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a VClock message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns VClock
             */
            public static fromObject(object: { [k: string]: any }): osp.v1.VClock;

            /**
             * Creates a plain object from a VClock message. Also converts values to other types if specified.
             * @param message VClock
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: osp.v1.VClock, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this VClock to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for VClock
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a Value. */
        interface IValue {

            /** Value nullValue */
            nullValue?: (boolean|null);

            /** Value boolValue */
            boolValue?: (boolean|null);

            /** Value intValue */
            intValue?: (number|Long|null);

            /** Value doubleValue */
            doubleValue?: (number|null);

            /** Value stringValue */
            stringValue?: (string|null);

            /** Value bytesValue */
            bytesValue?: (Uint8Array|null);

            /** Value arrayValue */
            arrayValue?: (osp.v1.IValueArray|null);

            /** Value objectValue */
            objectValue?: (osp.v1.IValueMap|null);
        }

        /** Represents a Value. */
        class Value implements IValue {

            /**
             * Constructs a new Value.
             * @param [properties] Properties to set
             */
            constructor(properties?: osp.v1.IValue);

            /** Value nullValue. */
            public nullValue?: (boolean|null);

            /** Value boolValue. */
            public boolValue?: (boolean|null);

            /** Value intValue. */
            public intValue?: (number|Long|null);

            /** Value doubleValue. */
            public doubleValue?: (number|null);

            /** Value stringValue. */
            public stringValue?: (string|null);

            /** Value bytesValue. */
            public bytesValue?: (Uint8Array|null);

            /** Value arrayValue. */
            public arrayValue?: (osp.v1.IValueArray|null);

            /** Value objectValue. */
            public objectValue?: (osp.v1.IValueMap|null);

            /** Value kind. */
            public kind?: ("nullValue"|"boolValue"|"intValue"|"doubleValue"|"stringValue"|"bytesValue"|"arrayValue"|"objectValue");

            /**
             * Creates a new Value instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Value instance
             */
            public static create(properties?: osp.v1.IValue): osp.v1.Value;

            /**
             * Encodes the specified Value message. Does not implicitly {@link osp.v1.Value.verify|verify} messages.
             * @param message Value message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: osp.v1.IValue, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Value message, length delimited. Does not implicitly {@link osp.v1.Value.verify|verify} messages.
             * @param message Value message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: osp.v1.IValue, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Value message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): osp.v1.Value;

            /**
             * Decodes a Value message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): osp.v1.Value;

            /**
             * Verifies a Value message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Value message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Value
             */
            public static fromObject(object: { [k: string]: any }): osp.v1.Value;

            /**
             * Creates a plain object from a Value message. Also converts values to other types if specified.
             * @param message Value
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: osp.v1.Value, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Value to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for Value
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a ValueArray. */
        interface IValueArray {

            /** ValueArray items */
            items?: (osp.v1.IValue[]|null);
        }

        /** Represents a ValueArray. */
        class ValueArray implements IValueArray {

            /**
             * Constructs a new ValueArray.
             * @param [properties] Properties to set
             */
            constructor(properties?: osp.v1.IValueArray);

            /** ValueArray items. */
            public items: osp.v1.IValue[];

            /**
             * Creates a new ValueArray instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ValueArray instance
             */
            public static create(properties?: osp.v1.IValueArray): osp.v1.ValueArray;

            /**
             * Encodes the specified ValueArray message. Does not implicitly {@link osp.v1.ValueArray.verify|verify} messages.
             * @param message ValueArray message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: osp.v1.IValueArray, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ValueArray message, length delimited. Does not implicitly {@link osp.v1.ValueArray.verify|verify} messages.
             * @param message ValueArray message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: osp.v1.IValueArray, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a ValueArray message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ValueArray
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): osp.v1.ValueArray;

            /**
             * Decodes a ValueArray message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ValueArray
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): osp.v1.ValueArray;

            /**
             * Verifies a ValueArray message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a ValueArray message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ValueArray
             */
            public static fromObject(object: { [k: string]: any }): osp.v1.ValueArray;

            /**
             * Creates a plain object from a ValueArray message. Also converts values to other types if specified.
             * @param message ValueArray
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: osp.v1.ValueArray, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ValueArray to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for ValueArray
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a ValueMap. */
        interface IValueMap {

            /** ValueMap entries */
            entries?: ({ [k: string]: osp.v1.IValue }|null);
        }

        /** Represents a ValueMap. */
        class ValueMap implements IValueMap {

            /**
             * Constructs a new ValueMap.
             * @param [properties] Properties to set
             */
            constructor(properties?: osp.v1.IValueMap);

            /** ValueMap entries. */
            public entries: { [k: string]: osp.v1.IValue };

            /**
             * Creates a new ValueMap instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ValueMap instance
             */
            public static create(properties?: osp.v1.IValueMap): osp.v1.ValueMap;

            /**
             * Encodes the specified ValueMap message. Does not implicitly {@link osp.v1.ValueMap.verify|verify} messages.
             * @param message ValueMap message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: osp.v1.IValueMap, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ValueMap message, length delimited. Does not implicitly {@link osp.v1.ValueMap.verify|verify} messages.
             * @param message ValueMap message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: osp.v1.IValueMap, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a ValueMap message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ValueMap
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): osp.v1.ValueMap;

            /**
             * Decodes a ValueMap message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ValueMap
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): osp.v1.ValueMap;

            /**
             * Verifies a ValueMap message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a ValueMap message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ValueMap
             */
            public static fromObject(object: { [k: string]: any }): osp.v1.ValueMap;

            /**
             * Creates a plain object from a ValueMap message. Also converts values to other types if specified.
             * @param message ValueMap
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: osp.v1.ValueMap, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ValueMap to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for ValueMap
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a FieldChange. */
        interface IFieldChange {

            /** FieldChange fieldName */
            fieldName?: (string|null);

            /** FieldChange newValue */
            newValue?: (osp.v1.IValue|null);

            /** FieldChange lamport */
            lamport?: (number|Long|null);

            /** FieldChange writerDeviceId */
            writerDeviceId?: (string|null);
        }

        /** Represents a FieldChange. */
        class FieldChange implements IFieldChange {

            /**
             * Constructs a new FieldChange.
             * @param [properties] Properties to set
             */
            constructor(properties?: osp.v1.IFieldChange);

            /** FieldChange fieldName. */
            public fieldName: string;

            /** FieldChange newValue. */
            public newValue?: (osp.v1.IValue|null);

            /** FieldChange lamport. */
            public lamport: (number|Long);

            /** FieldChange writerDeviceId. */
            public writerDeviceId: string;

            /**
             * Creates a new FieldChange instance using the specified properties.
             * @param [properties] Properties to set
             * @returns FieldChange instance
             */
            public static create(properties?: osp.v1.IFieldChange): osp.v1.FieldChange;

            /**
             * Encodes the specified FieldChange message. Does not implicitly {@link osp.v1.FieldChange.verify|verify} messages.
             * @param message FieldChange message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: osp.v1.IFieldChange, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified FieldChange message, length delimited. Does not implicitly {@link osp.v1.FieldChange.verify|verify} messages.
             * @param message FieldChange message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: osp.v1.IFieldChange, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a FieldChange message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns FieldChange
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): osp.v1.FieldChange;

            /**
             * Decodes a FieldChange message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns FieldChange
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): osp.v1.FieldChange;

            /**
             * Verifies a FieldChange message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a FieldChange message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns FieldChange
             */
            public static fromObject(object: { [k: string]: any }): osp.v1.FieldChange;

            /**
             * Creates a plain object from a FieldChange message. Also converts values to other types if specified.
             * @param message FieldChange
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: osp.v1.FieldChange, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this FieldChange to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for FieldChange
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of an ErrorInfo. */
        interface IErrorInfo {

            /** ErrorInfo code */
            code?: (number|null);

            /** ErrorInfo message */
            message?: (string|null);

            /** ErrorInfo detail */
            detail?: (string|null);
        }

        /** Represents an ErrorInfo. */
        class ErrorInfo implements IErrorInfo {

            /**
             * Constructs a new ErrorInfo.
             * @param [properties] Properties to set
             */
            constructor(properties?: osp.v1.IErrorInfo);

            /** ErrorInfo code. */
            public code: number;

            /** ErrorInfo message. */
            public message: string;

            /** ErrorInfo detail. */
            public detail: string;

            /**
             * Creates a new ErrorInfo instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ErrorInfo instance
             */
            public static create(properties?: osp.v1.IErrorInfo): osp.v1.ErrorInfo;

            /**
             * Encodes the specified ErrorInfo message. Does not implicitly {@link osp.v1.ErrorInfo.verify|verify} messages.
             * @param message ErrorInfo message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: osp.v1.IErrorInfo, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ErrorInfo message, length delimited. Does not implicitly {@link osp.v1.ErrorInfo.verify|verify} messages.
             * @param message ErrorInfo message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: osp.v1.IErrorInfo, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an ErrorInfo message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ErrorInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): osp.v1.ErrorInfo;

            /**
             * Decodes an ErrorInfo message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ErrorInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): osp.v1.ErrorInfo;

            /**
             * Verifies an ErrorInfo message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an ErrorInfo message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ErrorInfo
             */
            public static fromObject(object: { [k: string]: any }): osp.v1.ErrorInfo;

            /**
             * Creates a plain object from an ErrorInfo message. Also converts values to other types if specified.
             * @param message ErrorInfo
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: osp.v1.ErrorInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ErrorInfo to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for ErrorInfo
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Capability enum. */
        enum Capability {
            CAPABILITY_UNSPECIFIED = 0,
            CAPABILITY_COMPRESSION_ZSTD = 1,
            CAPABILITY_CHUNKING = 2,
            CAPABILITY_RESUME = 3,
            CAPABILITY_PRESENCE = 4
        }

        /** Properties of an Envelope. */
        interface IEnvelope {

            /** Envelope hello */
            hello?: (osp.v1.IHello|null);

            /** Envelope helloAck */
            helloAck?: (osp.v1.IHelloAck|null);

            /** Envelope auth */
            auth?: (osp.v1.IAuth|null);

            /** Envelope authOk */
            authOk?: (osp.v1.IAuthOk|null);

            /** Envelope authFailed */
            authFailed?: (osp.v1.IAuthFailed|null);

            /** Envelope subscribe */
            subscribe?: (osp.v1.ISubscribe|null);

            /** Envelope unsubscribe */
            unsubscribe?: (osp.v1.IUnsubscribe|null);

            /** Envelope subscribeAck */
            subscribeAck?: (osp.v1.ISubscribeAck|null);

            /** Envelope op */
            op?: (osp.v1.IOperation|null);

            /** Envelope opAck */
            opAck?: (osp.v1.IOpAck|null);

            /** Envelope syncPush */
            syncPush?: (osp.v1.ISyncPush|null);

            /** Envelope syncPullRequest */
            syncPullRequest?: (osp.v1.ISyncPullRequest|null);

            /** Envelope syncPullResponse */
            syncPullResponse?: (osp.v1.ISyncPullResponse|null);

            /** Envelope snapshot */
            snapshot?: (osp.v1.ISnapshot|null);

            /** Envelope record */
            record?: (osp.v1.IRecord|null);

            /** Envelope error */
            error?: (osp.v1.IErrorInfo|null);

            /** Envelope presence */
            presence?: (osp.v1.IPresence|null);
        }

        /** Represents an Envelope. */
        class Envelope implements IEnvelope {

            /**
             * Constructs a new Envelope.
             * @param [properties] Properties to set
             */
            constructor(properties?: osp.v1.IEnvelope);

            /** Envelope hello. */
            public hello?: (osp.v1.IHello|null);

            /** Envelope helloAck. */
            public helloAck?: (osp.v1.IHelloAck|null);

            /** Envelope auth. */
            public auth?: (osp.v1.IAuth|null);

            /** Envelope authOk. */
            public authOk?: (osp.v1.IAuthOk|null);

            /** Envelope authFailed. */
            public authFailed?: (osp.v1.IAuthFailed|null);

            /** Envelope subscribe. */
            public subscribe?: (osp.v1.ISubscribe|null);

            /** Envelope unsubscribe. */
            public unsubscribe?: (osp.v1.IUnsubscribe|null);

            /** Envelope subscribeAck. */
            public subscribeAck?: (osp.v1.ISubscribeAck|null);

            /** Envelope op. */
            public op?: (osp.v1.IOperation|null);

            /** Envelope opAck. */
            public opAck?: (osp.v1.IOpAck|null);

            /** Envelope syncPush. */
            public syncPush?: (osp.v1.ISyncPush|null);

            /** Envelope syncPullRequest. */
            public syncPullRequest?: (osp.v1.ISyncPullRequest|null);

            /** Envelope syncPullResponse. */
            public syncPullResponse?: (osp.v1.ISyncPullResponse|null);

            /** Envelope snapshot. */
            public snapshot?: (osp.v1.ISnapshot|null);

            /** Envelope record. */
            public record?: (osp.v1.IRecord|null);

            /** Envelope error. */
            public error?: (osp.v1.IErrorInfo|null);

            /** Envelope presence. */
            public presence?: (osp.v1.IPresence|null);

            /** Envelope payload. */
            public payload?: ("hello"|"helloAck"|"auth"|"authOk"|"authFailed"|"subscribe"|"unsubscribe"|"subscribeAck"|"op"|"opAck"|"syncPush"|"syncPullRequest"|"syncPullResponse"|"snapshot"|"record"|"error"|"presence");

            /**
             * Creates a new Envelope instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Envelope instance
             */
            public static create(properties?: osp.v1.IEnvelope): osp.v1.Envelope;

            /**
             * Encodes the specified Envelope message. Does not implicitly {@link osp.v1.Envelope.verify|verify} messages.
             * @param message Envelope message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: osp.v1.IEnvelope, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Envelope message, length delimited. Does not implicitly {@link osp.v1.Envelope.verify|verify} messages.
             * @param message Envelope message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: osp.v1.IEnvelope, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an Envelope message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Envelope
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): osp.v1.Envelope;

            /**
             * Decodes an Envelope message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Envelope
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): osp.v1.Envelope;

            /**
             * Verifies an Envelope message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an Envelope message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Envelope
             */
            public static fromObject(object: { [k: string]: any }): osp.v1.Envelope;

            /**
             * Creates a plain object from an Envelope message. Also converts values to other types if specified.
             * @param message Envelope
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: osp.v1.Envelope, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Envelope to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for Envelope
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a Hello. */
        interface IHello {

            /** Hello protocolVersion */
            protocolVersion?: (number|null);

            /** Hello sdkVersion */
            sdkVersion?: (string|null);

            /** Hello deviceId */
            deviceId?: (string|null);

            /** Hello devicePlatform */
            devicePlatform?: (string|null);

            /** Hello capabilities */
            capabilities?: (osp.v1.Capability[]|null);
        }

        /** Represents a Hello. */
        class Hello implements IHello {

            /**
             * Constructs a new Hello.
             * @param [properties] Properties to set
             */
            constructor(properties?: osp.v1.IHello);

            /** Hello protocolVersion. */
            public protocolVersion: number;

            /** Hello sdkVersion. */
            public sdkVersion: string;

            /** Hello deviceId. */
            public deviceId: string;

            /** Hello devicePlatform. */
            public devicePlatform: string;

            /** Hello capabilities. */
            public capabilities: osp.v1.Capability[];

            /**
             * Creates a new Hello instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Hello instance
             */
            public static create(properties?: osp.v1.IHello): osp.v1.Hello;

            /**
             * Encodes the specified Hello message. Does not implicitly {@link osp.v1.Hello.verify|verify} messages.
             * @param message Hello message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: osp.v1.IHello, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Hello message, length delimited. Does not implicitly {@link osp.v1.Hello.verify|verify} messages.
             * @param message Hello message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: osp.v1.IHello, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Hello message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Hello
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): osp.v1.Hello;

            /**
             * Decodes a Hello message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Hello
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): osp.v1.Hello;

            /**
             * Verifies a Hello message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Hello message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Hello
             */
            public static fromObject(object: { [k: string]: any }): osp.v1.Hello;

            /**
             * Creates a plain object from a Hello message. Also converts values to other types if specified.
             * @param message Hello
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: osp.v1.Hello, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Hello to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for Hello
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a HelloAck. */
        interface IHelloAck {

            /** HelloAck protocolVersion */
            protocolVersion?: (number|null);

            /** HelloAck serverVersion */
            serverVersion?: (string|null);

            /** HelloAck sessionId */
            sessionId?: (string|null);

            /** HelloAck heartbeatIntervalMs */
            heartbeatIntervalMs?: (number|null);

            /** HelloAck selectedCapabilities */
            selectedCapabilities?: (osp.v1.Capability[]|null);

            /** HelloAck snapshotWindow */
            snapshotWindow?: (number|Long|null);
        }

        /** Represents a HelloAck. */
        class HelloAck implements IHelloAck {

            /**
             * Constructs a new HelloAck.
             * @param [properties] Properties to set
             */
            constructor(properties?: osp.v1.IHelloAck);

            /** HelloAck protocolVersion. */
            public protocolVersion: number;

            /** HelloAck serverVersion. */
            public serverVersion: string;

            /** HelloAck sessionId. */
            public sessionId: string;

            /** HelloAck heartbeatIntervalMs. */
            public heartbeatIntervalMs: number;

            /** HelloAck selectedCapabilities. */
            public selectedCapabilities: osp.v1.Capability[];

            /** HelloAck snapshotWindow. */
            public snapshotWindow: (number|Long);

            /**
             * Creates a new HelloAck instance using the specified properties.
             * @param [properties] Properties to set
             * @returns HelloAck instance
             */
            public static create(properties?: osp.v1.IHelloAck): osp.v1.HelloAck;

            /**
             * Encodes the specified HelloAck message. Does not implicitly {@link osp.v1.HelloAck.verify|verify} messages.
             * @param message HelloAck message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: osp.v1.IHelloAck, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified HelloAck message, length delimited. Does not implicitly {@link osp.v1.HelloAck.verify|verify} messages.
             * @param message HelloAck message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: osp.v1.IHelloAck, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a HelloAck message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns HelloAck
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): osp.v1.HelloAck;

            /**
             * Decodes a HelloAck message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns HelloAck
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): osp.v1.HelloAck;

            /**
             * Verifies a HelloAck message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a HelloAck message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns HelloAck
             */
            public static fromObject(object: { [k: string]: any }): osp.v1.HelloAck;

            /**
             * Creates a plain object from a HelloAck message. Also converts values to other types if specified.
             * @param message HelloAck
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: osp.v1.HelloAck, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this HelloAck to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for HelloAck
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of an Auth. */
        interface IAuth {

            /** Auth token */
            token?: (string|null);
        }

        /** Represents an Auth. */
        class Auth implements IAuth {

            /**
             * Constructs a new Auth.
             * @param [properties] Properties to set
             */
            constructor(properties?: osp.v1.IAuth);

            /** Auth token. */
            public token: string;

            /**
             * Creates a new Auth instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Auth instance
             */
            public static create(properties?: osp.v1.IAuth): osp.v1.Auth;

            /**
             * Encodes the specified Auth message. Does not implicitly {@link osp.v1.Auth.verify|verify} messages.
             * @param message Auth message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: osp.v1.IAuth, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Auth message, length delimited. Does not implicitly {@link osp.v1.Auth.verify|verify} messages.
             * @param message Auth message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: osp.v1.IAuth, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an Auth message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Auth
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): osp.v1.Auth;

            /**
             * Decodes an Auth message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Auth
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): osp.v1.Auth;

            /**
             * Verifies an Auth message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an Auth message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Auth
             */
            public static fromObject(object: { [k: string]: any }): osp.v1.Auth;

            /**
             * Creates a plain object from an Auth message. Also converts values to other types if specified.
             * @param message Auth
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: osp.v1.Auth, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Auth to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for Auth
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of an AuthOk. */
        interface IAuthOk {

            /** AuthOk deviceId */
            deviceId?: (string|null);

            /** AuthOk collectionScopes */
            collectionScopes?: (string[]|null);
        }

        /** Represents an AuthOk. */
        class AuthOk implements IAuthOk {

            /**
             * Constructs a new AuthOk.
             * @param [properties] Properties to set
             */
            constructor(properties?: osp.v1.IAuthOk);

            /** AuthOk deviceId. */
            public deviceId: string;

            /** AuthOk collectionScopes. */
            public collectionScopes: string[];

            /**
             * Creates a new AuthOk instance using the specified properties.
             * @param [properties] Properties to set
             * @returns AuthOk instance
             */
            public static create(properties?: osp.v1.IAuthOk): osp.v1.AuthOk;

            /**
             * Encodes the specified AuthOk message. Does not implicitly {@link osp.v1.AuthOk.verify|verify} messages.
             * @param message AuthOk message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: osp.v1.IAuthOk, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified AuthOk message, length delimited. Does not implicitly {@link osp.v1.AuthOk.verify|verify} messages.
             * @param message AuthOk message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: osp.v1.IAuthOk, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an AuthOk message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns AuthOk
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): osp.v1.AuthOk;

            /**
             * Decodes an AuthOk message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns AuthOk
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): osp.v1.AuthOk;

            /**
             * Verifies an AuthOk message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an AuthOk message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns AuthOk
             */
            public static fromObject(object: { [k: string]: any }): osp.v1.AuthOk;

            /**
             * Creates a plain object from an AuthOk message. Also converts values to other types if specified.
             * @param message AuthOk
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: osp.v1.AuthOk, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this AuthOk to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for AuthOk
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of an AuthFailed. */
        interface IAuthFailed {

            /** AuthFailed error */
            error?: (osp.v1.IErrorInfo|null);
        }

        /** Represents an AuthFailed. */
        class AuthFailed implements IAuthFailed {

            /**
             * Constructs a new AuthFailed.
             * @param [properties] Properties to set
             */
            constructor(properties?: osp.v1.IAuthFailed);

            /** AuthFailed error. */
            public error?: (osp.v1.IErrorInfo|null);

            /**
             * Creates a new AuthFailed instance using the specified properties.
             * @param [properties] Properties to set
             * @returns AuthFailed instance
             */
            public static create(properties?: osp.v1.IAuthFailed): osp.v1.AuthFailed;

            /**
             * Encodes the specified AuthFailed message. Does not implicitly {@link osp.v1.AuthFailed.verify|verify} messages.
             * @param message AuthFailed message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: osp.v1.IAuthFailed, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified AuthFailed message, length delimited. Does not implicitly {@link osp.v1.AuthFailed.verify|verify} messages.
             * @param message AuthFailed message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: osp.v1.IAuthFailed, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an AuthFailed message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns AuthFailed
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): osp.v1.AuthFailed;

            /**
             * Decodes an AuthFailed message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns AuthFailed
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): osp.v1.AuthFailed;

            /**
             * Verifies an AuthFailed message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an AuthFailed message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns AuthFailed
             */
            public static fromObject(object: { [k: string]: any }): osp.v1.AuthFailed;

            /**
             * Creates a plain object from an AuthFailed message. Also converts values to other types if specified.
             * @param message AuthFailed
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: osp.v1.AuthFailed, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this AuthFailed to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for AuthFailed
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a Presence. */
        interface IPresence {

            /** Presence deviceId */
            deviceId?: (string|null);

            /** Presence status */
            status?: (number|null);

            /** Presence lamport */
            lamport?: (number|Long|null);
        }

        /** Represents a Presence. */
        class Presence implements IPresence {

            /**
             * Constructs a new Presence.
             * @param [properties] Properties to set
             */
            constructor(properties?: osp.v1.IPresence);

            /** Presence deviceId. */
            public deviceId: string;

            /** Presence status. */
            public status: number;

            /** Presence lamport. */
            public lamport: (number|Long);

            /**
             * Creates a new Presence instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Presence instance
             */
            public static create(properties?: osp.v1.IPresence): osp.v1.Presence;

            /**
             * Encodes the specified Presence message. Does not implicitly {@link osp.v1.Presence.verify|verify} messages.
             * @param message Presence message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: osp.v1.IPresence, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Presence message, length delimited. Does not implicitly {@link osp.v1.Presence.verify|verify} messages.
             * @param message Presence message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: osp.v1.IPresence, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Presence message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Presence
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): osp.v1.Presence;

            /**
             * Decodes a Presence message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Presence
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): osp.v1.Presence;

            /**
             * Verifies a Presence message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Presence message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Presence
             */
            public static fromObject(object: { [k: string]: any }): osp.v1.Presence;

            /**
             * Creates a plain object from a Presence message. Also converts values to other types if specified.
             * @param message Presence
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: osp.v1.Presence, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Presence to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for Presence
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a Subscribe. */
        interface ISubscribe {

            /** Subscribe subscriptionId */
            subscriptionId?: (string|null);

            /** Subscribe collection */
            collection?: (string|null);

            /** Subscribe predicate */
            predicate?: (osp.v1.IPredicate|null);

            /** Subscribe limit */
            limit?: (number|null);

            /** Subscribe withSnapshot */
            withSnapshot?: (boolean|null);
        }

        /** Represents a Subscribe. */
        class Subscribe implements ISubscribe {

            /**
             * Constructs a new Subscribe.
             * @param [properties] Properties to set
             */
            constructor(properties?: osp.v1.ISubscribe);

            /** Subscribe subscriptionId. */
            public subscriptionId: string;

            /** Subscribe collection. */
            public collection: string;

            /** Subscribe predicate. */
            public predicate?: (osp.v1.IPredicate|null);

            /** Subscribe limit. */
            public limit: number;

            /** Subscribe withSnapshot. */
            public withSnapshot: boolean;

            /**
             * Creates a new Subscribe instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Subscribe instance
             */
            public static create(properties?: osp.v1.ISubscribe): osp.v1.Subscribe;

            /**
             * Encodes the specified Subscribe message. Does not implicitly {@link osp.v1.Subscribe.verify|verify} messages.
             * @param message Subscribe message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: osp.v1.ISubscribe, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Subscribe message, length delimited. Does not implicitly {@link osp.v1.Subscribe.verify|verify} messages.
             * @param message Subscribe message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: osp.v1.ISubscribe, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Subscribe message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Subscribe
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): osp.v1.Subscribe;

            /**
             * Decodes a Subscribe message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Subscribe
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): osp.v1.Subscribe;

            /**
             * Verifies a Subscribe message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Subscribe message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Subscribe
             */
            public static fromObject(object: { [k: string]: any }): osp.v1.Subscribe;

            /**
             * Creates a plain object from a Subscribe message. Also converts values to other types if specified.
             * @param message Subscribe
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: osp.v1.Subscribe, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Subscribe to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for Subscribe
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of an Unsubscribe. */
        interface IUnsubscribe {

            /** Unsubscribe subscriptionId */
            subscriptionId?: (string|null);
        }

        /** Represents an Unsubscribe. */
        class Unsubscribe implements IUnsubscribe {

            /**
             * Constructs a new Unsubscribe.
             * @param [properties] Properties to set
             */
            constructor(properties?: osp.v1.IUnsubscribe);

            /** Unsubscribe subscriptionId. */
            public subscriptionId: string;

            /**
             * Creates a new Unsubscribe instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Unsubscribe instance
             */
            public static create(properties?: osp.v1.IUnsubscribe): osp.v1.Unsubscribe;

            /**
             * Encodes the specified Unsubscribe message. Does not implicitly {@link osp.v1.Unsubscribe.verify|verify} messages.
             * @param message Unsubscribe message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: osp.v1.IUnsubscribe, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Unsubscribe message, length delimited. Does not implicitly {@link osp.v1.Unsubscribe.verify|verify} messages.
             * @param message Unsubscribe message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: osp.v1.IUnsubscribe, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an Unsubscribe message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Unsubscribe
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): osp.v1.Unsubscribe;

            /**
             * Decodes an Unsubscribe message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Unsubscribe
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): osp.v1.Unsubscribe;

            /**
             * Verifies an Unsubscribe message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an Unsubscribe message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Unsubscribe
             */
            public static fromObject(object: { [k: string]: any }): osp.v1.Unsubscribe;

            /**
             * Creates a plain object from an Unsubscribe message. Also converts values to other types if specified.
             * @param message Unsubscribe
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: osp.v1.Unsubscribe, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Unsubscribe to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for Unsubscribe
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a SubscribeAck. */
        interface ISubscribeAck {

            /** SubscribeAck subscriptionId */
            subscriptionId?: (string|null);

            /** SubscribeAck accepted */
            accepted?: (boolean|null);

            /** SubscribeAck error */
            error?: (osp.v1.IErrorInfo|null);

            /** SubscribeAck snapshotRevision */
            snapshotRevision?: (number|Long|null);
        }

        /** Represents a SubscribeAck. */
        class SubscribeAck implements ISubscribeAck {

            /**
             * Constructs a new SubscribeAck.
             * @param [properties] Properties to set
             */
            constructor(properties?: osp.v1.ISubscribeAck);

            /** SubscribeAck subscriptionId. */
            public subscriptionId: string;

            /** SubscribeAck accepted. */
            public accepted: boolean;

            /** SubscribeAck error. */
            public error?: (osp.v1.IErrorInfo|null);

            /** SubscribeAck snapshotRevision. */
            public snapshotRevision: (number|Long);

            /**
             * Creates a new SubscribeAck instance using the specified properties.
             * @param [properties] Properties to set
             * @returns SubscribeAck instance
             */
            public static create(properties?: osp.v1.ISubscribeAck): osp.v1.SubscribeAck;

            /**
             * Encodes the specified SubscribeAck message. Does not implicitly {@link osp.v1.SubscribeAck.verify|verify} messages.
             * @param message SubscribeAck message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: osp.v1.ISubscribeAck, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified SubscribeAck message, length delimited. Does not implicitly {@link osp.v1.SubscribeAck.verify|verify} messages.
             * @param message SubscribeAck message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: osp.v1.ISubscribeAck, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a SubscribeAck message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns SubscribeAck
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): osp.v1.SubscribeAck;

            /**
             * Decodes a SubscribeAck message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns SubscribeAck
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): osp.v1.SubscribeAck;

            /**
             * Verifies a SubscribeAck message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a SubscribeAck message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns SubscribeAck
             */
            public static fromObject(object: { [k: string]: any }): osp.v1.SubscribeAck;

            /**
             * Creates a plain object from a SubscribeAck message. Also converts values to other types if specified.
             * @param message SubscribeAck
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: osp.v1.SubscribeAck, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this SubscribeAck to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for SubscribeAck
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a Predicate. */
        interface IPredicate {

            /** Predicate eq */
            eq?: (osp.v1.Predicate.IEq|null);

            /** Predicate ne */
            ne?: (osp.v1.Predicate.INe|null);

            /** Predicate lt */
            lt?: (osp.v1.Predicate.ILt|null);

            /** Predicate le */
            le?: (osp.v1.Predicate.ILe|null);

            /** Predicate gt */
            gt?: (osp.v1.Predicate.IGt|null);

            /** Predicate ge */
            ge?: (osp.v1.Predicate.IGe|null);

            /** Predicate inExpr */
            inExpr?: (osp.v1.Predicate.IInExpr|null);

            /** Predicate andExpr */
            andExpr?: (osp.v1.Predicate.IAndExpr|null);

            /** Predicate orExpr */
            orExpr?: (osp.v1.Predicate.IOrExpr|null);

            /** Predicate notExpr */
            notExpr?: (osp.v1.Predicate.INotExpr|null);
        }

        /** Represents a Predicate. */
        class Predicate implements IPredicate {

            /**
             * Constructs a new Predicate.
             * @param [properties] Properties to set
             */
            constructor(properties?: osp.v1.IPredicate);

            /** Predicate eq. */
            public eq?: (osp.v1.Predicate.IEq|null);

            /** Predicate ne. */
            public ne?: (osp.v1.Predicate.INe|null);

            /** Predicate lt. */
            public lt?: (osp.v1.Predicate.ILt|null);

            /** Predicate le. */
            public le?: (osp.v1.Predicate.ILe|null);

            /** Predicate gt. */
            public gt?: (osp.v1.Predicate.IGt|null);

            /** Predicate ge. */
            public ge?: (osp.v1.Predicate.IGe|null);

            /** Predicate inExpr. */
            public inExpr?: (osp.v1.Predicate.IInExpr|null);

            /** Predicate andExpr. */
            public andExpr?: (osp.v1.Predicate.IAndExpr|null);

            /** Predicate orExpr. */
            public orExpr?: (osp.v1.Predicate.IOrExpr|null);

            /** Predicate notExpr. */
            public notExpr?: (osp.v1.Predicate.INotExpr|null);

            /** Predicate kind. */
            public kind?: ("eq"|"ne"|"lt"|"le"|"gt"|"ge"|"inExpr"|"andExpr"|"orExpr"|"notExpr");

            /**
             * Creates a new Predicate instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Predicate instance
             */
            public static create(properties?: osp.v1.IPredicate): osp.v1.Predicate;

            /**
             * Encodes the specified Predicate message. Does not implicitly {@link osp.v1.Predicate.verify|verify} messages.
             * @param message Predicate message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: osp.v1.IPredicate, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Predicate message, length delimited. Does not implicitly {@link osp.v1.Predicate.verify|verify} messages.
             * @param message Predicate message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: osp.v1.IPredicate, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Predicate message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Predicate
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): osp.v1.Predicate;

            /**
             * Decodes a Predicate message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Predicate
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): osp.v1.Predicate;

            /**
             * Verifies a Predicate message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Predicate message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Predicate
             */
            public static fromObject(object: { [k: string]: any }): osp.v1.Predicate;

            /**
             * Creates a plain object from a Predicate message. Also converts values to other types if specified.
             * @param message Predicate
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: osp.v1.Predicate, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Predicate to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for Predicate
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace Predicate {

            /** Properties of an Eq. */
            interface IEq {

                /** Eq field */
                field?: (string|null);

                /** Eq value */
                value?: (osp.v1.IValue|null);
            }

            /** Represents an Eq. */
            class Eq implements IEq {

                /**
                 * Constructs a new Eq.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: osp.v1.Predicate.IEq);

                /** Eq field. */
                public field: string;

                /** Eq value. */
                public value?: (osp.v1.IValue|null);

                /**
                 * Creates a new Eq instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Eq instance
                 */
                public static create(properties?: osp.v1.Predicate.IEq): osp.v1.Predicate.Eq;

                /**
                 * Encodes the specified Eq message. Does not implicitly {@link osp.v1.Predicate.Eq.verify|verify} messages.
                 * @param message Eq message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: osp.v1.Predicate.IEq, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Eq message, length delimited. Does not implicitly {@link osp.v1.Predicate.Eq.verify|verify} messages.
                 * @param message Eq message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: osp.v1.Predicate.IEq, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an Eq message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Eq
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): osp.v1.Predicate.Eq;

                /**
                 * Decodes an Eq message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Eq
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): osp.v1.Predicate.Eq;

                /**
                 * Verifies an Eq message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates an Eq message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Eq
                 */
                public static fromObject(object: { [k: string]: any }): osp.v1.Predicate.Eq;

                /**
                 * Creates a plain object from an Eq message. Also converts values to other types if specified.
                 * @param message Eq
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: osp.v1.Predicate.Eq, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Eq to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for Eq
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a Ne. */
            interface INe {

                /** Ne field */
                field?: (string|null);

                /** Ne value */
                value?: (osp.v1.IValue|null);
            }

            /** Represents a Ne. */
            class Ne implements INe {

                /**
                 * Constructs a new Ne.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: osp.v1.Predicate.INe);

                /** Ne field. */
                public field: string;

                /** Ne value. */
                public value?: (osp.v1.IValue|null);

                /**
                 * Creates a new Ne instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Ne instance
                 */
                public static create(properties?: osp.v1.Predicate.INe): osp.v1.Predicate.Ne;

                /**
                 * Encodes the specified Ne message. Does not implicitly {@link osp.v1.Predicate.Ne.verify|verify} messages.
                 * @param message Ne message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: osp.v1.Predicate.INe, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Ne message, length delimited. Does not implicitly {@link osp.v1.Predicate.Ne.verify|verify} messages.
                 * @param message Ne message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: osp.v1.Predicate.INe, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Ne message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Ne
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): osp.v1.Predicate.Ne;

                /**
                 * Decodes a Ne message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Ne
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): osp.v1.Predicate.Ne;

                /**
                 * Verifies a Ne message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Ne message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Ne
                 */
                public static fromObject(object: { [k: string]: any }): osp.v1.Predicate.Ne;

                /**
                 * Creates a plain object from a Ne message. Also converts values to other types if specified.
                 * @param message Ne
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: osp.v1.Predicate.Ne, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Ne to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for Ne
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a Lt. */
            interface ILt {

                /** Lt field */
                field?: (string|null);

                /** Lt value */
                value?: (osp.v1.IValue|null);
            }

            /** Represents a Lt. */
            class Lt implements ILt {

                /**
                 * Constructs a new Lt.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: osp.v1.Predicate.ILt);

                /** Lt field. */
                public field: string;

                /** Lt value. */
                public value?: (osp.v1.IValue|null);

                /**
                 * Creates a new Lt instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Lt instance
                 */
                public static create(properties?: osp.v1.Predicate.ILt): osp.v1.Predicate.Lt;

                /**
                 * Encodes the specified Lt message. Does not implicitly {@link osp.v1.Predicate.Lt.verify|verify} messages.
                 * @param message Lt message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: osp.v1.Predicate.ILt, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Lt message, length delimited. Does not implicitly {@link osp.v1.Predicate.Lt.verify|verify} messages.
                 * @param message Lt message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: osp.v1.Predicate.ILt, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Lt message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Lt
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): osp.v1.Predicate.Lt;

                /**
                 * Decodes a Lt message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Lt
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): osp.v1.Predicate.Lt;

                /**
                 * Verifies a Lt message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Lt message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Lt
                 */
                public static fromObject(object: { [k: string]: any }): osp.v1.Predicate.Lt;

                /**
                 * Creates a plain object from a Lt message. Also converts values to other types if specified.
                 * @param message Lt
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: osp.v1.Predicate.Lt, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Lt to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for Lt
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a Le. */
            interface ILe {

                /** Le field */
                field?: (string|null);

                /** Le value */
                value?: (osp.v1.IValue|null);
            }

            /** Represents a Le. */
            class Le implements ILe {

                /**
                 * Constructs a new Le.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: osp.v1.Predicate.ILe);

                /** Le field. */
                public field: string;

                /** Le value. */
                public value?: (osp.v1.IValue|null);

                /**
                 * Creates a new Le instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Le instance
                 */
                public static create(properties?: osp.v1.Predicate.ILe): osp.v1.Predicate.Le;

                /**
                 * Encodes the specified Le message. Does not implicitly {@link osp.v1.Predicate.Le.verify|verify} messages.
                 * @param message Le message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: osp.v1.Predicate.ILe, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Le message, length delimited. Does not implicitly {@link osp.v1.Predicate.Le.verify|verify} messages.
                 * @param message Le message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: osp.v1.Predicate.ILe, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Le message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Le
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): osp.v1.Predicate.Le;

                /**
                 * Decodes a Le message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Le
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): osp.v1.Predicate.Le;

                /**
                 * Verifies a Le message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Le message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Le
                 */
                public static fromObject(object: { [k: string]: any }): osp.v1.Predicate.Le;

                /**
                 * Creates a plain object from a Le message. Also converts values to other types if specified.
                 * @param message Le
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: osp.v1.Predicate.Le, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Le to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for Le
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a Gt. */
            interface IGt {

                /** Gt field */
                field?: (string|null);

                /** Gt value */
                value?: (osp.v1.IValue|null);
            }

            /** Represents a Gt. */
            class Gt implements IGt {

                /**
                 * Constructs a new Gt.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: osp.v1.Predicate.IGt);

                /** Gt field. */
                public field: string;

                /** Gt value. */
                public value?: (osp.v1.IValue|null);

                /**
                 * Creates a new Gt instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Gt instance
                 */
                public static create(properties?: osp.v1.Predicate.IGt): osp.v1.Predicate.Gt;

                /**
                 * Encodes the specified Gt message. Does not implicitly {@link osp.v1.Predicate.Gt.verify|verify} messages.
                 * @param message Gt message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: osp.v1.Predicate.IGt, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Gt message, length delimited. Does not implicitly {@link osp.v1.Predicate.Gt.verify|verify} messages.
                 * @param message Gt message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: osp.v1.Predicate.IGt, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Gt message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Gt
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): osp.v1.Predicate.Gt;

                /**
                 * Decodes a Gt message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Gt
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): osp.v1.Predicate.Gt;

                /**
                 * Verifies a Gt message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Gt message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Gt
                 */
                public static fromObject(object: { [k: string]: any }): osp.v1.Predicate.Gt;

                /**
                 * Creates a plain object from a Gt message. Also converts values to other types if specified.
                 * @param message Gt
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: osp.v1.Predicate.Gt, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Gt to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for Gt
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a Ge. */
            interface IGe {

                /** Ge field */
                field?: (string|null);

                /** Ge value */
                value?: (osp.v1.IValue|null);
            }

            /** Represents a Ge. */
            class Ge implements IGe {

                /**
                 * Constructs a new Ge.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: osp.v1.Predicate.IGe);

                /** Ge field. */
                public field: string;

                /** Ge value. */
                public value?: (osp.v1.IValue|null);

                /**
                 * Creates a new Ge instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Ge instance
                 */
                public static create(properties?: osp.v1.Predicate.IGe): osp.v1.Predicate.Ge;

                /**
                 * Encodes the specified Ge message. Does not implicitly {@link osp.v1.Predicate.Ge.verify|verify} messages.
                 * @param message Ge message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: osp.v1.Predicate.IGe, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Ge message, length delimited. Does not implicitly {@link osp.v1.Predicate.Ge.verify|verify} messages.
                 * @param message Ge message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: osp.v1.Predicate.IGe, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Ge message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Ge
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): osp.v1.Predicate.Ge;

                /**
                 * Decodes a Ge message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Ge
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): osp.v1.Predicate.Ge;

                /**
                 * Verifies a Ge message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Ge message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Ge
                 */
                public static fromObject(object: { [k: string]: any }): osp.v1.Predicate.Ge;

                /**
                 * Creates a plain object from a Ge message. Also converts values to other types if specified.
                 * @param message Ge
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: osp.v1.Predicate.Ge, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Ge to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for Ge
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of an InExpr. */
            interface IInExpr {

                /** InExpr field */
                field?: (string|null);

                /** InExpr values */
                values?: (osp.v1.IValue[]|null);
            }

            /** Represents an InExpr. */
            class InExpr implements IInExpr {

                /**
                 * Constructs a new InExpr.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: osp.v1.Predicate.IInExpr);

                /** InExpr field. */
                public field: string;

                /** InExpr values. */
                public values: osp.v1.IValue[];

                /**
                 * Creates a new InExpr instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns InExpr instance
                 */
                public static create(properties?: osp.v1.Predicate.IInExpr): osp.v1.Predicate.InExpr;

                /**
                 * Encodes the specified InExpr message. Does not implicitly {@link osp.v1.Predicate.InExpr.verify|verify} messages.
                 * @param message InExpr message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: osp.v1.Predicate.IInExpr, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified InExpr message, length delimited. Does not implicitly {@link osp.v1.Predicate.InExpr.verify|verify} messages.
                 * @param message InExpr message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: osp.v1.Predicate.IInExpr, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an InExpr message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns InExpr
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): osp.v1.Predicate.InExpr;

                /**
                 * Decodes an InExpr message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns InExpr
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): osp.v1.Predicate.InExpr;

                /**
                 * Verifies an InExpr message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates an InExpr message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns InExpr
                 */
                public static fromObject(object: { [k: string]: any }): osp.v1.Predicate.InExpr;

                /**
                 * Creates a plain object from an InExpr message. Also converts values to other types if specified.
                 * @param message InExpr
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: osp.v1.Predicate.InExpr, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this InExpr to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for InExpr
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of an AndExpr. */
            interface IAndExpr {

                /** AndExpr children */
                children?: (osp.v1.IPredicate[]|null);
            }

            /** Represents an AndExpr. */
            class AndExpr implements IAndExpr {

                /**
                 * Constructs a new AndExpr.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: osp.v1.Predicate.IAndExpr);

                /** AndExpr children. */
                public children: osp.v1.IPredicate[];

                /**
                 * Creates a new AndExpr instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns AndExpr instance
                 */
                public static create(properties?: osp.v1.Predicate.IAndExpr): osp.v1.Predicate.AndExpr;

                /**
                 * Encodes the specified AndExpr message. Does not implicitly {@link osp.v1.Predicate.AndExpr.verify|verify} messages.
                 * @param message AndExpr message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: osp.v1.Predicate.IAndExpr, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified AndExpr message, length delimited. Does not implicitly {@link osp.v1.Predicate.AndExpr.verify|verify} messages.
                 * @param message AndExpr message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: osp.v1.Predicate.IAndExpr, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an AndExpr message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns AndExpr
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): osp.v1.Predicate.AndExpr;

                /**
                 * Decodes an AndExpr message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns AndExpr
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): osp.v1.Predicate.AndExpr;

                /**
                 * Verifies an AndExpr message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates an AndExpr message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns AndExpr
                 */
                public static fromObject(object: { [k: string]: any }): osp.v1.Predicate.AndExpr;

                /**
                 * Creates a plain object from an AndExpr message. Also converts values to other types if specified.
                 * @param message AndExpr
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: osp.v1.Predicate.AndExpr, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this AndExpr to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for AndExpr
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of an OrExpr. */
            interface IOrExpr {

                /** OrExpr children */
                children?: (osp.v1.IPredicate[]|null);
            }

            /** Represents an OrExpr. */
            class OrExpr implements IOrExpr {

                /**
                 * Constructs a new OrExpr.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: osp.v1.Predicate.IOrExpr);

                /** OrExpr children. */
                public children: osp.v1.IPredicate[];

                /**
                 * Creates a new OrExpr instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns OrExpr instance
                 */
                public static create(properties?: osp.v1.Predicate.IOrExpr): osp.v1.Predicate.OrExpr;

                /**
                 * Encodes the specified OrExpr message. Does not implicitly {@link osp.v1.Predicate.OrExpr.verify|verify} messages.
                 * @param message OrExpr message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: osp.v1.Predicate.IOrExpr, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified OrExpr message, length delimited. Does not implicitly {@link osp.v1.Predicate.OrExpr.verify|verify} messages.
                 * @param message OrExpr message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: osp.v1.Predicate.IOrExpr, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an OrExpr message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns OrExpr
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): osp.v1.Predicate.OrExpr;

                /**
                 * Decodes an OrExpr message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns OrExpr
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): osp.v1.Predicate.OrExpr;

                /**
                 * Verifies an OrExpr message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates an OrExpr message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns OrExpr
                 */
                public static fromObject(object: { [k: string]: any }): osp.v1.Predicate.OrExpr;

                /**
                 * Creates a plain object from an OrExpr message. Also converts values to other types if specified.
                 * @param message OrExpr
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: osp.v1.Predicate.OrExpr, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this OrExpr to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for OrExpr
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a NotExpr. */
            interface INotExpr {

                /** NotExpr child */
                child?: (osp.v1.IPredicate|null);
            }

            /** Represents a NotExpr. */
            class NotExpr implements INotExpr {

                /**
                 * Constructs a new NotExpr.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: osp.v1.Predicate.INotExpr);

                /** NotExpr child. */
                public child?: (osp.v1.IPredicate|null);

                /**
                 * Creates a new NotExpr instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns NotExpr instance
                 */
                public static create(properties?: osp.v1.Predicate.INotExpr): osp.v1.Predicate.NotExpr;

                /**
                 * Encodes the specified NotExpr message. Does not implicitly {@link osp.v1.Predicate.NotExpr.verify|verify} messages.
                 * @param message NotExpr message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: osp.v1.Predicate.INotExpr, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified NotExpr message, length delimited. Does not implicitly {@link osp.v1.Predicate.NotExpr.verify|verify} messages.
                 * @param message NotExpr message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: osp.v1.Predicate.INotExpr, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a NotExpr message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns NotExpr
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): osp.v1.Predicate.NotExpr;

                /**
                 * Decodes a NotExpr message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns NotExpr
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): osp.v1.Predicate.NotExpr;

                /**
                 * Verifies a NotExpr message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a NotExpr message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns NotExpr
                 */
                public static fromObject(object: { [k: string]: any }): osp.v1.Predicate.NotExpr;

                /**
                 * Creates a plain object from a NotExpr message. Also converts values to other types if specified.
                 * @param message NotExpr
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: osp.v1.Predicate.NotExpr, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this NotExpr to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for NotExpr
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }
        }

        /** Properties of an Operation. */
        interface IOperation {

            /** Operation opId */
            opId?: (string|null);

            /** Operation deviceId */
            deviceId?: (string|null);

            /** Operation lamport */
            lamport?: (number|Long|null);

            /** Operation collection */
            collection?: (string|null);

            /** Operation recordId */
            recordId?: (string|null);

            /** Operation kind */
            kind?: (osp.v1.OpKind|null);

            /** Operation fieldChanges */
            fieldChanges?: (osp.v1.IFieldChange[]|null);

            /** Operation baseClock */
            baseClock?: (osp.v1.IVClock|null);

            /** Operation timestampMs */
            timestampMs?: (number|Long|null);
        }

        /** Represents an Operation. */
        class Operation implements IOperation {

            /**
             * Constructs a new Operation.
             * @param [properties] Properties to set
             */
            constructor(properties?: osp.v1.IOperation);

            /** Operation opId. */
            public opId: string;

            /** Operation deviceId. */
            public deviceId: string;

            /** Operation lamport. */
            public lamport: (number|Long);

            /** Operation collection. */
            public collection: string;

            /** Operation recordId. */
            public recordId: string;

            /** Operation kind. */
            public kind: osp.v1.OpKind;

            /** Operation fieldChanges. */
            public fieldChanges: osp.v1.IFieldChange[];

            /** Operation baseClock. */
            public baseClock?: (osp.v1.IVClock|null);

            /** Operation timestampMs. */
            public timestampMs: (number|Long);

            /**
             * Creates a new Operation instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Operation instance
             */
            public static create(properties?: osp.v1.IOperation): osp.v1.Operation;

            /**
             * Encodes the specified Operation message. Does not implicitly {@link osp.v1.Operation.verify|verify} messages.
             * @param message Operation message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: osp.v1.IOperation, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Operation message, length delimited. Does not implicitly {@link osp.v1.Operation.verify|verify} messages.
             * @param message Operation message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: osp.v1.IOperation, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an Operation message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Operation
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): osp.v1.Operation;

            /**
             * Decodes an Operation message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Operation
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): osp.v1.Operation;

            /**
             * Verifies an Operation message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an Operation message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Operation
             */
            public static fromObject(object: { [k: string]: any }): osp.v1.Operation;

            /**
             * Creates a plain object from an Operation message. Also converts values to other types if specified.
             * @param message Operation
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: osp.v1.Operation, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Operation to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for Operation
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** OpKind enum. */
        enum OpKind {
            OP_KIND_UNSPECIFIED = 0,
            OP_KIND_INSERT = 1,
            OP_KIND_UPDATE = 2,
            OP_KIND_DELETE = 3,
            OP_KIND_RESTORE = 4
        }

        /** Properties of a Record. */
        interface IRecord {

            /** Record collection */
            collection?: (string|null);

            /** Record recordId */
            recordId?: (string|null);

            /** Record revision */
            revision?: (number|Long|null);

            /** Record vectorClock */
            vectorClock?: (osp.v1.IVClock|null);

            /** Record tombstone */
            tombstone?: (boolean|null);

            /** Record fields */
            fields?: ({ [k: string]: osp.v1.IValue }|null);

            /** Record fieldMeta */
            fieldMeta?: ({ [k: string]: osp.v1.IFieldMeta }|null);

            /** Record updatedAtMs */
            updatedAtMs?: (number|Long|null);
        }

        /** Represents a Record. */
        class Record implements IRecord {

            /**
             * Constructs a new Record.
             * @param [properties] Properties to set
             */
            constructor(properties?: osp.v1.IRecord);

            /** Record collection. */
            public collection: string;

            /** Record recordId. */
            public recordId: string;

            /** Record revision. */
            public revision: (number|Long);

            /** Record vectorClock. */
            public vectorClock?: (osp.v1.IVClock|null);

            /** Record tombstone. */
            public tombstone: boolean;

            /** Record fields. */
            public fields: { [k: string]: osp.v1.IValue };

            /** Record fieldMeta. */
            public fieldMeta: { [k: string]: osp.v1.IFieldMeta };

            /** Record updatedAtMs. */
            public updatedAtMs: (number|Long);

            /**
             * Creates a new Record instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Record instance
             */
            public static create(properties?: osp.v1.IRecord): osp.v1.Record;

            /**
             * Encodes the specified Record message. Does not implicitly {@link osp.v1.Record.verify|verify} messages.
             * @param message Record message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: osp.v1.IRecord, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Record message, length delimited. Does not implicitly {@link osp.v1.Record.verify|verify} messages.
             * @param message Record message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: osp.v1.IRecord, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Record message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Record
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): osp.v1.Record;

            /**
             * Decodes a Record message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Record
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): osp.v1.Record;

            /**
             * Verifies a Record message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Record message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Record
             */
            public static fromObject(object: { [k: string]: any }): osp.v1.Record;

            /**
             * Creates a plain object from a Record message. Also converts values to other types if specified.
             * @param message Record
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: osp.v1.Record, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Record to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for Record
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a FieldMeta. */
        interface IFieldMeta {

            /** FieldMeta lamport */
            lamport?: (number|Long|null);

            /** FieldMeta writerDeviceId */
            writerDeviceId?: (string|null);
        }

        /** Represents a FieldMeta. */
        class FieldMeta implements IFieldMeta {

            /**
             * Constructs a new FieldMeta.
             * @param [properties] Properties to set
             */
            constructor(properties?: osp.v1.IFieldMeta);

            /** FieldMeta lamport. */
            public lamport: (number|Long);

            /** FieldMeta writerDeviceId. */
            public writerDeviceId: string;

            /**
             * Creates a new FieldMeta instance using the specified properties.
             * @param [properties] Properties to set
             * @returns FieldMeta instance
             */
            public static create(properties?: osp.v1.IFieldMeta): osp.v1.FieldMeta;

            /**
             * Encodes the specified FieldMeta message. Does not implicitly {@link osp.v1.FieldMeta.verify|verify} messages.
             * @param message FieldMeta message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: osp.v1.IFieldMeta, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified FieldMeta message, length delimited. Does not implicitly {@link osp.v1.FieldMeta.verify|verify} messages.
             * @param message FieldMeta message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: osp.v1.IFieldMeta, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a FieldMeta message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns FieldMeta
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): osp.v1.FieldMeta;

            /**
             * Decodes a FieldMeta message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns FieldMeta
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): osp.v1.FieldMeta;

            /**
             * Verifies a FieldMeta message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a FieldMeta message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns FieldMeta
             */
            public static fromObject(object: { [k: string]: any }): osp.v1.FieldMeta;

            /**
             * Creates a plain object from a FieldMeta message. Also converts values to other types if specified.
             * @param message FieldMeta
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: osp.v1.FieldMeta, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this FieldMeta to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for FieldMeta
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a Snapshot. */
        interface ISnapshot {

            /** Snapshot collection */
            collection?: (string|null);

            /** Snapshot revision */
            revision?: (number|Long|null);

            /** Snapshot lamportFloor */
            lamportFloor?: (number|Long|null);

            /** Snapshot records */
            records?: (osp.v1.IRecord[]|null);
        }

        /** Represents a Snapshot. */
        class Snapshot implements ISnapshot {

            /**
             * Constructs a new Snapshot.
             * @param [properties] Properties to set
             */
            constructor(properties?: osp.v1.ISnapshot);

            /** Snapshot collection. */
            public collection: string;

            /** Snapshot revision. */
            public revision: (number|Long);

            /** Snapshot lamportFloor. */
            public lamportFloor: (number|Long);

            /** Snapshot records. */
            public records: osp.v1.IRecord[];

            /**
             * Creates a new Snapshot instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Snapshot instance
             */
            public static create(properties?: osp.v1.ISnapshot): osp.v1.Snapshot;

            /**
             * Encodes the specified Snapshot message. Does not implicitly {@link osp.v1.Snapshot.verify|verify} messages.
             * @param message Snapshot message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: osp.v1.ISnapshot, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Snapshot message, length delimited. Does not implicitly {@link osp.v1.Snapshot.verify|verify} messages.
             * @param message Snapshot message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: osp.v1.ISnapshot, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Snapshot message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Snapshot
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): osp.v1.Snapshot;

            /**
             * Decodes a Snapshot message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Snapshot
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): osp.v1.Snapshot;

            /**
             * Verifies a Snapshot message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Snapshot message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Snapshot
             */
            public static fromObject(object: { [k: string]: any }): osp.v1.Snapshot;

            /**
             * Creates a plain object from a Snapshot message. Also converts values to other types if specified.
             * @param message Snapshot
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: osp.v1.Snapshot, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Snapshot to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for Snapshot
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of an OpAck. */
        interface IOpAck {

            /** OpAck opId */
            opId?: (string|null);

            /** OpAck accepted */
            accepted?: (boolean|null);

            /** OpAck error */
            error?: (osp.v1.IErrorInfo|null);

            /** OpAck revision */
            revision?: (number|Long|null);
        }

        /** Represents an OpAck. */
        class OpAck implements IOpAck {

            /**
             * Constructs a new OpAck.
             * @param [properties] Properties to set
             */
            constructor(properties?: osp.v1.IOpAck);

            /** OpAck opId. */
            public opId: string;

            /** OpAck accepted. */
            public accepted: boolean;

            /** OpAck error. */
            public error?: (osp.v1.IErrorInfo|null);

            /** OpAck revision. */
            public revision: (number|Long);

            /**
             * Creates a new OpAck instance using the specified properties.
             * @param [properties] Properties to set
             * @returns OpAck instance
             */
            public static create(properties?: osp.v1.IOpAck): osp.v1.OpAck;

            /**
             * Encodes the specified OpAck message. Does not implicitly {@link osp.v1.OpAck.verify|verify} messages.
             * @param message OpAck message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: osp.v1.IOpAck, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified OpAck message, length delimited. Does not implicitly {@link osp.v1.OpAck.verify|verify} messages.
             * @param message OpAck message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: osp.v1.IOpAck, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an OpAck message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns OpAck
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): osp.v1.OpAck;

            /**
             * Decodes an OpAck message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns OpAck
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): osp.v1.OpAck;

            /**
             * Verifies an OpAck message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an OpAck message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns OpAck
             */
            public static fromObject(object: { [k: string]: any }): osp.v1.OpAck;

            /**
             * Creates a plain object from an OpAck message. Also converts values to other types if specified.
             * @param message OpAck
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: osp.v1.OpAck, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this OpAck to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for OpAck
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a SyncPush. */
        interface ISyncPush {

            /** SyncPush ops */
            ops?: (osp.v1.IOperation[]|null);
        }

        /** Represents a SyncPush. */
        class SyncPush implements ISyncPush {

            /**
             * Constructs a new SyncPush.
             * @param [properties] Properties to set
             */
            constructor(properties?: osp.v1.ISyncPush);

            /** SyncPush ops. */
            public ops: osp.v1.IOperation[];

            /**
             * Creates a new SyncPush instance using the specified properties.
             * @param [properties] Properties to set
             * @returns SyncPush instance
             */
            public static create(properties?: osp.v1.ISyncPush): osp.v1.SyncPush;

            /**
             * Encodes the specified SyncPush message. Does not implicitly {@link osp.v1.SyncPush.verify|verify} messages.
             * @param message SyncPush message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: osp.v1.ISyncPush, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified SyncPush message, length delimited. Does not implicitly {@link osp.v1.SyncPush.verify|verify} messages.
             * @param message SyncPush message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: osp.v1.ISyncPush, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a SyncPush message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns SyncPush
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): osp.v1.SyncPush;

            /**
             * Decodes a SyncPush message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns SyncPush
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): osp.v1.SyncPush;

            /**
             * Verifies a SyncPush message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a SyncPush message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns SyncPush
             */
            public static fromObject(object: { [k: string]: any }): osp.v1.SyncPush;

            /**
             * Creates a plain object from a SyncPush message. Also converts values to other types if specified.
             * @param message SyncPush
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: osp.v1.SyncPush, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this SyncPush to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for SyncPush
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a SyncPullRequest. */
        interface ISyncPullRequest {

            /** SyncPullRequest collection */
            collection?: (string|null);

            /** SyncPullRequest sinceLamport */
            sinceLamport?: (number|Long|null);

            /** SyncPullRequest maxOps */
            maxOps?: (number|null);
        }

        /** Represents a SyncPullRequest. */
        class SyncPullRequest implements ISyncPullRequest {

            /**
             * Constructs a new SyncPullRequest.
             * @param [properties] Properties to set
             */
            constructor(properties?: osp.v1.ISyncPullRequest);

            /** SyncPullRequest collection. */
            public collection: string;

            /** SyncPullRequest sinceLamport. */
            public sinceLamport: (number|Long);

            /** SyncPullRequest maxOps. */
            public maxOps: number;

            /**
             * Creates a new SyncPullRequest instance using the specified properties.
             * @param [properties] Properties to set
             * @returns SyncPullRequest instance
             */
            public static create(properties?: osp.v1.ISyncPullRequest): osp.v1.SyncPullRequest;

            /**
             * Encodes the specified SyncPullRequest message. Does not implicitly {@link osp.v1.SyncPullRequest.verify|verify} messages.
             * @param message SyncPullRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: osp.v1.ISyncPullRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified SyncPullRequest message, length delimited. Does not implicitly {@link osp.v1.SyncPullRequest.verify|verify} messages.
             * @param message SyncPullRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: osp.v1.ISyncPullRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a SyncPullRequest message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns SyncPullRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): osp.v1.SyncPullRequest;

            /**
             * Decodes a SyncPullRequest message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns SyncPullRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): osp.v1.SyncPullRequest;

            /**
             * Verifies a SyncPullRequest message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a SyncPullRequest message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns SyncPullRequest
             */
            public static fromObject(object: { [k: string]: any }): osp.v1.SyncPullRequest;

            /**
             * Creates a plain object from a SyncPullRequest message. Also converts values to other types if specified.
             * @param message SyncPullRequest
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: osp.v1.SyncPullRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this SyncPullRequest to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for SyncPullRequest
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a SyncPullResponse. */
        interface ISyncPullResponse {

            /** SyncPullResponse collection */
            collection?: (string|null);

            /** SyncPullResponse sinceLamport */
            sinceLamport?: (number|Long|null);

            /** SyncPullResponse ops */
            ops?: (osp.v1.IOperation[]|null);

            /** SyncPullResponse hasMore */
            hasMore?: (boolean|null);
        }

        /** Represents a SyncPullResponse. */
        class SyncPullResponse implements ISyncPullResponse {

            /**
             * Constructs a new SyncPullResponse.
             * @param [properties] Properties to set
             */
            constructor(properties?: osp.v1.ISyncPullResponse);

            /** SyncPullResponse collection. */
            public collection: string;

            /** SyncPullResponse sinceLamport. */
            public sinceLamport: (number|Long);

            /** SyncPullResponse ops. */
            public ops: osp.v1.IOperation[];

            /** SyncPullResponse hasMore. */
            public hasMore: boolean;

            /**
             * Creates a new SyncPullResponse instance using the specified properties.
             * @param [properties] Properties to set
             * @returns SyncPullResponse instance
             */
            public static create(properties?: osp.v1.ISyncPullResponse): osp.v1.SyncPullResponse;

            /**
             * Encodes the specified SyncPullResponse message. Does not implicitly {@link osp.v1.SyncPullResponse.verify|verify} messages.
             * @param message SyncPullResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: osp.v1.ISyncPullResponse, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified SyncPullResponse message, length delimited. Does not implicitly {@link osp.v1.SyncPullResponse.verify|verify} messages.
             * @param message SyncPullResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: osp.v1.ISyncPullResponse, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a SyncPullResponse message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns SyncPullResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): osp.v1.SyncPullResponse;

            /**
             * Decodes a SyncPullResponse message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns SyncPullResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): osp.v1.SyncPullResponse;

            /**
             * Verifies a SyncPullResponse message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a SyncPullResponse message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns SyncPullResponse
             */
            public static fromObject(object: { [k: string]: any }): osp.v1.SyncPullResponse;

            /**
             * Creates a plain object from a SyncPullResponse message. Also converts values to other types if specified.
             * @param message SyncPullResponse
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: osp.v1.SyncPullResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this SyncPullResponse to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for SyncPullResponse
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }
    }
}
