<?php

declare(strict_types=1);

namespace OWL\OSP;

use Ramsey\Uuid\Uuid;
use Google\Protobuf\Internal\Message;

/**
 * OSP Client for PHP
 * Uses Google Protobuf for binary serialization
 */
class Client
{
    private ?object $socket = null;
    private string $buffer = '';
    private string $host;
    private int $port;
    private string $token;
    private string $deviceId;
    private bool $connected = false;
    private bool $authenticated = false;
    private int $requestId = 0;
    private array $listeners = [];

    public function __construct(
        string $host,
        int $port,
        string $token,
        ?string $deviceId = null
    ) {
        $this->host = $host;
        $this->port = $port;
        $this->token = $token;
        $this->deviceId = $deviceId ?? Uuid::uuid4()->toString();
    }

    public function connect(): void
    {
        $this->socket = @socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
        if ($this->socket === false) {
            throw new \RuntimeException('Failed to create socket');
        }

        socket_set_nonblock($this->socket);

        $result = @socket_connect($this->socket, $this->host, $this->port);
        if ($result === false) {
            $error = socket_last_error($this->socket);
            if ($error !== SOCKET_EINPROGRESS && $error !== SOCKET_EALREADY) {
                throw new \RuntimeException('Failed to connect: ' . socket_strerror($error));
            }
        }

        // Wait for connection to complete
        $timeout = 5;
        $start = time();
        while (!$this->isConnectedToSocket()) {
            if (time() - $start > $timeout) {
                throw new \RuntimeException('Connection timeout');
            }
            usleep(100000); // 100ms
        }

        $this->connected = true;
        $this->sendHello();
    }

    private function isConnectedToSocket(): bool
    {
        if ($this->socket === null) {
            return false;
        }

        $write = [$this->socket];
        $read = null;
        $except = null;

        $result = @socket_select($read, $write, $except, 0, 100000);
        return $result > 0;
    }

    public function disconnect(): void
    {
        if ($this->socket !== null) {
            socket_close($this->socket);
            $this->socket = null;
        }
        $this->connected = false;
        $this->authenticated = false;
        $this->emit('disconnect');
    }

    public function on(string $event, callable $callback): void
    {
        if (!isset($this->listeners[$event])) {
            $this->listeners[$event] = [];
        }
        $this->listeners[$event][] = $callback;
    }

    private function emit(string $event, ...$args): void
    {
        if (isset($this->listeners[$event])) {
            foreach ($this->listeners[$event] as $callback) {
                $callback(...$args);
            }
        }
    }

    private function sendHello(): void
    {
        $hello = new \Osp\V1\Hello([
            'protocol_version' => Frame::PROTOCOL_VERSION,
            'sdk_version' => '0.1.0',
            'device_id' => $this->deviceId,
            'device_platform' => 'php',
            'capabilities' => [
                \Osp\V1\Capability::CAPABILITY_COMPRESSION_ZSTD,
                \Osp\V1\Capability::CAPABILITY_CHUNKING,
                \Osp\V1\Capability::CAPABILITY_RESUME,
            ],
        ]);

        $envelope = new \Osp\V1\Envelope([
            'hello' => $hello,
        ]);

        $payload = $envelope->serializeToString();
        $this->sendFrame(Frame::OPCODE_HELLO, $payload);
    }

    private function sendAuth(): void
    {
        $auth = new \Osp\V1\Auth([
            'token' => $this->token,
        ]);

        $envelope = new \Osp\V1\Envelope([
            'auth' => $auth,
        ]);

        $payload = $envelope->serializeToString();
        $this->sendFrame(Frame::OPCODE_AUTH, $payload);
    }

    private function sendFrame(int $opcode, string $payload): void
    {
        if ($this->socket === null) {
            throw new \RuntimeException('Not connected');
        }

        $frame = new Frame(
            $opcode,
            Frame::PROTOCOL_VERSION,
            0, // flags
            strlen($payload),
            $this->requestId++,
            $payload
        );
        $encoded = Frame::encode($frame);
        @socket_write($this->socket, $encoded, strlen($encoded));
    }

