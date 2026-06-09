//! OSP opcodes.

#![allow(missing_docs)]

/// All OSP opcodes. Values are stable wire constants.
#[repr(u16)]
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum OpCode {
    Hello = 0x01,
    HelloAck = 0x02,
    Auth = 0x03,
    AuthOk = 0x04,
    AuthFailed = 0x05,
    Subscribe = 0x06,
    SubscribeAck = 0x07,
    Unsubscribe = 0x08,
    Patch = 0x09,
    Delete = 0x0A,
    Restore = 0x0B,
    Sync = 0x0C,
    Ack = 0x0D,
    Heartbeat = 0x0E,
    Error = 0x0F,
    Presence = 0x10,
    Ping = 0x11,
    Pong = 0x12,
}

impl OpCode {
    pub const fn as_u16(self) -> u16 {
        self as u16
    }

    pub fn from_u16(v: u16) -> Option<Self> {
        Some(match v {
            0x01 => Self::Hello,
            0x02 => Self::HelloAck,
            0x03 => Self::Auth,
            0x04 => Self::AuthOk,
            0x05 => Self::AuthFailed,
            0x06 => Self::Subscribe,
            0x07 => Self::SubscribeAck,
            0x08 => Self::Unsubscribe,
            0x09 => Self::Patch,
            0x0A => Self::Delete,
            0x0B => Self::Restore,
            0x0C => Self::Sync,
            0x0D => Self::Ack,
            0x0E => Self::Heartbeat,
            0x0F => Self::Error,
            0x10 => Self::Presence,
            0x11 => Self::Ping,
            0x12 => Self::Pong,
            _ => return None,
        })
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn opcode_round_trip() {
        for v in 0x01u16..=0x12 {
            let op = OpCode::from_u16(v).unwrap();
            assert_eq!(op.as_u16(), v);
        }
    }

    #[test]
    fn unknown_opcode_is_none() {
        assert!(OpCode::from_u16(0xFFFF).is_none());
        assert!(OpCode::from_u16(0x00).is_none());
    }
}
