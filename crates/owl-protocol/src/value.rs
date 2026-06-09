//! High-level Value type used by the sync engine.
//!
//! Maps to the `Value` protobuf in `osp.v1.Value`.

use crate::gen::common;
use serde::{Deserialize, Serialize};
use std::collections::BTreeMap;

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub enum Value {
    Null,
    Bool(bool),
    Int(i64),
    Double(f64),
    String(String),
    Bytes(Vec<u8>),
    Array(Vec<Value>),
    Object(BTreeMap<String, Value>),
}

impl Value {
    pub fn as_str(&self) -> Option<&str> {
        if let Self::String(s) = self {
            Some(s)
        } else {
            None
        }
    }
    pub fn as_i64(&self) -> Option<i64> {
        if let Self::Int(i) = self {
            Some(*i)
        } else {
            None
        }
    }
    pub fn as_bool(&self) -> Option<bool> {
        if let Self::Bool(b) = self {
            Some(*b)
        } else {
            None
        }
    }
    pub fn type_name(&self) -> &'static str {
        match self {
            Self::Null => "null",
            Self::Bool(_) => "bool",
            Self::Int(_) => "int",
            Self::Double(_) => "double",
            Self::String(_) => "string",
            Self::Bytes(_) => "bytes",
            Self::Array(_) => "array",
            Self::Object(_) => "object",
        }
    }
}

impl From<bool> for Value {
    fn from(v: bool) -> Self {
        Self::Bool(v)
    }
}
impl From<i64> for Value {
    fn from(v: i64) -> Self {
        Self::Int(v)
    }
}
impl From<i32> for Value {
    fn from(v: i32) -> Self {
        Self::Int(v as i64)
    }
}
impl From<f64> for Value {
    fn from(v: f64) -> Self {
        Self::Double(v)
    }
}
impl From<String> for Value {
    fn from(v: String) -> Self {
        Self::String(v)
    }
}
impl From<&str> for Value {
    fn from(v: &str) -> Self {
        Self::String(v.to_string())
    }
}
impl From<Vec<u8>> for Value {
    fn from(v: Vec<u8>) -> Self {
        Self::Bytes(v)
    }
}

impl From<BTreeMap<String, Value>> for Value {
    fn from(v: BTreeMap<String, Value>) -> Self {
        Self::Object(v)
    }
}

impl From<Vec<Value>> for Value {
    fn from(v: Vec<Value>) -> Self {
        Self::Array(v)
    }
}

impl From<common::Value> for Value {
    fn from(pb: common::Value) -> Self {
        match pb.kind {
            Some(common::value::Kind::NullValue(_)) => Value::Null,
            Some(common::value::Kind::BoolValue(b)) => Value::Bool(b),
            Some(common::value::Kind::IntValue(i)) => Value::Int(i),
            Some(common::value::Kind::DoubleValue(d)) => Value::Double(d),
            Some(common::value::Kind::StringValue(s)) => Value::String(s),
            Some(common::value::Kind::BytesValue(b)) => Value::Bytes(b.to_vec()),
            Some(common::value::Kind::ArrayValue(a)) => {
                Value::Array(a.items.into_iter().map(Value::from).collect())
            }
            Some(common::value::Kind::ObjectValue(o)) => {
                Value::Object(o.entries.into_iter().map(|(k, v)| (k, Value::from(v))).collect())
            }
            None => Value::Null,
        }
    }
}

impl From<Value> for common::Value {
    fn from(v: Value) -> Self {
        let kind = match v {
            Value::Null => Some(common::value::Kind::NullValue(true)),
            Value::Bool(b) => Some(common::value::Kind::BoolValue(b)),
            Value::Int(i) => Some(common::value::Kind::IntValue(i)),
            Value::Double(d) => Some(common::value::Kind::DoubleValue(d)),
            Value::String(s) => Some(common::value::Kind::StringValue(s)),
            Value::Bytes(b) => Some(common::value::Kind::BytesValue(b.into())),
            Value::Array(items) => Some(common::value::Kind::ArrayValue(common::ValueArray {
                items: items.into_iter().map(common::Value::from).collect(),
            })),
            Value::Object(entries) => Some(common::value::Kind::ObjectValue(common::ValueMap {
                entries: entries.into_iter().map(|(k, v)| (k, common::Value::from(v))).collect(),
            })),
        };
        common::Value { kind }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn round_trip_scalars() {
        for v in [
            Value::Null,
            Value::Bool(true),
            Value::Int(-7),
            Value::Double(3.14),
            Value::String("hi".into()),
            Value::Bytes(vec![1, 2, 3]),
        ] {
            let pb = common::Value::from(v.clone());
            let back = Value::from(pb);
            assert_eq!(v, back);
        }
    }

    #[test]
    fn round_trip_nested() {
        let mut obj = BTreeMap::new();
        obj.insert("a".into(), Value::Int(1));
        obj.insert("b".into(), Value::String("x".into()));
        let v = Value::Array(vec![Value::Int(1), Value::Object(obj)]);
        let pb = common::Value::from(v.clone());
        let back = Value::from(pb);
        assert_eq!(v, back);
    }
}