    public function poll(): void
    {
        if ($this->socket === null) {
            return;
        }

        $read = [$this->socket];
        $write = null;
        $except = null;

        $result = @socket_select($read, $write, $except, 0, 100000);
        if ($result > 0) {
            $data = @socket_read($this->socket, 65536);
            if ($data === false || $data === '') {
                $this->disconnect();
                return;
            }

            $this->buffer .= $data;
            $this->processBuffer();
        }
    }

    private function processBuffer(): void
    {
        while (strlen($this->buffer) >= Frame::HEADER_LEN) {
            $frame = Frame::decode($this->buffer);
            if ($frame === null) {
                break;
            }

            $this->buffer = substr($this->buffer, Frame::HEADER_LEN + $frame->length);
            $this->handleFrame($frame);
        }
    }

    private function handleFrame(Frame $frame): void
    {
        try {
            $envelope = new \Osp\V1\Envelope();
            $envelope->mergeFromString($frame->payload);

            switch ($frame->opcode) {
                case Frame::OPCODE_HELLO_ACK:
                    if ($envelope->getHelloAck() !== null) {
                        $this->emit('hello_ack', $envelope->getHelloAck());
                        $this->sendAuth();
                    }
                    break;

                case Frame::OPCODE_AUTH_OK:
                    if ($envelope->getAuthOk() !== null) {
                        $this->authenticated = true;
                        $this->emit('connect', $envelope->getAuthOk());
                    }
                    break;

                case Frame::OPCODE_AUTH_FAILED:
                    if ($envelope->getAuthFailed() !== null) {
                        $this->emit('auth_failed', $envelope->getAuthFailed());
                        $this->disconnect();
                    }
                    break;

                case Frame::OPCODE_PATCH:
                    if ($envelope->getOp() !== null) {
                        $this->emit('patch', $envelope->getOp());
                    }
                    break;

                case Frame::OPCODE_DELETE:
                    if ($envelope->getOp() !== null) {
                        $this->emit('delete', $envelope->getOp());
                    }
                    break;

                case Frame::OPCODE_RESTORE:
                    if ($envelope->getOp() !== null) {
                        $this->emit('restore', $envelope->getOp());
                    }
                    break;

                case Frame::OPCODE_PING:
                    $this->sendFrame(Frame::OPCODE_PONG, '');
                    break;

                case Frame::OPCODE_ERROR:
                    if ($envelope->getError() !== null) {
                        $this->emit('error', $envelope->getError()->getMessage());
                    }
                    break;

                default:
                    $this->emit('unhandled', $frame->opcode, $envelope);
            }
        } catch (\Exception $e) {
            $this->emit('error', $e->getMessage());
        }
    }

    public function set(string $collection, string $recordId, array $fields): void
    {
        if (!$this->authenticated) {
            throw new \RuntimeException('Not authenticated');
        }

        $fieldChanges = [];
        foreach ($fields as $fieldName => $newValue) {
            $fieldChanges[] = new \Osp\V1\FieldChange([
                'field_name' => $fieldName,
                'new_value' => $this->toProtoValue($newValue),
                'lamport' => $this->currentTimestamp(),
                'writer_device_id' => $this->deviceId,
            ]);
        }

        $op = new \Osp\V1\Operation([
            'op_id' => Uuid::uuid4()->toString(),
            'device_id' => $this->deviceId,
            'lamport' => $this->currentTimestamp(),
            'collection' => $collection,
            'record_id' => $recordId,
            'kind' => \Osp\V1\OpKind::OP_KIND_UPDATE,
            'field_changes' => $fieldChanges,
            'base_clock' => new \Osp\V1\VClock(['entries' => []]),
            'timestamp_ms' => $this->currentTimestamp(),
        ]);

        $envelope = new \Osp\V1\Envelope([
            'op' => $op,
        ]);

        $payload = $envelope->serializeToString();
        $this->sendFrame(Frame::OPCODE_PATCH, $payload);
    }

