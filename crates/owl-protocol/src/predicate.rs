//! Predicate used in subscriptions and queries.

use crate::gen::sync as pb;
use crate::value::Value;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub enum Predicate {
    Eq(String, Value),
    Ne(String, Value),
    Lt(String, Value),
    Le(String, Value),
    Gt(String, Value),
    Ge(String, Value),
    In(String, Vec<Value>),
    And(Vec<Predicate>),
    Or(Vec<Predicate>),
    Not(Box<Predicate>),
}

impl Predicate {
    pub fn from_prost(pb: pb::Predicate) -> Self {
        let kind = pb.kind.unwrap_or(pb::predicate::Kind::Eq(pb::predicate::Eq::default()));
        match kind {
            pb::predicate::Kind::Eq(p) => Self::Eq(p.field, p.value.map(Value::from).unwrap_or(Value::Null)),
            pb::predicate::Kind::Ne(p) => Self::Ne(p.field, p.value.map(Value::from).unwrap_or(Value::Null)),
            pb::predicate::Kind::Lt(p) => Self::Lt(p.field, p.value.map(Value::from).unwrap_or(Value::Null)),
            pb::predicate::Kind::Le(p) => Self::Le(p.field, p.value.map(Value::from).unwrap_or(Value::Null)),
            pb::predicate::Kind::Gt(p) => Self::Gt(p.field, p.value.map(Value::from).unwrap_or(Value::Null)),
            pb::predicate::Kind::Ge(p) => Self::Ge(p.field, p.value.map(Value::from).unwrap_or(Value::Null)),
            pb::predicate::Kind::InExpr(p) => Self::In(p.field, p.values.into_iter().map(Value::from).collect()),
            pb::predicate::Kind::AndExpr(p) => Self::And(p.children.into_iter().map(Self::from_prost).collect()),
            pb::predicate::Kind::OrExpr(p) => Self::Or(p.children.into_iter().map(Self::from_prost).collect()),
            pb::predicate::Kind::NotExpr(p) => Self::Not(Box::new(Self::from_prost(*p.child.unwrap_or_default()))),
        }
    }

    pub fn to_prost(&self) -> pb::Predicate {
        let kind = match self {
            Self::Eq(f, v) => pb::predicate::Kind::Eq(pb::predicate::Eq { field: f.clone(), value: Some(v.clone().into()) }),
            Self::Ne(f, v) => pb::predicate::Kind::Ne(pb::predicate::Ne { field: f.clone(), value: Some(v.clone().into()) }),
            Self::Lt(f, v) => pb::predicate::Kind::Lt(pb::predicate::Lt { field: f.clone(), value: Some(v.clone().into()) }),
            Self::Le(f, v) => pb::predicate::Kind::Le(pb::predicate::Le { field: f.clone(), value: Some(v.clone().into()) }),
            Self::Gt(f, v) => pb::predicate::Kind::Gt(pb::predicate::Gt { field: f.clone(), value: Some(v.clone().into()) }),
            Self::Ge(f, v) => pb::predicate::Kind::Ge(pb::predicate::Ge { field: f.clone(), value: Some(v.clone().into()) }),
            Self::In(f, vs) => pb::predicate::Kind::InExpr(pb::predicate::InExpr { field: f.clone(), values: vs.iter().cloned().map(Into::into).collect() }),
            Self::And(cs) => {
                let children: Vec<pb::Predicate> = cs.iter().map(|c| c.to_prost()).collect();
                pb::predicate::Kind::AndExpr(pb::predicate::AndExpr { children })
            }
            Self::Or(cs) => {
                let children: Vec<pb::Predicate> = cs.iter().map(|c| c.to_prost()).collect();
                pb::predicate::Kind::OrExpr(pb::predicate::OrExpr { children })
            }
            Self::Not(c) => {
                let child = c.to_prost();
                pb::predicate::Kind::NotExpr(Box::new(pb::predicate::NotExpr { child: Some(Box::new(child)) }))
            }
        };
        pb::Predicate { kind: Some(kind) }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn round_trip_eq() {
        let p = Predicate::Eq("name".into(), Value::String("alice".into()));
        let pb = p.to_prost();
        let back = Predicate::from_prost(pb);
        assert_eq!(p, back);
    }

    #[test]
    fn round_trip_nested() {
        let p = Predicate::And(vec![
            Predicate::Eq("active".into(), Value::Bool(true)),
            Predicate::Or(vec![
                Predicate::Gt("age".into(), Value::Int(18)),
                Predicate::In("role".into(), vec![Value::String("admin".into()), Value::String("mod".into())]),
            ]),
            Predicate::Not(Box::new(Predicate::Eq("banned".into(), Value::Bool(true)))),
        ]);
        let pb = p.to_prost();
        let back = Predicate::from_prost(pb);
        assert_eq!(p, back);
    }
}
