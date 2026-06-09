//! owl-query: filter predicates, queries, and index interface for OSP.

#![forbid(unsafe_code)]


use owl_protocol::{Predicate, RecordMsg, Value};
use owl_types::{CollectionId, RecordId};
use thiserror::Error;

#[derive(Debug, Error)]
pub enum QueryError {
    #[error("type mismatch: field '{0}' expected {1}, got {2}")]
    TypeMismatch(String, &'static str, &'static str),
    #[error("missing field: {0}")]
    MissingField(String),
}

/// A full query: target collection + filter + sort/limit.
#[derive(Debug, Clone)]
pub struct Query {
    pub collection: CollectionId,
    pub filter: Option<Predicate>,
    pub sort: Vec<(String, SortDir)>,
    pub limit: Option<u32>,
    pub after: Option<RecordId>,
}

impl Default for Query {
    fn default() -> Self {
        Self {
            collection: CollectionId::new(""),
            filter: None,
            sort: Vec::new(),
            limit: None,
            after: None,
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum SortDir {
    Asc,
    Desc,
}

/// Matcher: pure-function evaluation of a predicate against a record's fields.
pub struct Matcher;

impl Matcher {
    /// Evaluate `pred` against `rec.fields`. Returns true if the record matches.
    pub fn matches(pred: &Predicate, rec: &RecordMsg) -> bool {
        match pred {
            Predicate::Eq(f, v) => field_eq(rec, f, v),
            Predicate::Ne(f, v) => !field_eq(rec, f, v),
            Predicate::Lt(f, v) => field_cmp(rec, f, v).map_or(false, |o| o == std::cmp::Ordering::Less),
            Predicate::Le(f, v) => {
                field_cmp(rec, f, v).map_or(false, |o| o != std::cmp::Ordering::Greater)
            }
            Predicate::Gt(f, v) => field_cmp(rec, f, v).map_or(false, |o| o == std::cmp::Ordering::Greater),
            Predicate::Ge(f, v) => {
                field_cmp(rec, f, v).map_or(false, |o| o != std::cmp::Ordering::Less)
            }
            Predicate::In(f, vs) => match rec.fields.get(f) {
                Some(actual) => vs.iter().any(|v| values_equal(actual, v)),
                None => false,
            },
            Predicate::And(cs) => cs.iter().all(|c| Self::matches(c, rec)),
            Predicate::Or(cs) => cs.iter().any(|c| Self::matches(c, rec)),
            Predicate::Not(c) => !Self::matches(c, rec),
        }
    }
}

/// Apply a query to a list of records and return the matching, sorted, limited subset.
pub fn apply_query(q: &Query, records: &[RecordMsg]) -> Vec<RecordMsg> {
    let mut out: Vec<RecordMsg> = records
        .iter()
        .filter(|r| q.filter.as_ref().map_or(true, |p| Matcher::matches(p, r)))
        .cloned()
        .collect();
    if !q.sort.is_empty() {
        out.sort_by(|a, b| {
            for (field, dir) in &q.sort {
                let av = a.fields.get(field);
                let bv = b.fields.get(field);
                let ord = compare_optional(av, bv);
                let ord = if *dir == SortDir::Desc { ord.reverse() } else { ord };
                if ord != std::cmp::Ordering::Equal {
                    return ord;
                }
            }
            a.record_id.cmp(&b.record_id)
        });
    } else {
        out.sort_by(|a, b| a.record_id.cmp(&b.record_id));
    }
    if let Some(off) = &q.after {
        let idx = out.iter().position(|r| r.record_id.as_str() > off.as_str());
        if let Some(i) = idx {
            out = out.split_off(i);
        }
    }
    if let Some(limit) = q.limit {
        out.truncate(limit as usize);
    }
    out
}

fn field_eq(rec: &RecordMsg, field: &str, v: &Value) -> bool {
    match rec.fields.get(field) {
        Some(actual) => values_equal(actual, v),
        None => matches!(v, Value::Null),
    }
}

fn field_cmp(rec: &RecordMsg, field: &str, v: &Value) -> Option<std::cmp::Ordering> {
    let actual = rec.fields.get(field)?;
    compare_values(actual, v)
}

fn values_equal(a: &Value, b: &Value) -> bool {
    match (a, b) {
        (Value::Null, Value::Null) => true,
        (Value::Bool(x), Value::Bool(y)) => x == y,
        (Value::Int(x), Value::Int(y)) => x == y,
        (Value::Double(x), Value::Double(y)) => x == y,
        (Value::String(x), Value::String(y)) => x == y,
        (Value::Bytes(x), Value::Bytes(y)) => x == y,
        (Value::Array(x), Value::Array(y)) => {
            x.len() == y.len() && x.iter().zip(y.iter()).all(|(xi, yi)| values_equal(xi, yi))
        }
        (Value::Object(x), Value::Object(y)) => {
            x.len() == y.len() && x.iter().all(|(k, v)| y.get(k).map_or(false, |vv| values_equal(v, vv)))
        }
        _ => false,
    }
}

fn compare_values(a: &Value, b: &Value) -> Option<std::cmp::Ordering> {
    Some(match (a, b) {
        (Value::Int(x), Value::Int(y)) => x.cmp(y),
        (Value::Double(x), Value::Double(y)) => x.partial_cmp(y)?,
        (Value::Int(x), Value::Double(y)) => (*x as f64).partial_cmp(y)?,
        (Value::Double(x), Value::Int(y)) => x.partial_cmp(&(*y as f64))?,
        (Value::String(x), Value::String(y)) => x.cmp(y),
        (Value::Bool(x), Value::Bool(y)) => x.cmp(y),
        (Value::Null, Value::Null) => std::cmp::Ordering::Equal,
        _ => return None,
    })
}

fn compare_optional(a: Option<&Value>, b: Option<&Value>) -> std::cmp::Ordering {
    match (a, b) {
        (Some(x), Some(y)) => compare_values(x, y).unwrap_or(std::cmp::Ordering::Equal),
        (Some(_), None) => std::cmp::Ordering::Less,
        (None, Some(_)) => std::cmp::Ordering::Greater,
        (None, None) => std::cmp::Ordering::Equal,
    }
}

/// Trait for pluggable indexes. In-memory default; BTree-based; future: RocksDB-backed.
pub trait Index: Send + Sync {
    /// Returns true if `record` matches `query`.
    fn matches(&self, query: &Query, record: &RecordMsg) -> bool;
    /// Update internal state when a record is added/updated/deleted.
    fn update(&mut self, record: &RecordMsg);
    fn remove(&mut self, record_id: &str);
    /// Apply a query and return matching record ids.
    fn query(&self, query: &Query, candidates: &[RecordMsg]) -> Vec<RecordMsg>;
}

/// Default in-memory index: linear scan + Matcher.
pub struct LinearIndex;

impl Index for LinearIndex {
    fn matches(&self, query: &Query, record: &RecordMsg) -> bool {
        query.filter.as_ref().map_or(true, |p| Matcher::matches(p, record))
    }
    fn update(&mut self, _record: &RecordMsg) {}
    fn remove(&mut self, _record_id: &str) {}
    fn query(&self, query: &Query, candidates: &[RecordMsg]) -> Vec<RecordMsg> {
        apply_query(query, candidates)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use owl_protocol::Value;
    use std::collections::BTreeMap;

    fn rec(id: &str, name: &str, age: i64, active: bool) -> RecordMsg {
        let mut f = BTreeMap::new();
        f.insert("name".into(), Value::String(name.into()));
        f.insert("age".into(), Value::Int(age));
        f.insert("active".into(), Value::Bool(active));
        RecordMsg {
            collection: "users".into(),
            record_id: id.into(),
            revision: 0,
            vector_clock: owl_types::VectorClock::new(),
            tombstone: false,
            fields: f,
            field_meta: BTreeMap::new(),
            updated_at_ms: 0,
        }
    }

    #[test]
    fn eq_predicate_matches() {
        let r = rec("u1", "alice", 30, true);
        assert!(Matcher::matches(&Predicate::Eq("name".into(), Value::String("alice".into())), &r));
        assert!(!Matcher::matches(&Predicate::Eq("name".into(), Value::String("bob".into())), &r));
    }

    #[test]
    fn and_or_not_compose() {
        let r = rec("u1", "alice", 30, true);
        let p = Predicate::And(vec![
            Predicate::Gt("age".into(), Value::Int(18)),
            Predicate::Or(vec![
                Predicate::Eq("active".into(), Value::Bool(true)),
                Predicate::Eq("name".into(), Value::String("x".into())),
            ]),
        ]);
        assert!(Matcher::matches(&p, &r));

        let not_p = Predicate::Not(Box::new(p));
        assert!(!Matcher::matches(&not_p, &r));
    }

    #[test]
    fn in_predicate() {
        let r = rec("u1", "alice", 30, true);
        let p = Predicate::In("name".into(), vec![Value::String("alice".into()), Value::String("bob".into())]);
        assert!(Matcher::matches(&p, &r));
        let p2 = Predicate::In("name".into(), vec![Value::String("x".into())]);
        assert!(!Matcher::matches(&p2, &r));
    }

    #[test]
    fn ordering_with_limit() {
        let records = vec![
            rec("u1", "alice", 30, true),
            rec("u2", "bob", 25, true),
            rec("u3", "carol", 40, false),
        ];
        let q = Query {
            collection: CollectionId::new("users"),
            filter: None,
            sort: vec![("age".into(), SortDir::Asc)],
            limit: Some(2),
            after: None,
        };
        let out = apply_query(&q, &records);
        assert_eq!(out.len(), 2);
        assert_eq!(out[0].record_id, "u2"); // age 25
        assert_eq!(out[1].record_id, "u1"); // age 30
    }

    #[test]
    fn filter_then_sort_then_limit() {
        let records = vec![
            rec("u1", "alice", 30, true),
            rec("u2", "bob", 25, false),
            rec("u3", "carol", 40, true),
            rec("u4", "dave", 20, true),
        ];
        let q = Query {
            collection: CollectionId::new("users"),
            filter: Some(Predicate::Eq("active".into(), Value::Bool(true))),
            sort: vec![("age".into(), SortDir::Desc)],
            limit: Some(2),
            after: None,
        };
        let out = apply_query(&q, &records);
        assert_eq!(out.iter().map(|r| r.record_id.as_str()).collect::<Vec<_>>(), vec!["u3", "u1"]);
    }

    #[test]
    fn after_cursor() {
        let records = vec![rec("a", "x", 1, true), rec("b", "x", 2, true), rec("c", "x", 3, true)];
        let q = Query {
            collection: CollectionId::new("c"),
            after: Some(RecordId::new("a")),
            ..Default::default()
        };
        let out = apply_query(&q, &records);
        assert_eq!(out.iter().map(|r| r.record_id.as_str()).collect::<Vec<_>>(), vec!["b", "c"]);
    }

    #[test]
    fn numeric_and_string_compare() {
        assert_eq!(compare_values(&Value::Int(3), &Value::Int(3)), Some(std::cmp::Ordering::Equal));
        assert_eq!(compare_values(&Value::Int(3), &Value::Int(7)), Some(std::cmp::Ordering::Less));
        assert_eq!(compare_values(&Value::String("a".into()), &Value::String("b".into())), Some(std::cmp::Ordering::Less));
        assert_eq!(compare_values(&Value::Double(1.5), &Value::Int(1)), Some(std::cmp::Ordering::Greater));
    }
}