    public function delete(string $collection, string $recordId): void
    {
        if (!$this->authenticated) {
            throw new \RuntimeException('Not authenticated');
        }

        $op = new \Osp\V1\Operation([
            'op_id' => Uuid::uuid4()->toString(),
            'device_id' => $this->deviceId,
            'lamport' => $this->currentTimestamp(),
            'collection' => $collection,
            'record_id' => $recordId,
            'kind' => \Osp\V1\OpKind::OP_KIND_DELETE,
            'field_changes' => [],
            'base_clock' => new \Osp\V1\VClock(['entries' => []]),
            'timestamp_ms' => $this->currentTimestamp(),
        ]);

        $envelope = new \Osp\V1\Envelope([
            'op' => $op,
        ]);

        $payload = $envelope->serializeToString();
        $this->sendFrame(Frame::OPCODE_DELETE, $payload);
    }

    public function restore(string $collection, string $recordId): void
    {
        if (!$this->authenticated) {
            throw new \RuntimeException('Not authenticated');
        }

        $op = new \Osp\V1\Operation([
            'op_id' => Uuid::uuid4()->toString(),
            'device_id' => $this->deviceId,
            'lamport' => $this->currentTimestamp(),
            'collection' => $collection,
            'record_id' => $recordId,
            'kind' => \Osp\V1\OpKind::OP_KIND_RESTORE,
            'field_changes' => [],
            'base_clock' => new \Osp\V1\VClock(['entries' => []]),
            'timestamp_ms' => $this->currentTimestamp(),
        ]);

        $envelope = new \Osp\V1\Envelope([
            'op' => $op,
        ]);

        $payload = $envelope->serializeToString();
        $this->sendFrame(Frame::OPCODE_RESTORE, $payload);
    }

    public function subscribe(string $collection): void
    {
        if (!$this->authenticated) {
            throw new \RuntimeException('Not authenticated');
        }

        $msg = new \Osp\V1\Subscribe([
            'subscription_id' => Uuid::uuid4()->toString(),
            'collection' => $collection,
            'with_snapshot' => true,
        ]);

        $envelope = new \Osp\V1\Envelope([
            'subscribe' => $msg,
        ]);

        $payload = $envelope->serializeToString();
        $this->sendFrame(Frame::OPCODE_SUBSCRIBE, $payload);
    }

    public function unsubscribe(string $subscriptionId): void
    {
        if (!$this->authenticated) {
            throw new \RuntimeException('Not authenticated');
        }

        $msg = new \Osp\V1\Unsubscribe([
            'subscription_id' => $subscriptionId,
        ]);

        $envelope = new \Osp\V1\Envelope([
            'unsubscribe' => $msg,
        ]);

        $payload = $envelope->serializeToString();
        $this->sendFrame(Frame::OPCODE_UNSUBSCRIBE, $payload);
    }

    private function toProtoValue($value): \Osp\V1\Value
    {
        if ($value === null) {
            return new \Osp\V1\Value(['null_value' => true]);
        }

        if (is_bool($value)) {
            return new \Osp\V1\Value(['bool_value' => $value]);
        }

        if (is_int($value)) {
            return new \Osp\V1\Value(['int_value' => $value]);
        }

        if (is_float($value)) {
            return new \Osp\V1\Value(['double_value' => $value]);
        }

        if (is_string($value)) {
            return new \Osp\V1\Value(['string_value' => $value]);
        }

        if (is_array($value)) {
            if (array_is_list($value)) {
                $items = array_map(fn($v) => $this->toProtoValue($v), $value);
                return new \Osp\V1\Value([
                    'array_value' => new \Osp\V1\ValueArray(['items' => $items])
                ]);
            } else {
                $entries = [];
                foreach ($value as $k => $v) {
                    $entries[$k] = $this->toProtoValue($v);
                }
                return new \Osp\V1\Value([
                    'object_value' => new \Osp\V1\ValueMap(['entries' => $entries])
                ]);
            }
        }

        return new \Osp\V1\Value(['null_value' => true]);
    }

    private function currentTimestamp(): int
    {
        return (int)(microtime(true) * 1000);
    }

    public function isConnected(): bool
    {
        return $this->connected && $this->authenticated;
    }
}
