<?php

declare(strict_types=1);

namespace OWL\OSP;

/**
 * OSP Frame encoding/decoding
 */
class Frame
{
    public const MAGIC = 'OWL1';
    public const PROTOCOL_VERSION = 1;
    public const HEADER_LEN = 22;
    public const MAX_PAYLOAD_LEN = 16 * 1024 * 1024; // 16 MB

    public const FLAG_COMPRESSED = 1 << 0;
    public const FLAG_CHUNK = 1 << 1;
    public const FLAG_CHUNK_LAST = 1 << 2;

    public const OPCODE_HELLO = 0x01;
    public const OPCODE_HELLO_ACK = 0x02;
    public const OPCODE_AUTH = 0x03;
    public const OPCODE_AUTH_OK = 0x04;
    public const OPCODE_AUTH_FAILED = 0x05;
    public const OPCODE_SUBSCRIBE = 0x06;
    public const OPCODE_SUBSCRIBE_ACK = 0x07;
    public const OPCODE_UNSUBSCRIBE = 0x08;
    public const OPCODE_PATCH = 0x09;
    public const OPCODE_DELETE = 0x0A;
    public const OPCODE_RESTORE = 0x0B;
    public const OPCODE_SYNC = 0x0C;
    public const OPCODE_ACK = 0x0D;
    public const OPCODE_HEARTBEAT = 0x0E;
    public const OPCODE_ERROR = 0x0F;
    public const OPCODE_PRESENCE = 0x10;
    public const OPCODE_PING = 0x11;
    public const OPCODE_PONG = 0x12;

    public int $opcode;
    public int $version;
    public int $flags;
    public int $length;
    public int $reqId;
    public string $payload;

    public function __construct(
        int $opcode,
        int $version,
        int $flags,
        int $length,
        int $reqId,
        string $payload = ''
    ) {
        $this->opcode = $opcode;
        $this->version = $version;
        $this->flags = $flags;
        $this->length = $length;
        $this->reqId = $reqId;
        $this->payload = $payload;
    }

    public static function encode(self $frame): string
    {
        $header = pack('a4nnnN', self::MAGIC, $frame->version, $frame->opcode, $frame->flags, $frame->length);
        $header .= pack('J', $frame->reqId);
        return $header . $frame->payload;
    }

    public static function decodeHeader(string $buffer): ?self
    {
        if (strlen($buffer) < self::HEADER_LEN) {
            return null;
        }

        $magic = substr($buffer, 0, 4);
        if ($magic !== self::MAGIC) {
            throw new \RuntimeException('Invalid magic bytes');
        }

        $data = unpack('nversion/nopcode/nflags/Nlength', substr($buffer, 4, 10));
        $reqId = unpack('J', substr($buffer, 14, 8))[1];

        if ($data['version'] !== self::PROTOCOL_VERSION) {
            throw new \RuntimeException("Unsupported protocol version: {$data['version']}");
        }

        if ($data['length'] > self::MAX_PAYLOAD_LEN) {
            throw new \RuntimeException("Payload too large: {$data['length']}");
        }

        return new self(
            $data['opcode'],
            $data['version'],
            $data['flags'],
            $data['length'],
            $reqId
        );
    }

    public static function decode(string $buffer): ?self
    {
        $header = self::decodeHeader($buffer);
        if ($header === null) {
            return null;
        }

        $totalLen = self::HEADER_LEN + $header->length;
        if (strlen($buffer) < $totalLen) {
            return null;
        }

        $header->payload = substr($buffer, self::HEADER_LEN, $header->length);
        return $header;
    }
}
