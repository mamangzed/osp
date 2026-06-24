/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.osp = (function() {

    /**
     * Namespace osp.
     * @exports osp
     * @namespace
     */
    var osp = {};

    osp.v1 = (function() {

        /**
         * Namespace v1.
         * @memberof osp
         * @namespace
         */
        var v1 = {};

        v1.Hello = (function() {

            /**
             * Properties of a Hello.
             * @memberof osp.v1
             * @interface IHello
             * @property {number|null} [protocolVersion] Hello protocolVersion
             * @property {string|null} [sdkVersion] Hello sdkVersion
             * @property {string|null} [deviceId] Hello deviceId
             * @property {string|null} [devicePlatform] Hello devicePlatform
             * @property {Array.<osp.v1.Capability>|null} [capabilities] Hello capabilities
             */

            /**
             * Constructs a new Hello.
             * @memberof osp.v1
             * @classdesc Represents a Hello.
             * @implements IHello
             * @constructor
             * @param {osp.v1.IHello=} [properties] Properties to set
             */
            function Hello(properties) {
                this.capabilities = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Hello protocolVersion.
             * @member {number} protocolVersion
             * @memberof osp.v1.Hello
             * @instance
             */
            Hello.prototype.protocolVersion = 0;

            /**
             * Hello sdkVersion.
             * @member {string} sdkVersion
             * @memberof osp.v1.Hello
             * @instance
             */
            Hello.prototype.sdkVersion = "";

            /**
             * Hello deviceId.
             * @member {string} deviceId
             * @memberof osp.v1.Hello
             * @instance
             */
            Hello.prototype.deviceId = "";

            /**
             * Hello devicePlatform.
             * @member {string} devicePlatform
             * @memberof osp.v1.Hello
             * @instance
             */
            Hello.prototype.devicePlatform = "";

            /**
             * Hello capabilities.
             * @member {Array.<osp.v1.Capability>} capabilities
             * @memberof osp.v1.Hello
             * @instance
             */
            Hello.prototype.capabilities = $util.emptyArray;

            /**
             * Creates a new Hello instance using the specified properties.
             * @function create
             * @memberof osp.v1.Hello
             * @static
             * @param {osp.v1.IHello=} [properties] Properties to set
             * @returns {osp.v1.Hello} Hello instance
             */
            Hello.create = function create(properties) {
                return new Hello(properties);
            };

            /**
             * Encodes the specified Hello message. Does not implicitly {@link osp.v1.Hello.verify|verify} messages.
             * @function encode
             * @memberof osp.v1.Hello
             * @static
             * @param {osp.v1.IHello} message Hello message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Hello.encode = function encode(message, writer, q) {
                if (!writer)
                    writer = $Writer.create();
                if (q === undefined)
                    q = 0;
                if (q > $util.recursionLimit)
                    throw Error("max depth exceeded");
                if (message.protocolVersion != null && Object.hasOwnProperty.call(message, "protocolVersion"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.protocolVersion);
                if (message.sdkVersion != null && Object.hasOwnProperty.call(message, "sdkVersion"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.sdkVersion);
                if (message.deviceId != null && Object.hasOwnProperty.call(message, "deviceId"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.deviceId);
                if (message.devicePlatform != null && Object.hasOwnProperty.call(message, "devicePlatform"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.devicePlatform);
                if (message.capabilities != null && message.capabilities.length) {
                    writer.uint32(/* id 5, wireType 2 =*/42).fork();
                    for (var i = 0; i < message.capabilities.length; ++i)
                        writer.int32(message.capabilities[i]);
                    writer.ldelim();
                }
                return writer;
            };

            /**
             * Encodes the specified Hello message, length delimited. Does not implicitly {@link osp.v1.Hello.verify|verify} messages.
             * @function encodeDelimited
             * @memberof osp.v1.Hello
             * @static
             * @param {osp.v1.IHello} message Hello message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Hello.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
            };

            /**
             * Decodes a Hello message from the specified reader or buffer.
             * @function decode
             * @memberof osp.v1.Hello
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {osp.v1.Hello} Hello
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Hello.decode = function decode(reader, length, error, long) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (long === undefined)
                    long = 0;
                if (long > $Reader.recursionLimit)
                    throw Error("maximum nesting depth exceeded");
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.osp.v1.Hello();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            message.protocolVersion = reader.uint32();
                            break;
                        }
                    case 2: {
                            message.sdkVersion = reader.string();
                            break;
                        }
                    case 3: {
                            message.deviceId = reader.string();
                            break;
                        }
                    case 4: {
                            message.devicePlatform = reader.string();
                            break;
                        }
                    case 5: {
                            if (!(message.capabilities && message.capabilities.length))
                                message.capabilities = [];
                            if ((tag & 7) === 2) {
                                var end2 = reader.uint32() + reader.pos;
                                while (reader.pos < end2)
                                    message.capabilities.push(reader.int32());
                            } else
                                message.capabilities.push(reader.int32());
                            break;
                        }
                    default:
                        reader.skipType(tag & 7, long);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a Hello message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof osp.v1.Hello
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {osp.v1.Hello} Hello
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Hello.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a Hello message.
             * @function verify
             * @memberof osp.v1.Hello
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Hello.verify = function verify(message, long) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (long === undefined)
                    long = 0;
                if (long > $util.recursionLimit)
                    return "maximum nesting depth exceeded";
                if (message.protocolVersion != null && Object.hasOwnProperty.call(message, "protocolVersion"))
                    if (!$util.isInteger(message.protocolVersion))
                        return "protocolVersion: integer expected";
                if (message.sdkVersion != null && Object.hasOwnProperty.call(message, "sdkVersion"))
                    if (!$util.isString(message.sdkVersion))
                        return "sdkVersion: string expected";
                if (message.deviceId != null && Object.hasOwnProperty.call(message, "deviceId"))
                    if (!$util.isString(message.deviceId))
                        return "deviceId: string expected";
                if (message.devicePlatform != null && Object.hasOwnProperty.call(message, "devicePlatform"))
                    if (!$util.isString(message.devicePlatform))
                        return "devicePlatform: string expected";
                if (message.capabilities != null && Object.hasOwnProperty.call(message, "capabilities")) {
                    if (!Array.isArray(message.capabilities))
                        return "capabilities: array expected";
                    for (var i = 0; i < message.capabilities.length; ++i)
                        switch (message.capabilities[i]) {
                        default:
                            return "capabilities: enum value[] expected";
                        case 0:
                        case 1:
                        case 2:
                        case 3:
                        case 4:
                            break;
                        }
                }
                return null;
            };

            /**
             * Creates a Hello message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof osp.v1.Hello
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {osp.v1.Hello} Hello
             */
            Hello.fromObject = function fromObject(object, long) {
                if (object instanceof $root.osp.v1.Hello)
                    return object;
                if (!$util.isObject(object))
                    throw TypeError(".osp.v1.Hello: object expected");
                if (long === undefined)
                    long = 0;
                if (long > $util.recursionLimit)
                    throw Error("maximum nesting depth exceeded");
                var message = new $root.osp.v1.Hello();
                if (object.protocolVersion != null)
                    message.protocolVersion = object.protocolVersion >>> 0;
                if (object.sdkVersion != null)
                    message.sdkVersion = String(object.sdkVersion);
                if (object.deviceId != null)
                    message.deviceId = String(object.deviceId);
                if (object.devicePlatform != null)
                    message.devicePlatform = String(object.devicePlatform);
                if (object.capabilities) {
                    if (!Array.isArray(object.capabilities))
                        throw TypeError(".osp.v1.Hello.capabilities: array expected");
                    message.capabilities = [];
                    for (var i = 0; i < object.capabilities.length; ++i)
                        switch (object.capabilities[i]) {
                        default:
                            if (typeof object.capabilities[i] === "number") {
                                message.capabilities[i] = object.capabilities[i];
                                break;
                            }
                        case "CAPABILITY_UNSPECIFIED":
                        case 0:
                            message.capabilities[i] = 0;
                            break;
                        case "CAPABILITY_COMPRESSION_ZSTD":
                        case 1:
                            message.capabilities[i] = 1;
                            break;
                        case "CAPABILITY_CHUNKING":
                        case 2:
                            message.capabilities[i] = 2;
                            break;
                        case "CAPABILITY_RESUME":
                        case 3:
                            message.capabilities[i] = 3;
                            break;
                        case "CAPABILITY_PRESENCE":
                        case 4:
                            message.capabilities[i] = 4;
                            break;
                        }
                }
                return message;
            };

            /**
             * Creates a plain object from a Hello message. Also converts values to other types if specified.
             * @function toObject
             * @memberof osp.v1.Hello
             * @static
             * @param {osp.v1.Hello} message Hello
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Hello.toObject = function toObject(message, options, q) {
                if (!options)
                    options = {};
                if (q === undefined)
                    q = 0;
                if (q > $util.recursionLimit)
                    throw Error("max depth exceeded");
                var object = {};
                if (options.arrays || options.defaults)
                    object.capabilities = [];
                if (options.defaults) {
                    object.protocolVersion = 0;
                    object.sdkVersion = "";
                    object.deviceId = "";
                    object.devicePlatform = "";
                }
                if (message.protocolVersion != null && Object.hasOwnProperty.call(message, "protocolVersion"))
                    object.protocolVersion = message.protocolVersion;
                if (message.sdkVersion != null && Object.hasOwnProperty.call(message, "sdkVersion"))
                    object.sdkVersion = message.sdkVersion;
                if (message.deviceId != null && Object.hasOwnProperty.call(message, "deviceId"))
                    object.deviceId = message.deviceId;
                if (message.devicePlatform != null && Object.hasOwnProperty.call(message, "devicePlatform"))
                    object.devicePlatform = message.devicePlatform;
                if (message.capabilities && message.capabilities.length) {
                    object.capabilities = [];
                    for (var j = 0; j < message.capabilities.length; ++j)
                        object.capabilities[j] = options.enums === String ? $root.osp.v1.Capability[message.capabilities[j]] === undefined ? message.capabilities[j] : $root.osp.v1.Capability[message.capabilities[j]] : message.capabilities[j];
                }
                return object;
            };

            /**
             * Converts this Hello to JSON.
             * @function toJSON
             * @memberof osp.v1.Hello
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Hello.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for Hello
             * @function getTypeUrl
             * @memberof osp.v1.Hello
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            Hello.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/osp.v1.Hello";
            };

            return Hello;
        })();

        v1.HelloAck = (function() {

            /**
             * Properties of a HelloAck.
             * @memberof osp.v1
             * @interface IHelloAck
             * @property {number|null} [protocolVersion] HelloAck protocolVersion
             * @property {string|null} [serverVersion] HelloAck serverVersion
             * @property {string|null} [sessionId] HelloAck sessionId
             * @property {number|null} [heartbeatIntervalMs] HelloAck heartbeatIntervalMs
             * @property {Array.<osp.v1.Capability>|null} [selectedCapabilities] HelloAck selectedCapabilities
             * @property {number|Long|null} [snapshotWindow] HelloAck snapshotWindow
             */

            /**
             * Constructs a new HelloAck.
             * @memberof osp.v1
             * @classdesc Represents a HelloAck.
             * @implements IHelloAck
             * @constructor
             * @param {osp.v1.IHelloAck=} [properties] Properties to set
             */
            function HelloAck(properties) {
                this.selectedCapabilities = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * HelloAck protocolVersion.
             * @member {number} protocolVersion
             * @memberof osp.v1.HelloAck
             * @instance
             */
            HelloAck.prototype.protocolVersion = 0;

            /**
             * HelloAck serverVersion.
             * @member {string} serverVersion
             * @memberof osp.v1.HelloAck
             * @instance
             */
            HelloAck.prototype.serverVersion = "";

            /**
             * HelloAck sessionId.
             * @member {string} sessionId
             * @memberof osp.v1.HelloAck
             * @instance
             */
            HelloAck.prototype.sessionId = "";

            /**
             * HelloAck heartbeatIntervalMs.
             * @member {number} heartbeatIntervalMs
             * @memberof osp.v1.HelloAck
             * @instance
             */
            HelloAck.prototype.heartbeatIntervalMs = 0;

            /**
             * HelloAck selectedCapabilities.
             * @member {Array.<osp.v1.Capability>} selectedCapabilities
             * @memberof osp.v1.HelloAck
             * @instance
             */
            HelloAck.prototype.selectedCapabilities = $util.emptyArray;

            /**
             * HelloAck snapshotWindow.
             * @member {number|Long} snapshotWindow
             * @memberof osp.v1.HelloAck
             * @instance
             */
            HelloAck.prototype.snapshotWindow = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * Creates a new HelloAck instance using the specified properties.
             * @function create
             * @memberof osp.v1.HelloAck
             * @static
             * @param {osp.v1.IHelloAck=} [properties] Properties to set
             * @returns {osp.v1.HelloAck} HelloAck instance
             */
            HelloAck.create = function create(properties) {
                return new HelloAck(properties);
            };

            /**
             * Encodes the specified HelloAck message. Does not implicitly {@link osp.v1.HelloAck.verify|verify} messages.
             * @function encode
             * @memberof osp.v1.HelloAck
             * @static
             * @param {osp.v1.IHelloAck} message HelloAck message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            HelloAck.encode = function encode(message, writer, q) {
                if (!writer)
                    writer = $Writer.create();
                if (q === undefined)
                    q = 0;
                if (q > $util.recursionLimit)
                    throw Error("max depth exceeded");
                if (message.protocolVersion != null && Object.hasOwnProperty.call(message, "protocolVersion"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.protocolVersion);
                if (message.serverVersion != null && Object.hasOwnProperty.call(message, "serverVersion"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.serverVersion);
                if (message.sessionId != null && Object.hasOwnProperty.call(message, "sessionId"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.sessionId);
                if (message.heartbeatIntervalMs != null && Object.hasOwnProperty.call(message, "heartbeatIntervalMs"))
                    writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.heartbeatIntervalMs);
                if (message.selectedCapabilities != null && message.selectedCapabilities.length) {
                    writer.uint32(/* id 5, wireType 2 =*/42).fork();
                    for (var i = 0; i < message.selectedCapabilities.length; ++i)
                        writer.int32(message.selectedCapabilities[i]);
                    writer.ldelim();
                }
                if (message.snapshotWindow != null && Object.hasOwnProperty.call(message, "snapshotWindow"))
                    writer.uint32(/* id 6, wireType 0 =*/48).uint64(message.snapshotWindow);
                return writer;
            };

            /**
             * Encodes the specified HelloAck message, length delimited. Does not implicitly {@link osp.v1.HelloAck.verify|verify} messages.
             * @function encodeDelimited
             * @memberof osp.v1.HelloAck
             * @static
             * @param {osp.v1.IHelloAck} message HelloAck message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            HelloAck.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
            };

            /**
             * Decodes a HelloAck message from the specified reader or buffer.
             * @function decode
             * @memberof osp.v1.HelloAck
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {osp.v1.HelloAck} HelloAck
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            HelloAck.decode = function decode(reader, length, error, long) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (long === undefined)
                    long = 0;
                if (long > $Reader.recursionLimit)
                    throw Error("maximum nesting depth exceeded");
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.osp.v1.HelloAck();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            message.protocolVersion = reader.uint32();
                            break;
                        }
                    case 2: {
                            message.serverVersion = reader.string();
                            break;
                        }
                    case 3: {
                            message.sessionId = reader.string();
                            break;
                        }
                    case 4: {
                            message.heartbeatIntervalMs = reader.uint32();
                            break;
                        }
                    case 5: {
                            if (!(message.selectedCapabilities && message.selectedCapabilities.length))
                                message.selectedCapabilities = [];
                            if ((tag & 7) === 2) {
                                var end2 = reader.uint32() + reader.pos;
                                while (reader.pos < end2)
                                    message.selectedCapabilities.push(reader.int32());
                            } else
                                message.selectedCapabilities.push(reader.int32());
                            break;
                        }
                    case 6: {
                            message.snapshotWindow = reader.uint64();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7, long);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a HelloAck message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof osp.v1.HelloAck
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {osp.v1.HelloAck} HelloAck
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            HelloAck.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a HelloAck message.
             * @function verify
             * @memberof osp.v1.HelloAck
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            HelloAck.verify = function verify(message, long) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (long === undefined)
                    long = 0;
                if (long > $util.recursionLimit)
                    return "maximum nesting depth exceeded";
                if (message.protocolVersion != null && Object.hasOwnProperty.call(message, "protocolVersion"))
                    if (!$util.isInteger(message.protocolVersion))
                        return "protocolVersion: integer expected";
                if (message.serverVersion != null && Object.hasOwnProperty.call(message, "serverVersion"))
                    if (!$util.isString(message.serverVersion))
                        return "serverVersion: string expected";
                if (message.sessionId != null && Object.hasOwnProperty.call(message, "sessionId"))
                    if (!$util.isString(message.sessionId))
                        return "sessionId: string expected";
                if (message.heartbeatIntervalMs != null && Object.hasOwnProperty.call(message, "heartbeatIntervalMs"))
                    if (!$util.isInteger(message.heartbeatIntervalMs))
                        return "heartbeatIntervalMs: integer expected";
                if (message.selectedCapabilities != null && Object.hasOwnProperty.call(message, "selectedCapabilities")) {
                    if (!Array.isArray(message.selectedCapabilities))
                        return "selectedCapabilities: array expected";
                    for (var i = 0; i < message.selectedCapabilities.length; ++i)
                        switch (message.selectedCapabilities[i]) {
                        default:
                            return "selectedCapabilities: enum value[] expected";
                        case 0:
                        case 1:
                        case 2:
                        case 3:
                        case 4:
                            break;
                        }
                }
                if (message.snapshotWindow != null && Object.hasOwnProperty.call(message, "snapshotWindow"))
                    if (!$util.isInteger(message.snapshotWindow) && !(message.snapshotWindow && $util.isInteger(message.snapshotWindow.low) && $util.isInteger(message.snapshotWindow.high)))
                        return "snapshotWindow: integer|Long expected";
                return null;
            };

            /**
             * Creates a HelloAck message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof osp.v1.HelloAck
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {osp.v1.HelloAck} HelloAck
             */
            HelloAck.fromObject = function fromObject(object, long) {
                if (object instanceof $root.osp.v1.HelloAck)
                    return object;
                if (!$util.isObject(object))
                    throw TypeError(".osp.v1.HelloAck: object expected");
                if (long === undefined)
                    long = 0;
                if (long > $util.recursionLimit)
                    throw Error("maximum nesting depth exceeded");
                var message = new $root.osp.v1.HelloAck();
                if (object.protocolVersion != null)
                    message.protocolVersion = object.protocolVersion >>> 0;
                if (object.serverVersion != null)
                    message.serverVersion = String(object.serverVersion);
                if (object.sessionId != null)
                    message.sessionId = String(object.sessionId);
                if (object.heartbeatIntervalMs != null)
                    message.heartbeatIntervalMs = object.heartbeatIntervalMs >>> 0;
                if (object.selectedCapabilities) {
                    if (!Array.isArray(object.selectedCapabilities))
                        throw TypeError(".osp.v1.HelloAck.selectedCapabilities: array expected");
                    message.selectedCapabilities = [];
                    for (var i = 0; i < object.selectedCapabilities.length; ++i)
                        switch (object.selectedCapabilities[i]) {
                        default:
                            if (typeof object.selectedCapabilities[i] === "number") {
                                message.selectedCapabilities[i] = object.selectedCapabilities[i];
                                break;
                            }
                        case "CAPABILITY_UNSPECIFIED":
                        case 0:
                            message.selectedCapabilities[i] = 0;
                            break;
                        case "CAPABILITY_COMPRESSION_ZSTD":
                        case 1:
                            message.selectedCapabilities[i] = 1;
                            break;
                        case "CAPABILITY_CHUNKING":
                        case 2:
                            message.selectedCapabilities[i] = 2;
                            break;
                        case "CAPABILITY_RESUME":
                        case 3:
                            message.selectedCapabilities[i] = 3;
                            break;
                        case "CAPABILITY_PRESENCE":
                        case 4:
                            message.selectedCapabilities[i] = 4;
                            break;
                        }
                }
                if (object.snapshotWindow != null)
                    if ($util.Long)
                        message.snapshotWindow = $util.Long.fromValue(object.snapshotWindow, true);
                    else if (typeof object.snapshotWindow === "string")
                        message.snapshotWindow = parseInt(object.snapshotWindow, 10);
                    else if (typeof object.snapshotWindow === "number")
                        message.snapshotWindow = object.snapshotWindow;
                    else if (typeof object.snapshotWindow === "object")
                        message.snapshotWindow = new $util.LongBits(object.snapshotWindow.low >>> 0, object.snapshotWindow.high >>> 0).toNumber(true);
                return message;
            };

            /**
             * Creates a plain object from a HelloAck message. Also converts values to other types if specified.
             * @function toObject
             * @memberof osp.v1.HelloAck
             * @static
             * @param {osp.v1.HelloAck} message HelloAck
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            HelloAck.toObject = function toObject(message, options, q) {
                if (!options)
                    options = {};
                if (q === undefined)
                    q = 0;
                if (q > $util.recursionLimit)
                    throw Error("max depth exceeded");
                var object = {};
                if (options.arrays || options.defaults)
                    object.selectedCapabilities = [];
                if (options.defaults) {
                    object.protocolVersion = 0;
                    object.serverVersion = "";
                    object.sessionId = "";
                    object.heartbeatIntervalMs = 0;
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.snapshotWindow = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : typeof BigInt !== "undefined" && options.longs === BigInt ? long.toBigInt() : long;
                    } else
                        object.snapshotWindow = options.longs === String ? "0" : typeof BigInt !== "undefined" && options.longs === BigInt ? BigInt("0") : 0;
                }
                if (message.protocolVersion != null && Object.hasOwnProperty.call(message, "protocolVersion"))
                    object.protocolVersion = message.protocolVersion;
                if (message.serverVersion != null && Object.hasOwnProperty.call(message, "serverVersion"))
                    object.serverVersion = message.serverVersion;
                if (message.sessionId != null && Object.hasOwnProperty.call(message, "sessionId"))
                    object.sessionId = message.sessionId;
                if (message.heartbeatIntervalMs != null && Object.hasOwnProperty.call(message, "heartbeatIntervalMs"))
                    object.heartbeatIntervalMs = message.heartbeatIntervalMs;
                if (message.selectedCapabilities && message.selectedCapabilities.length) {
                    object.selectedCapabilities = [];
                    for (var j = 0; j < message.selectedCapabilities.length; ++j)
                        object.selectedCapabilities[j] = options.enums === String ? $root.osp.v1.Capability[message.selectedCapabilities[j]] === undefined ? message.selectedCapabilities[j] : $root.osp.v1.Capability[message.selectedCapabilities[j]] : message.selectedCapabilities[j];
                }
                if (message.snapshotWindow != null && Object.hasOwnProperty.call(message, "snapshotWindow"))
                    if (typeof BigInt !== "undefined" && options.longs === BigInt)
                        object.snapshotWindow = typeof message.snapshotWindow === "number" ? BigInt(message.snapshotWindow) : $util.Long.fromBits(message.snapshotWindow.low >>> 0, message.snapshotWindow.high >>> 0, true).toBigInt();
                    else if (typeof message.snapshotWindow === "number")
                        object.snapshotWindow = options.longs === String ? String(message.snapshotWindow) : message.snapshotWindow;
                    else
                        object.snapshotWindow = options.longs === String ? $util.Long.prototype.toString.call(message.snapshotWindow) : options.longs === Number ? new $util.LongBits(message.snapshotWindow.low >>> 0, message.snapshotWindow.high >>> 0).toNumber(true) : message.snapshotWindow;
                return object;
            };

            /**
             * Converts this HelloAck to JSON.
             * @function toJSON
             * @memberof osp.v1.HelloAck
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            HelloAck.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for HelloAck
             * @function getTypeUrl
             * @memberof osp.v1.HelloAck
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            HelloAck.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/osp.v1.HelloAck";
            };

            return HelloAck;
        })();

        v1.Auth = (function() {

            /**
             * Properties of an Auth.
             * @memberof osp.v1
             * @interface IAuth
             * @property {string|null} [token] Auth token
             */

            /**
             * Constructs a new Auth.
             * @memberof osp.v1
             * @classdesc Represents an Auth.
             * @implements IAuth
             * @constructor
             * @param {osp.v1.IAuth=} [properties] Properties to set
             */
            function Auth(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Auth token.
             * @member {string} token
             * @memberof osp.v1.Auth
             * @instance
             */
            Auth.prototype.token = "";

            /**
             * Creates a new Auth instance using the specified properties.
             * @function create
             * @memberof osp.v1.Auth
             * @static
             * @param {osp.v1.IAuth=} [properties] Properties to set
             * @returns {osp.v1.Auth} Auth instance
             */
            Auth.create = function create(properties) {
                return new Auth(properties);
            };

            /**
             * Encodes the specified Auth message. Does not implicitly {@link osp.v1.Auth.verify|verify} messages.
             * @function encode
             * @memberof osp.v1.Auth
             * @static
             * @param {osp.v1.IAuth} message Auth message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Auth.encode = function encode(message, writer, q) {
                if (!writer)
                    writer = $Writer.create();
                if (q === undefined)
                    q = 0;
                if (q > $util.recursionLimit)
                    throw Error("max depth exceeded");
                if (message.token != null && Object.hasOwnProperty.call(message, "token"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.token);
                return writer;
            };

            /**
             * Encodes the specified Auth message, length delimited. Does not implicitly {@link osp.v1.Auth.verify|verify} messages.
             * @function encodeDelimited
             * @memberof osp.v1.Auth
             * @static
             * @param {osp.v1.IAuth} message Auth message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Auth.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
            };

            /**
             * Decodes an Auth message from the specified reader or buffer.
             * @function decode
             * @memberof osp.v1.Auth
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {osp.v1.Auth} Auth
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Auth.decode = function decode(reader, length, error, long) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (long === undefined)
                    long = 0;
                if (long > $Reader.recursionLimit)
                    throw Error("maximum nesting depth exceeded");
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.osp.v1.Auth();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            message.token = reader.string();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7, long);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes an Auth message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof osp.v1.Auth
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {osp.v1.Auth} Auth
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Auth.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an Auth message.
             * @function verify
             * @memberof osp.v1.Auth
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Auth.verify = function verify(message, long) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (long === undefined)
                    long = 0;
                if (long > $util.recursionLimit)
                    return "maximum nesting depth exceeded";
                if (message.token != null && Object.hasOwnProperty.call(message, "token"))
                    if (!$util.isString(message.token))
                        return "token: string expected";
                return null;
            };

            /**
             * Creates an Auth message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof osp.v1.Auth
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {osp.v1.Auth} Auth
             */
            Auth.fromObject = function fromObject(object, long) {
                if (object instanceof $root.osp.v1.Auth)
                    return object;
                if (!$util.isObject(object))
                    throw TypeError(".osp.v1.Auth: object expected");
                if (long === undefined)
                    long = 0;
                if (long > $util.recursionLimit)
                    throw Error("maximum nesting depth exceeded");
                var message = new $root.osp.v1.Auth();
                if (object.token != null)
                    message.token = String(object.token);
                return message;
            };

            /**
             * Creates a plain object from an Auth message. Also converts values to other types if specified.
             * @function toObject
             * @memberof osp.v1.Auth
             * @static
             * @param {osp.v1.Auth} message Auth
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Auth.toObject = function toObject(message, options, q) {
                if (!options)
                    options = {};
                if (q === undefined)
                    q = 0;
                if (q > $util.recursionLimit)
                    throw Error("max depth exceeded");
                var object = {};
                if (options.defaults)
                    object.token = "";
                if (message.token != null && Object.hasOwnProperty.call(message, "token"))
                    object.token = message.token;
                return object;
            };

            /**
             * Converts this Auth to JSON.
             * @function toJSON
             * @memberof osp.v1.Auth
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Auth.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for Auth
             * @function getTypeUrl
             * @memberof osp.v1.Auth
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            Auth.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/osp.v1.Auth";
            };

            return Auth;
        })();

        v1.AuthOk = (function() {

            /**
             * Properties of an AuthOk.
             * @memberof osp.v1
             * @interface IAuthOk
             * @property {string|null} [deviceId] AuthOk deviceId
             * @property {Array.<string>|null} [collectionScopes] AuthOk collectionScopes
             */

            /**
             * Constructs a new AuthOk.
             * @memberof osp.v1
             * @classdesc Represents an AuthOk.
             * @implements IAuthOk
             * @constructor
             * @param {osp.v1.IAuthOk=} [properties] Properties to set
             */
            function AuthOk(properties) {
                this.collectionScopes = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * AuthOk deviceId.
             * @member {string} deviceId
             * @memberof osp.v1.AuthOk
             * @instance
             */
            AuthOk.prototype.deviceId = "";

            /**
             * AuthOk collectionScopes.
             * @member {Array.<string>} collectionScopes
             * @memberof osp.v1.AuthOk
             * @instance
             */
            AuthOk.prototype.collectionScopes = $util.emptyArray;

            /**
             * Creates a new AuthOk instance using the specified properties.
             * @function create
             * @memberof osp.v1.AuthOk
             * @static
             * @param {osp.v1.IAuthOk=} [properties] Properties to set
             * @returns {osp.v1.AuthOk} AuthOk instance
             */
            AuthOk.create = function create(properties) {
                return new AuthOk(properties);
            };

            /**
             * Encodes the specified AuthOk message. Does not implicitly {@link osp.v1.AuthOk.verify|verify} messages.
             * @function encode
             * @memberof osp.v1.AuthOk
             * @static
             * @param {osp.v1.IAuthOk} message AuthOk message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            AuthOk.encode = function encode(message, writer, q) {
                if (!writer)
                    writer = $Writer.create();
                if (q === undefined)
                    q = 0;
                if (q > $util.recursionLimit)
                    throw Error("max depth exceeded");
                if (message.deviceId != null && Object.hasOwnProperty.call(message, "deviceId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.deviceId);
                if (message.collectionScopes != null && message.collectionScopes.length)
                    for (var i = 0; i < message.collectionScopes.length; ++i)
                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.collectionScopes[i]);
                return writer;
            };

            /**
             * Encodes the specified AuthOk message, length delimited. Does not implicitly {@link osp.v1.AuthOk.verify|verify} messages.
             * @function encodeDelimited
             * @memberof osp.v1.AuthOk
             * @static
             * @param {osp.v1.IAuthOk} message AuthOk message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            AuthOk.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
            };

            /**
             * Decodes an AuthOk message from the specified reader or buffer.
             * @function decode
             * @memberof osp.v1.AuthOk
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {osp.v1.AuthOk} AuthOk
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            AuthOk.decode = function decode(reader, length, error, long) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (long === undefined)
                    long = 0;
                if (long > $Reader.recursionLimit)
                    throw Error("maximum nesting depth exceeded");
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.osp.v1.AuthOk();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            message.deviceId = reader.string();
                            break;
                        }
                    case 2: {
                            if (!(message.collectionScopes && message.collectionScopes.length))
                                message.collectionScopes = [];
                            message.collectionScopes.push(reader.string());
                            break;
                        }
                    default:
                        reader.skipType(tag & 7, long);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes an AuthOk message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof osp.v1.AuthOk
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {osp.v1.AuthOk} AuthOk
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            AuthOk.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an AuthOk message.
             * @function verify
             * @memberof osp.v1.AuthOk
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            AuthOk.verify = function verify(message, long) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (long === undefined)
                    long = 0;
                if (long > $util.recursionLimit)
                    return "maximum nesting depth exceeded";
                if (message.deviceId != null && Object.hasOwnProperty.call(message, "deviceId"))
                    if (!$util.isString(message.deviceId))
                        return "deviceId: string expected";
                if (message.collectionScopes != null && Object.hasOwnProperty.call(message, "collectionScopes")) {
                    if (!Array.isArray(message.collectionScopes))
                        return "collectionScopes: array expected";
                    for (var i = 0; i < message.collectionScopes.length; ++i)
                        if (!$util.isString(message.collectionScopes[i]))
                            return "collectionScopes: string[] expected";
                }
                return null;
            };

            /**
             * Creates an AuthOk message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof osp.v1.AuthOk
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {osp.v1.AuthOk} AuthOk
             */
            AuthOk.fromObject = function fromObject(object, long) {
                if (object instanceof $root.osp.v1.AuthOk)
                    return object;
                if (!$util.isObject(object))
                    throw TypeError(".osp.v1.AuthOk: object expected");
                if (long === undefined)
                    long = 0;
                if (long > $util.recursionLimit)
                    throw Error("maximum nesting depth exceeded");
                var message = new $root.osp.v1.AuthOk();
                if (object.deviceId != null)
                    message.deviceId = String(object.deviceId);
                if (object.collectionScopes) {
                    if (!Array.isArray(object.collectionScopes))
                        throw TypeError(".osp.v1.AuthOk.collectionScopes: array expected");
                    message.collectionScopes = [];
                    for (var i = 0; i < object.collectionScopes.length; ++i)
                        message.collectionScopes[i] = String(object.collectionScopes[i]);
                }
                return message;
            };

            /**
             * Creates a plain object from an AuthOk message. Also converts values to other types if specified.
             * @function toObject
             * @memberof osp.v1.AuthOk
             * @static
             * @param {osp.v1.AuthOk} message AuthOk
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            AuthOk.toObject = function toObject(message, options, q) {
                if (!options)
                    options = {};
                if (q === undefined)
                    q = 0;
                if (q > $util.recursionLimit)
                    throw Error("max depth exceeded");
                var object = {};
                if (options.arrays || options.defaults)
                    object.collectionScopes = [];
                if (options.defaults)
                    object.deviceId = "";
                if (message.deviceId != null && Object.hasOwnProperty.call(message, "deviceId"))
                    object.deviceId = message.deviceId;
                if (message.collectionScopes && message.collectionScopes.length) {
                    object.collectionScopes = [];
                    for (var j = 0; j < message.collectionScopes.length; ++j)
                        object.collectionScopes[j] = message.collectionScopes[j];
                }
                return object;
            };

            /**
             * Converts this AuthOk to JSON.
             * @function toJSON
             * @memberof osp.v1.AuthOk
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            AuthOk.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for AuthOk
             * @function getTypeUrl
             * @memberof osp.v1.AuthOk
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            AuthOk.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/osp.v1.AuthOk";
            };

            return AuthOk;
        })();

        v1.AuthFailed = (function() {

            /**
             * Properties of an AuthFailed.
             * @memberof osp.v1
             * @interface IAuthFailed
             * @property {osp.v1.IErrorInfo|null} [error] AuthFailed error
             */

            /**
             * Constructs a new AuthFailed.
             * @memberof osp.v1
             * @classdesc Represents an AuthFailed.
             * @implements IAuthFailed
             * @constructor
             * @param {osp.v1.IAuthFailed=} [properties] Properties to set
             */
            function AuthFailed(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * AuthFailed error.
             * @member {osp.v1.IErrorInfo|null|undefined} error
             * @memberof osp.v1.AuthFailed
             * @instance
             */
            AuthFailed.prototype.error = null;

            /**
             * Creates a new AuthFailed instance using the specified properties.
             * @function create
             * @memberof osp.v1.AuthFailed
             * @static
             * @param {osp.v1.IAuthFailed=} [properties] Properties to set
             * @returns {osp.v1.AuthFailed} AuthFailed instance
             */
            AuthFailed.create = function create(properties) {
                return new AuthFailed(properties);
            };

            /**
             * Encodes the specified AuthFailed message. Does not implicitly {@link osp.v1.AuthFailed.verify|verify} messages.
             * @function encode
             * @memberof osp.v1.AuthFailed
             * @static
             * @param {osp.v1.IAuthFailed} message AuthFailed message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            AuthFailed.encode = function encode(message, writer, q) {
                if (!writer)
                    writer = $Writer.create();
                if (q === undefined)
                    q = 0;
                if (q > $util.recursionLimit)
                    throw Error("max depth exceeded");
                if (message.error != null && Object.hasOwnProperty.call(message, "error"))
                    $root.osp.v1.ErrorInfo.encode(message.error, writer.uint32(/* id 1, wireType 2 =*/10).fork(), q + 1).ldelim();
                return writer;
            };

            /**
             * Encodes the specified AuthFailed message, length delimited. Does not implicitly {@link osp.v1.AuthFailed.verify|verify} messages.
             * @function encodeDelimited
             * @memberof osp.v1.AuthFailed
             * @static
             * @param {osp.v1.IAuthFailed} message AuthFailed message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            AuthFailed.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
            };

            /**
             * Decodes an AuthFailed message from the specified reader or buffer.
             * @function decode
             * @memberof osp.v1.AuthFailed
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {osp.v1.AuthFailed} AuthFailed
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            AuthFailed.decode = function decode(reader, length, error, long) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (long === undefined)
                    long = 0;
                if (long > $Reader.recursionLimit)
                    throw Error("maximum nesting depth exceeded");
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.osp.v1.AuthFailed();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            message.error = $root.osp.v1.ErrorInfo.decode(reader, reader.uint32(), undefined, long + 1);
                            break;
                        }
                    default:
                        reader.skipType(tag & 7, long);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes an AuthFailed message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof osp.v1.AuthFailed
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {osp.v1.AuthFailed} AuthFailed
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            AuthFailed.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an AuthFailed message.
             * @function verify
             * @memberof osp.v1.AuthFailed
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            AuthFailed.verify = function verify(message, long) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (long === undefined)
                    long = 0;
                if (long > $util.recursionLimit)
                    return "maximum nesting depth exceeded";
                if (message.error != null && Object.hasOwnProperty.call(message, "error")) {
                    var error = $root.osp.v1.ErrorInfo.verify(message.error, long + 1);
                    if (error)
                        return "error." + error;
                }
                return null;
            };

            /**
             * Creates an AuthFailed message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof osp.v1.AuthFailed
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {osp.v1.AuthFailed} AuthFailed
             */
            AuthFailed.fromObject = function fromObject(object, long) {
                if (object instanceof $root.osp.v1.AuthFailed)
                    return object;
                if (!$util.isObject(object))
                    throw TypeError(".osp.v1.AuthFailed: object expected");
                if (long === undefined)
                    long = 0;
                if (long > $util.recursionLimit)
                    throw Error("maximum nesting depth exceeded");
                var message = new $root.osp.v1.AuthFailed();
                if (object.error != null) {
                    if (!$util.isObject(object.error))
                        throw TypeError(".osp.v1.AuthFailed.error: object expected");
                    message.error = $root.osp.v1.ErrorInfo.fromObject(object.error, long + 1);
                }
                return message;
            };

            /**
             * Creates a plain object from an AuthFailed message. Also converts values to other types if specified.
             * @function toObject
             * @memberof osp.v1.AuthFailed
             * @static
             * @param {osp.v1.AuthFailed} message AuthFailed
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            AuthFailed.toObject = function toObject(message, options, q) {
                if (!options)
                    options = {};
                if (q === undefined)
                    q = 0;
                if (q > $util.recursionLimit)
                    throw Error("max depth exceeded");
                var object = {};
                if (options.defaults)
                    object.error = null;
                if (message.error != null && Object.hasOwnProperty.call(message, "error"))
                    object.error = $root.osp.v1.ErrorInfo.toObject(message.error, options, q + 1);
                return object;
            };

            /**
             * Converts this AuthFailed to JSON.
             * @function toJSON
             * @memberof osp.v1.AuthFailed
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            AuthFailed.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for AuthFailed
             * @function getTypeUrl
             * @memberof osp.v1.AuthFailed
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            AuthFailed.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/osp.v1.AuthFailed";
            };

            return AuthFailed;
        })();

        v1.Presence = (function() {

            /**
             * Properties of a Presence.
             * @memberof osp.v1
             * @interface IPresence
             * @property {string|null} [deviceId] Presence deviceId
             * @property {number|null} [status] Presence status
             * @property {number|Long|null} [lamport] Presence lamport
             */

            /**
             * Constructs a new Presence.
             * @memberof osp.v1
             * @classdesc Represents a Presence.
             * @implements IPresence
             * @constructor
             * @param {osp.v1.IPresence=} [properties] Properties to set
             */
            function Presence(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Presence deviceId.
             * @member {string} deviceId
             * @memberof osp.v1.Presence
             * @instance
             */
            Presence.prototype.deviceId = "";

            /**
             * Presence status.
             * @member {number} status
             * @memberof osp.v1.Presence
             * @instance
             */
            Presence.prototype.status = 0;

            /**
             * Presence lamport.
             * @member {number|Long} lamport
             * @memberof osp.v1.Presence
             * @instance
             */
            Presence.prototype.lamport = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * Creates a new Presence instance using the specified properties.
             * @function create
             * @memberof osp.v1.Presence
             * @static
             * @param {osp.v1.IPresence=} [properties] Properties to set
             * @returns {osp.v1.Presence} Presence instance
             */
            Presence.create = function create(properties) {
                return new Presence(properties);
            };

            /**
             * Encodes the specified Presence message. Does not implicitly {@link osp.v1.Presence.verify|verify} messages.
             * @function encode
             * @memberof osp.v1.Presence
             * @static
             * @param {osp.v1.IPresence} message Presence message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Presence.encode = function encode(message, writer, q) {
                if (!writer)
                    writer = $Writer.create();
                if (q === undefined)
                    q = 0;
                if (q > $util.recursionLimit)
                    throw Error("max depth exceeded");
                if (message.deviceId != null && Object.hasOwnProperty.call(message, "deviceId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.deviceId);
                if (message.status != null && Object.hasOwnProperty.call(message, "status"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.status);
                if (message.lamport != null && Object.hasOwnProperty.call(message, "lamport"))
                    writer.uint32(/* id 3, wireType 0 =*/24).uint64(message.lamport);
                return writer;
            };

            /**
             * Encodes the specified Presence message, length delimited. Does not implicitly {@link osp.v1.Presence.verify|verify} messages.
             * @function encodeDelimited
             * @memberof osp.v1.Presence
             * @static
             * @param {osp.v1.IPresence} message Presence message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Presence.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
            };

            /**
             * Decodes a Presence message from the specified reader or buffer.
             * @function decode
             * @memberof osp.v1.Presence
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {osp.v1.Presence} Presence
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Presence.decode = function decode(reader, length, error, long) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (long === undefined)
                    long = 0;
                if (long > $Reader.recursionLimit)
                    throw Error("maximum nesting depth exceeded");
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.osp.v1.Presence();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            message.deviceId = reader.string();
                            break;
                        }
                    case 2: {
                            message.status = reader.uint32();
                            break;
                        }
                    case 3: {
                            message.lamport = reader.uint64();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7, long);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a Presence message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof osp.v1.Presence
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {osp.v1.Presence} Presence
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Presence.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a Presence message.
             * @function verify
             * @memberof osp.v1.Presence
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Presence.verify = function verify(message, long) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (long === undefined)
                    long = 0;
                if (long > $util.recursionLimit)
                    return "maximum nesting depth exceeded";
                if (message.deviceId != null && Object.hasOwnProperty.call(message, "deviceId"))
                    if (!$util.isString(message.deviceId))
                        return "deviceId: string expected";
                if (message.status != null && Object.hasOwnProperty.call(message, "status"))
                    if (!$util.isInteger(message.status))
                        return "status: integer expected";
                if (message.lamport != null && Object.hasOwnProperty.call(message, "lamport"))
                    if (!$util.isInteger(message.lamport) && !(message.lamport && $util.isInteger(message.lamport.low) && $util.isInteger(message.lamport.high)))
                        return "lamport: integer|Long expected";
                return null;
            };

            /**
             * Creates a Presence message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof osp.v1.Presence
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {osp.v1.Presence} Presence
             */
            Presence.fromObject = function fromObject(object, long) {
                if (object instanceof $root.osp.v1.Presence)
                    return object;
                if (!$util.isObject(object))
                    throw TypeError(".osp.v1.Presence: object expected");
                if (long === undefined)
                    long = 0;
                if (long > $util.recursionLimit)
                    throw Error("maximum nesting depth exceeded");
                var message = new $root.osp.v1.Presence();
                if (object.deviceId != null)
                    message.deviceId = String(object.deviceId);
                if (object.status != null)
                    message.status = object.status >>> 0;
                if (object.lamport != null)
                    if ($util.Long)
                        message.lamport = $util.Long.fromValue(object.lamport, true);
                    else if (typeof object.lamport === "string")
                        message.lamport = parseInt(object.lamport, 10);
                    else if (typeof object.lamport === "number")
                        message.lamport = object.lamport;
                    else if (typeof object.lamport === "object")
                        message.lamport = new $util.LongBits(object.lamport.low >>> 0, object.lamport.high >>> 0).toNumber(true);
                return message;
            };

            /**
             * Creates a plain object from a Presence message. Also converts values to other types if specified.
             * @function toObject
             * @memberof osp.v1.Presence
             * @static
             * @param {osp.v1.Presence} message Presence
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Presence.toObject = function toObject(message, options, q) {
                if (!options)
                    options = {};
                if (q === undefined)
                    q = 0;
                if (q > $util.recursionLimit)
                    throw Error("max depth exceeded");
                var object = {};
                if (options.defaults) {
                    object.deviceId = "";
                    object.status = 0;
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.lamport = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : typeof BigInt !== "undefined" && options.longs === BigInt ? long.toBigInt() : long;
                    } else
                        object.lamport = options.longs === String ? "0" : typeof BigInt !== "undefined" && options.longs === BigInt ? BigInt("0") : 0;
                }
                if (message.deviceId != null && Object.hasOwnProperty.call(message, "deviceId"))
                    object.deviceId = message.deviceId;
                if (message.status != null && Object.hasOwnProperty.call(message, "status"))
                    object.status = message.status;
                if (message.lamport != null && Object.hasOwnProperty.call(message, "lamport"))
                    if (typeof BigInt !== "undefined" && options.longs === BigInt)
                        object.lamport = typeof message.lamport === "number" ? BigInt(message.lamport) : $util.Long.fromBits(message.lamport.low >>> 0, message.lamport.high >>> 0, true).toBigInt();
                    else if (typeof message.lamport === "number")
                        object.lamport = options.longs === String ? String(message.lamport) : message.lamport;
                    else
                        object.lamport = options.longs === String ? $util.Long.prototype.toString.call(message.lamport) : options.longs === Number ? new $util.LongBits(message.lamport.low >>> 0, message.lamport.high >>> 0).toNumber(true) : message.lamport;
                return object;
            };

            /**
             * Converts this Presence to JSON.
             * @function toJSON
             * @memberof osp.v1.Presence
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Presence.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for Presence
             * @function getTypeUrl
             * @memberof osp.v1.Presence
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            Presence.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/osp.v1.Presence";
            };

            return Presence;
        })();

        v1.VClock = (function() {

            /**
             * Properties of a VClock.
             * @memberof osp.v1
             * @interface IVClock
             * @property {Object.<string,number|Long>|null} [entries] VClock entries
             */

            /**
             * Constructs a new VClock.
             * @memberof osp.v1
             * @classdesc Represents a VClock.
             * @implements IVClock
             * @constructor
             * @param {osp.v1.IVClock=} [properties] Properties to set
             */
            function VClock(properties) {
                this.entries = {};
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * VClock entries.
             * @member {Object.<string,number|Long>} entries
             * @memberof osp.v1.VClock
             * @instance
             */
            VClock.prototype.entries = $util.emptyObject;

            /**
             * Creates a new VClock instance using the specified properties.
             * @function create
             * @memberof osp.v1.VClock
             * @static
             * @param {osp.v1.IVClock=} [properties] Properties to set
             * @returns {osp.v1.VClock} VClock instance
             */
            VClock.create = function create(properties) {
                return new VClock(properties);
            };

            /**
             * Encodes the specified VClock message. Does not implicitly {@link osp.v1.VClock.verify|verify} messages.
             * @function encode
             * @memberof osp.v1.VClock
             * @static
             * @param {osp.v1.IVClock} message VClock message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            VClock.encode = function encode(message, writer, q) {
                if (!writer)
                    writer = $Writer.create();
                if (q === undefined)
                    q = 0;
                if (q > $util.recursionLimit)
                    throw Error("max depth exceeded");
                if (message.entries != null && Object.hasOwnProperty.call(message, "entries"))
                    for (var keys = Object.keys(message.entries), i = 0; i < keys.length; ++i)
                        writer.uint32(/* id 1, wireType 2 =*/10).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]).uint32(/* id 2, wireType 0 =*/16).uint64(message.entries[keys[i]]).ldelim();
                return writer;
            };

            /**
             * Encodes the specified VClock message, length delimited. Does not implicitly {@link osp.v1.VClock.verify|verify} messages.
             * @function encodeDelimited
             * @memberof osp.v1.VClock
             * @static
             * @param {osp.v1.IVClock} message VClock message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            VClock.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
            };

            /**
             * Decodes a VClock message from the specified reader or buffer.
             * @function decode
             * @memberof osp.v1.VClock
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {osp.v1.VClock} VClock
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            VClock.decode = function decode(reader, length, error, long) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (long === undefined)
                    long = 0;
                if (long > $Reader.recursionLimit)
                    throw Error("maximum nesting depth exceeded");
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.osp.v1.VClock(), key, value;
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            if (message.entries === $util.emptyObject)
                                message.entries = {};
                            var end2 = reader.uint32() + reader.pos;
                            key = "";
                            value = 0;
                            while (reader.pos < end2) {
                                var tag2 = reader.uint32();
                                switch (tag2 >>> 3) {
                                case 1:
                                    key = reader.string();
                                    break;
                                case 2:
                                    value = reader.uint64();
                                    break;
                                default:
                                    reader.skipType(tag2 & 7, long);
                                    break;
                                }
                            }
                            if (key === "__proto__")
                                $util.makeProp(message.entries, key);
                            message.entries[key] = value;
                            break;
                        }
                    default:
                        reader.skipType(tag & 7, long);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a VClock message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof osp.v1.VClock
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {osp.v1.VClock} VClock
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            VClock.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a VClock message.
             * @function verify
             * @memberof osp.v1.VClock
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            VClock.verify = function verify(message, long) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (long === undefined)
                    long = 0;
                if (long > $util.recursionLimit)
                    return "maximum nesting depth exceeded";
                if (message.entries != null && Object.hasOwnProperty.call(message, "entries")) {
                    if (!$util.isObject(message.entries))
                        return "entries: object expected";
                    var key = Object.keys(message.entries);
                    for (var i = 0; i < key.length; ++i)
                        if (!$util.isInteger(message.entries[key[i]]) && !(message.entries[key[i]] && $util.isInteger(message.entries[key[i]].low) && $util.isInteger(message.entries[key[i]].high)))
                            return "entries: integer|Long{k:string} expected";
                }
                return null;
            };

            /**
             * Creates a VClock message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof osp.v1.VClock
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {osp.v1.VClock} VClock
             */
            VClock.fromObject = function fromObject(object, long) {
                if (object instanceof $root.osp.v1.VClock)
                    return object;
                if (!$util.isObject(object))
                    throw TypeError(".osp.v1.VClock: object expected");
                if (long === undefined)
                    long = 0;
                if (long > $util.recursionLimit)
                    throw Error("maximum nesting depth exceeded");
                var message = new $root.osp.v1.VClock();
                if (object.entries) {
                    if (!$util.isObject(object.entries))
                        throw TypeError(".osp.v1.VClock.entries: object expected");
                    message.entries = {};
                    for (var keys = Object.keys(object.entries), i = 0; i < keys.length; ++i) {
                        if (keys[i] === "__proto__")
                            $util.makeProp(message.entries, keys[i]);
                        if ($util.Long)
                            message.entries[keys[i]] = $util.Long.fromValue(object.entries[keys[i]], true);
                        else if (typeof object.entries[keys[i]] === "string")
                            message.entries[keys[i]] = parseInt(object.entries[keys[i]], 10);
                        else if (typeof object.entries[keys[i]] === "number")
                            message.entries[keys[i]] = object.entries[keys[i]];
                        else if (typeof object.entries[keys[i]] === "object")
                            message.entries[keys[i]] = new $util.LongBits(object.entries[keys[i]].low >>> 0, object.entries[keys[i]].high >>> 0).toNumber(true);
                    }
                }
                return message;
            };

            /**
             * Creates a plain object from a VClock message. Also converts values to other types if specified.
             * @function toObject
             * @memberof osp.v1.VClock
             * @static
             * @param {osp.v1.VClock} message VClock
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            VClock.toObject = function toObject(message, options, q) {
                if (!options)
                    options = {};
                if (q === undefined)
                    q = 0;
                if (q > $util.recursionLimit)
                    throw Error("max depth exceeded");
                var object = {};
                if (options.objects || options.defaults)
                    object.entries = {};
                var keys2;
                if (message.entries && (keys2 = Object.keys(message.entries)).length) {
                    object.entries = {};
                    for (var j = 0; j < keys2.length; ++j) {
                        if (keys2[j] === "__proto__")
                            $util.makeProp(object.entries, keys2[j]);
                        if (typeof BigInt !== "undefined" && options.longs === BigInt)
                            object.entries[keys2[j]] = typeof message.entries[keys2[j]] === "number" ? BigInt(message.entries[keys2[j]]) : $util.Long.fromBits(message.entries[keys2[j]].low >>> 0, message.entries[keys2[j]].high >>> 0, true).toBigInt();
                        else if (typeof message.entries[keys2[j]] === "number")
                            object.entries[keys2[j]] = options.longs === String ? String(message.entries[keys2[j]]) : message.entries[keys2[j]];
                        else
                            object.entries[keys2[j]] = options.longs === String ? $util.Long.prototype.toString.call(message.entries[keys2[j]]) : options.longs === Number ? new $util.LongBits(message.entries[keys2[j]].low >>> 0, message.entries[keys2[j]].high >>> 0).toNumber(true) : message.entries[keys2[j]];
                    }
                }
                return object;
            };

            /**
             * Converts this VClock to JSON.
             * @function toJSON
             * @memberof osp.v1.VClock
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            VClock.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for VClock
             * @function getTypeUrl
             * @memberof osp.v1.VClock
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            VClock.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/osp.v1.VClock";
            };

            return VClock;
        })();

        v1.Value = (function() {

            /**
             * Properties of a Value.
             * @memberof osp.v1
             * @interface IValue
             * @property {boolean|null} [nullValue] Value nullValue
             * @property {boolean|null} [boolValue] Value boolValue
             * @property {number|Long|null} [intValue] Value intValue
             * @property {number|null} [doubleValue] Value doubleValue
             * @property {string|null} [stringValue] Value stringValue
             * @property {Uint8Array|null} [bytesValue] Value bytesValue
             * @property {osp.v1.IValueArray|null} [arrayValue] Value arrayValue
             * @property {osp.v1.IValueMap|null} [objectValue] Value objectValue
             */

            /**
             * Constructs a new Value.
             * @memberof osp.v1
             * @classdesc Represents a Value.
             * @implements IValue
             * @constructor
             * @param {osp.v1.IValue=} [properties] Properties to set
             */
            function Value(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Value nullValue.
             * @member {boolean|null|undefined} nullValue
             * @memberof osp.v1.Value
             * @instance
             */
            Value.prototype.nullValue = null;

            /**
             * Value boolValue.
             * @member {boolean|null|undefined} boolValue
             * @memberof osp.v1.Value
             * @instance
             */
            Value.prototype.boolValue = null;

            /**
             * Value intValue.
             * @member {number|Long|null|undefined} intValue
             * @memberof osp.v1.Value
             * @instance
             */
            Value.prototype.intValue = null;

            /**
             * Value doubleValue.
             * @member {number|null|undefined} doubleValue
             * @memberof osp.v1.Value
             * @instance
             */
            Value.prototype.doubleValue = null;

            /**
             * Value stringValue.
             * @member {string|null|undefined} stringValue
             * @memberof osp.v1.Value
             * @instance
             */
            Value.prototype.stringValue = null;

            /**
             * Value bytesValue.
             * @member {Uint8Array|null|undefined} bytesValue
             * @memberof osp.v1.Value
             * @instance
             */
            Value.prototype.bytesValue = null;

            /**
             * Value arrayValue.
             * @member {osp.v1.IValueArray|null|undefined} arrayValue
             * @memberof osp.v1.Value
             * @instance
             */
            Value.prototype.arrayValue = null;

            /**
             * Value objectValue.
             * @member {osp.v1.IValueMap|null|undefined} objectValue
             * @memberof osp.v1.Value
             * @instance
             */
            Value.prototype.objectValue = null;

            // OneOf field names bound to virtual getters and setters
            var $oneOfFields;

            /**
             * Value kind.
             * @member {"nullValue"|"boolValue"|"intValue"|"doubleValue"|"stringValue"|"bytesValue"|"arrayValue"|"objectValue"|undefined} kind
             * @memberof osp.v1.Value
             * @instance
             */
            Object.defineProperty(Value.prototype, "kind", {
                get: $util.oneOfGetter($oneOfFields = ["nullValue", "boolValue", "intValue", "doubleValue", "stringValue", "bytesValue", "arrayValue", "objectValue"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new Value instance using the specified properties.
             * @function create
             * @memberof osp.v1.Value
             * @static
             * @param {osp.v1.IValue=} [properties] Properties to set
             * @returns {osp.v1.Value} Value instance
             */
            Value.create = function create(properties) {
                return new Value(properties);
            };

            /**
             * Encodes the specified Value message. Does not implicitly {@link osp.v1.Value.verify|verify} messages.
             * @function encode
             * @memberof osp.v1.Value
             * @static
             * @param {osp.v1.IValue} message Value message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Value.encode = function encode(message, writer, q) {
                if (!writer)
                    writer = $Writer.create();
                if (q === undefined)
                    q = 0;
                if (q > $util.recursionLimit)
                    throw Error("max depth exceeded");
                if (message.nullValue != null && Object.hasOwnProperty.call(message, "nullValue"))
                    writer.uint32(/* id 1, wireType 0 =*/8).bool(message.nullValue);
                if (message.boolValue != null && Object.hasOwnProperty.call(message, "boolValue"))
                    writer.uint32(/* id 2, wireType 0 =*/16).bool(message.boolValue);
                if (message.intValue != null && Object.hasOwnProperty.call(message, "intValue"))
                    writer.uint32(/* id 3, wireType 0 =*/24).int64(message.intValue);
                if (message.doubleValue != null && Object.hasOwnProperty.call(message, "doubleValue"))
                    writer.uint32(/* id 4, wireType 1 =*/33).double(message.doubleValue);
                if (message.stringValue != null && Object.hasOwnProperty.call(message, "stringValue"))
                    writer.uint32(/* id 5, wireType 2 =*/42).string(message.stringValue);
                if (message.bytesValue != null && Object.hasOwnProperty.call(message, "bytesValue"))
                    writer.uint32(/* id 6, wireType 2 =*/50).bytes(message.bytesValue);
                if (message.arrayValue != null && Object.hasOwnProperty.call(message, "arrayValue"))
                    $root.osp.v1.ValueArray.encode(message.arrayValue, writer.uint32(/* id 7, wireType 2 =*/58).fork(), q + 1).ldelim();
                if (message.objectValue != null && Object.hasOwnProperty.call(message, "objectValue"))
                    $root.osp.v1.ValueMap.encode(message.objectValue, writer.uint32(/* id 8, wireType 2 =*/66).fork(), q + 1).ldelim();
                return writer;
            };

            /**
             * Encodes the specified Value message, length delimited. Does not implicitly {@link osp.v1.Value.verify|verify} messages.
             * @function encodeDelimited
             * @memberof osp.v1.Value
             * @static
             * @param {osp.v1.IValue} message Value message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Value.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
            };

            /**
             * Decodes a Value message from the specified reader or buffer.
             * @function decode
             * @memberof osp.v1.Value
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {osp.v1.Value} Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Value.decode = function decode(reader, length, error, long) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (long === undefined)
                    long = 0;
                if (long > $Reader.recursionLimit)
                    throw Error("maximum nesting depth exceeded");
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.osp.v1.Value();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            message.nullValue = reader.bool();
                            break;
                        }
                    case 2: {
                            message.boolValue = reader.bool();
                            break;
                        }
                    case 3: {
                            message.intValue = reader.int64();
                            break;
                        }
                    case 4: {
                            message.doubleValue = reader.double();
                            break;
                        }
                    case 5: {
                            message.stringValue = reader.string();
                            break;
                        }
                    case 6: {
                            message.bytesValue = reader.bytes();
                            break;
                        }
                    case 7: {
                            message.arrayValue = $root.osp.v1.ValueArray.decode(reader, reader.uint32(), undefined, long + 1);
                            break;
                        }
                    case 8: {
                            message.objectValue = $root.osp.v1.ValueMap.decode(reader, reader.uint32(), undefined, long + 1);
                            break;
                        }
                    default:
                        reader.skipType(tag & 7, long);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a Value message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof osp.v1.Value
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {osp.v1.Value} Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Value.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a Value message.
             * @function verify
             * @memberof osp.v1.Value
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Value.verify = function verify(message, long) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (long === undefined)
                    long = 0;
                if (long > $util.recursionLimit)
                    return "maximum nesting depth exceeded";
                var properties = {};
                if (message.nullValue != null && Object.hasOwnProperty.call(message, "nullValue")) {
                    properties.kind = 1;
                    if (typeof message.nullValue !== "boolean")
                        return "nullValue: boolean expected";
                }
                if (message.boolValue != null && Object.hasOwnProperty.call(message, "boolValue")) {
                    if (properties.kind === 1)
                        return "kind: multiple values";
                    properties.kind = 1;
                    if (typeof message.boolValue !== "boolean")
                        return "boolValue: boolean expected";
                }
                if (message.intValue != null && Object.hasOwnProperty.call(message, "intValue")) {
                    if (properties.kind === 1)
                        return "kind: multiple values";
                    properties.kind = 1;
                    if (!$util.isInteger(message.intValue) && !(message.intValue && $util.isInteger(message.intValue.low) && $util.isInteger(message.intValue.high)))
                        return "intValue: integer|Long expected";
                }
                if (message.doubleValue != null && Object.hasOwnProperty.call(message, "doubleValue")) {
                    if (properties.kind === 1)
                        return "kind: multiple values";
                    properties.kind = 1;
                    if (typeof message.doubleValue !== "number")
                        return "doubleValue: number expected";
                }
                if (message.stringValue != null && Object.hasOwnProperty.call(message, "stringValue")) {
                    if (properties.kind === 1)
                        return "kind: multiple values";
                    properties.kind = 1;
                    if (!$util.isString(message.stringValue))
                        return "stringValue: string expected";
                }
                if (message.bytesValue != null && Object.hasOwnProperty.call(message, "bytesValue")) {
                    if (properties.kind === 1)
                        return "kind: multiple values";
                    properties.kind = 1;
                    if (!(message.bytesValue && typeof message.bytesValue.length === "number" || $util.isString(message.bytesValue)))
                        return "bytesValue: buffer expected";
                }
                if (message.arrayValue != null && Object.hasOwnProperty.call(message, "arrayValue")) {
                    if (properties.kind === 1)
                        return "kind: multiple values";
                    properties.kind = 1;
                    {
                        var error = $root.osp.v1.ValueArray.verify(message.arrayValue, long + 1);
                        if (error)
                            return "arrayValue." + error;
                    }
                }
                if (message.objectValue != null && Object.hasOwnProperty.call(message, "objectValue")) {
                    if (properties.kind === 1)
                        return "kind: multiple values";
                    properties.kind = 1;
                    {
                        var error = $root.osp.v1.ValueMap.verify(message.objectValue, long + 1);
                        if (error)
                            return "objectValue." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a Value message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof osp.v1.Value
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {osp.v1.Value} Value
             */
            Value.fromObject = function fromObject(object, long) {
                if (object instanceof $root.osp.v1.Value)
                    return object;
                if (!$util.isObject(object))
                    throw TypeError(".osp.v1.Value: object expected");
                if (long === undefined)
                    long = 0;
                if (long > $util.recursionLimit)
                    throw Error("maximum nesting depth exceeded");
                var message = new $root.osp.v1.Value();
                if (object.nullValue != null)
                    message.nullValue = Boolean(object.nullValue);
                if (object.boolValue != null)
                    message.boolValue = Boolean(object.boolValue);
                if (object.intValue != null)
                    if ($util.Long)
                        message.intValue = $util.Long.fromValue(object.intValue, false);
                    else if (typeof object.intValue === "string")
                        message.intValue = parseInt(object.intValue, 10);
                    else if (typeof object.intValue === "number")
                        message.intValue = object.intValue;
                    else if (typeof object.intValue === "object")
                        message.intValue = new $util.LongBits(object.intValue.low >>> 0, object.intValue.high >>> 0).toNumber();
                if (object.doubleValue != null)
                    message.doubleValue = Number(object.doubleValue);
                if (object.stringValue != null)
                    message.stringValue = String(object.stringValue);
                if (object.bytesValue != null)
                    if (typeof object.bytesValue === "string")
                        $util.base64.decode(object.bytesValue, message.bytesValue = $util.newBuffer($util.base64.length(object.bytesValue)), 0);
                    else if (object.bytesValue.length >= 0)
                        message.bytesValue = object.bytesValue;
                if (object.arrayValue != null) {
                    if (!$util.isObject(object.arrayValue))
                        throw TypeError(".osp.v1.Value.arrayValue: object expected");
                    message.arrayValue = $root.osp.v1.ValueArray.fromObject(object.arrayValue, long + 1);
                }
                if (object.objectValue != null) {
                    if (!$util.isObject(object.objectValue))
                        throw TypeError(".osp.v1.Value.objectValue: object expected");
                    message.objectValue = $root.osp.v1.ValueMap.fromObject(object.objectValue, long + 1);
                }
                return message;
            };

            /**
             * Creates a plain object from a Value message. Also converts values to other types if specified.
             * @function toObject
             * @memberof osp.v1.Value
             * @static
             * @param {osp.v1.Value} message Value
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Value.toObject = function toObject(message, options, q) {
                if (!options)
                    options = {};
                if (q === undefined)
                    q = 0;
                if (q > $util.recursionLimit)
                    throw Error("max depth exceeded");
                var object = {};
                if (message.nullValue != null && Object.hasOwnProperty.call(message, "nullValue")) {
                    object.nullValue = message.nullValue;
                    if (options.oneofs)
                        object.kind = "nullValue";
                }
                if (message.boolValue != null && Object.hasOwnProperty.call(message, "boolValue")) {
                    object.boolValue = message.boolValue;
                    if (options.oneofs)
                        object.kind = "boolValue";
                }
                if (message.intValue != null && Object.hasOwnProperty.call(message, "intValue")) {
                    if (typeof BigInt !== "undefined" && options.longs === BigInt)
                        object.intValue = typeof message.intValue === "number" ? BigInt(message.intValue) : $util.Long.fromBits(message.intValue.low >>> 0, message.intValue.high >>> 0, false).toBigInt();
                    else if (typeof message.intValue === "number")
                        object.intValue = options.longs === String ? String(message.intValue) : message.intValue;
                    else
                        object.intValue = options.longs === String ? $util.Long.prototype.toString.call(message.intValue) : options.longs === Number ? new $util.LongBits(message.intValue.low >>> 0, message.intValue.high >>> 0).toNumber() : message.intValue;
                    if (options.oneofs)
                        object.kind = "intValue";
                }
                if (message.doubleValue != null && Object.hasOwnProperty.call(message, "doubleValue")) {
                    object.doubleValue = options.json && !isFinite(message.doubleValue) ? String(message.doubleValue) : message.doubleValue;
                    if (options.oneofs)
                        object.kind = "doubleValue";
                }
                if (message.stringValue != null && Object.hasOwnProperty.call(message, "stringValue")) {
                    object.stringValue = message.stringValue;
                    if (options.oneofs)
                        object.kind = "stringValue";
                }
                if (message.bytesValue != null && Object.hasOwnProperty.call(message, "bytesValue")) {
                    object.bytesValue = options.bytes === String ? $util.base64.encode(message.bytesValue, 0, message.bytesValue.length) : options.bytes === Array ? Array.prototype.slice.call(message.bytesValue) : message.bytesValue;
                    if (options.oneofs)
                        object.kind = "bytesValue";
                }
                if (message.arrayValue != null && Object.hasOwnProperty.call(message, "arrayValue")) {
                    object.arrayValue = $root.osp.v1.ValueArray.toObject(message.arrayValue, options, q + 1);
                    if (options.oneofs)
                        object.kind = "arrayValue";
                }
                if (message.objectValue != null && Object.hasOwnProperty.call(message, "objectValue")) {
                    object.objectValue = $root.osp.v1.ValueMap.toObject(message.objectValue, options, q + 1);
                    if (options.oneofs)
                        object.kind = "objectValue";
                }
                return object;
            };

            /**
             * Converts this Value to JSON.
             * @function toJSON
             * @memberof osp.v1.Value
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Value.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for Value
             * @function getTypeUrl
             * @memberof osp.v1.Value
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            Value.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/osp.v1.Value";
            };

            return Value;
        })();

        v1.ValueArray = (function() {

            /**
             * Properties of a ValueArray.
             * @memberof osp.v1
             * @interface IValueArray
             * @property {Array.<osp.v1.IValue>|null} [items] ValueArray items
             */

            /**
             * Constructs a new ValueArray.
             * @memberof osp.v1
             * @classdesc Represents a ValueArray.
             * @implements IValueArray
             * @constructor
             * @param {osp.v1.IValueArray=} [properties] Properties to set
             */
            function ValueArray(properties) {
                this.items = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * ValueArray items.
             * @member {Array.<osp.v1.IValue>} items
             * @memberof osp.v1.ValueArray
             * @instance
             */
            ValueArray.prototype.items = $util.emptyArray;

            /**
             * Creates a new ValueArray instance using the specified properties.
             * @function create
             * @memberof osp.v1.ValueArray
             * @static
             * @param {osp.v1.IValueArray=} [properties] Properties to set
             * @returns {osp.v1.ValueArray} ValueArray instance
             */
            ValueArray.create = function create(properties) {
                return new ValueArray(properties);
            };

            /**
             * Encodes the specified ValueArray message. Does not implicitly {@link osp.v1.ValueArray.verify|verify} messages.
             * @function encode
             * @memberof osp.v1.ValueArray
             * @static
             * @param {osp.v1.IValueArray} message ValueArray message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ValueArray.encode = function encode(message, writer, q) {
                if (!writer)
                    writer = $Writer.create();
                if (q === undefined)
                    q = 0;
                if (q > $util.recursionLimit)
                    throw Error("max depth exceeded");
                if (message.items != null && message.items.length)
                    for (var i = 0; i < message.items.length; ++i)
                        $root.osp.v1.Value.encode(message.items[i], writer.uint32(/* id 1, wireType 2 =*/10).fork(), q + 1).ldelim();
                return writer;
            };

            /**
             * Encodes the specified ValueArray message, length delimited. Does not implicitly {@link osp.v1.ValueArray.verify|verify} messages.
             * @function encodeDelimited
             * @memberof osp.v1.ValueArray
             * @static
             * @param {osp.v1.IValueArray} message ValueArray message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ValueArray.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
            };

            /**
             * Decodes a ValueArray message from the specified reader or buffer.
             * @function decode
             * @memberof osp.v1.ValueArray
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {osp.v1.ValueArray} ValueArray
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ValueArray.decode = function decode(reader, length, error, long) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (long === undefined)
                    long = 0;
                if (long > $Reader.recursionLimit)
                    throw Error("maximum nesting depth exceeded");
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.osp.v1.ValueArray();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            if (!(message.items && message.items.length))
                                message.items = [];
                            message.items.push($root.osp.v1.Value.decode(reader, reader.uint32(), undefined, long + 1));
                            break;
                        }
                    default:
                        reader.skipType(tag & 7, long);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a ValueArray message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof osp.v1.ValueArray
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {osp.v1.ValueArray} ValueArray
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ValueArray.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a ValueArray message.
             * @function verify
             * @memberof osp.v1.ValueArray
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ValueArray.verify = function verify(message, long) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (long === undefined)
                    long = 0;
                if (long > $util.recursionLimit)
                    return "maximum nesting depth exceeded";
                if (message.items != null && Object.hasOwnProperty.call(message, "items")) {
                    if (!Array.isArray(message.items))
                        return "items: array expected";
                    for (var i = 0; i < message.items.length; ++i) {
                        var error = $root.osp.v1.Value.verify(message.items[i], long + 1);
                        if (error)
                            return "items." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a ValueArray message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof osp.v1.ValueArray
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {osp.v1.ValueArray} ValueArray
             */
            ValueArray.fromObject = function fromObject(object, long) {
                if (object instanceof $root.osp.v1.ValueArray)
                    return object;
                if (!$util.isObject(object))
                    throw TypeError(".osp.v1.ValueArray: object expected");
                if (long === undefined)
                    long = 0;
                if (long > $util.recursionLimit)
                    throw Error("maximum nesting depth exceeded");
                var message = new $root.osp.v1.ValueArray();
                if (object.items) {
                    if (!Array.isArray(object.items))
                        throw TypeError(".osp.v1.ValueArray.items: array expected");
                    message.items = [];
                    for (var i = 0; i < object.items.length; ++i) {
                        if (!$util.isObject(object.items[i]))
                            throw TypeError(".osp.v1.ValueArray.items: object expected");
                        message.items[i] = $root.osp.v1.Value.fromObject(object.items[i], long + 1);
                    }
                }
                return message;
            };

            /**
             * Creates a plain object from a ValueArray message. Also converts values to other types if specified.
             * @function toObject
             * @memberof osp.v1.ValueArray
             * @static
             * @param {osp.v1.ValueArray} message ValueArray
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ValueArray.toObject = function toObject(message, options, q) {
                if (!options)
                    options = {};
                if (q === undefined)
                    q = 0;
                if (q > $util.recursionLimit)
                    throw Error("max depth exceeded");
                var object = {};
                if (options.arrays || options.defaults)
                    object.items = [];
                if (message.items && message.items.length) {
                    object.items = [];
                    for (var j = 0; j < message.items.length; ++j)
                        object.items[j] = $root.osp.v1.Value.toObject(message.items[j], options, q + 1);
                }
                return object;
            };

            /**
             * Converts this ValueArray to JSON.
             * @function toJSON
             * @memberof osp.v1.ValueArray
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ValueArray.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for ValueArray
             * @function getTypeUrl
             * @memberof osp.v1.ValueArray
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            ValueArray.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/osp.v1.ValueArray";
            };

            return ValueArray;
        })();

        v1.ValueMap = (function() {

            /**
             * Properties of a ValueMap.
             * @memberof osp.v1
             * @interface IValueMap
             * @property {Object.<string,osp.v1.IValue>|null} [entries] ValueMap entries
             */

            /**
             * Constructs a new ValueMap.
             * @memberof osp.v1
             * @classdesc Represents a ValueMap.
             * @implements IValueMap
             * @constructor
             * @param {osp.v1.IValueMap=} [properties] Properties to set
             */
            function ValueMap(properties) {
                this.entries = {};
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * ValueMap entries.
             * @member {Object.<string,osp.v1.IValue>} entries
             * @memberof osp.v1.ValueMap
             * @instance
             */
            ValueMap.prototype.entries = $util.emptyObject;

            /**
             * Creates a new ValueMap instance using the specified properties.
             * @function create
             * @memberof osp.v1.ValueMap
             * @static
             * @param {osp.v1.IValueMap=} [properties] Properties to set
             * @returns {osp.v1.ValueMap} ValueMap instance
             */
            ValueMap.create = function create(properties) {
                return new ValueMap(properties);
            };

            /**
             * Encodes the specified ValueMap message. Does not implicitly {@link osp.v1.ValueMap.verify|verify} messages.
             * @function encode
             * @memberof osp.v1.ValueMap
             * @static
             * @param {osp.v1.IValueMap} message ValueMap message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ValueMap.encode = function encode(message, writer, q) {
                if (!writer)
                    writer = $Writer.create();
                if (q === undefined)
                    q = 0;
                if (q > $util.recursionLimit)
                    throw Error("max depth exceeded");
                if (message.entries != null && Object.hasOwnProperty.call(message, "entries"))
                    for (var keys = Object.keys(message.entries), i = 0; i < keys.length; ++i) {
                        writer.uint32(/* id 1, wireType 2 =*/10).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                        $root.osp.v1.Value.encode(message.entries[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork(), q + 1).ldelim().ldelim();
                    }
                return writer;
            };

            /**
             * Encodes the specified ValueMap message, length delimited. Does not implicitly {@link osp.v1.ValueMap.verify|verify} messages.
             * @function encodeDelimited
             * @memberof osp.v1.ValueMap
             * @static
             * @param {osp.v1.IValueMap} message ValueMap message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ValueMap.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
            };

            /**
             * Decodes a ValueMap message from the specified reader or buffer.
             * @function decode
             * @memberof osp.v1.ValueMap
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {osp.v1.ValueMap} ValueMap
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ValueMap.decode = function decode(reader, length, error, long) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (long === undefined)
                    long = 0;
                if (long > $Reader.recursionLimit)
                    throw Error("maximum nesting depth exceeded");
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.osp.v1.ValueMap(), key, value;
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            if (message.entries === $util.emptyObject)
                                message.entries = {};
                            var end2 = reader.uint32() + reader.pos;
                            key = "";
                            value = null;
                            while (reader.pos < end2) {
                                var tag2 = reader.uint32();
                                switch (tag2 >>> 3) {
                                case 1:
                                    key = reader.string();
                                    break;
                                case 2:
                                    value = $root.osp.v1.Value.decode(reader, reader.uint32(), undefined, long + 1);
                                    break;
                                default:
                                    reader.skipType(tag2 & 7, long);
                                    break;
                                }
                            }
                            if (key === "__proto__")
                                $util.makeProp(message.entries, key);
                            message.entries[key] = value;
                            break;
                        }
                    default:
                        reader.skipType(tag & 7, long);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a ValueMap message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof osp.v1.ValueMap
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {osp.v1.ValueMap} ValueMap
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ValueMap.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a ValueMap message.
             * @function verify
             * @memberof osp.v1.ValueMap
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ValueMap.verify = function verify(message, long) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (long === undefined)
                    long = 0;
                if (long > $util.recursionLimit)
                    return "maximum nesting depth exceeded";
                if (message.entries != null && Object.hasOwnProperty.call(message, "entries")) {
                    if (!$util.isObject(message.entries))
                        return "entries: object expected";
                    var key = Object.keys(message.entries);
                    for (var i = 0; i < key.length; ++i) {
                        var error = $root.osp.v1.Value.verify(message.entries[key[i]], long + 1);
                        if (error)
                            return "entries." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a ValueMap message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof osp.v1.ValueMap
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {osp.v1.ValueMap} ValueMap
             */
            ValueMap.fromObject = function fromObject(object, long) {
                if (object instanceof $root.osp.v1.ValueMap)
                    return object;
                if (!$util.isObject(object))
                    throw TypeError(".osp.v1.ValueMap: object expected");
                if (long === undefined)
                    long = 0;
                if (long > $util.recursionLimit)
                    throw Error("maximum nesting depth exceeded");
                var message = new $root.osp.v1.ValueMap();
                if (object.entries) {
                    if (!$util.isObject(object.entries))
                        throw TypeError(".osp.v1.ValueMap.entries: object expected");
                    message.entries = {};
                    for (var keys = Object.keys(object.entries), i = 0; i < keys.length; ++i) {
                        if (keys[i] === "__proto__")
                            $util.makeProp(message.entries, keys[i]);
                        if (!$util.isObject(object.entries[keys[i]]))
                            throw TypeError(".osp.v1.ValueMap.entries: object expected");
                        message.entries[keys[i]] = $root.osp.v1.Value.fromObject(object.entries[keys[i]], long + 1);
                    }
                }
                return message;
            };

            /**
             * Creates a plain object from a ValueMap message. Also converts values to other types if specified.
             * @function toObject
             * @memberof osp.v1.ValueMap
             * @static
             * @param {osp.v1.ValueMap} message ValueMap
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ValueMap.toObject = function toObject(message, options, q) {
                if (!options)
                    options = {};
                if (q === undefined)
                    q = 0;
                if (q > $util.recursionLimit)
                    throw Error("max depth exceeded");
                var object = {};
                if (options.objects || options.defaults)
                    object.entries = {};
                var keys2;
                if (message.entries && (keys2 = Object.keys(message.entries)).length) {
                    object.entries = {};
                    for (var j = 0; j < keys2.length; ++j) {
                        if (keys2[j] === "__proto__")
                            $util.makeProp(object.entries, keys2[j]);
                        object.entries[keys2[j]] = $root.osp.v1.Value.toObject(message.entries[keys2[j]], options, q + 1);
                    }
                }
                return object;
            };

            /**
             * Converts this ValueMap to JSON.
             * @function toJSON
             * @memberof osp.v1.ValueMap
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ValueMap.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for ValueMap
             * @function getTypeUrl
             * @memberof osp.v1.ValueMap
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            ValueMap.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/osp.v1.ValueMap";
            };

            return ValueMap;
        })();

        v1.FieldChange = (function() {

            /**
             * Properties of a FieldChange.
             * @memberof osp.v1
             * @interface IFieldChange
             * @property {string|null} [fieldName] FieldChange fieldName
             * @property {osp.v1.IValue|null} [newValue] FieldChange newValue
             * @property {number|Long|null} [lamport] FieldChange lamport
             * @property {string|null} [writerDeviceId] FieldChange writerDeviceId
             */

            /**
             * Constructs a new FieldChange.
             * @memberof osp.v1
             * @classdesc Represents a FieldChange.
             * @implements IFieldChange
             * @constructor
             * @param {osp.v1.IFieldChange=} [properties] Properties to set
             */
            function FieldChange(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * FieldChange fieldName.
             * @member {string} fieldName
             * @memberof osp.v1.FieldChange
             * @instance
             */
            FieldChange.prototype.fieldName = "";

            /**
             * FieldChange newValue.
             * @member {osp.v1.IValue|null|undefined} newValue
             * @memberof osp.v1.FieldChange
             * @instance
             */
            FieldChange.prototype.newValue = null;

            /**
             * FieldChange lamport.
             * @member {number|Long} lamport
             * @memberof osp.v1.FieldChange
             * @instance
             */
            FieldChange.prototype.lamport = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * FieldChange writerDeviceId.
             * @member {string} writerDeviceId
             * @memberof osp.v1.FieldChange
             * @instance
             */
            FieldChange.prototype.writerDeviceId = "";

            /**
             * Creates a new FieldChange instance using the specified properties.
             * @function create
             * @memberof osp.v1.FieldChange
             * @static
             * @param {osp.v1.IFieldChange=} [properties] Properties to set
             * @returns {osp.v1.FieldChange} FieldChange instance
             */
            FieldChange.create = function create(properties) {
                return new FieldChange(properties);
            };

            /**
             * Encodes the specified FieldChange message. Does not implicitly {@link osp.v1.FieldChange.verify|verify} messages.
             * @function encode
             * @memberof osp.v1.FieldChange
             * @static
             * @param {osp.v1.IFieldChange} message FieldChange message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            FieldChange.encode = function encode(message, writer, q) {
                if (!writer)
                    writer = $Writer.create();
                if (q === undefined)
                    q = 0;
                if (q > $util.recursionLimit)
                    throw Error("max depth exceeded");
                if (message.fieldName != null && Object.hasOwnProperty.call(message, "fieldName"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.fieldName);
                if (message.newValue != null && Object.hasOwnProperty.call(message, "newValue"))
                    $root.osp.v1.Value.encode(message.newValue, writer.uint32(/* id 2, wireType 2 =*/18).fork(), q + 1).ldelim();
                if (message.lamport != null && Object.hasOwnProperty.call(message, "lamport"))
                    writer.uint32(/* id 3, wireType 0 =*/24).uint64(message.lamport);
                if (message.writerDeviceId != null && Object.hasOwnProperty.call(message, "writerDeviceId"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.writerDeviceId);
                return writer;
            };

            /**
             * Encodes the specified FieldChange message, length delimited. Does not implicitly {@link osp.v1.FieldChange.verify|verify} messages.
             * @function encodeDelimited
             * @memberof osp.v1.FieldChange
             * @static
             * @param {osp.v1.IFieldChange} message FieldChange message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            FieldChange.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
            };

            /**
             * Decodes a FieldChange message from the specified reader or buffer.
             * @function decode
             * @memberof osp.v1.FieldChange
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {osp.v1.FieldChange} FieldChange
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            FieldChange.decode = function decode(reader, length, error, long) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (long === undefined)
                    long = 0;
                if (long > $Reader.recursionLimit)
                    throw Error("maximum nesting depth exceeded");
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.osp.v1.FieldChange();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            message.fieldName = reader.string();
                            break;
                        }
                    case 2: {
                            message.newValue = $root.osp.v1.Value.decode(reader, reader.uint32(), undefined, long + 1);
                            break;
                        }
                    case 3: {
                            message.lamport = reader.uint64();
                            break;
                        }
                    case 4: {
                            message.writerDeviceId = reader.string();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7, long);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a FieldChange message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof osp.v1.FieldChange
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {osp.v1.FieldChange} FieldChange
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            FieldChange.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a FieldChange message.
             * @function verify
             * @memberof osp.v1.FieldChange
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            FieldChange.verify = function verify(message, long) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (long === undefined)
                    long = 0;
                if (long > $util.recursionLimit)
                    return "maximum nesting depth exceeded";
                if (message.fieldName != null && Object.hasOwnProperty.call(message, "fieldName"))
                    if (!$util.isString(message.fieldName))
                        return "fieldName: string expected";
                if (message.newValue != null && Object.hasOwnProperty.call(message, "newValue")) {
                    var error = $root.osp.v1.Value.verify(message.newValue, long + 1);
                    if (error)
                        return "newValue." + error;
                }
                if (message.lamport != null && Object.hasOwnProperty.call(message, "lamport"))
                    if (!$util.isInteger(message.lamport) && !(message.lamport && $util.isInteger(message.lamport.low) && $util.isInteger(message.lamport.high)))
                        return "lamport: integer|Long expected";
                if (message.writerDeviceId != null && Object.hasOwnProperty.call(message, "writerDeviceId"))
                    if (!$util.isString(message.writerDeviceId))
                        return "writerDeviceId: string expected";
                return null;
            };

            /**
             * Creates a FieldChange message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof osp.v1.FieldChange
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {osp.v1.FieldChange} FieldChange
             */
            FieldChange.fromObject = function fromObject(object, long) {
                if (object instanceof $root.osp.v1.FieldChange)
                    return object;
                if (!$util.isObject(object))
                    throw TypeError(".osp.v1.FieldChange: object expected");
                if (long === undefined)
                    long = 0;
                if (long > $util.recursionLimit)
                    throw Error("maximum nesting depth exceeded");
                var message = new $root.osp.v1.FieldChange();
                if (object.fieldName != null)
                    message.fieldName = String(object.fieldName);
                if (object.newValue != null) {
                    if (!$util.isObject(object.newValue))
                        throw TypeError(".osp.v1.FieldChange.newValue: object expected");
                    message.newValue = $root.osp.v1.Value.fromObject(object.newValue, long + 1);
                }
                if (object.lamport != null)
                    if ($util.Long)
                        message.lamport = $util.Long.fromValue(object.lamport, true);
                    else if (typeof object.lamport === "string")
                        message.lamport = parseInt(object.lamport, 10);
                    else if (typeof object.lamport === "number")
                        message.lamport = object.lamport;
                    else if (typeof object.lamport === "object")
                        message.lamport = new $util.LongBits(object.lamport.low >>> 0, object.lamport.high >>> 0).toNumber(true);
                if (object.writerDeviceId != null)
                    message.writerDeviceId = String(object.writerDeviceId);
                return message;
            };

            /**
             * Creates a plain object from a FieldChange message. Also converts values to other types if specified.
             * @function toObject
             * @memberof osp.v1.FieldChange
             * @static
             * @param {osp.v1.FieldChange} message FieldChange
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            FieldChange.toObject = function toObject(message, options, q) {
                if (!options)
                    options = {};
                if (q === undefined)
                    q = 0;
                if (q > $util.recursionLimit)
                    throw Error("max depth exceeded");
                var object = {};
                if (options.defaults) {
                    object.fieldName = "";
                    object.newValue = null;
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.lamport = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : typeof BigInt !== "undefined" && options.longs === BigInt ? long.toBigInt() : long;
                    } else
                        object.lamport = options.longs === String ? "0" : typeof BigInt !== "undefined" && options.longs === BigInt ? BigInt("0") : 0;
                    object.writerDeviceId = "";
                }
                if (message.fieldName != null && Object.hasOwnProperty.call(message, "fieldName"))
                    object.fieldName = message.fieldName;
                if (message.newValue != null && Object.hasOwnProperty.call(message, "newValue"))
                    object.newValue = $root.osp.v1.Value.toObject(message.newValue, options, q + 1);
                if (message.lamport != null && Object.hasOwnProperty.call(message, "lamport"))
                    if (typeof BigInt !== "undefined" && options.longs === BigInt)
                        object.lamport = typeof message.lamport === "number" ? BigInt(message.lamport) : $util.Long.fromBits(message.lamport.low >>> 0, message.lamport.high >>> 0, true).toBigInt();
                    else if (typeof message.lamport === "number")
                        object.lamport = options.longs === String ? String(message.lamport) : message.lamport;
                    else
                        object.lamport = options.longs === String ? $util.Long.prototype.toString.call(message.lamport) : options.longs === Number ? new $util.LongBits(message.lamport.low >>> 0, message.lamport.high >>> 0).toNumber(true) : message.lamport;
                if (message.writerDeviceId != null && Object.hasOwnProperty.call(message, "writerDeviceId"))
                    object.writerDeviceId = message.writerDeviceId;
                return object;
            };

            /**
             * Converts this FieldChange to JSON.
             * @function toJSON
             * @memberof osp.v1.FieldChange
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            FieldChange.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for FieldChange
             * @function getTypeUrl
             * @memberof osp.v1.FieldChange
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            FieldChange.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/osp.v1.FieldChange";
            };

            return FieldChange;
        })();

        v1.ErrorInfo = (function() {

            /**
             * Properties of an ErrorInfo.
             * @memberof osp.v1
             * @interface IErrorInfo
             * @property {number|null} [code] ErrorInfo code
             * @property {string|null} [message] ErrorInfo message
             * @property {string|null} [detail] ErrorInfo detail
             */

            /**
             * Constructs a new ErrorInfo.
             * @memberof osp.v1
             * @classdesc Represents an ErrorInfo.
             * @implements IErrorInfo
             * @constructor
             * @param {osp.v1.IErrorInfo=} [properties] Properties to set
             */
            function ErrorInfo(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * ErrorInfo code.
             * @member {number} code
             * @memberof osp.v1.ErrorInfo
             * @instance
             */
            ErrorInfo.prototype.code = 0;

            /**
             * ErrorInfo message.
             * @member {string} message
             * @memberof osp.v1.ErrorInfo
             * @instance
             */
            ErrorInfo.prototype.message = "";

            /**
             * ErrorInfo detail.
             * @member {string} detail
             * @memberof osp.v1.ErrorInfo
             * @instance
             */
            ErrorInfo.prototype.detail = "";

            /**
             * Creates a new ErrorInfo instance using the specified properties.
             * @function create
             * @memberof osp.v1.ErrorInfo
             * @static
             * @param {osp.v1.IErrorInfo=} [properties] Properties to set
             * @returns {osp.v1.ErrorInfo} ErrorInfo instance
             */
            ErrorInfo.create = function create(properties) {
                return new ErrorInfo(properties);
            };

            /**
             * Encodes the specified ErrorInfo message. Does not implicitly {@link osp.v1.ErrorInfo.verify|verify} messages.
             * @function encode
             * @memberof osp.v1.ErrorInfo
             * @static
             * @param {osp.v1.IErrorInfo} message ErrorInfo message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ErrorInfo.encode = function encode(message, writer, q) {
                if (!writer)
                    writer = $Writer.create();
                if (q === undefined)
                    q = 0;
                if (q > $util.recursionLimit)
                    throw Error("max depth exceeded");
                if (message.code != null && Object.hasOwnProperty.call(message, "code"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.code);
                if (message.message != null && Object.hasOwnProperty.call(message, "message"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.message);
                if (message.detail != null && Object.hasOwnProperty.call(message, "detail"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.detail);
                return writer;
            };

            /**
             * Encodes the specified ErrorInfo message, length delimited. Does not implicitly {@link osp.v1.ErrorInfo.verify|verify} messages.
             * @function encodeDelimited
             * @memberof osp.v1.ErrorInfo
             * @static
             * @param {osp.v1.IErrorInfo} message ErrorInfo message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ErrorInfo.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
            };

            /**
             * Decodes an ErrorInfo message from the specified reader or buffer.
             * @function decode
             * @memberof osp.v1.ErrorInfo
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {osp.v1.ErrorInfo} ErrorInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ErrorInfo.decode = function decode(reader, length, error, long) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (long === undefined)
                    long = 0;
                if (long > $Reader.recursionLimit)
                    throw Error("maximum nesting depth exceeded");
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.osp.v1.ErrorInfo();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            message.code = reader.uint32();
                            break;
                        }
                    case 2: {
                            message.message = reader.string();
                            break;
                        }
                    case 3: {
                            message.detail = reader.string();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7, long);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes an ErrorInfo message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof osp.v1.ErrorInfo
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {osp.v1.ErrorInfo} ErrorInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ErrorInfo.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an ErrorInfo message.
             * @function verify
             * @memberof osp.v1.ErrorInfo
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ErrorInfo.verify = function verify(message, long) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (long === undefined)
                    long = 0;
                if (long > $util.recursionLimit)
                    return "maximum nesting depth exceeded";
                if (message.code != null && Object.hasOwnProperty.call(message, "code"))
                    if (!$util.isInteger(message.code))
                        return "code: integer expected";
                if (message.message != null && Object.hasOwnProperty.call(message, "message"))
                    if (!$util.isString(message.message))
                        return "message: string expected";
                if (message.detail != null && Object.hasOwnProperty.call(message, "detail"))
                    if (!$util.isString(message.detail))
                        return "detail: string expected";
                return null;
            };

            /**
             * Creates an ErrorInfo message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof osp.v1.ErrorInfo
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {osp.v1.ErrorInfo} ErrorInfo
             */
            ErrorInfo.fromObject = function fromObject(object, long) {
                if (object instanceof $root.osp.v1.ErrorInfo)
                    return object;
                if (!$util.isObject(object))
                    throw TypeError(".osp.v1.ErrorInfo: object expected");
                if (long === undefined)
                    long = 0;
                if (long > $util.recursionLimit)
                    throw Error("maximum nesting depth exceeded");
                var message = new $root.osp.v1.ErrorInfo();
                if (object.code != null)
                    message.code = object.code >>> 0;
                if (object.message != null)
                    message.message = String(object.message);
                if (object.detail != null)
                    message.detail = String(object.detail);
                return message;
            };

            /**
             * Creates a plain object from an ErrorInfo message. Also converts values to other types if specified.
             * @function toObject
             * @memberof osp.v1.ErrorInfo
             * @static
             * @param {osp.v1.ErrorInfo} message ErrorInfo
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ErrorInfo.toObject = function toObject(message, options, q) {
                if (!options)
                    options = {};
                if (q === undefined)
                    q = 0;
                if (q > $util.recursionLimit)
                    throw Error("max depth exceeded");
                var object = {};
                if (options.defaults) {
                    object.code = 0;
                    object.message = "";
                    object.detail = "";
                }
                if (message.code != null && Object.hasOwnProperty.call(message, "code"))
                    object.code = message.code;
                if (message.message != null && Object.hasOwnProperty.call(message, "message"))
                    object.message = message.message;
                if (message.detail != null && Object.hasOwnProperty.call(message, "detail"))
                    object.detail = message.detail;
                return object;
            };

            /**
             * Converts this ErrorInfo to JSON.
             * @function toJSON
             * @memberof osp.v1.ErrorInfo
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ErrorInfo.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for ErrorInfo
             * @function getTypeUrl
             * @memberof osp.v1.ErrorInfo
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            ErrorInfo.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/osp.v1.ErrorInfo";
            };

            return ErrorInfo;
        })();

        /**
         * Capability enum.
         * @name osp.v1.Capability
         * @enum {number}
         * @property {number} CAPABILITY_UNSPECIFIED=0 CAPABILITY_UNSPECIFIED value
         * @property {number} CAPABILITY_COMPRESSION_ZSTD=1 CAPABILITY_COMPRESSION_ZSTD value
         * @property {number} CAPABILITY_CHUNKING=2 CAPABILITY_CHUNKING value
         * @property {number} CAPABILITY_RESUME=3 CAPABILITY_RESUME value
         * @property {number} CAPABILITY_PRESENCE=4 CAPABILITY_PRESENCE value
         */
        v1.Capability = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "CAPABILITY_UNSPECIFIED"] = 0;
            values[valuesById[1] = "CAPABILITY_COMPRESSION_ZSTD"] = 1;
            values[valuesById[2] = "CAPABILITY_CHUNKING"] = 2;
            values[valuesById[3] = "CAPABILITY_RESUME"] = 3;
            values[valuesById[4] = "CAPABILITY_PRESENCE"] = 4;
            return values;
        })();

        v1.Envelope = (function() {

            /**
             * Properties of an Envelope.
             * @memberof osp.v1
             * @interface IEnvelope
             * @property {osp.v1.IHello|null} [hello] Envelope hello
             * @property {osp.v1.IHelloAck|null} [helloAck] Envelope helloAck
             * @property {osp.v1.IAuth|null} [auth] Envelope auth
             * @property {osp.v1.IAuthOk|null} [authOk] Envelope authOk
             * @property {osp.v1.IAuthFailed|null} [authFailed] Envelope authFailed
             * @property {osp.v1.ISubscribe|null} [subscribe] Envelope subscribe
             * @property {osp.v1.IUnsubscribe|null} [unsubscribe] Envelope unsubscribe
             * @property {osp.v1.ISubscribeAck|null} [subscribeAck] Envelope subscribeAck
             * @property {osp.v1.IOperation|null} [op] Envelope op
             * @property {osp.v1.IOpAck|null} [opAck] Envelope opAck
             * @property {osp.v1.ISyncPush|null} [syncPush] Envelope syncPush
             * @property {osp.v1.ISyncPullRequest|null} [syncPullRequest] Envelope syncPullRequest
             * @property {osp.v1.ISyncPullResponse|null} [syncPullResponse] Envelope syncPullResponse
             * @property {osp.v1.ISnapshot|null} [snapshot] Envelope snapshot
             * @property {osp.v1.IRecord|null} [record] Envelope record
             * @property {osp.v1.IErrorInfo|null} [error] Envelope error
             * @property {osp.v1.IPresence|null} [presence] Envelope presence
             */

            /**
             * Constructs a new Envelope.
             * @memberof osp.v1
             * @classdesc Represents an Envelope.
             * @implements IEnvelope
             * @constructor
             * @param {osp.v1.IEnvelope=} [properties] Properties to set
             */
            function Envelope(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Envelope hello.
             * @member {osp.v1.IHello|null|undefined} hello
             * @memberof osp.v1.Envelope
             * @instance
             */
            Envelope.prototype.hello = null;

            /**
             * Envelope helloAck.
             * @member {osp.v1.IHelloAck|null|undefined} helloAck
             * @memberof osp.v1.Envelope
             * @instance
             */
            Envelope.prototype.helloAck = null;

            /**
             * Envelope auth.
             * @member {osp.v1.IAuth|null|undefined} auth
             * @memberof osp.v1.Envelope
             * @instance
             */
            Envelope.prototype.auth = null;

            /**
             * Envelope authOk.
             * @member {osp.v1.IAuthOk|null|undefined} authOk
             * @memberof osp.v1.Envelope
             * @instance
             */
            Envelope.prototype.authOk = null;

            /**
             * Envelope authFailed.
             * @member {osp.v1.IAuthFailed|null|undefined} authFailed
             * @memberof osp.v1.Envelope
             * @instance
             */
            Envelope.prototype.authFailed = null;

            /**
             * Envelope subscribe.
             * @member {osp.v1.ISubscribe|null|undefined} subscribe
             * @memberof osp.v1.Envelope
             * @instance
             */
            Envelope.prototype.subscribe = null;

            /**
             * Envelope unsubscribe.
             * @member {osp.v1.IUnsubscribe|null|undefined} unsubscribe
             * @memberof osp.v1.Envelope
             * @instance
             */
            Envelope.prototype.unsubscribe = null;

            /**
             * Envelope subscribeAck.
             * @member {osp.v1.ISubscribeAck|null|undefined} subscribeAck
             * @memberof osp.v1.Envelope
             * @instance
             */
            Envelope.prototype.subscribeAck = null;

            /**
             * Envelope op.
             * @member {osp.v1.IOperation|null|undefined} op
             * @memberof osp.v1.Envelope
             * @instance
             */
            Envelope.prototype.op = null;

            /**
             * Envelope opAck.
             * @member {osp.v1.IOpAck|null|undefined} opAck
             * @memberof osp.v1.Envelope
             * @instance
             */
            Envelope.prototype.opAck = null;

            /**
             * Envelope syncPush.
             * @member {osp.v1.ISyncPush|null|undefined} syncPush
             * @memberof osp.v1.Envelope
             * @instance
             */
            Envelope.prototype.syncPush = null;

            /**
             * Envelope syncPullRequest.
             * @member {osp.v1.ISyncPullRequest|null|undefined} syncPullRequest
             * @memberof osp.v1.Envelope
             * @instance
             */
            Envelope.prototype.syncPullRequest = null;

            /**
             * Envelope syncPullResponse.
             * @member {osp.v1.ISyncPullResponse|null|undefined} syncPullResponse
             * @memberof osp.v1.Envelope
             * @instance
             */
            Envelope.prototype.syncPullResponse = null;

            /**
             * Envelope snapshot.
             * @member {osp.v1.ISnapshot|null|undefined} snapshot
             * @memberof osp.v1.Envelope
             * @instance
             */
            Envelope.prototype.snapshot = null;

            /**
             * Envelope record.
             * @member {osp.v1.IRecord|null|undefined} record
             * @memberof osp.v1.Envelope
             * @instance
             */
            Envelope.prototype.record = null;

            /**
             * Envelope error.
             * @member {osp.v1.IErrorInfo|null|undefined} error
             * @memberof osp.v1.Envelope
             * @instance
             */
            Envelope.prototype.error = null;

            /**
             * Envelope presence.
             * @member {osp.v1.IPresence|null|undefined} presence
             * @memberof osp.v1.Envelope
             * @instance
             */
            Envelope.prototype.presence = null;

            // OneOf field names bound to virtual getters and setters
            var $oneOfFields;

            /**
             * Envelope payload.
             * @member {"hello"|"helloAck"|"auth"|"authOk"|"authFailed"|"subscribe"|"unsubscribe"|"subscribeAck"|"op"|"opAck"|"syncPush"|"syncPullRequest"|"syncPullResponse"|"snapshot"|"record"|"error"|"presence"|undefined} payload
             * @memberof osp.v1.Envelope
             * @instance
             */
            Object.defineProperty(Envelope.prototype, "payload", {
                get: $util.oneOfGetter($oneOfFields = ["hello", "helloAck", "auth", "authOk", "authFailed", "subscribe", "unsubscribe", "subscribeAck", "op", "opAck", "syncPush", "syncPullRequest", "syncPullResponse", "snapshot", "record", "error", "presence"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new Envelope instance using the specified properties.
             * @function create
             * @memberof osp.v1.Envelope
             * @static
             * @param {osp.v1.IEnvelope=} [properties] Properties to set
             * @returns {osp.v1.Envelope} Envelope instance
             */
            Envelope.create = function create(properties) {
                return new Envelope(properties);
            };

            /**
             * Encodes the specified Envelope message. Does not implicitly {@link osp.v1.Envelope.verify|verify} messages.
             * @function encode
             * @memberof osp.v1.Envelope
             * @static
             * @param {osp.v1.IEnvelope} message Envelope message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Envelope.encode = function encode(message, writer, q) {
                if (!writer)
                    writer = $Writer.create();
                if (q === undefined)
                    q = 0;
                if (q > $util.recursionLimit)
                    throw Error("max depth exceeded");
                if (message.hello != null && Object.hasOwnProperty.call(message, "hello"))
                    $root.osp.v1.Hello.encode(message.hello, writer.uint32(/* id 1, wireType 2 =*/10).fork(), q + 1).ldelim();
                if (message.helloAck != null && Object.hasOwnProperty.call(message, "helloAck"))
                    $root.osp.v1.HelloAck.encode(message.helloAck, writer.uint32(/* id 2, wireType 2 =*/18).fork(), q + 1).ldelim();
                if (message.auth != null && Object.hasOwnProperty.call(message, "auth"))
                    $root.osp.v1.Auth.encode(message.auth, writer.uint32(/* id 3, wireType 2 =*/26).fork(), q + 1).ldelim();
                if (message.authOk != null && Object.hasOwnProperty.call(message, "authOk"))
                    $root.osp.v1.AuthOk.encode(message.authOk, writer.uint32(/* id 4, wireType 2 =*/34).fork(), q + 1).ldelim();
                if (message.authFailed != null && Object.hasOwnProperty.call(message, "authFailed"))
                    $root.osp.v1.AuthFailed.encode(message.authFailed, writer.uint32(/* id 5, wireType 2 =*/42).fork(), q + 1).ldelim();
                if (message.subscribe != null && Object.hasOwnProperty.call(message, "subscribe"))
                    $root.osp.v1.Subscribe.encode(message.subscribe, writer.uint32(/* id 6, wireType 2 =*/50).fork(), q + 1).ldelim();
                if (message.unsubscribe != null && Object.hasOwnProperty.call(message, "unsubscribe"))
                    $root.osp.v1.Unsubscribe.encode(message.unsubscribe, writer.uint32(/* id 7, wireType 2 =*/58).fork(), q + 1).ldelim();
                if (message.subscribeAck != null && Object.hasOwnProperty.call(message, "subscribeAck"))
                    $root.osp.v1.SubscribeAck.encode(message.subscribeAck, writer.uint32(/* id 8, wireType 2 =*/66).fork(), q + 1).ldelim();
                if (message.op != null && Object.hasOwnProperty.call(message, "op"))
                    $root.osp.v1.Operation.encode(message.op, writer.uint32(/* id 20, wireType 2 =*/162).fork(), q + 1).ldelim();
                if (message.opAck != null && Object.hasOwnProperty.call(message, "opAck"))
                    $root.osp.v1.OpAck.encode(message.opAck, writer.uint32(/* id 21, wireType 2 =*/170).fork(), q + 1).ldelim();
                if (message.syncPush != null && Object.hasOwnProperty.call(message, "syncPush"))
                    $root.osp.v1.SyncPush.encode(message.syncPush, writer.uint32(/* id 22, wireType 2 =*/178).fork(), q + 1).ldelim();
                if (message.syncPullRequest != null && Object.hasOwnProperty.call(message, "syncPullRequest"))
                    $root.osp.v1.SyncPullRequest.encode(message.syncPullRequest, writer.uint32(/* id 23, wireType 2 =*/186).fork(), q + 1).ldelim();
                if (message.syncPullResponse != null && Object.hasOwnProperty.call(message, "syncPullResponse"))
                    $root.osp.v1.SyncPullResponse.encode(message.syncPullResponse, writer.uint32(/* id 24, wireType 2 =*/194).fork(), q + 1).ldelim();
                if (message.snapshot != null && Object.hasOwnProperty.call(message, "snapshot"))
                    $root.osp.v1.Snapshot.encode(message.snapshot, writer.uint32(/* id 25, wireType 2 =*/202).fork(), q + 1).ldelim();
                if (message.record != null && Object.hasOwnProperty.call(message, "record"))
                    $root.osp.v1.Record.encode(message.record, writer.uint32(/* id 26, wireType 2 =*/210).fork(), q + 1).ldelim();
                if (message.error != null && Object.hasOwnProperty.call(message, "error"))
                    $root.osp.v1.ErrorInfo.encode(message.error, writer.uint32(/* id 40, wireType 2 =*/322).fork(), q + 1).ldelim();
                if (message.presence != null && Object.hasOwnProperty.call(message, "presence"))
                    $root.osp.v1.Presence.encode(message.presence, writer.uint32(/* id 41, wireType 2 =*/330).fork(), q + 1).ldelim();
                return writer;
            };

            /**
             * Encodes the specified Envelope message, length delimited. Does not implicitly {@link osp.v1.Envelope.verify|verify} messages.
             * @function encodeDelimited
             * @memberof osp.v1.Envelope
             * @static
             * @param {osp.v1.IEnvelope} message Envelope message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Envelope.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
            };

            /**
             * Decodes an Envelope message from the specified reader or buffer.
             * @function decode
             * @memberof osp.v1.Envelope
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {osp.v1.Envelope} Envelope
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Envelope.decode = function decode(reader, length, error, long) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (long === undefined)
                    long = 0;
                if (long > $Reader.recursionLimit)
                    throw Error("maximum nesting depth exceeded");
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.osp.v1.Envelope();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            message.hello = $root.osp.v1.Hello.decode(reader, reader.uint32(), undefined, long + 1);
                            break;
                        }
                    case 2: {
                            message.helloAck = $root.osp.v1.HelloAck.decode(reader, reader.uint32(), undefined, long + 1);
                            break;
                        }
                    case 3: {
                            message.auth = $root.osp.v1.Auth.decode(reader, reader.uint32(), undefined, long + 1);
                            break;
                        }
                    case 4: {
                            message.authOk = $root.osp.v1.AuthOk.decode(reader, reader.uint32(), undefined, long + 1);
                            break;
                        }
                    case 5: {
                            message.authFailed = $root.osp.v1.AuthFailed.decode(reader, reader.uint32(), undefined, long + 1);
                            break;
                        }
                    case 6: {
                            message.subscribe = $root.osp.v1.Subscribe.decode(reader, reader.uint32(), undefined, long + 1);
                            break;
                        }
                    case 7: {
                            message.unsubscribe = $root.osp.v1.Unsubscribe.decode(reader, reader.uint32(), undefined, long + 1);
                            break;
                        }
                    case 8: {
                            message.subscribeAck = $root.osp.v1.SubscribeAck.decode(reader, reader.uint32(), undefined, long + 1);
                            break;
                        }
                    case 20: {
                            message.op = $root.osp.v1.Operation.decode(reader, reader.uint32(), undefined, long + 1);
                            break;
                        }
                    case 21: {
                            message.opAck = $root.osp.v1.OpAck.decode(reader, reader.uint32(), undefined, long + 1);
                            break;
                        }
                    case 22: {
                            message.syncPush = $root.osp.v1.SyncPush.decode(reader, reader.uint32(), undefined, long + 1);
                            break;
                        }
                    case 23: {
                            message.syncPullRequest = $root.osp.v1.SyncPullRequest.decode(reader, reader.uint32(), undefined, long + 1);
                            break;
                        }
                    case 24: {
                            message.syncPullResponse = $root.osp.v1.SyncPullResponse.decode(reader, reader.uint32(), undefined, long + 1);
                            break;
                        }
                    case 25: {
                            message.snapshot = $root.osp.v1.Snapshot.decode(reader, reader.uint32(), undefined, long + 1);
                            break;
                        }
                    case 26: {
                            message.record = $root.osp.v1.Record.decode(reader, reader.uint32(), undefined, long + 1);
                            break;
                        }
                    case 40: {
                            message.error = $root.osp.v1.ErrorInfo.decode(reader, reader.uint32(), undefined, long + 1);
                            break;
                        }
                    case 41: {
                            message.presence = $root.osp.v1.Presence.decode(reader, reader.uint32(), undefined, long + 1);
                            break;
                        }
                    default:
                        reader.skipType(tag & 7, long);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes an Envelope message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof osp.v1.Envelope
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {osp.v1.Envelope} Envelope
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Envelope.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an Envelope message.
             * @function verify
             * @memberof osp.v1.Envelope
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Envelope.verify = function verify(message, long) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (long === undefined)
                    long = 0;
                if (long > $util.recursionLimit)
                    return "maximum nesting depth exceeded";
                var properties = {};
                if (message.hello != null && Object.hasOwnProperty.call(message, "hello")) {
                    properties.payload = 1;
                    {
                        var error = $root.osp.v1.Hello.verify(message.hello, long + 1);
                        if (error)
                            return "hello." + error;
                    }
                }
                if (message.helloAck != null && Object.hasOwnProperty.call(message, "helloAck")) {
                    if (properties.payload === 1)
                        return "payload: multiple values";
                    properties.payload = 1;
                    {
                        var error = $root.osp.v1.HelloAck.verify(message.helloAck, long + 1);
                        if (error)
                            return "helloAck." + error;
                    }
                }
                if (message.auth != null && Object.hasOwnProperty.call(message, "auth")) {
                    if (properties.payload === 1)
                        return "payload: multiple values";
                    properties.payload = 1;
                    {
                        var error = $root.osp.v1.Auth.verify(message.auth, long + 1);
                        if (error)
                            return "auth." + error;
                    }
                }
                if (message.authOk != null && Object.hasOwnProperty.call(message, "authOk")) {
                    if (properties.payload === 1)
                        return "payload: multiple values";
                    properties.payload = 1;
                    {
                        var error = $root.osp.v1.AuthOk.verify(message.authOk, long + 1);
                        if (error)
                            return "authOk." + error;
                    }
                }
                if (message.authFailed != null && Object.hasOwnProperty.call(message, "authFailed")) {
                    if (properties.payload === 1)
                        return "payload: multiple values";
                    properties.payload = 1;
                    {
                        var error = $root.osp.v1.AuthFailed.verify(message.authFailed, long + 1);
                        if (error)
                            return "authFailed." + error;
                    }
                }
                if (message.subscribe != null && Object.hasOwnProperty.call(message, "subscribe")) {
                    if (properties.payload === 1)
                        return "payload: multiple values";
                    properties.payload = 1;
                    {
                        var error = $root.osp.v1.Subscribe.verify(message.subscribe, long + 1);
                        if (error)
                            return "subscribe." + error;
                    }
                }
                if (message.unsubscribe != null && Object.hasOwnProperty.call(message, "unsubscribe")) {
                    if (properties.payload === 1)
                        return "payload: multiple values";
                    properties.payload = 1;
                    {
                        var error = $root.osp.v1.Unsubscribe.verify(message.unsubscribe, long + 1);
                        if (error)
                            return "unsubscribe." + error;
                    }
                }
                if (message.subscribeAck != null && Object.hasOwnProperty.call(message, "subscribeAck")) {
                    if (properties.payload === 1)
                        return "payload: multiple values";
                    properties.payload = 1;
                    {
                        var error = $root.osp.v1.SubscribeAck.verify(message.subscribeAck, long + 1);
                        if (error)
                            return "subscribeAck." + error;
                    }
                }
                if (message.op != null && Object.hasOwnProperty.call(message, "op")) {
                    if (properties.payload === 1)
                        return "payload: multiple values";
                    properties.payload = 1;
                    {
                        var error = $root.osp.v1.Operation.verify(message.op, long + 1);
                        if (error)
                            return "op." + error;
                    }
                }
                if (message.opAck != null && Object.hasOwnProperty.call(message, "opAck")) {
                    if (properties.payload === 1)
                        return "payload: multiple values";
                    properties.payload = 1;
                    {
                        var error = $root.osp.v1.OpAck.verify(message.opAck, long + 1);
                        if (error)
                            return "opAck." + error;
                    }
                }
                if (message.syncPush != null && Object.hasOwnProperty.call(message, "syncPush")) {
                    if (properties.payload === 1)
                        return "payload: multiple values";
                    properties.payload = 1;
                    {
                        var error = $root.osp.v1.SyncPush.verify(message.syncPush, long + 1);
                        if (error)
                            return "syncPush." + error;
                    }
                }
                if (message.syncPullRequest != null && Object.hasOwnProperty.call(message, "syncPullRequest")) {
                    if (properties.payload === 1)
                        return "payload: multiple values";
                    properties.payload = 1;
                    {
                        var error = $root.osp.v1.SyncPullRequest.verify(message.syncPullRequest, long + 1);
                        if (error)
                            return "syncPullRequest." + error;
                    }
                }
                if (message.syncPullResponse != null && Object.hasOwnProperty.call(message, "syncPullResponse")) {
                    if (properties.payload === 1)
                        return "payload: multiple values";
                    properties.payload = 1;
                    {
                        var error = $root.osp.v1.SyncPullResponse.verify(message.syncPullResponse, long + 1);
                        if (error)
                            return "syncPullResponse." + error;
                    }
                }
                if (message.snapshot != null && Object.hasOwnProperty.call(message, "snapshot")) {
                    if (properties.payload === 1)
                        return "payload: multiple values";
                    properties.payload = 1;
                    {
                        var error = $root.osp.v1.Snapshot.verify(message.snapshot, long + 1);
                        if (error)
                            return "snapshot." + error;
                    }
                }
                if (message.record != null && Object.hasOwnProperty.call(message, "record")) {
                    if (properties.payload === 1)
                        return "payload: multiple values";
                    properties.payload = 1;
                    {
                        var error = $root.osp.v1.Record.verify(message.record, long + 1);
                        if (error)
                            return "record." + error;
                    }
                }
                if (message.error != null && Object.hasOwnProperty.call(message, "error")) {
                    if (properties.payload === 1)
                        return "payload: multiple values";
                    properties.payload = 1;
                    {
                        var error = $root.osp.v1.ErrorInfo.verify(message.error, long + 1);
                        if (error)
                            return "error." + error;
                    }
                }
                if (message.presence != null && Object.hasOwnProperty.call(message, "presence")) {
                    if (properties.payload === 1)
                        return "payload: multiple values";
                    properties.payload = 1;
                    {
                        var error = $root.osp.v1.Presence.verify(message.presence, long + 1);
                        if (error)
                            return "presence." + error;
                    }
                }
                return null;
            };

            /**
             * Creates an Envelope message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof osp.v1.Envelope
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {osp.v1.Envelope} Envelope
             */
            Envelope.fromObject = function fromObject(object, long) {
                if (object instanceof $root.osp.v1.Envelope)
                    return object;
                if (!$util.isObject(object))
                    throw TypeError(".osp.v1.Envelope: object expected");
                if (long === undefined)
                    long = 0;
                if (long > $util.recursionLimit)
                    throw Error("maximum nesting depth exceeded");
                var message = new $root.osp.v1.Envelope();
                if (object.hello != null) {
                    if (!$util.isObject(object.hello))
                        throw TypeError(".osp.v1.Envelope.hello: object expected");
                    message.hello = $root.osp.v1.Hello.fromObject(object.hello, long + 1);
                }
                if (object.helloAck != null) {
                    if (!$util.isObject(object.helloAck))
                        throw TypeError(".osp.v1.Envelope.helloAck: object expected");
                    message.helloAck = $root.osp.v1.HelloAck.fromObject(object.helloAck, long + 1);
                }
                if (object.auth != null) {
                    if (!$util.isObject(object.auth))
                        throw TypeError(".osp.v1.Envelope.auth: object expected");
                    message.auth = $root.osp.v1.Auth.fromObject(object.auth, long + 1);
                }
                if (object.authOk != null) {
                    if (!$util.isObject(object.authOk))
                        throw TypeError(".osp.v1.Envelope.authOk: object expected");
                    message.authOk = $root.osp.v1.AuthOk.fromObject(object.authOk, long + 1);
                }
                if (object.authFailed != null) {
                    if (!$util.isObject(object.authFailed))
                        throw TypeError(".osp.v1.Envelope.authFailed: object expected");
                    message.authFailed = $root.osp.v1.AuthFailed.fromObject(object.authFailed, long + 1);
                }
                if (object.subscribe != null) {
                    if (!$util.isObject(object.subscribe))
                        throw TypeError(".osp.v1.Envelope.subscribe: object expected");
                    message.subscribe = $root.osp.v1.Subscribe.fromObject(object.subscribe, long + 1);
                }
                if (object.unsubscribe != null) {
                    if (!$util.isObject(object.unsubscribe))
                        throw TypeError(".osp.v1.Envelope.unsubscribe: object expected");
                    message.unsubscribe = $root.osp.v1.Unsubscribe.fromObject(object.unsubscribe, long + 1);
                }
                if (object.subscribeAck != null) {
                    if (!$util.isObject(object.subscribeAck))
                        throw TypeError(".osp.v1.Envelope.subscribeAck: object expected");
                    message.subscribeAck = $root.osp.v1.SubscribeAck.fromObject(object.subscribeAck, long + 1);
                }
                if (object.op != null) {
                    if (!$util.isObject(object.op))
                        throw TypeError(".osp.v1.Envelope.op: object expected");
                    message.op = $root.osp.v1.Operation.fromObject(object.op, long + 1);
                }
                if (object.opAck != null) {
                    if (!$util.isObject(object.opAck))
                        throw TypeError(".osp.v1.Envelope.opAck: object expected");
                    message.opAck = $root.osp.v1.OpAck.fromObject(object.opAck, long + 1);
                }
                if (object.syncPush != null) {
                    if (!$util.isObject(object.syncPush))
                        throw TypeError(".osp.v1.Envelope.syncPush: object expected");
                    message.syncPush = $root.osp.v1.SyncPush.fromObject(object.syncPush, long + 1);
                }
                if (object.syncPullRequest != null) {
                    if (!$util.isObject(object.syncPullRequest))
                        throw TypeError(".osp.v1.Envelope.syncPullRequest: object expected");
                    message.syncPullRequest = $root.osp.v1.SyncPullRequest.fromObject(object.syncPullRequest, long + 1);
                }
                if (object.syncPullResponse != null) {
                    if (!$util.isObject(object.syncPullResponse))
                        throw TypeError(".osp.v1.Envelope.syncPullResponse: object expected");
                    message.syncPullResponse = $root.osp.v1.SyncPullResponse.fromObject(object.syncPullResponse, long + 1);
                }
                if (object.snapshot != null) {
                    if (!$util.isObject(object.snapshot))
                        throw TypeError(".osp.v1.Envelope.snapshot: object expected");
                    message.snapshot = $root.osp.v1.Snapshot.fromObject(object.snapshot, long + 1);
                }
                if (object.record != null) {
                    if (!$util.isObject(object.record))
                        throw TypeError(".osp.v1.Envelope.record: object expected");
                    message.record = $root.osp.v1.Record.fromObject(object.record, long + 1);
                }
                if (object.error != null) {
                    if (!$util.isObject(object.error))
                        throw TypeError(".osp.v1.Envelope.error: object expected");
                    message.error = $root.osp.v1.ErrorInfo.fromObject(object.error, long + 1);
                }
                if (object.presence != null) {
                    if (!$util.isObject(object.presence))
                        throw TypeError(".osp.v1.Envelope.presence: object expected");
                    message.presence = $root.osp.v1.Presence.fromObject(object.presence, long + 1);
                }
                return message;
            };

            /**
             * Creates a plain object from an Envelope message. Also converts values to other types if specified.
             * @function toObject
             * @memberof osp.v1.Envelope
             * @static
             * @param {osp.v1.Envelope} message Envelope
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Envelope.toObject = function toObject(message, options, q) {
                if (!options)
                    options = {};
                if (q === undefined)
                    q = 0;
                if (q > $util.recursionLimit)
                    throw Error("max depth exceeded");
                var object = {};
                if (message.hello != null && Object.hasOwnProperty.call(message, "hello")) {
                    object.hello = $root.osp.v1.Hello.toObject(message.hello, options, q + 1);
                    if (options.oneofs)
                        object.payload = "hello";
                }
                if (message.helloAck != null && Object.hasOwnProperty.call(message, "helloAck")) {
                    object.helloAck = $root.osp.v1.HelloAck.toObject(message.helloAck, options, q + 1);
                    if (options.oneofs)
                        object.payload = "helloAck";
                }
                if (message.auth != null && Object.hasOwnProperty.call(message, "auth")) {
                    object.auth = $root.osp.v1.Auth.toObject(message.auth, options, q + 1);
                    if (options.oneofs)
                        object.payload = "auth";
                }
                if (message.authOk != null && Object.hasOwnProperty.call(message, "authOk")) {
                    object.authOk = $root.osp.v1.AuthOk.toObject(message.authOk, options, q + 1);
                    if (options.oneofs)
                        object.payload = "authOk";
                }
                if (message.authFailed != null && Object.hasOwnProperty.call(message, "authFailed")) {
                    object.authFailed = $root.osp.v1.AuthFailed.toObject(message.authFailed, options, q + 1);
                    if (options.oneofs)
                        object.payload = "authFailed";
                }
                if (message.subscribe != null && Object.hasOwnProperty.call(message, "subscribe")) {
                    object.subscribe = $root.osp.v1.Subscribe.toObject(message.subscribe, options, q + 1);
                    if (options.oneofs)
                        object.payload = "subscribe";
                }
                if (message.unsubscribe != null && Object.hasOwnProperty.call(message, "unsubscribe")) {
                    object.unsubscribe = $root.osp.v1.Unsubscribe.toObject(message.unsubscribe, options, q + 1);
                    if (options.oneofs)
                        object.payload = "unsubscribe";
                }
                if (message.subscribeAck != null && Object.hasOwnProperty.call(message, "subscribeAck")) {
                    object.subscribeAck = $root.osp.v1.SubscribeAck.toObject(message.subscribeAck, options, q + 1);
                    if (options.oneofs)
                        object.payload = "subscribeAck";
                }
                if (message.op != null && Object.hasOwnProperty.call(message, "op")) {
                    object.op = $root.osp.v1.Operation.toObject(message.op, options, q + 1);
                    if (options.oneofs)
                        object.payload = "op";
                }
                if (message.opAck != null && Object.hasOwnProperty.call(message, "opAck")) {
                    object.opAck = $root.osp.v1.OpAck.toObject(message.opAck, options, q + 1);
                    if (options.oneofs)
                        object.payload = "opAck";
                }
                if (message.syncPush != null && Object.hasOwnProperty.call(message, "syncPush")) {
                    object.syncPush = $root.osp.v1.SyncPush.toObject(message.syncPush, options, q + 1);
                    if (options.oneofs)
                        object.payload = "syncPush";
                }
                if (message.syncPullRequest != null && Object.hasOwnProperty.call(message, "syncPullRequest")) {
                    object.syncPullRequest = $root.osp.v1.SyncPullRequest.toObject(message.syncPullRequest, options, q + 1);
                    if (options.oneofs)
                        object.payload = "syncPullRequest";
                }
                if (message.syncPullResponse != null && Object.hasOwnProperty.call(message, "syncPullResponse")) {
                    object.syncPullResponse = $root.osp.v1.SyncPullResponse.toObject(message.syncPullResponse, options, q + 1);
                    if (options.oneofs)
                        object.payload = "syncPullResponse";
                }
                if (message.snapshot != null && Object.hasOwnProperty.call(message, "snapshot")) {
                    object.snapshot = $root.osp.v1.Snapshot.toObject(message.snapshot, options, q + 1);
                    if (options.oneofs)
                        object.payload = "snapshot";
                }
                if (message.record != null && Object.hasOwnProperty.call(message, "record")) {
                    object.record = $root.osp.v1.Record.toObject(message.record, options, q + 1);
                    if (options.oneofs)
                        object.payload = "record";
                }
                if (message.error != null && Object.hasOwnProperty.call(message, "error")) {
                    object.error = $root.osp.v1.ErrorInfo.toObject(message.error, options, q + 1);
                    if (options.oneofs)
                        object.payload = "error";
                }
                if (message.presence != null && Object.hasOwnProperty.call(message, "presence")) {
                    object.presence = $root.osp.v1.Presence.toObject(message.presence, options, q + 1);
                    if (options.oneofs)
                        object.payload = "presence";
                }
                return object;
            };

            /**
             * Converts this Envelope to JSON.
             * @function toJSON
             * @memberof osp.v1.Envelope
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Envelope.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for Envelope
             * @function getTypeUrl
             * @memberof osp.v1.Envelope
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            Envelope.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/osp.v1.Envelope";
            };

            return Envelope;
        })();

        v1.Subscribe = (function() {

            /**
             * Properties of a Subscribe.
             * @memberof osp.v1
             * @interface ISubscribe
             * @property {string|null} [subscriptionId] Subscribe subscriptionId
             * @property {string|null} [collection] Subscribe collection
             * @property {osp.v1.IPredicate|null} [predicate] Subscribe predicate
             * @property {number|null} [limit] Subscribe limit
             * @property {boolean|null} [withSnapshot] Subscribe withSnapshot
             */

            /**
             * Constructs a new Subscribe.
             * @memberof osp.v1
             * @classdesc Represents a Subscribe.
             * @implements ISubscribe
             * @constructor
             * @param {osp.v1.ISubscribe=} [properties] Properties to set
             */
            function Subscribe(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Subscribe subscriptionId.
             * @member {string} subscriptionId
             * @memberof osp.v1.Subscribe
             * @instance
             */
            Subscribe.prototype.subscriptionId = "";

            /**
             * Subscribe collection.
             * @member {string} collection
             * @memberof osp.v1.Subscribe
             * @instance
             */
            Subscribe.prototype.collection = "";

            /**
             * Subscribe predicate.
             * @member {osp.v1.IPredicate|null|undefined} predicate
             * @memberof osp.v1.Subscribe
             * @instance
             */
            Subscribe.prototype.predicate = null;

            /**
             * Subscribe limit.
             * @member {number} limit
             * @memberof osp.v1.Subscribe
             * @instance
             */
            Subscribe.prototype.limit = 0;

            /**
             * Subscribe withSnapshot.
             * @member {boolean} withSnapshot
             * @memberof osp.v1.Subscribe
             * @instance
             */
            Subscribe.prototype.withSnapshot = false;

            /**
             * Creates a new Subscribe instance using the specified properties.
             * @function create
             * @memberof osp.v1.Subscribe
             * @static
             * @param {osp.v1.ISubscribe=} [properties] Properties to set
             * @returns {osp.v1.Subscribe} Subscribe instance
             */
            Subscribe.create = function create(properties) {
                return new Subscribe(properties);
            };

            /**
             * Encodes the specified Subscribe message. Does not implicitly {@link osp.v1.Subscribe.verify|verify} messages.
             * @function encode
             * @memberof osp.v1.Subscribe
             * @static
             * @param {osp.v1.ISubscribe} message Subscribe message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Subscribe.encode = function encode(message, writer, q) {
                if (!writer)
                    writer = $Writer.create();
                if (q === undefined)
                    q = 0;
                if (q > $util.recursionLimit)
                    throw Error("max depth exceeded");
                if (message.subscriptionId != null && Object.hasOwnProperty.call(message, "subscriptionId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.subscriptionId);
                if (message.collection != null && Object.hasOwnProperty.call(message, "collection"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.collection);
                if (message.predicate != null && Object.hasOwnProperty.call(message, "predicate"))
                    $root.osp.v1.Predicate.encode(message.predicate, writer.uint32(/* id 3, wireType 2 =*/26).fork(), q + 1).ldelim();
                if (message.limit != null && Object.hasOwnProperty.call(message, "limit"))
                    writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.limit);
                if (message.withSnapshot != null && Object.hasOwnProperty.call(message, "withSnapshot"))
                    writer.uint32(/* id 5, wireType 0 =*/40).bool(message.withSnapshot);
                return writer;
            };

            /**
             * Encodes the specified Subscribe message, length delimited. Does not implicitly {@link osp.v1.Subscribe.verify|verify} messages.
             * @function encodeDelimited
             * @memberof osp.v1.Subscribe
             * @static
             * @param {osp.v1.ISubscribe} message Subscribe message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Subscribe.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
            };

            /**
             * Decodes a Subscribe message from the specified reader or buffer.
             * @function decode
             * @memberof osp.v1.Subscribe
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {osp.v1.Subscribe} Subscribe
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Subscribe.decode = function decode(reader, length, error, long) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (long === undefined)
                    long = 0;
                if (long > $Reader.recursionLimit)
                    throw Error("maximum nesting depth exceeded");
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.osp.v1.Subscribe();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            message.subscriptionId = reader.string();
                            break;
                        }
                    case 2: {
                            message.collection = reader.string();
                            break;
                        }
                    case 3: {
                            message.predicate = $root.osp.v1.Predicate.decode(reader, reader.uint32(), undefined, long + 1);
                            break;
                        }
                    case 4: {
                            message.limit = reader.uint32();
                            break;
                        }
                    case 5: {
                            message.withSnapshot = reader.bool();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7, long);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a Subscribe message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof osp.v1.Subscribe
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {osp.v1.Subscribe} Subscribe
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Subscribe.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a Subscribe message.
             * @function verify
             * @memberof osp.v1.Subscribe
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Subscribe.verify = function verify(message, long) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (long === undefined)
                    long = 0;
                if (long > $util.recursionLimit)
                    return "maximum nesting depth exceeded";
                if (message.subscriptionId != null && Object.hasOwnProperty.call(message, "subscriptionId"))
                    if (!$util.isString(message.subscriptionId))
                        return "subscriptionId: string expected";
                if (message.collection != null && Object.hasOwnProperty.call(message, "collection"))
                    if (!$util.isString(message.collection))
                        return "collection: string expected";
                if (message.predicate != null && Object.hasOwnProperty.call(message, "predicate")) {
                    var error = $root.osp.v1.Predicate.verify(message.predicate, long + 1);
                    if (error)
                        return "predicate." + error;
                }
                if (message.limit != null && Object.hasOwnProperty.call(message, "limit"))
                    if (!$util.isInteger(message.limit))
                        return "limit: integer expected";
                if (message.withSnapshot != null && Object.hasOwnProperty.call(message, "withSnapshot"))
                    if (typeof message.withSnapshot !== "boolean")
                        return "withSnapshot: boolean expected";
                return null;
            };

            /**
             * Creates a Subscribe message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof osp.v1.Subscribe
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {osp.v1.Subscribe} Subscribe
             */
            Subscribe.fromObject = function fromObject(object, long) {
                if (object instanceof $root.osp.v1.Subscribe)
                    return object;
                if (!$util.isObject(object))
                    throw TypeError(".osp.v1.Subscribe: object expected");
                if (long === undefined)
                    long = 0;
                if (long > $util.recursionLimit)
                    throw Error("maximum nesting depth exceeded");
                var message = new $root.osp.v1.Subscribe();
                if (object.subscriptionId != null)
                    message.subscriptionId = String(object.subscriptionId);
                if (object.collection != null)
                    message.collection = String(object.collection);
                if (object.predicate != null) {
                    if (!$util.isObject(object.predicate))
                        throw TypeError(".osp.v1.Subscribe.predicate: object expected");
                    message.predicate = $root.osp.v1.Predicate.fromObject(object.predicate, long + 1);
                }
                if (object.limit != null)
                    message.limit = object.limit >>> 0;
                if (object.withSnapshot != null)
                    message.withSnapshot = Boolean(object.withSnapshot);
                return message;
            };

            /**
             * Creates a plain object from a Subscribe message. Also converts values to other types if specified.
             * @function toObject
             * @memberof osp.v1.Subscribe
             * @static
             * @param {osp.v1.Subscribe} message Subscribe
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Subscribe.toObject = function toObject(message, options, q) {
                if (!options)
                    options = {};
                if (q === undefined)
                    q = 0;
                if (q > $util.recursionLimit)
                    throw Error("max depth exceeded");
                var object = {};
                if (options.defaults) {
                    object.subscriptionId = "";
                    object.collection = "";
                    object.predicate = null;
                    object.limit = 0;
                    object.withSnapshot = false;
                }
                if (message.subscriptionId != null && Object.hasOwnProperty.call(message, "subscriptionId"))
                    object.subscriptionId = message.subscriptionId;
                if (message.collection != null && Object.hasOwnProperty.call(message, "collection"))
                    object.collection = message.collection;
                if (message.predicate != null && Object.hasOwnProperty.call(message, "predicate"))
                    object.predicate = $root.osp.v1.Predicate.toObject(message.predicate, options, q + 1);
                if (message.limit != null && Object.hasOwnProperty.call(message, "limit"))
                    object.limit = message.limit;
                if (message.withSnapshot != null && Object.hasOwnProperty.call(message, "withSnapshot"))
                    object.withSnapshot = message.withSnapshot;
                return object;
            };

            /**
             * Converts this Subscribe to JSON.
             * @function toJSON
             * @memberof osp.v1.Subscribe
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Subscribe.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for Subscribe
             * @function getTypeUrl
             * @memberof osp.v1.Subscribe
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            Subscribe.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/osp.v1.Subscribe";
            };

            return Subscribe;
        })();

        v1.Unsubscribe = (function() {

            /**
             * Properties of an Unsubscribe.
             * @memberof osp.v1
             * @interface IUnsubscribe
             * @property {string|null} [subscriptionId] Unsubscribe subscriptionId
             */

            /**
             * Constructs a new Unsubscribe.
             * @memberof osp.v1
             * @classdesc Represents an Unsubscribe.
             * @implements IUnsubscribe
             * @constructor
             * @param {osp.v1.IUnsubscribe=} [properties] Properties to set
             */
            function Unsubscribe(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Unsubscribe subscriptionId.
             * @member {string} subscriptionId
             * @memberof osp.v1.Unsubscribe
             * @instance
             */
            Unsubscribe.prototype.subscriptionId = "";

            /**
             * Creates a new Unsubscribe instance using the specified properties.
             * @function create
             * @memberof osp.v1.Unsubscribe
             * @static
             * @param {osp.v1.IUnsubscribe=} [properties] Properties to set
             * @returns {osp.v1.Unsubscribe} Unsubscribe instance
             */
            Unsubscribe.create = function create(properties) {
                return new Unsubscribe(properties);
            };

            /**
             * Encodes the specified Unsubscribe message. Does not implicitly {@link osp.v1.Unsubscribe.verify|verify} messages.
             * @function encode
             * @memberof osp.v1.Unsubscribe
             * @static
             * @param {osp.v1.IUnsubscribe} message Unsubscribe message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Unsubscribe.encode = function encode(message, writer, q) {
                if (!writer)
                    writer = $Writer.create();
                if (q === undefined)
                    q = 0;
                if (q > $util.recursionLimit)
                    throw Error("max depth exceeded");
                if (message.subscriptionId != null && Object.hasOwnProperty.call(message, "subscriptionId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.subscriptionId);
                return writer;
            };

            /**
             * Encodes the specified Unsubscribe message, length delimited. Does not implicitly {@link osp.v1.Unsubscribe.verify|verify} messages.
             * @function encodeDelimited
             * @memberof osp.v1.Unsubscribe
             * @static
             * @param {osp.v1.IUnsubscribe} message Unsubscribe message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Unsubscribe.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
            };

            /**
             * Decodes an Unsubscribe message from the specified reader or buffer.
             * @function decode
             * @memberof osp.v1.Unsubscribe
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {osp.v1.Unsubscribe} Unsubscribe
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Unsubscribe.decode = function decode(reader, length, error, long) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (long === undefined)
                    long = 0;
                if (long > $Reader.recursionLimit)
                    throw Error("maximum nesting depth exceeded");
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.osp.v1.Unsubscribe();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            message.subscriptionId = reader.string();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7, long);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes an Unsubscribe message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof osp.v1.Unsubscribe
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {osp.v1.Unsubscribe} Unsubscribe
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Unsubscribe.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an Unsubscribe message.
             * @function verify
             * @memberof osp.v1.Unsubscribe
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Unsubscribe.verify = function verify(message, long) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (long === undefined)
                    long = 0;
                if (long > $util.recursionLimit)
                    return "maximum nesting depth exceeded";
                if (message.subscriptionId != null && Object.hasOwnProperty.call(message, "subscriptionId"))
                    if (!$util.isString(message.subscriptionId))
                        return "subscriptionId: string expected";
                return null;
            };

            /**
             * Creates an Unsubscribe message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof osp.v1.Unsubscribe
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {osp.v1.Unsubscribe} Unsubscribe
             */
            Unsubscribe.fromObject = function fromObject(object, long) {
                if (object instanceof $root.osp.v1.Unsubscribe)
                    return object;
                if (!$util.isObject(object))
                    throw TypeError(".osp.v1.Unsubscribe: object expected");
                if (long === undefined)
                    long = 0;
                if (long > $util.recursionLimit)
                    throw Error("maximum nesting depth exceeded");
                var message = new $root.osp.v1.Unsubscribe();
                if (object.subscriptionId != null)
                    message.subscriptionId = String(object.subscriptionId);
                return message;
            };

            /**
             * Creates a plain object from an Unsubscribe message. Also converts values to other types if specified.
             * @function toObject
             * @memberof osp.v1.Unsubscribe
             * @static
             * @param {osp.v1.Unsubscribe} message Unsubscribe
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Unsubscribe.toObject = function toObject(message, options, q) {
                if (!options)
                    options = {};
                if (q === undefined)
                    q = 0;
                if (q > $util.recursionLimit)
                    throw Error("max depth exceeded");
                var object = {};
                if (options.defaults)
                    object.subscriptionId = "";
                if (message.subscriptionId != null && Object.hasOwnProperty.call(message, "subscriptionId"))
                    object.subscriptionId = message.subscriptionId;
                return object;
            };

            /**
             * Converts this Unsubscribe to JSON.
             * @function toJSON
             * @memberof osp.v1.Unsubscribe
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Unsubscribe.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for Unsubscribe
             * @function getTypeUrl
             * @memberof osp.v1.Unsubscribe
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            Unsubscribe.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/osp.v1.Unsubscribe";
            };

            return Unsubscribe;
        })();

        v1.SubscribeAck = (function() {

            /**
             * Properties of a SubscribeAck.
             * @memberof osp.v1
             * @interface ISubscribeAck
             * @property {string|null} [subscriptionId] SubscribeAck subscriptionId
             * @property {boolean|null} [accepted] SubscribeAck accepted
             * @property {osp.v1.IErrorInfo|null} [error] SubscribeAck error
             * @property {number|Long|null} [snapshotRevision] SubscribeAck snapshotRevision
             */

            /**
             * Constructs a new SubscribeAck.
             * @memberof osp.v1
             * @classdesc Represents a SubscribeAck.
             * @implements ISubscribeAck
             * @constructor
             * @param {osp.v1.ISubscribeAck=} [properties] Properties to set
             */
            function SubscribeAck(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * SubscribeAck subscriptionId.
             * @member {string} subscriptionId
             * @memberof osp.v1.SubscribeAck
             * @instance
             */
            SubscribeAck.prototype.subscriptionId = "";

            /**
             * SubscribeAck accepted.
             * @member {boolean} accepted
             * @memberof osp.v1.SubscribeAck
             * @instance
             */
            SubscribeAck.prototype.accepted = false;

            /**
             * SubscribeAck error.
             * @member {osp.v1.IErrorInfo|null|undefined} error
             * @memberof osp.v1.SubscribeAck
             * @instance
             */
            SubscribeAck.prototype.error = null;

            /**
             * SubscribeAck snapshotRevision.
             * @member {number|Long} snapshotRevision
             * @memberof osp.v1.SubscribeAck
             * @instance
             */
            SubscribeAck.prototype.snapshotRevision = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * Creates a new SubscribeAck instance using the specified properties.
             * @function create
             * @memberof osp.v1.SubscribeAck
             * @static
             * @param {osp.v1.ISubscribeAck=} [properties] Properties to set
             * @returns {osp.v1.SubscribeAck} SubscribeAck instance
             */
            SubscribeAck.create = function create(properties) {
                return new SubscribeAck(properties);
            };

            /**
             * Encodes the specified SubscribeAck message. Does not implicitly {@link osp.v1.SubscribeAck.verify|verify} messages.
             * @function encode
             * @memberof osp.v1.SubscribeAck
             * @static
             * @param {osp.v1.ISubscribeAck} message SubscribeAck message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SubscribeAck.encode = function encode(message, writer, q) {
                if (!writer)
                    writer = $Writer.create();
                if (q === undefined)
                    q = 0;
                if (q > $util.recursionLimit)
                    throw Error("max depth exceeded");
                if (message.subscriptionId != null && Object.hasOwnProperty.call(message, "subscriptionId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.subscriptionId);
                if (message.accepted != null && Object.hasOwnProperty.call(message, "accepted"))
                    writer.uint32(/* id 2, wireType 0 =*/16).bool(message.accepted);
                if (message.error != null && Object.hasOwnProperty.call(message, "error"))
                    $root.osp.v1.ErrorInfo.encode(message.error, writer.uint32(/* id 3, wireType 2 =*/26).fork(), q + 1).ldelim();
                if (message.snapshotRevision != null && Object.hasOwnProperty.call(message, "snapshotRevision"))
                    writer.uint32(/* id 4, wireType 0 =*/32).uint64(message.snapshotRevision);
                return writer;
            };

            /**
             * Encodes the specified SubscribeAck message, length delimited. Does not implicitly {@link osp.v1.SubscribeAck.verify|verify} messages.
             * @function encodeDelimited
             * @memberof osp.v1.SubscribeAck
             * @static
             * @param {osp.v1.ISubscribeAck} message SubscribeAck message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SubscribeAck.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
            };

            /**
             * Decodes a SubscribeAck message from the specified reader or buffer.
             * @function decode
             * @memberof osp.v1.SubscribeAck
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {osp.v1.SubscribeAck} SubscribeAck
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SubscribeAck.decode = function decode(reader, length, error, long) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (long === undefined)
                    long = 0;
                if (long > $Reader.recursionLimit)
                    throw Error("maximum nesting depth exceeded");
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.osp.v1.SubscribeAck();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            message.subscriptionId = reader.string();
                            break;
                        }
                    case 2: {
                            message.accepted = reader.bool();
                            break;
                        }
                    case 3: {
                            message.error = $root.osp.v1.ErrorInfo.decode(reader, reader.uint32(), undefined, long + 1);
                            break;
                        }
                    case 4: {
                            message.snapshotRevision = reader.uint64();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7, long);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a SubscribeAck message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof osp.v1.SubscribeAck
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {osp.v1.SubscribeAck} SubscribeAck
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SubscribeAck.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a SubscribeAck message.
             * @function verify
             * @memberof osp.v1.SubscribeAck
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            SubscribeAck.verify = function verify(message, long) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (long === undefined)
                    long = 0;
                if (long > $util.recursionLimit)
                    return "maximum nesting depth exceeded";
                if (message.subscriptionId != null && Object.hasOwnProperty.call(message, "subscriptionId"))
                    if (!$util.isString(message.subscriptionId))
                        return "subscriptionId: string expected";
                if (message.accepted != null && Object.hasOwnProperty.call(message, "accepted"))
                    if (typeof message.accepted !== "boolean")
                        return "accepted: boolean expected";
                if (message.error != null && Object.hasOwnProperty.call(message, "error")) {
                    var error = $root.osp.v1.ErrorInfo.verify(message.error, long + 1);
                    if (error)
                        return "error." + error;
                }
                if (message.snapshotRevision != null && Object.hasOwnProperty.call(message, "snapshotRevision"))
                    if (!$util.isInteger(message.snapshotRevision) && !(message.snapshotRevision && $util.isInteger(message.snapshotRevision.low) && $util.isInteger(message.snapshotRevision.high)))
                        return "snapshotRevision: integer|Long expected";
                return null;
            };

            /**
             * Creates a SubscribeAck message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof osp.v1.SubscribeAck
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {osp.v1.SubscribeAck} SubscribeAck
             */
            SubscribeAck.fromObject = function fromObject(object, long) {
                if (object instanceof $root.osp.v1.SubscribeAck)
                    return object;
                if (!$util.isObject(object))
                    throw TypeError(".osp.v1.SubscribeAck: object expected");
                if (long === undefined)
                    long = 0;
                if (long > $util.recursionLimit)
                    throw Error("maximum nesting depth exceeded");
                var message = new $root.osp.v1.SubscribeAck();
                if (object.subscriptionId != null)
                    message.subscriptionId = String(object.subscriptionId);
                if (object.accepted != null)
                    message.accepted = Boolean(object.accepted);
                if (object.error != null) {
                    if (!$util.isObject(object.error))
                        throw TypeError(".osp.v1.SubscribeAck.error: object expected");
                    message.error = $root.osp.v1.ErrorInfo.fromObject(object.error, long + 1);
                }
                if (object.snapshotRevision != null)
                    if ($util.Long)
                        message.snapshotRevision = $util.Long.fromValue(object.snapshotRevision, true);
                    else if (typeof object.snapshotRevision === "string")
                        message.snapshotRevision = parseInt(object.snapshotRevision, 10);
                    else if (typeof object.snapshotRevision === "number")
                        message.snapshotRevision = object.snapshotRevision;
                    else if (typeof object.snapshotRevision === "object")
                        message.snapshotRevision = new $util.LongBits(object.snapshotRevision.low >>> 0, object.snapshotRevision.high >>> 0).toNumber(true);
                return message;
            };

            /**
             * Creates a plain object from a SubscribeAck message. Also converts values to other types if specified.
             * @function toObject
             * @memberof osp.v1.SubscribeAck
             * @static
             * @param {osp.v1.SubscribeAck} message SubscribeAck
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            SubscribeAck.toObject = function toObject(message, options, q) {
                if (!options)
                    options = {};
                if (q === undefined)
                    q = 0;
                if (q > $util.recursionLimit)
                    throw Error("max depth exceeded");
                var object = {};
                if (options.defaults) {
                    object.subscriptionId = "";
                    object.accepted = false;
                    object.error = null;
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.snapshotRevision = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : typeof BigInt !== "undefined" && options.longs === BigInt ? long.toBigInt() : long;
                    } else
                        object.snapshotRevision = options.longs === String ? "0" : typeof BigInt !== "undefined" && options.longs === BigInt ? BigInt("0") : 0;
                }
                if (message.subscriptionId != null && Object.hasOwnProperty.call(message, "subscriptionId"))
                    object.subscriptionId = message.subscriptionId;
                if (message.accepted != null && Object.hasOwnProperty.call(message, "accepted"))
                    object.accepted = message.accepted;
                if (message.error != null && Object.hasOwnProperty.call(message, "error"))
                    object.error = $root.osp.v1.ErrorInfo.toObject(message.error, options, q + 1);
                if (message.snapshotRevision != null && Object.hasOwnProperty.call(message, "snapshotRevision"))
                    if (typeof BigInt !== "undefined" && options.longs === BigInt)
                        object.snapshotRevision = typeof message.snapshotRevision === "number" ? BigInt(message.snapshotRevision) : $util.Long.fromBits(message.snapshotRevision.low >>> 0, message.snapshotRevision.high >>> 0, true).toBigInt();
                    else if (typeof message.snapshotRevision === "number")
                        object.snapshotRevision = options.longs === String ? String(message.snapshotRevision) : message.snapshotRevision;
                    else
                        object.snapshotRevision = options.longs === String ? $util.Long.prototype.toString.call(message.snapshotRevision) : options.longs === Number ? new $util.LongBits(message.snapshotRevision.low >>> 0, message.snapshotRevision.high >>> 0).toNumber(true) : message.snapshotRevision;
                return object;
            };

            /**
             * Converts this SubscribeAck to JSON.
             * @function toJSON
             * @memberof osp.v1.SubscribeAck
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            SubscribeAck.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for SubscribeAck
             * @function getTypeUrl
             * @memberof osp.v1.SubscribeAck
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            SubscribeAck.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/osp.v1.SubscribeAck";
            };

            return SubscribeAck;
        })();

        v1.Predicate = (function() {

            /**
             * Properties of a Predicate.
             * @memberof osp.v1
             * @interface IPredicate
             * @property {osp.v1.Predicate.IEq|null} [eq] Predicate eq
             * @property {osp.v1.Predicate.INe|null} [ne] Predicate ne
             * @property {osp.v1.Predicate.ILt|null} [lt] Predicate lt
             * @property {osp.v1.Predicate.ILe|null} [le] Predicate le
             * @property {osp.v1.Predicate.IGt|null} [gt] Predicate gt
             * @property {osp.v1.Predicate.IGe|null} [ge] Predicate ge
             * @property {osp.v1.Predicate.IInExpr|null} [inExpr] Predicate inExpr
             * @property {osp.v1.Predicate.IAndExpr|null} [andExpr] Predicate andExpr
             * @property {osp.v1.Predicate.IOrExpr|null} [orExpr] Predicate orExpr
             * @property {osp.v1.Predicate.INotExpr|null} [notExpr] Predicate notExpr
             */

            /**
             * Constructs a new Predicate.
             * @memberof osp.v1
             * @classdesc Represents a Predicate.
             * @implements IPredicate
             * @constructor
             * @param {osp.v1.IPredicate=} [properties] Properties to set
             */
            function Predicate(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Predicate eq.
             * @member {osp.v1.Predicate.IEq|null|undefined} eq
             * @memberof osp.v1.Predicate
             * @instance
             */
            Predicate.prototype.eq = null;

            /**
             * Predicate ne.
             * @member {osp.v1.Predicate.INe|null|undefined} ne
             * @memberof osp.v1.Predicate
             * @instance
             */
            Predicate.prototype.ne = null;

            /**
             * Predicate lt.
             * @member {osp.v1.Predicate.ILt|null|undefined} lt
             * @memberof osp.v1.Predicate
             * @instance
             */
            Predicate.prototype.lt = null;

            /**
             * Predicate le.
             * @member {osp.v1.Predicate.ILe|null|undefined} le
             * @memberof osp.v1.Predicate
             * @instance
             */
            Predicate.prototype.le = null;

            /**
             * Predicate gt.
             * @member {osp.v1.Predicate.IGt|null|undefined} gt
             * @memberof osp.v1.Predicate
             * @instance
             */
            Predicate.prototype.gt = null;

            /**
             * Predicate ge.
             * @member {osp.v1.Predicate.IGe|null|undefined} ge
             * @memberof osp.v1.Predicate
             * @instance
             */
            Predicate.prototype.ge = null;

            /**
             * Predicate inExpr.
             * @member {osp.v1.Predicate.IInExpr|null|undefined} inExpr
             * @memberof osp.v1.Predicate
             * @instance
             */
            Predicate.prototype.inExpr = null;

            /**
             * Predicate andExpr.
             * @member {osp.v1.Predicate.IAndExpr|null|undefined} andExpr
             * @memberof osp.v1.Predicate
             * @instance
             */
            Predicate.prototype.andExpr = null;

            /**
             * Predicate orExpr.
             * @member {osp.v1.Predicate.IOrExpr|null|undefined} orExpr
             * @memberof osp.v1.Predicate
             * @instance
             */
            Predicate.prototype.orExpr = null;

            /**
             * Predicate notExpr.
             * @member {osp.v1.Predicate.INotExpr|null|undefined} notExpr
             * @memberof osp.v1.Predicate
             * @instance
             */
            Predicate.prototype.notExpr = null;

            // OneOf field names bound to virtual getters and setters
            var $oneOfFields;

            /**
             * Predicate kind.
             * @member {"eq"|"ne"|"lt"|"le"|"gt"|"ge"|"inExpr"|"andExpr"|"orExpr"|"notExpr"|undefined} kind
             * @memberof osp.v1.Predicate
             * @instance
             */
            Object.defineProperty(Predicate.prototype, "kind", {
                get: $util.oneOfGetter($oneOfFields = ["eq", "ne", "lt", "le", "gt", "ge", "inExpr", "andExpr", "orExpr", "notExpr"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new Predicate instance using the specified properties.
             * @function create
             * @memberof osp.v1.Predicate
             * @static
             * @param {osp.v1.IPredicate=} [properties] Properties to set
             * @returns {osp.v1.Predicate} Predicate instance
             */
            Predicate.create = function create(properties) {
                return new Predicate(properties);
            };

            /**
             * Encodes the specified Predicate message. Does not implicitly {@link osp.v1.Predicate.verify|verify} messages.
             * @function encode
             * @memberof osp.v1.Predicate
             * @static
             * @param {osp.v1.IPredicate} message Predicate message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Predicate.encode = function encode(message, writer, q) {
                if (!writer)
                    writer = $Writer.create();
                if (q === undefined)
                    q = 0;
                if (q > $util.recursionLimit)
                    throw Error("max depth exceeded");
                if (message.eq != null && Object.hasOwnProperty.call(message, "eq"))
                    $root.osp.v1.Predicate.Eq.encode(message.eq, writer.uint32(/* id 1, wireType 2 =*/10).fork(), q + 1).ldelim();
                if (message.ne != null && Object.hasOwnProperty.call(message, "ne"))
                    $root.osp.v1.Predicate.Ne.encode(message.ne, writer.uint32(/* id 2, wireType 2 =*/18).fork(), q + 1).ldelim();
                if (message.lt != null && Object.hasOwnProperty.call(message, "lt"))
                    $root.osp.v1.Predicate.Lt.encode(message.lt, writer.uint32(/* id 3, wireType 2 =*/26).fork(), q + 1).ldelim();
                if (message.le != null && Object.hasOwnProperty.call(message, "le"))
                    $root.osp.v1.Predicate.Le.encode(message.le, writer.uint32(/* id 4, wireType 2 =*/34).fork(), q + 1).ldelim();
                if (message.gt != null && Object.hasOwnProperty.call(message, "gt"))
                    $root.osp.v1.Predicate.Gt.encode(message.gt, writer.uint32(/* id 5, wireType 2 =*/42).fork(), q + 1).ldelim();
                if (message.ge != null && Object.hasOwnProperty.call(message, "ge"))
                    $root.osp.v1.Predicate.Ge.encode(message.ge, writer.uint32(/* id 6, wireType 2 =*/50).fork(), q + 1).ldelim();
                if (message.inExpr != null && Object.hasOwnProperty.call(message, "inExpr"))
                    $root.osp.v1.Predicate.InExpr.encode(message.inExpr, writer.uint32(/* id 7, wireType 2 =*/58).fork(), q + 1).ldelim();
                if (message.andExpr != null && Object.hasOwnProperty.call(message, "andExpr"))
                    $root.osp.v1.Predicate.AndExpr.encode(message.andExpr, writer.uint32(/* id 8, wireType 2 =*/66).fork(), q + 1).ldelim();
                if (message.orExpr != null && Object.hasOwnProperty.call(message, "orExpr"))
                    $root.osp.v1.Predicate.OrExpr.encode(message.orExpr, writer.uint32(/* id 9, wireType 2 =*/74).fork(), q + 1).ldelim();
                if (message.notExpr != null && Object.hasOwnProperty.call(message, "notExpr"))
                    $root.osp.v1.Predicate.NotExpr.encode(message.notExpr, writer.uint32(/* id 10, wireType 2 =*/82).fork(), q + 1).ldelim();
                return writer;
            };

            /**
             * Encodes the specified Predicate message, length delimited. Does not implicitly {@link osp.v1.Predicate.verify|verify} messages.
             * @function encodeDelimited
             * @memberof osp.v1.Predicate
             * @static
             * @param {osp.v1.IPredicate} message Predicate message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Predicate.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
            };

            /**
             * Decodes a Predicate message from the specified reader or buffer.
             * @function decode
             * @memberof osp.v1.Predicate
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {osp.v1.Predicate} Predicate
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Predicate.decode = function decode(reader, length, error, long) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (long === undefined)
                    long = 0;
                if (long > $Reader.recursionLimit)
                    throw Error("maximum nesting depth exceeded");
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.osp.v1.Predicate();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            message.eq = $root.osp.v1.Predicate.Eq.decode(reader, reader.uint32(), undefined, long + 1);
                            break;
                        }
                    case 2: {
                            message.ne = $root.osp.v1.Predicate.Ne.decode(reader, reader.uint32(), undefined, long + 1);
                            break;
                        }
                    case 3: {
                            message.lt = $root.osp.v1.Predicate.Lt.decode(reader, reader.uint32(), undefined, long + 1);
                            break;
                        }
                    case 4: {
                            message.le = $root.osp.v1.Predicate.Le.decode(reader, reader.uint32(), undefined, long + 1);
                            break;
                        }
                    case 5: {
                            message.gt = $root.osp.v1.Predicate.Gt.decode(reader, reader.uint32(), undefined, long + 1);
                            break;
                        }
                    case 6: {
                            message.ge = $root.osp.v1.Predicate.Ge.decode(reader, reader.uint32(), undefined, long + 1);
                            break;
                        }
                    case 7: {
                            message.inExpr = $root.osp.v1.Predicate.InExpr.decode(reader, reader.uint32(), undefined, long + 1);
                            break;
                        }
                    case 8: {
                            message.andExpr = $root.osp.v1.Predicate.AndExpr.decode(reader, reader.uint32(), undefined, long + 1);
                            break;
                        }
                    case 9: {
                            message.orExpr = $root.osp.v1.Predicate.OrExpr.decode(reader, reader.uint32(), undefined, long + 1);
                            break;
                        }
                    case 10: {
                            message.notExpr = $root.osp.v1.Predicate.NotExpr.decode(reader, reader.uint32(), undefined, long + 1);
                            break;
                        }
                    default:
                        reader.skipType(tag & 7, long);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a Predicate message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof osp.v1.Predicate
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {osp.v1.Predicate} Predicate
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Predicate.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a Predicate message.
             * @function verify
             * @memberof osp.v1.Predicate
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Predicate.verify = function verify(message, long) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (long === undefined)
                    long = 0;
                if (long > $util.recursionLimit)
                    return "maximum nesting depth exceeded";
                var properties = {};
                if (message.eq != null && Object.hasOwnProperty.call(message, "eq")) {
                    properties.kind = 1;
                    {
                        var error = $root.osp.v1.Predicate.Eq.verify(message.eq, long + 1);
                        if (error)
                            return "eq." + error;
                    }
                }
                if (message.ne != null && Object.hasOwnProperty.call(message, "ne")) {
                    if (properties.kind === 1)
                        return "kind: multiple values";
                    properties.kind = 1;
                    {
                        var error = $root.osp.v1.Predicate.Ne.verify(message.ne, long + 1);
                        if (error)
                            return "ne." + error;
                    }
                }
                if (message.lt != null && Object.hasOwnProperty.call(message, "lt")) {
                    if (properties.kind === 1)
                        return "kind: multiple values";
                    properties.kind = 1;
                    {
                        var error = $root.osp.v1.Predicate.Lt.verify(message.lt, long + 1);
                        if (error)
                            return "lt." + error;
                    }
                }
                if (message.le != null && Object.hasOwnProperty.call(message, "le")) {
                    if (properties.kind === 1)
                        return "kind: multiple values";
                    properties.kind = 1;
                    {
                        var error = $root.osp.v1.Predicate.Le.verify(message.le, long + 1);
                        if (error)
                            return "le." + error;
                    }
                }
                if (message.gt != null && Object.hasOwnProperty.call(message, "gt")) {
                    if (properties.kind === 1)
                        return "kind: multiple values";
                    properties.kind = 1;
                    {
                        var error = $root.osp.v1.Predicate.Gt.verify(message.gt, long + 1);
                        if (error)
                            return "gt." + error;
                    }
                }
                if (message.ge != null && Object.hasOwnProperty.call(message, "ge")) {
                    if (properties.kind === 1)
                        return "kind: multiple values";
                    properties.kind = 1;
                    {
                        var error = $root.osp.v1.Predicate.Ge.verify(message.ge, long + 1);
                        if (error)
                            return "ge." + error;
                    }
                }
                if (message.inExpr != null && Object.hasOwnProperty.call(message, "inExpr")) {
                    if (properties.kind === 1)
                        return "kind: multiple values";
                    properties.kind = 1;
                    {
                        var error = $root.osp.v1.Predicate.InExpr.verify(message.inExpr, long + 1);
                        if (error)
                            return "inExpr." + error;
                    }
                }
                if (message.andExpr != null && Object.hasOwnProperty.call(message, "andExpr")) {
                    if (properties.kind === 1)
                        return "kind: multiple values";
                    properties.kind = 1;
                    {
                        var error = $root.osp.v1.Predicate.AndExpr.verify(message.andExpr, long + 1);
                        if (error)
                            return "andExpr." + error;
                    }
                }
                if (message.orExpr != null && Object.hasOwnProperty.call(message, "orExpr")) {
                    if (properties.kind === 1)
                        return "kind: multiple values";
                    properties.kind = 1;
                    {
                        var error = $root.osp.v1.Predicate.OrExpr.verify(message.orExpr, long + 1);
                        if (error)
                            return "orExpr." + error;
                    }
                }
                if (message.notExpr != null && Object.hasOwnProperty.call(message, "notExpr")) {
                    if (properties.kind === 1)
                        return "kind: multiple values";
                    properties.kind = 1;
                    {
                        var error = $root.osp.v1.Predicate.NotExpr.verify(message.notExpr, long + 1);
                        if (error)
                            return "notExpr." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a Predicate message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof osp.v1.Predicate
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {osp.v1.Predicate} Predicate
             */
            Predicate.fromObject = function fromObject(object, long) {
                if (object instanceof $root.osp.v1.Predicate)
                    return object;
                if (!$util.isObject(object))
                    throw TypeError(".osp.v1.Predicate: object expected");
                if (long === undefined)
                    long = 0;
                if (long > $util.recursionLimit)
                    throw Error("maximum nesting depth exceeded");
                var message = new $root.osp.v1.Predicate();
                if (object.eq != null) {
                    if (!$util.isObject(object.eq))
                        throw TypeError(".osp.v1.Predicate.eq: object expected");
                    message.eq = $root.osp.v1.Predicate.Eq.fromObject(object.eq, long + 1);
                }
                if (object.ne != null) {
                    if (!$util.isObject(object.ne))
                        throw TypeError(".osp.v1.Predicate.ne: object expected");
                    message.ne = $root.osp.v1.Predicate.Ne.fromObject(object.ne, long + 1);
                }
                if (object.lt != null) {
                    if (!$util.isObject(object.lt))
                        throw TypeError(".osp.v1.Predicate.lt: object expected");
                    message.lt = $root.osp.v1.Predicate.Lt.fromObject(object.lt, long + 1);
                }
                if (object.le != null) {
                    if (!$util.isObject(object.le))
                        throw TypeError(".osp.v1.Predicate.le: object expected");
                    message.le = $root.osp.v1.Predicate.Le.fromObject(object.le, long + 1);
                }
                if (object.gt != null) {
                    if (!$util.isObject(object.gt))
                        throw TypeError(".osp.v1.Predicate.gt: object expected");
                    message.gt = $root.osp.v1.Predicate.Gt.fromObject(object.gt, long + 1);
                }
                if (object.ge != null) {
                    if (!$util.isObject(object.ge))
                        throw TypeError(".osp.v1.Predicate.ge: object expected");
                    message.ge = $root.osp.v1.Predicate.Ge.fromObject(object.ge, long + 1);
                }
                if (object.inExpr != null) {
                    if (!$util.isObject(object.inExpr))
                        throw TypeError(".osp.v1.Predicate.inExpr: object expected");
                    message.inExpr = $root.osp.v1.Predicate.InExpr.fromObject(object.inExpr, long + 1);
                }
                if (object.andExpr != null) {
                    if (!$util.isObject(object.andExpr))
                        throw TypeError(".osp.v1.Predicate.andExpr: object expected");
                    message.andExpr = $root.osp.v1.Predicate.AndExpr.fromObject(object.andExpr, long + 1);
                }
                if (object.orExpr != null) {
                    if (!$util.isObject(object.orExpr))
                        throw TypeError(".osp.v1.Predicate.orExpr: object expected");
                    message.orExpr = $root.osp.v1.Predicate.OrExpr.fromObject(object.orExpr, long + 1);
                }
                if (object.notExpr != null) {
                    if (!$util.isObject(object.notExpr))
                        throw TypeError(".osp.v1.Predicate.notExpr: object expected");
                    message.notExpr = $root.osp.v1.Predicate.NotExpr.fromObject(object.notExpr, long + 1);
                }
                return message;
            };

            /**
             * Creates a plain object from a Predicate message. Also converts values to other types if specified.
             * @function toObject
             * @memberof osp.v1.Predicate
             * @static
             * @param {osp.v1.Predicate} message Predicate
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Predicate.toObject = function toObject(message, options, q) {
                if (!options)
                    options = {};
                if (q === undefined)
                    q = 0;
                if (q > $util.recursionLimit)
                    throw Error("max depth exceeded");
                var object = {};
                if (message.eq != null && Object.hasOwnProperty.call(message, "eq")) {
                    object.eq = $root.osp.v1.Predicate.Eq.toObject(message.eq, options, q + 1);
                    if (options.oneofs)
                        object.kind = "eq";
                }
                if (message.ne != null && Object.hasOwnProperty.call(message, "ne")) {
                    object.ne = $root.osp.v1.Predicate.Ne.toObject(message.ne, options, q + 1);
                    if (options.oneofs)
                        object.kind = "ne";
                }
                if (message.lt != null && Object.hasOwnProperty.call(message, "lt")) {
                    object.lt = $root.osp.v1.Predicate.Lt.toObject(message.lt, options, q + 1);
                    if (options.oneofs)
                        object.kind = "lt";
                }
                if (message.le != null && Object.hasOwnProperty.call(message, "le")) {
                    object.le = $root.osp.v1.Predicate.Le.toObject(message.le, options, q + 1);
                    if (options.oneofs)
                        object.kind = "le";
                }
                if (message.gt != null && Object.hasOwnProperty.call(message, "gt")) {
                    object.gt = $root.osp.v1.Predicate.Gt.toObject(message.gt, options, q + 1);
                    if (options.oneofs)
                        object.kind = "gt";
                }
                if (message.ge != null && Object.hasOwnProperty.call(message, "ge")) {
                    object.ge = $root.osp.v1.Predicate.Ge.toObject(message.ge, options, q + 1);
                    if (options.oneofs)
                        object.kind = "ge";
                }
                if (message.inExpr != null && Object.hasOwnProperty.call(message, "inExpr")) {
                    object.inExpr = $root.osp.v1.Predicate.InExpr.toObject(message.inExpr, options, q + 1);
                    if (options.oneofs)
                        object.kind = "inExpr";
                }
                if (message.andExpr != null && Object.hasOwnProperty.call(message, "andExpr")) {
                    object.andExpr = $root.osp.v1.Predicate.AndExpr.toObject(message.andExpr, options, q + 1);
                    if (options.oneofs)
                        object.kind = "andExpr";
                }
                if (message.orExpr != null && Object.hasOwnProperty.call(message, "orExpr")) {
                    object.orExpr = $root.osp.v1.Predicate.OrExpr.toObject(message.orExpr, options, q + 1);
                    if (options.oneofs)
                        object.kind = "orExpr";
                }
                if (message.notExpr != null && Object.hasOwnProperty.call(message, "notExpr")) {
                    object.notExpr = $root.osp.v1.Predicate.NotExpr.toObject(message.notExpr, options, q + 1);
                    if (options.oneofs)
                        object.kind = "notExpr";
                }
                return object;
            };

            /**
             * Converts this Predicate to JSON.
             * @function toJSON
             * @memberof osp.v1.Predicate
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Predicate.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for Predicate
             * @function getTypeUrl
             * @memberof osp.v1.Predicate
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            Predicate.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/osp.v1.Predicate";
            };

            Predicate.Eq = (function() {

                /**
                 * Properties of an Eq.
                 * @memberof osp.v1.Predicate
                 * @interface IEq
                 * @property {string|null} [field] Eq field
                 * @property {osp.v1.IValue|null} [value] Eq value
                 */

                /**
                 * Constructs a new Eq.
                 * @memberof osp.v1.Predicate
                 * @classdesc Represents an Eq.
                 * @implements IEq
                 * @constructor
                 * @param {osp.v1.Predicate.IEq=} [properties] Properties to set
                 */
                function Eq(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * Eq field.
                 * @member {string} field
                 * @memberof osp.v1.Predicate.Eq
                 * @instance
                 */
                Eq.prototype.field = "";

                /**
                 * Eq value.
                 * @member {osp.v1.IValue|null|undefined} value
                 * @memberof osp.v1.Predicate.Eq
                 * @instance
                 */
                Eq.prototype.value = null;

                /**
                 * Creates a new Eq instance using the specified properties.
                 * @function create
                 * @memberof osp.v1.Predicate.Eq
                 * @static
                 * @param {osp.v1.Predicate.IEq=} [properties] Properties to set
                 * @returns {osp.v1.Predicate.Eq} Eq instance
                 */
                Eq.create = function create(properties) {
                    return new Eq(properties);
                };

                /**
                 * Encodes the specified Eq message. Does not implicitly {@link osp.v1.Predicate.Eq.verify|verify} messages.
                 * @function encode
                 * @memberof osp.v1.Predicate.Eq
                 * @static
                 * @param {osp.v1.Predicate.IEq} message Eq message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Eq.encode = function encode(message, writer, q) {
                    if (!writer)
                        writer = $Writer.create();
                    if (q === undefined)
                        q = 0;
                    if (q > $util.recursionLimit)
                        throw Error("max depth exceeded");
                    if (message.field != null && Object.hasOwnProperty.call(message, "field"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.field);
                    if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                        $root.osp.v1.Value.encode(message.value, writer.uint32(/* id 2, wireType 2 =*/18).fork(), q + 1).ldelim();
                    return writer;
                };

                /**
                 * Encodes the specified Eq message, length delimited. Does not implicitly {@link osp.v1.Predicate.Eq.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof osp.v1.Predicate.Eq
                 * @static
                 * @param {osp.v1.Predicate.IEq} message Eq message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Eq.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
                };

                /**
                 * Decodes an Eq message from the specified reader or buffer.
                 * @function decode
                 * @memberof osp.v1.Predicate.Eq
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {osp.v1.Predicate.Eq} Eq
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Eq.decode = function decode(reader, length, error, long) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    if (long === undefined)
                        long = 0;
                    if (long > $Reader.recursionLimit)
                        throw Error("maximum nesting depth exceeded");
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.osp.v1.Predicate.Eq();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        if (tag === error)
                            break;
                        switch (tag >>> 3) {
                        case 1: {
                                message.field = reader.string();
                                break;
                            }
                        case 2: {
                                message.value = $root.osp.v1.Value.decode(reader, reader.uint32(), undefined, long + 1);
                                break;
                            }
                        default:
                            reader.skipType(tag & 7, long);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes an Eq message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof osp.v1.Predicate.Eq
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {osp.v1.Predicate.Eq} Eq
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Eq.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies an Eq message.
                 * @function verify
                 * @memberof osp.v1.Predicate.Eq
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Eq.verify = function verify(message, long) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (long === undefined)
                        long = 0;
                    if (long > $util.recursionLimit)
                        return "maximum nesting depth exceeded";
                    if (message.field != null && Object.hasOwnProperty.call(message, "field"))
                        if (!$util.isString(message.field))
                            return "field: string expected";
                    if (message.value != null && Object.hasOwnProperty.call(message, "value")) {
                        var error = $root.osp.v1.Value.verify(message.value, long + 1);
                        if (error)
                            return "value." + error;
                    }
                    return null;
                };

                /**
                 * Creates an Eq message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof osp.v1.Predicate.Eq
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {osp.v1.Predicate.Eq} Eq
                 */
                Eq.fromObject = function fromObject(object, long) {
                    if (object instanceof $root.osp.v1.Predicate.Eq)
                        return object;
                    if (!$util.isObject(object))
                        throw TypeError(".osp.v1.Predicate.Eq: object expected");
                    if (long === undefined)
                        long = 0;
                    if (long > $util.recursionLimit)
                        throw Error("maximum nesting depth exceeded");
                    var message = new $root.osp.v1.Predicate.Eq();
                    if (object.field != null)
                        message.field = String(object.field);
                    if (object.value != null) {
                        if (!$util.isObject(object.value))
                            throw TypeError(".osp.v1.Predicate.Eq.value: object expected");
                        message.value = $root.osp.v1.Value.fromObject(object.value, long + 1);
                    }
                    return message;
                };

                /**
                 * Creates a plain object from an Eq message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof osp.v1.Predicate.Eq
                 * @static
                 * @param {osp.v1.Predicate.Eq} message Eq
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Eq.toObject = function toObject(message, options, q) {
                    if (!options)
                        options = {};
                    if (q === undefined)
                        q = 0;
                    if (q > $util.recursionLimit)
                        throw Error("max depth exceeded");
                    var object = {};
                    if (options.defaults) {
                        object.field = "";
                        object.value = null;
                    }
                    if (message.field != null && Object.hasOwnProperty.call(message, "field"))
                        object.field = message.field;
                    if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                        object.value = $root.osp.v1.Value.toObject(message.value, options, q + 1);
                    return object;
                };

                /**
                 * Converts this Eq to JSON.
                 * @function toJSON
                 * @memberof osp.v1.Predicate.Eq
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Eq.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                /**
                 * Gets the default type url for Eq
                 * @function getTypeUrl
                 * @memberof osp.v1.Predicate.Eq
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                Eq.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/osp.v1.Predicate.Eq";
                };

                return Eq;
            })();

            Predicate.Ne = (function() {

                /**
                 * Properties of a Ne.
                 * @memberof osp.v1.Predicate
                 * @interface INe
                 * @property {string|null} [field] Ne field
                 * @property {osp.v1.IValue|null} [value] Ne value
                 */

                /**
                 * Constructs a new Ne.
                 * @memberof osp.v1.Predicate
                 * @classdesc Represents a Ne.
                 * @implements INe
                 * @constructor
                 * @param {osp.v1.Predicate.INe=} [properties] Properties to set
                 */
                function Ne(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * Ne field.
                 * @member {string} field
                 * @memberof osp.v1.Predicate.Ne
                 * @instance
                 */
                Ne.prototype.field = "";

                /**
                 * Ne value.
                 * @member {osp.v1.IValue|null|undefined} value
                 * @memberof osp.v1.Predicate.Ne
                 * @instance
                 */
                Ne.prototype.value = null;

                /**
                 * Creates a new Ne instance using the specified properties.
                 * @function create
                 * @memberof osp.v1.Predicate.Ne
                 * @static
                 * @param {osp.v1.Predicate.INe=} [properties] Properties to set
                 * @returns {osp.v1.Predicate.Ne} Ne instance
                 */
                Ne.create = function create(properties) {
                    return new Ne(properties);
                };

                /**
                 * Encodes the specified Ne message. Does not implicitly {@link osp.v1.Predicate.Ne.verify|verify} messages.
                 * @function encode
                 * @memberof osp.v1.Predicate.Ne
                 * @static
                 * @param {osp.v1.Predicate.INe} message Ne message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Ne.encode = function encode(message, writer, q) {
                    if (!writer)
                        writer = $Writer.create();
                    if (q === undefined)
                        q = 0;
                    if (q > $util.recursionLimit)
                        throw Error("max depth exceeded");
                    if (message.field != null && Object.hasOwnProperty.call(message, "field"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.field);
                    if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                        $root.osp.v1.Value.encode(message.value, writer.uint32(/* id 2, wireType 2 =*/18).fork(), q + 1).ldelim();
                    return writer;
                };

                /**
                 * Encodes the specified Ne message, length delimited. Does not implicitly {@link osp.v1.Predicate.Ne.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof osp.v1.Predicate.Ne
                 * @static
                 * @param {osp.v1.Predicate.INe} message Ne message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Ne.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
                };

                /**
                 * Decodes a Ne message from the specified reader or buffer.
                 * @function decode
                 * @memberof osp.v1.Predicate.Ne
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {osp.v1.Predicate.Ne} Ne
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Ne.decode = function decode(reader, length, error, long) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    if (long === undefined)
                        long = 0;
                    if (long > $Reader.recursionLimit)
                        throw Error("maximum nesting depth exceeded");
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.osp.v1.Predicate.Ne();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        if (tag === error)
                            break;
                        switch (tag >>> 3) {
                        case 1: {
                                message.field = reader.string();
                                break;
                            }
                        case 2: {
                                message.value = $root.osp.v1.Value.decode(reader, reader.uint32(), undefined, long + 1);
                                break;
                            }
                        default:
                            reader.skipType(tag & 7, long);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a Ne message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof osp.v1.Predicate.Ne
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {osp.v1.Predicate.Ne} Ne
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Ne.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a Ne message.
                 * @function verify
                 * @memberof osp.v1.Predicate.Ne
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Ne.verify = function verify(message, long) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (long === undefined)
                        long = 0;
                    if (long > $util.recursionLimit)
                        return "maximum nesting depth exceeded";
                    if (message.field != null && Object.hasOwnProperty.call(message, "field"))
                        if (!$util.isString(message.field))
                            return "field: string expected";
                    if (message.value != null && Object.hasOwnProperty.call(message, "value")) {
                        var error = $root.osp.v1.Value.verify(message.value, long + 1);
                        if (error)
                            return "value." + error;
                    }
                    return null;
                };

                /**
                 * Creates a Ne message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof osp.v1.Predicate.Ne
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {osp.v1.Predicate.Ne} Ne
                 */
                Ne.fromObject = function fromObject(object, long) {
                    if (object instanceof $root.osp.v1.Predicate.Ne)
                        return object;
                    if (!$util.isObject(object))
                        throw TypeError(".osp.v1.Predicate.Ne: object expected");
                    if (long === undefined)
                        long = 0;
                    if (long > $util.recursionLimit)
                        throw Error("maximum nesting depth exceeded");
                    var message = new $root.osp.v1.Predicate.Ne();
                    if (object.field != null)
                        message.field = String(object.field);
                    if (object.value != null) {
                        if (!$util.isObject(object.value))
                            throw TypeError(".osp.v1.Predicate.Ne.value: object expected");
                        message.value = $root.osp.v1.Value.fromObject(object.value, long + 1);
                    }
                    return message;
                };

                /**
                 * Creates a plain object from a Ne message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof osp.v1.Predicate.Ne
                 * @static
                 * @param {osp.v1.Predicate.Ne} message Ne
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Ne.toObject = function toObject(message, options, q) {
                    if (!options)
                        options = {};
                    if (q === undefined)
                        q = 0;
                    if (q > $util.recursionLimit)
                        throw Error("max depth exceeded");
                    var object = {};
                    if (options.defaults) {
                        object.field = "";
                        object.value = null;
                    }
                    if (message.field != null && Object.hasOwnProperty.call(message, "field"))
                        object.field = message.field;
                    if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                        object.value = $root.osp.v1.Value.toObject(message.value, options, q + 1);
                    return object;
                };

                /**
                 * Converts this Ne to JSON.
                 * @function toJSON
                 * @memberof osp.v1.Predicate.Ne
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Ne.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                /**
                 * Gets the default type url for Ne
                 * @function getTypeUrl
                 * @memberof osp.v1.Predicate.Ne
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                Ne.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/osp.v1.Predicate.Ne";
                };

                return Ne;
            })();

            Predicate.Lt = (function() {

                /**
                 * Properties of a Lt.
                 * @memberof osp.v1.Predicate
                 * @interface ILt
                 * @property {string|null} [field] Lt field
                 * @property {osp.v1.IValue|null} [value] Lt value
                 */

                /**
                 * Constructs a new Lt.
                 * @memberof osp.v1.Predicate
                 * @classdesc Represents a Lt.
                 * @implements ILt
                 * @constructor
                 * @param {osp.v1.Predicate.ILt=} [properties] Properties to set
                 */
                function Lt(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * Lt field.
                 * @member {string} field
                 * @memberof osp.v1.Predicate.Lt
                 * @instance
                 */
                Lt.prototype.field = "";

                /**
                 * Lt value.
                 * @member {osp.v1.IValue|null|undefined} value
                 * @memberof osp.v1.Predicate.Lt
                 * @instance
                 */
                Lt.prototype.value = null;

                /**
                 * Creates a new Lt instance using the specified properties.
                 * @function create
                 * @memberof osp.v1.Predicate.Lt
                 * @static
                 * @param {osp.v1.Predicate.ILt=} [properties] Properties to set
                 * @returns {osp.v1.Predicate.Lt} Lt instance
                 */
                Lt.create = function create(properties) {
                    return new Lt(properties);
                };

                /**
                 * Encodes the specified Lt message. Does not implicitly {@link osp.v1.Predicate.Lt.verify|verify} messages.
                 * @function encode
                 * @memberof osp.v1.Predicate.Lt
                 * @static
                 * @param {osp.v1.Predicate.ILt} message Lt message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Lt.encode = function encode(message, writer, q) {
                    if (!writer)
                        writer = $Writer.create();
                    if (q === undefined)
                        q = 0;
                    if (q > $util.recursionLimit)
                        throw Error("max depth exceeded");
                    if (message.field != null && Object.hasOwnProperty.call(message, "field"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.field);
                    if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                        $root.osp.v1.Value.encode(message.value, writer.uint32(/* id 2, wireType 2 =*/18).fork(), q + 1).ldelim();
                    return writer;
                };

                /**
                 * Encodes the specified Lt message, length delimited. Does not implicitly {@link osp.v1.Predicate.Lt.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof osp.v1.Predicate.Lt
                 * @static
                 * @param {osp.v1.Predicate.ILt} message Lt message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Lt.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
                };

                /**
                 * Decodes a Lt message from the specified reader or buffer.
                 * @function decode
                 * @memberof osp.v1.Predicate.Lt
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {osp.v1.Predicate.Lt} Lt
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Lt.decode = function decode(reader, length, error, long) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    if (long === undefined)
                        long = 0;
                    if (long > $Reader.recursionLimit)
                        throw Error("maximum nesting depth exceeded");
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.osp.v1.Predicate.Lt();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        if (tag === error)
                            break;
                        switch (tag >>> 3) {
                        case 1: {
                                message.field = reader.string();
                                break;
                            }
                        case 2: {
                                message.value = $root.osp.v1.Value.decode(reader, reader.uint32(), undefined, long + 1);
                                break;
                            }
                        default:
                            reader.skipType(tag & 7, long);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a Lt message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof osp.v1.Predicate.Lt
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {osp.v1.Predicate.Lt} Lt
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Lt.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a Lt message.
                 * @function verify
                 * @memberof osp.v1.Predicate.Lt
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Lt.verify = function verify(message, long) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (long === undefined)
                        long = 0;
                    if (long > $util.recursionLimit)
                        return "maximum nesting depth exceeded";
                    if (message.field != null && Object.hasOwnProperty.call(message, "field"))
                        if (!$util.isString(message.field))
                            return "field: string expected";
                    if (message.value != null && Object.hasOwnProperty.call(message, "value")) {
                        var error = $root.osp.v1.Value.verify(message.value, long + 1);
                        if (error)
                            return "value." + error;
                    }
                    return null;
                };

                /**
                 * Creates a Lt message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof osp.v1.Predicate.Lt
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {osp.v1.Predicate.Lt} Lt
                 */
                Lt.fromObject = function fromObject(object, long) {
                    if (object instanceof $root.osp.v1.Predicate.Lt)
                        return object;
                    if (!$util.isObject(object))
                        throw TypeError(".osp.v1.Predicate.Lt: object expected");
                    if (long === undefined)
                        long = 0;
                    if (long > $util.recursionLimit)
                        throw Error("maximum nesting depth exceeded");
                    var message = new $root.osp.v1.Predicate.Lt();
                    if (object.field != null)
                        message.field = String(object.field);
                    if (object.value != null) {
                        if (!$util.isObject(object.value))
                            throw TypeError(".osp.v1.Predicate.Lt.value: object expected");
                        message.value = $root.osp.v1.Value.fromObject(object.value, long + 1);
                    }
                    return message;
                };

                /**
                 * Creates a plain object from a Lt message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof osp.v1.Predicate.Lt
                 * @static
                 * @param {osp.v1.Predicate.Lt} message Lt
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Lt.toObject = function toObject(message, options, q) {
                    if (!options)
                        options = {};
                    if (q === undefined)
                        q = 0;
                    if (q > $util.recursionLimit)
                        throw Error("max depth exceeded");
                    var object = {};
                    if (options.defaults) {
                        object.field = "";
                        object.value = null;
                    }
                    if (message.field != null && Object.hasOwnProperty.call(message, "field"))
                        object.field = message.field;
                    if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                        object.value = $root.osp.v1.Value.toObject(message.value, options, q + 1);
                    return object;
                };

                /**
                 * Converts this Lt to JSON.
                 * @function toJSON
                 * @memberof osp.v1.Predicate.Lt
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Lt.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                /**
                 * Gets the default type url for Lt
                 * @function getTypeUrl
                 * @memberof osp.v1.Predicate.Lt
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                Lt.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/osp.v1.Predicate.Lt";
                };

                return Lt;
            })();

            Predicate.Le = (function() {

                /**
                 * Properties of a Le.
                 * @memberof osp.v1.Predicate
                 * @interface ILe
                 * @property {string|null} [field] Le field
                 * @property {osp.v1.IValue|null} [value] Le value
                 */

                /**
                 * Constructs a new Le.
                 * @memberof osp.v1.Predicate
                 * @classdesc Represents a Le.
                 * @implements ILe
                 * @constructor
                 * @param {osp.v1.Predicate.ILe=} [properties] Properties to set
                 */
                function Le(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * Le field.
                 * @member {string} field
                 * @memberof osp.v1.Predicate.Le
                 * @instance
                 */
                Le.prototype.field = "";

                /**
                 * Le value.
                 * @member {osp.v1.IValue|null|undefined} value
                 * @memberof osp.v1.Predicate.Le
                 * @instance
                 */
                Le.prototype.value = null;

                /**
                 * Creates a new Le instance using the specified properties.
                 * @function create
                 * @memberof osp.v1.Predicate.Le
                 * @static
                 * @param {osp.v1.Predicate.ILe=} [properties] Properties to set
                 * @returns {osp.v1.Predicate.Le} Le instance
                 */
                Le.create = function create(properties) {
                    return new Le(properties);
                };

                /**
                 * Encodes the specified Le message. Does not implicitly {@link osp.v1.Predicate.Le.verify|verify} messages.
                 * @function encode
                 * @memberof osp.v1.Predicate.Le
                 * @static
                 * @param {osp.v1.Predicate.ILe} message Le message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Le.encode = function encode(message, writer, q) {
                    if (!writer)
                        writer = $Writer.create();
                    if (q === undefined)
                        q = 0;
                    if (q > $util.recursionLimit)
                        throw Error("max depth exceeded");
                    if (message.field != null && Object.hasOwnProperty.call(message, "field"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.field);
                    if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                        $root.osp.v1.Value.encode(message.value, writer.uint32(/* id 2, wireType 2 =*/18).fork(), q + 1).ldelim();
                    return writer;
                };

                /**
                 * Encodes the specified Le message, length delimited. Does not implicitly {@link osp.v1.Predicate.Le.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof osp.v1.Predicate.Le
                 * @static
                 * @param {osp.v1.Predicate.ILe} message Le message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Le.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
                };

                /**
                 * Decodes a Le message from the specified reader or buffer.
                 * @function decode
                 * @memberof osp.v1.Predicate.Le
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {osp.v1.Predicate.Le} Le
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Le.decode = function decode(reader, length, error, long) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    if (long === undefined)
                        long = 0;
                    if (long > $Reader.recursionLimit)
                        throw Error("maximum nesting depth exceeded");
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.osp.v1.Predicate.Le();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        if (tag === error)
                            break;
                        switch (tag >>> 3) {
                        case 1: {
                                message.field = reader.string();
                                break;
                            }
                        case 2: {
                                message.value = $root.osp.v1.Value.decode(reader, reader.uint32(), undefined, long + 1);
                                break;
                            }
                        default:
                            reader.skipType(tag & 7, long);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a Le message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof osp.v1.Predicate.Le
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {osp.v1.Predicate.Le} Le
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Le.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a Le message.
                 * @function verify
                 * @memberof osp.v1.Predicate.Le
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Le.verify = function verify(message, long) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (long === undefined)
                        long = 0;
                    if (long > $util.recursionLimit)
                        return "maximum nesting depth exceeded";
                    if (message.field != null && Object.hasOwnProperty.call(message, "field"))
                        if (!$util.isString(message.field))
                            return "field: string expected";
                    if (message.value != null && Object.hasOwnProperty.call(message, "value")) {
                        var error = $root.osp.v1.Value.verify(message.value, long + 1);
                        if (error)
                            return "value." + error;
                    }
                    return null;
                };

                /**
                 * Creates a Le message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof osp.v1.Predicate.Le
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {osp.v1.Predicate.Le} Le
                 */
                Le.fromObject = function fromObject(object, long) {
                    if (object instanceof $root.osp.v1.Predicate.Le)
                        return object;
                    if (!$util.isObject(object))
                        throw TypeError(".osp.v1.Predicate.Le: object expected");
                    if (long === undefined)
                        long = 0;
                    if (long > $util.recursionLimit)
                        throw Error("maximum nesting depth exceeded");
                    var message = new $root.osp.v1.Predicate.Le();
                    if (object.field != null)
                        message.field = String(object.field);
                    if (object.value != null) {
                        if (!$util.isObject(object.value))
                            throw TypeError(".osp.v1.Predicate.Le.value: object expected");
                        message.value = $root.osp.v1.Value.fromObject(object.value, long + 1);
                    }
                    return message;
                };

                /**
                 * Creates a plain object from a Le message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof osp.v1.Predicate.Le
                 * @static
                 * @param {osp.v1.Predicate.Le} message Le
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Le.toObject = function toObject(message, options, q) {
                    if (!options)
                        options = {};
                    if (q === undefined)
                        q = 0;
                    if (q > $util.recursionLimit)
                        throw Error("max depth exceeded");
                    var object = {};
                    if (options.defaults) {
                        object.field = "";
                        object.value = null;
                    }
                    if (message.field != null && Object.hasOwnProperty.call(message, "field"))
                        object.field = message.field;
                    if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                        object.value = $root.osp.v1.Value.toObject(message.value, options, q + 1);
                    return object;
                };

                /**
                 * Converts this Le to JSON.
                 * @function toJSON
                 * @memberof osp.v1.Predicate.Le
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Le.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                /**
                 * Gets the default type url for Le
                 * @function getTypeUrl
                 * @memberof osp.v1.Predicate.Le
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                Le.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/osp.v1.Predicate.Le";
                };

                return Le;
            })();

            Predicate.Gt = (function() {

                /**
                 * Properties of a Gt.
                 * @memberof osp.v1.Predicate
                 * @interface IGt
                 * @property {string|null} [field] Gt field
                 * @property {osp.v1.IValue|null} [value] Gt value
                 */

                /**
                 * Constructs a new Gt.
                 * @memberof osp.v1.Predicate
                 * @classdesc Represents a Gt.
                 * @implements IGt
                 * @constructor
                 * @param {osp.v1.Predicate.IGt=} [properties] Properties to set
                 */
                function Gt(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * Gt field.
                 * @member {string} field
                 * @memberof osp.v1.Predicate.Gt
                 * @instance
                 */
                Gt.prototype.field = "";

                /**
                 * Gt value.
                 * @member {osp.v1.IValue|null|undefined} value
                 * @memberof osp.v1.Predicate.Gt
                 * @instance
                 */
                Gt.prototype.value = null;

                /**
                 * Creates a new Gt instance using the specified properties.
                 * @function create
                 * @memberof osp.v1.Predicate.Gt
                 * @static
                 * @param {osp.v1.Predicate.IGt=} [properties] Properties to set
                 * @returns {osp.v1.Predicate.Gt} Gt instance
                 */
                Gt.create = function create(properties) {
                    return new Gt(properties);
                };

                /**
                 * Encodes the specified Gt message. Does not implicitly {@link osp.v1.Predicate.Gt.verify|verify} messages.
                 * @function encode
                 * @memberof osp.v1.Predicate.Gt
                 * @static
                 * @param {osp.v1.Predicate.IGt} message Gt message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Gt.encode = function encode(message, writer, q) {
                    if (!writer)
                        writer = $Writer.create();
                    if (q === undefined)
                        q = 0;
                    if (q > $util.recursionLimit)
                        throw Error("max depth exceeded");
                    if (message.field != null && Object.hasOwnProperty.call(message, "field"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.field);
                    if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                        $root.osp.v1.Value.encode(message.value, writer.uint32(/* id 2, wireType 2 =*/18).fork(), q + 1).ldelim();
                    return writer;
                };

                /**
                 * Encodes the specified Gt message, length delimited. Does not implicitly {@link osp.v1.Predicate.Gt.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof osp.v1.Predicate.Gt
                 * @static
                 * @param {osp.v1.Predicate.IGt} message Gt message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Gt.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
                };

                /**
                 * Decodes a Gt message from the specified reader or buffer.
                 * @function decode
                 * @memberof osp.v1.Predicate.Gt
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {osp.v1.Predicate.Gt} Gt
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Gt.decode = function decode(reader, length, error, long) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    if (long === undefined)
                        long = 0;
                    if (long > $Reader.recursionLimit)
                        throw Error("maximum nesting depth exceeded");
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.osp.v1.Predicate.Gt();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        if (tag === error)
                            break;
                        switch (tag >>> 3) {
                        case 1: {
                                message.field = reader.string();
                                break;
                            }
                        case 2: {
                                message.value = $root.osp.v1.Value.decode(reader, reader.uint32(), undefined, long + 1);
                                break;
                            }
                        default:
                            reader.skipType(tag & 7, long);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a Gt message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof osp.v1.Predicate.Gt
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {osp.v1.Predicate.Gt} Gt
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Gt.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a Gt message.
                 * @function verify
                 * @memberof osp.v1.Predicate.Gt
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Gt.verify = function verify(message, long) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (long === undefined)
                        long = 0;
                    if (long > $util.recursionLimit)
                        return "maximum nesting depth exceeded";
                    if (message.field != null && Object.hasOwnProperty.call(message, "field"))
                        if (!$util.isString(message.field))
                            return "field: string expected";
                    if (message.value != null && Object.hasOwnProperty.call(message, "value")) {
                        var error = $root.osp.v1.Value.verify(message.value, long + 1);
                        if (error)
                            return "value." + error;
                    }
                    return null;
                };

                /**
                 * Creates a Gt message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof osp.v1.Predicate.Gt
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {osp.v1.Predicate.Gt} Gt
                 */
                Gt.fromObject = function fromObject(object, long) {
                    if (object instanceof $root.osp.v1.Predicate.Gt)
                        return object;
                    if (!$util.isObject(object))
                        throw TypeError(".osp.v1.Predicate.Gt: object expected");
                    if (long === undefined)
                        long = 0;
                    if (long > $util.recursionLimit)
                        throw Error("maximum nesting depth exceeded");
                    var message = new $root.osp.v1.Predicate.Gt();
                    if (object.field != null)
                        message.field = String(object.field);
                    if (object.value != null) {
                        if (!$util.isObject(object.value))
                            throw TypeError(".osp.v1.Predicate.Gt.value: object expected");
                        message.value = $root.osp.v1.Value.fromObject(object.value, long + 1);
                    }
                    return message;
                };

                /**
                 * Creates a plain object from a Gt message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof osp.v1.Predicate.Gt
                 * @static
                 * @param {osp.v1.Predicate.Gt} message Gt
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Gt.toObject = function toObject(message, options, q) {
                    if (!options)
                        options = {};
                    if (q === undefined)
                        q = 0;
                    if (q > $util.recursionLimit)
                        throw Error("max depth exceeded");
                    var object = {};
                    if (options.defaults) {
                        object.field = "";
                        object.value = null;
                    }
                    if (message.field != null && Object.hasOwnProperty.call(message, "field"))
                        object.field = message.field;
                    if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                        object.value = $root.osp.v1.Value.toObject(message.value, options, q + 1);
                    return object;
                };

                /**
                 * Converts this Gt to JSON.
                 * @function toJSON
                 * @memberof osp.v1.Predicate.Gt
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Gt.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                /**
                 * Gets the default type url for Gt
                 * @function getTypeUrl
                 * @memberof osp.v1.Predicate.Gt
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                Gt.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/osp.v1.Predicate.Gt";
                };

                return Gt;
            })();

            Predicate.Ge = (function() {

                /**
                 * Properties of a Ge.
                 * @memberof osp.v1.Predicate
                 * @interface IGe
                 * @property {string|null} [field] Ge field
                 * @property {osp.v1.IValue|null} [value] Ge value
                 */

                /**
                 * Constructs a new Ge.
                 * @memberof osp.v1.Predicate
                 * @classdesc Represents a Ge.
                 * @implements IGe
                 * @constructor
                 * @param {osp.v1.Predicate.IGe=} [properties] Properties to set
                 */
                function Ge(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * Ge field.
                 * @member {string} field
                 * @memberof osp.v1.Predicate.Ge
                 * @instance
                 */
                Ge.prototype.field = "";

                /**
                 * Ge value.
                 * @member {osp.v1.IValue|null|undefined} value
                 * @memberof osp.v1.Predicate.Ge
                 * @instance
                 */
                Ge.prototype.value = null;

                /**
                 * Creates a new Ge instance using the specified properties.
                 * @function create
                 * @memberof osp.v1.Predicate.Ge
                 * @static
                 * @param {osp.v1.Predicate.IGe=} [properties] Properties to set
                 * @returns {osp.v1.Predicate.Ge} Ge instance
                 */
                Ge.create = function create(properties) {
                    return new Ge(properties);
                };

                /**
                 * Encodes the specified Ge message. Does not implicitly {@link osp.v1.Predicate.Ge.verify|verify} messages.
                 * @function encode
                 * @memberof osp.v1.Predicate.Ge
                 * @static
                 * @param {osp.v1.Predicate.IGe} message Ge message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Ge.encode = function encode(message, writer, q) {
                    if (!writer)
                        writer = $Writer.create();
                    if (q === undefined)
                        q = 0;
                    if (q > $util.recursionLimit)
                        throw Error("max depth exceeded");
                    if (message.field != null && Object.hasOwnProperty.call(message, "field"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.field);
                    if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                        $root.osp.v1.Value.encode(message.value, writer.uint32(/* id 2, wireType 2 =*/18).fork(), q + 1).ldelim();
                    return writer;
                };

                /**
                 * Encodes the specified Ge message, length delimited. Does not implicitly {@link osp.v1.Predicate.Ge.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof osp.v1.Predicate.Ge
                 * @static
                 * @param {osp.v1.Predicate.IGe} message Ge message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Ge.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
                };

                /**
                 * Decodes a Ge message from the specified reader or buffer.
                 * @function decode
                 * @memberof osp.v1.Predicate.Ge
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {osp.v1.Predicate.Ge} Ge
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Ge.decode = function decode(reader, length, error, long) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    if (long === undefined)
                        long = 0;
                    if (long > $Reader.recursionLimit)
                        throw Error("maximum nesting depth exceeded");
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.osp.v1.Predicate.Ge();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        if (tag === error)
                            break;
                        switch (tag >>> 3) {
                        case 1: {
                                message.field = reader.string();
                                break;
                            }
                        case 2: {
                                message.value = $root.osp.v1.Value.decode(reader, reader.uint32(), undefined, long + 1);
                                break;
                            }
                        default:
                            reader.skipType(tag & 7, long);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a Ge message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof osp.v1.Predicate.Ge
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {osp.v1.Predicate.Ge} Ge
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Ge.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a Ge message.
                 * @function verify
                 * @memberof osp.v1.Predicate.Ge
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Ge.verify = function verify(message, long) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (long === undefined)
                        long = 0;
                    if (long > $util.recursionLimit)
                        return "maximum nesting depth exceeded";
                    if (message.field != null && Object.hasOwnProperty.call(message, "field"))
                        if (!$util.isString(message.field))
                            return "field: string expected";
                    if (message.value != null && Object.hasOwnProperty.call(message, "value")) {
                        var error = $root.osp.v1.Value.verify(message.value, long + 1);
                        if (error)
                            return "value." + error;
                    }
                    return null;
                };

                /**
                 * Creates a Ge message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof osp.v1.Predicate.Ge
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {osp.v1.Predicate.Ge} Ge
                 */
                Ge.fromObject = function fromObject(object, long) {
                    if (object instanceof $root.osp.v1.Predicate.Ge)
                        return object;
                    if (!$util.isObject(object))
                        throw TypeError(".osp.v1.Predicate.Ge: object expected");
                    if (long === undefined)
                        long = 0;
                    if (long > $util.recursionLimit)
                        throw Error("maximum nesting depth exceeded");
                    var message = new $root.osp.v1.Predicate.Ge();
                    if (object.field != null)
                        message.field = String(object.field);
                    if (object.value != null) {
                        if (!$util.isObject(object.value))
                            throw TypeError(".osp.v1.Predicate.Ge.value: object expected");
                        message.value = $root.osp.v1.Value.fromObject(object.value, long + 1);
                    }
                    return message;
                };

                /**
                 * Creates a plain object from a Ge message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof osp.v1.Predicate.Ge
                 * @static
                 * @param {osp.v1.Predicate.Ge} message Ge
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Ge.toObject = function toObject(message, options, q) {
                    if (!options)
                        options = {};
                    if (q === undefined)
                        q = 0;
                    if (q > $util.recursionLimit)
                        throw Error("max depth exceeded");
                    var object = {};
                    if (options.defaults) {
                        object.field = "";
                        object.value = null;
                    }
                    if (message.field != null && Object.hasOwnProperty.call(message, "field"))
                        object.field = message.field;
                    if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                        object.value = $root.osp.v1.Value.toObject(message.value, options, q + 1);
                    return object;
                };

                /**
                 * Converts this Ge to JSON.
                 * @function toJSON
                 * @memberof osp.v1.Predicate.Ge
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Ge.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                /**
                 * Gets the default type url for Ge
                 * @function getTypeUrl
                 * @memberof osp.v1.Predicate.Ge
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                Ge.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/osp.v1.Predicate.Ge";
                };

                return Ge;
            })();

            Predicate.InExpr = (function() {

                /**
                 * Properties of an InExpr.
                 * @memberof osp.v1.Predicate
                 * @interface IInExpr
                 * @property {string|null} [field] InExpr field
                 * @property {Array.<osp.v1.IValue>|null} [values] InExpr values
                 */

                /**
                 * Constructs a new InExpr.
                 * @memberof osp.v1.Predicate
                 * @classdesc Represents an InExpr.
                 * @implements IInExpr
                 * @constructor
                 * @param {osp.v1.Predicate.IInExpr=} [properties] Properties to set
                 */
                function InExpr(properties) {
                    this.values = [];
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * InExpr field.
                 * @member {string} field
                 * @memberof osp.v1.Predicate.InExpr
                 * @instance
                 */
                InExpr.prototype.field = "";

                /**
                 * InExpr values.
                 * @member {Array.<osp.v1.IValue>} values
                 * @memberof osp.v1.Predicate.InExpr
                 * @instance
                 */
                InExpr.prototype.values = $util.emptyArray;

                /**
                 * Creates a new InExpr instance using the specified properties.
                 * @function create
                 * @memberof osp.v1.Predicate.InExpr
                 * @static
                 * @param {osp.v1.Predicate.IInExpr=} [properties] Properties to set
                 * @returns {osp.v1.Predicate.InExpr} InExpr instance
                 */
                InExpr.create = function create(properties) {
                    return new InExpr(properties);
                };

                /**
                 * Encodes the specified InExpr message. Does not implicitly {@link osp.v1.Predicate.InExpr.verify|verify} messages.
                 * @function encode
                 * @memberof osp.v1.Predicate.InExpr
                 * @static
                 * @param {osp.v1.Predicate.IInExpr} message InExpr message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                InExpr.encode = function encode(message, writer, q) {
                    if (!writer)
                        writer = $Writer.create();
                    if (q === undefined)
                        q = 0;
                    if (q > $util.recursionLimit)
                        throw Error("max depth exceeded");
                    if (message.field != null && Object.hasOwnProperty.call(message, "field"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.field);
                    if (message.values != null && message.values.length)
                        for (var i = 0; i < message.values.length; ++i)
                            $root.osp.v1.Value.encode(message.values[i], writer.uint32(/* id 2, wireType 2 =*/18).fork(), q + 1).ldelim();
                    return writer;
                };

                /**
                 * Encodes the specified InExpr message, length delimited. Does not implicitly {@link osp.v1.Predicate.InExpr.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof osp.v1.Predicate.InExpr
                 * @static
                 * @param {osp.v1.Predicate.IInExpr} message InExpr message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                InExpr.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
                };

                /**
                 * Decodes an InExpr message from the specified reader or buffer.
                 * @function decode
                 * @memberof osp.v1.Predicate.InExpr
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {osp.v1.Predicate.InExpr} InExpr
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                InExpr.decode = function decode(reader, length, error, long) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    if (long === undefined)
                        long = 0;
                    if (long > $Reader.recursionLimit)
                        throw Error("maximum nesting depth exceeded");
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.osp.v1.Predicate.InExpr();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        if (tag === error)
                            break;
                        switch (tag >>> 3) {
                        case 1: {
                                message.field = reader.string();
                                break;
                            }
                        case 2: {
                                if (!(message.values && message.values.length))
                                    message.values = [];
                                message.values.push($root.osp.v1.Value.decode(reader, reader.uint32(), undefined, long + 1));
                                break;
                            }
                        default:
                            reader.skipType(tag & 7, long);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes an InExpr message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof osp.v1.Predicate.InExpr
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {osp.v1.Predicate.InExpr} InExpr
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                InExpr.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies an InExpr message.
                 * @function verify
                 * @memberof osp.v1.Predicate.InExpr
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                InExpr.verify = function verify(message, long) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (long === undefined)
                        long = 0;
                    if (long > $util.recursionLimit)
                        return "maximum nesting depth exceeded";
                    if (message.field != null && Object.hasOwnProperty.call(message, "field"))
                        if (!$util.isString(message.field))
                            return "field: string expected";
                    if (message.values != null && Object.hasOwnProperty.call(message, "values")) {
                        if (!Array.isArray(message.values))
                            return "values: array expected";
                        for (var i = 0; i < message.values.length; ++i) {
                            var error = $root.osp.v1.Value.verify(message.values[i], long + 1);
                            if (error)
                                return "values." + error;
                        }
                    }
                    return null;
                };

                /**
                 * Creates an InExpr message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof osp.v1.Predicate.InExpr
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {osp.v1.Predicate.InExpr} InExpr
                 */
                InExpr.fromObject = function fromObject(object, long) {
                    if (object instanceof $root.osp.v1.Predicate.InExpr)
                        return object;
                    if (!$util.isObject(object))
                        throw TypeError(".osp.v1.Predicate.InExpr: object expected");
                    if (long === undefined)
                        long = 0;
                    if (long > $util.recursionLimit)
                        throw Error("maximum nesting depth exceeded");
                    var message = new $root.osp.v1.Predicate.InExpr();
                    if (object.field != null)
                        message.field = String(object.field);
                    if (object.values) {
                        if (!Array.isArray(object.values))
                            throw TypeError(".osp.v1.Predicate.InExpr.values: array expected");
                        message.values = [];
                        for (var i = 0; i < object.values.length; ++i) {
                            if (!$util.isObject(object.values[i]))
                                throw TypeError(".osp.v1.Predicate.InExpr.values: object expected");
                            message.values[i] = $root.osp.v1.Value.fromObject(object.values[i], long + 1);
                        }
                    }
                    return message;
                };

                /**
                 * Creates a plain object from an InExpr message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof osp.v1.Predicate.InExpr
                 * @static
                 * @param {osp.v1.Predicate.InExpr} message InExpr
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                InExpr.toObject = function toObject(message, options, q) {
                    if (!options)
                        options = {};
                    if (q === undefined)
                        q = 0;
                    if (q > $util.recursionLimit)
                        throw Error("max depth exceeded");
                    var object = {};
                    if (options.arrays || options.defaults)
                        object.values = [];
                    if (options.defaults)
                        object.field = "";
                    if (message.field != null && Object.hasOwnProperty.call(message, "field"))
                        object.field = message.field;
                    if (message.values && message.values.length) {
                        object.values = [];
                        for (var j = 0; j < message.values.length; ++j)
                            object.values[j] = $root.osp.v1.Value.toObject(message.values[j], options, q + 1);
                    }
                    return object;
                };

                /**
                 * Converts this InExpr to JSON.
                 * @function toJSON
                 * @memberof osp.v1.Predicate.InExpr
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                InExpr.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                /**
                 * Gets the default type url for InExpr
                 * @function getTypeUrl
                 * @memberof osp.v1.Predicate.InExpr
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                InExpr.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/osp.v1.Predicate.InExpr";
                };

                return InExpr;
            })();

            Predicate.AndExpr = (function() {

                /**
                 * Properties of an AndExpr.
                 * @memberof osp.v1.Predicate
                 * @interface IAndExpr
                 * @property {Array.<osp.v1.IPredicate>|null} [children] AndExpr children
                 */

                /**
                 * Constructs a new AndExpr.
                 * @memberof osp.v1.Predicate
                 * @classdesc Represents an AndExpr.
                 * @implements IAndExpr
                 * @constructor
                 * @param {osp.v1.Predicate.IAndExpr=} [properties] Properties to set
                 */
                function AndExpr(properties) {
                    this.children = [];
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * AndExpr children.
                 * @member {Array.<osp.v1.IPredicate>} children
                 * @memberof osp.v1.Predicate.AndExpr
                 * @instance
                 */
                AndExpr.prototype.children = $util.emptyArray;

                /**
                 * Creates a new AndExpr instance using the specified properties.
                 * @function create
                 * @memberof osp.v1.Predicate.AndExpr
                 * @static
                 * @param {osp.v1.Predicate.IAndExpr=} [properties] Properties to set
                 * @returns {osp.v1.Predicate.AndExpr} AndExpr instance
                 */
                AndExpr.create = function create(properties) {
                    return new AndExpr(properties);
                };

                /**
                 * Encodes the specified AndExpr message. Does not implicitly {@link osp.v1.Predicate.AndExpr.verify|verify} messages.
                 * @function encode
                 * @memberof osp.v1.Predicate.AndExpr
                 * @static
                 * @param {osp.v1.Predicate.IAndExpr} message AndExpr message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                AndExpr.encode = function encode(message, writer, q) {
                    if (!writer)
                        writer = $Writer.create();
                    if (q === undefined)
                        q = 0;
                    if (q > $util.recursionLimit)
                        throw Error("max depth exceeded");
                    if (message.children != null && message.children.length)
                        for (var i = 0; i < message.children.length; ++i)
                            $root.osp.v1.Predicate.encode(message.children[i], writer.uint32(/* id 1, wireType 2 =*/10).fork(), q + 1).ldelim();
                    return writer;
                };

                /**
                 * Encodes the specified AndExpr message, length delimited. Does not implicitly {@link osp.v1.Predicate.AndExpr.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof osp.v1.Predicate.AndExpr
                 * @static
                 * @param {osp.v1.Predicate.IAndExpr} message AndExpr message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                AndExpr.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
                };

                /**
                 * Decodes an AndExpr message from the specified reader or buffer.
                 * @function decode
                 * @memberof osp.v1.Predicate.AndExpr
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {osp.v1.Predicate.AndExpr} AndExpr
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                AndExpr.decode = function decode(reader, length, error, long) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    if (long === undefined)
                        long = 0;
                    if (long > $Reader.recursionLimit)
                        throw Error("maximum nesting depth exceeded");
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.osp.v1.Predicate.AndExpr();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        if (tag === error)
                            break;
                        switch (tag >>> 3) {
                        case 1: {
                                if (!(message.children && message.children.length))
                                    message.children = [];
                                message.children.push($root.osp.v1.Predicate.decode(reader, reader.uint32(), undefined, long + 1));
                                break;
                            }
                        default:
                            reader.skipType(tag & 7, long);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes an AndExpr message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof osp.v1.Predicate.AndExpr
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {osp.v1.Predicate.AndExpr} AndExpr
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                AndExpr.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies an AndExpr message.
                 * @function verify
                 * @memberof osp.v1.Predicate.AndExpr
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                AndExpr.verify = function verify(message, long) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (long === undefined)
                        long = 0;
                    if (long > $util.recursionLimit)
                        return "maximum nesting depth exceeded";
                    if (message.children != null && Object.hasOwnProperty.call(message, "children")) {
                        if (!Array.isArray(message.children))
                            return "children: array expected";
                        for (var i = 0; i < message.children.length; ++i) {
                            var error = $root.osp.v1.Predicate.verify(message.children[i], long + 1);
                            if (error)
                                return "children." + error;
                        }
                    }
                    return null;
                };

                /**
                 * Creates an AndExpr message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof osp.v1.Predicate.AndExpr
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {osp.v1.Predicate.AndExpr} AndExpr
                 */
                AndExpr.fromObject = function fromObject(object, long) {
                    if (object instanceof $root.osp.v1.Predicate.AndExpr)
                        return object;
                    if (!$util.isObject(object))
                        throw TypeError(".osp.v1.Predicate.AndExpr: object expected");
                    if (long === undefined)
                        long = 0;
                    if (long > $util.recursionLimit)
                        throw Error("maximum nesting depth exceeded");
                    var message = new $root.osp.v1.Predicate.AndExpr();
                    if (object.children) {
                        if (!Array.isArray(object.children))
                            throw TypeError(".osp.v1.Predicate.AndExpr.children: array expected");
                        message.children = [];
                        for (var i = 0; i < object.children.length; ++i) {
                            if (!$util.isObject(object.children[i]))
                                throw TypeError(".osp.v1.Predicate.AndExpr.children: object expected");
                            message.children[i] = $root.osp.v1.Predicate.fromObject(object.children[i], long + 1);
                        }
                    }
                    return message;
                };

                /**
                 * Creates a plain object from an AndExpr message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof osp.v1.Predicate.AndExpr
                 * @static
                 * @param {osp.v1.Predicate.AndExpr} message AndExpr
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                AndExpr.toObject = function toObject(message, options, q) {
                    if (!options)
                        options = {};
                    if (q === undefined)
                        q = 0;
                    if (q > $util.recursionLimit)
                        throw Error("max depth exceeded");
                    var object = {};
                    if (options.arrays || options.defaults)
                        object.children = [];
                    if (message.children && message.children.length) {
                        object.children = [];
                        for (var j = 0; j < message.children.length; ++j)
                            object.children[j] = $root.osp.v1.Predicate.toObject(message.children[j], options, q + 1);
                    }
                    return object;
                };

                /**
                 * Converts this AndExpr to JSON.
                 * @function toJSON
                 * @memberof osp.v1.Predicate.AndExpr
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                AndExpr.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                /**
                 * Gets the default type url for AndExpr
                 * @function getTypeUrl
                 * @memberof osp.v1.Predicate.AndExpr
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                AndExpr.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/osp.v1.Predicate.AndExpr";
                };

                return AndExpr;
            })();

            Predicate.OrExpr = (function() {

                /**
                 * Properties of an OrExpr.
                 * @memberof osp.v1.Predicate
                 * @interface IOrExpr
                 * @property {Array.<osp.v1.IPredicate>|null} [children] OrExpr children
                 */

                /**
                 * Constructs a new OrExpr.
                 * @memberof osp.v1.Predicate
                 * @classdesc Represents an OrExpr.
                 * @implements IOrExpr
                 * @constructor
                 * @param {osp.v1.Predicate.IOrExpr=} [properties] Properties to set
                 */
                function OrExpr(properties) {
                    this.children = [];
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * OrExpr children.
                 * @member {Array.<osp.v1.IPredicate>} children
                 * @memberof osp.v1.Predicate.OrExpr
                 * @instance
                 */
                OrExpr.prototype.children = $util.emptyArray;

                /**
                 * Creates a new OrExpr instance using the specified properties.
                 * @function create
                 * @memberof osp.v1.Predicate.OrExpr
                 * @static
                 * @param {osp.v1.Predicate.IOrExpr=} [properties] Properties to set
                 * @returns {osp.v1.Predicate.OrExpr} OrExpr instance
                 */
                OrExpr.create = function create(properties) {
                    return new OrExpr(properties);
                };

                /**
                 * Encodes the specified OrExpr message. Does not implicitly {@link osp.v1.Predicate.OrExpr.verify|verify} messages.
                 * @function encode
                 * @memberof osp.v1.Predicate.OrExpr
                 * @static
                 * @param {osp.v1.Predicate.IOrExpr} message OrExpr message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                OrExpr.encode = function encode(message, writer, q) {
                    if (!writer)
                        writer = $Writer.create();
                    if (q === undefined)
                        q = 0;
                    if (q > $util.recursionLimit)
                        throw Error("max depth exceeded");
                    if (message.children != null && message.children.length)
                        for (var i = 0; i < message.children.length; ++i)
                            $root.osp.v1.Predicate.encode(message.children[i], writer.uint32(/* id 1, wireType 2 =*/10).fork(), q + 1).ldelim();
                    return writer;
                };

                /**
                 * Encodes the specified OrExpr message, length delimited. Does not implicitly {@link osp.v1.Predicate.OrExpr.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof osp.v1.Predicate.OrExpr
                 * @static
                 * @param {osp.v1.Predicate.IOrExpr} message OrExpr message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                OrExpr.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
                };

                /**
                 * Decodes an OrExpr message from the specified reader or buffer.
                 * @function decode
                 * @memberof osp.v1.Predicate.OrExpr
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {osp.v1.Predicate.OrExpr} OrExpr
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                OrExpr.decode = function decode(reader, length, error, long) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    if (long === undefined)
                        long = 0;
                    if (long > $Reader.recursionLimit)
                        throw Error("maximum nesting depth exceeded");
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.osp.v1.Predicate.OrExpr();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        if (tag === error)
                            break;
                        switch (tag >>> 3) {
                        case 1: {
                                if (!(message.children && message.children.length))
                                    message.children = [];
                                message.children.push($root.osp.v1.Predicate.decode(reader, reader.uint32(), undefined, long + 1));
                                break;
                            }
                        default:
                            reader.skipType(tag & 7, long);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes an OrExpr message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof osp.v1.Predicate.OrExpr
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {osp.v1.Predicate.OrExpr} OrExpr
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                OrExpr.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies an OrExpr message.
                 * @function verify
                 * @memberof osp.v1.Predicate.OrExpr
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                OrExpr.verify = function verify(message, long) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (long === undefined)
                        long = 0;
                    if (long > $util.recursionLimit)
                        return "maximum nesting depth exceeded";
                    if (message.children != null && Object.hasOwnProperty.call(message, "children")) {
                        if (!Array.isArray(message.children))
                            return "children: array expected";
                        for (var i = 0; i < message.children.length; ++i) {
                            var error = $root.osp.v1.Predicate.verify(message.children[i], long + 1);
                            if (error)
                                return "children." + error;
                        }
                    }
                    return null;
                };

                /**
                 * Creates an OrExpr message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof osp.v1.Predicate.OrExpr
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {osp.v1.Predicate.OrExpr} OrExpr
                 */
                OrExpr.fromObject = function fromObject(object, long) {
                    if (object instanceof $root.osp.v1.Predicate.OrExpr)
                        return object;
                    if (!$util.isObject(object))
                        throw TypeError(".osp.v1.Predicate.OrExpr: object expected");
                    if (long === undefined)
                        long = 0;
                    if (long > $util.recursionLimit)
                        throw Error("maximum nesting depth exceeded");
                    var message = new $root.osp.v1.Predicate.OrExpr();
                    if (object.children) {
                        if (!Array.isArray(object.children))
                            throw TypeError(".osp.v1.Predicate.OrExpr.children: array expected");
                        message.children = [];
                        for (var i = 0; i < object.children.length; ++i) {
                            if (!$util.isObject(object.children[i]))
                                throw TypeError(".osp.v1.Predicate.OrExpr.children: object expected");
                            message.children[i] = $root.osp.v1.Predicate.fromObject(object.children[i], long + 1);
                        }
                    }
                    return message;
                };

                /**
                 * Creates a plain object from an OrExpr message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof osp.v1.Predicate.OrExpr
                 * @static
                 * @param {osp.v1.Predicate.OrExpr} message OrExpr
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                OrExpr.toObject = function toObject(message, options, q) {
                    if (!options)
                        options = {};
                    if (q === undefined)
                        q = 0;
                    if (q > $util.recursionLimit)
                        throw Error("max depth exceeded");
                    var object = {};
                    if (options.arrays || options.defaults)
                        object.children = [];
                    if (message.children && message.children.length) {
                        object.children = [];
                        for (var j = 0; j < message.children.length; ++j)
                            object.children[j] = $root.osp.v1.Predicate.toObject(message.children[j], options, q + 1);
                    }
                    return object;
                };

                /**
                 * Converts this OrExpr to JSON.
                 * @function toJSON
                 * @memberof osp.v1.Predicate.OrExpr
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                OrExpr.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                /**
                 * Gets the default type url for OrExpr
                 * @function getTypeUrl
                 * @memberof osp.v1.Predicate.OrExpr
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                OrExpr.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/osp.v1.Predicate.OrExpr";
                };

                return OrExpr;
            })();

            Predicate.NotExpr = (function() {

                /**
                 * Properties of a NotExpr.
                 * @memberof osp.v1.Predicate
                 * @interface INotExpr
                 * @property {osp.v1.IPredicate|null} [child] NotExpr child
                 */

                /**
                 * Constructs a new NotExpr.
                 * @memberof osp.v1.Predicate
                 * @classdesc Represents a NotExpr.
                 * @implements INotExpr
                 * @constructor
                 * @param {osp.v1.Predicate.INotExpr=} [properties] Properties to set
                 */
                function NotExpr(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * NotExpr child.
                 * @member {osp.v1.IPredicate|null|undefined} child
                 * @memberof osp.v1.Predicate.NotExpr
                 * @instance
                 */
                NotExpr.prototype.child = null;

                /**
                 * Creates a new NotExpr instance using the specified properties.
                 * @function create
                 * @memberof osp.v1.Predicate.NotExpr
                 * @static
                 * @param {osp.v1.Predicate.INotExpr=} [properties] Properties to set
                 * @returns {osp.v1.Predicate.NotExpr} NotExpr instance
                 */
                NotExpr.create = function create(properties) {
                    return new NotExpr(properties);
                };

                /**
                 * Encodes the specified NotExpr message. Does not implicitly {@link osp.v1.Predicate.NotExpr.verify|verify} messages.
                 * @function encode
                 * @memberof osp.v1.Predicate.NotExpr
                 * @static
                 * @param {osp.v1.Predicate.INotExpr} message NotExpr message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                NotExpr.encode = function encode(message, writer, q) {
                    if (!writer)
                        writer = $Writer.create();
                    if (q === undefined)
                        q = 0;
                    if (q > $util.recursionLimit)
                        throw Error("max depth exceeded");
                    if (message.child != null && Object.hasOwnProperty.call(message, "child"))
                        $root.osp.v1.Predicate.encode(message.child, writer.uint32(/* id 1, wireType 2 =*/10).fork(), q + 1).ldelim();
                    return writer;
                };

                /**
                 * Encodes the specified NotExpr message, length delimited. Does not implicitly {@link osp.v1.Predicate.NotExpr.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof osp.v1.Predicate.NotExpr
                 * @static
                 * @param {osp.v1.Predicate.INotExpr} message NotExpr message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                NotExpr.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
                };

                /**
                 * Decodes a NotExpr message from the specified reader or buffer.
                 * @function decode
                 * @memberof osp.v1.Predicate.NotExpr
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {osp.v1.Predicate.NotExpr} NotExpr
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                NotExpr.decode = function decode(reader, length, error, long) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    if (long === undefined)
                        long = 0;
                    if (long > $Reader.recursionLimit)
                        throw Error("maximum nesting depth exceeded");
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.osp.v1.Predicate.NotExpr();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        if (tag === error)
                            break;
                        switch (tag >>> 3) {
                        case 1: {
                                message.child = $root.osp.v1.Predicate.decode(reader, reader.uint32(), undefined, long + 1);
                                break;
                            }
                        default:
                            reader.skipType(tag & 7, long);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a NotExpr message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof osp.v1.Predicate.NotExpr
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {osp.v1.Predicate.NotExpr} NotExpr
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                NotExpr.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a NotExpr message.
                 * @function verify
                 * @memberof osp.v1.Predicate.NotExpr
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                NotExpr.verify = function verify(message, long) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (long === undefined)
                        long = 0;
                    if (long > $util.recursionLimit)
                        return "maximum nesting depth exceeded";
                    if (message.child != null && Object.hasOwnProperty.call(message, "child")) {
                        var error = $root.osp.v1.Predicate.verify(message.child, long + 1);
                        if (error)
                            return "child." + error;
                    }
                    return null;
                };

                /**
                 * Creates a NotExpr message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof osp.v1.Predicate.NotExpr
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {osp.v1.Predicate.NotExpr} NotExpr
                 */
                NotExpr.fromObject = function fromObject(object, long) {
                    if (object instanceof $root.osp.v1.Predicate.NotExpr)
                        return object;
                    if (!$util.isObject(object))
                        throw TypeError(".osp.v1.Predicate.NotExpr: object expected");
                    if (long === undefined)
                        long = 0;
                    if (long > $util.recursionLimit)
                        throw Error("maximum nesting depth exceeded");
                    var message = new $root.osp.v1.Predicate.NotExpr();
                    if (object.child != null) {
                        if (!$util.isObject(object.child))
                            throw TypeError(".osp.v1.Predicate.NotExpr.child: object expected");
                        message.child = $root.osp.v1.Predicate.fromObject(object.child, long + 1);
                    }
                    return message;
                };

                /**
                 * Creates a plain object from a NotExpr message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof osp.v1.Predicate.NotExpr
                 * @static
                 * @param {osp.v1.Predicate.NotExpr} message NotExpr
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                NotExpr.toObject = function toObject(message, options, q) {
                    if (!options)
                        options = {};
                    if (q === undefined)
                        q = 0;
                    if (q > $util.recursionLimit)
                        throw Error("max depth exceeded");
                    var object = {};
                    if (options.defaults)
                        object.child = null;
                    if (message.child != null && Object.hasOwnProperty.call(message, "child"))
                        object.child = $root.osp.v1.Predicate.toObject(message.child, options, q + 1);
                    return object;
                };

                /**
                 * Converts this NotExpr to JSON.
                 * @function toJSON
                 * @memberof osp.v1.Predicate.NotExpr
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                NotExpr.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                /**
                 * Gets the default type url for NotExpr
                 * @function getTypeUrl
                 * @memberof osp.v1.Predicate.NotExpr
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                NotExpr.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/osp.v1.Predicate.NotExpr";
                };

                return NotExpr;
            })();

            return Predicate;
        })();

        v1.Operation = (function() {

            /**
             * Properties of an Operation.
             * @memberof osp.v1
             * @interface IOperation
             * @property {string|null} [opId] Operation opId
             * @property {string|null} [deviceId] Operation deviceId
             * @property {number|Long|null} [lamport] Operation lamport
             * @property {string|null} [collection] Operation collection
             * @property {string|null} [recordId] Operation recordId
             * @property {osp.v1.OpKind|null} [kind] Operation kind
             * @property {Array.<osp.v1.IFieldChange>|null} [fieldChanges] Operation fieldChanges
             * @property {osp.v1.IVClock|null} [baseClock] Operation baseClock
             * @property {number|Long|null} [timestampMs] Operation timestampMs
             */

            /**
             * Constructs a new Operation.
             * @memberof osp.v1
             * @classdesc Represents an Operation.
             * @implements IOperation
             * @constructor
             * @param {osp.v1.IOperation=} [properties] Properties to set
             */
            function Operation(properties) {
                this.fieldChanges = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Operation opId.
             * @member {string} opId
             * @memberof osp.v1.Operation
             * @instance
             */
            Operation.prototype.opId = "";

            /**
             * Operation deviceId.
             * @member {string} deviceId
             * @memberof osp.v1.Operation
             * @instance
             */
            Operation.prototype.deviceId = "";

            /**
             * Operation lamport.
             * @member {number|Long} lamport
             * @memberof osp.v1.Operation
             * @instance
             */
            Operation.prototype.lamport = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * Operation collection.
             * @member {string} collection
             * @memberof osp.v1.Operation
             * @instance
             */
            Operation.prototype.collection = "";

            /**
             * Operation recordId.
             * @member {string} recordId
             * @memberof osp.v1.Operation
             * @instance
             */
            Operation.prototype.recordId = "";

            /**
             * Operation kind.
             * @member {osp.v1.OpKind} kind
             * @memberof osp.v1.Operation
             * @instance
             */
            Operation.prototype.kind = 0;

            /**
             * Operation fieldChanges.
             * @member {Array.<osp.v1.IFieldChange>} fieldChanges
             * @memberof osp.v1.Operation
             * @instance
             */
            Operation.prototype.fieldChanges = $util.emptyArray;

            /**
             * Operation baseClock.
             * @member {osp.v1.IVClock|null|undefined} baseClock
             * @memberof osp.v1.Operation
             * @instance
             */
            Operation.prototype.baseClock = null;

            /**
             * Operation timestampMs.
             * @member {number|Long} timestampMs
             * @memberof osp.v1.Operation
             * @instance
             */
            Operation.prototype.timestampMs = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * Creates a new Operation instance using the specified properties.
             * @function create
             * @memberof osp.v1.Operation
             * @static
             * @param {osp.v1.IOperation=} [properties] Properties to set
             * @returns {osp.v1.Operation} Operation instance
             */
            Operation.create = function create(properties) {
                return new Operation(properties);
            };

            /**
             * Encodes the specified Operation message. Does not implicitly {@link osp.v1.Operation.verify|verify} messages.
             * @function encode
             * @memberof osp.v1.Operation
             * @static
             * @param {osp.v1.IOperation} message Operation message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Operation.encode = function encode(message, writer, q) {
                if (!writer)
                    writer = $Writer.create();
                if (q === undefined)
                    q = 0;
                if (q > $util.recursionLimit)
                    throw Error("max depth exceeded");
                if (message.opId != null && Object.hasOwnProperty.call(message, "opId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.opId);
                if (message.deviceId != null && Object.hasOwnProperty.call(message, "deviceId"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.deviceId);
                if (message.lamport != null && Object.hasOwnProperty.call(message, "lamport"))
                    writer.uint32(/* id 3, wireType 0 =*/24).uint64(message.lamport);
                if (message.collection != null && Object.hasOwnProperty.call(message, "collection"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.collection);
                if (message.recordId != null && Object.hasOwnProperty.call(message, "recordId"))
                    writer.uint32(/* id 5, wireType 2 =*/42).string(message.recordId);
                if (message.kind != null && Object.hasOwnProperty.call(message, "kind"))
                    writer.uint32(/* id 6, wireType 0 =*/48).int32(message.kind);
                if (message.fieldChanges != null && message.fieldChanges.length)
                    for (var i = 0; i < message.fieldChanges.length; ++i)
                        $root.osp.v1.FieldChange.encode(message.fieldChanges[i], writer.uint32(/* id 7, wireType 2 =*/58).fork(), q + 1).ldelim();
                if (message.baseClock != null && Object.hasOwnProperty.call(message, "baseClock"))
                    $root.osp.v1.VClock.encode(message.baseClock, writer.uint32(/* id 8, wireType 2 =*/66).fork(), q + 1).ldelim();
                if (message.timestampMs != null && Object.hasOwnProperty.call(message, "timestampMs"))
                    writer.uint32(/* id 9, wireType 0 =*/72).uint64(message.timestampMs);
                return writer;
            };

            /**
             * Encodes the specified Operation message, length delimited. Does not implicitly {@link osp.v1.Operation.verify|verify} messages.
             * @function encodeDelimited
             * @memberof osp.v1.Operation
             * @static
             * @param {osp.v1.IOperation} message Operation message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Operation.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
            };

            /**
             * Decodes an Operation message from the specified reader or buffer.
             * @function decode
             * @memberof osp.v1.Operation
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {osp.v1.Operation} Operation
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Operation.decode = function decode(reader, length, error, long) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (long === undefined)
                    long = 0;
                if (long > $Reader.recursionLimit)
                    throw Error("maximum nesting depth exceeded");
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.osp.v1.Operation();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            message.opId = reader.string();
                            break;
                        }
                    case 2: {
                            message.deviceId = reader.string();
                            break;
                        }
                    case 3: {
                            message.lamport = reader.uint64();
                            break;
                        }
                    case 4: {
                            message.collection = reader.string();
                            break;
                        }
                    case 5: {
                            message.recordId = reader.string();
                            break;
                        }
                    case 6: {
                            message.kind = reader.int32();
                            break;
                        }
                    case 7: {
                            if (!(message.fieldChanges && message.fieldChanges.length))
                                message.fieldChanges = [];
                            message.fieldChanges.push($root.osp.v1.FieldChange.decode(reader, reader.uint32(), undefined, long + 1));
                            break;
                        }
                    case 8: {
                            message.baseClock = $root.osp.v1.VClock.decode(reader, reader.uint32(), undefined, long + 1);
                            break;
                        }
                    case 9: {
                            message.timestampMs = reader.uint64();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7, long);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes an Operation message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof osp.v1.Operation
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {osp.v1.Operation} Operation
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Operation.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an Operation message.
             * @function verify
             * @memberof osp.v1.Operation
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Operation.verify = function verify(message, long) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (long === undefined)
                    long = 0;
                if (long > $util.recursionLimit)
                    return "maximum nesting depth exceeded";
                if (message.opId != null && Object.hasOwnProperty.call(message, "opId"))
                    if (!$util.isString(message.opId))
                        return "opId: string expected";
                if (message.deviceId != null && Object.hasOwnProperty.call(message, "deviceId"))
                    if (!$util.isString(message.deviceId))
                        return "deviceId: string expected";
                if (message.lamport != null && Object.hasOwnProperty.call(message, "lamport"))
                    if (!$util.isInteger(message.lamport) && !(message.lamport && $util.isInteger(message.lamport.low) && $util.isInteger(message.lamport.high)))
                        return "lamport: integer|Long expected";
                if (message.collection != null && Object.hasOwnProperty.call(message, "collection"))
                    if (!$util.isString(message.collection))
                        return "collection: string expected";
                if (message.recordId != null && Object.hasOwnProperty.call(message, "recordId"))
                    if (!$util.isString(message.recordId))
                        return "recordId: string expected";
                if (message.kind != null && Object.hasOwnProperty.call(message, "kind"))
                    switch (message.kind) {
                    default:
                        return "kind: enum value expected";
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                        break;
                    }
                if (message.fieldChanges != null && Object.hasOwnProperty.call(message, "fieldChanges")) {
                    if (!Array.isArray(message.fieldChanges))
                        return "fieldChanges: array expected";
                    for (var i = 0; i < message.fieldChanges.length; ++i) {
                        var error = $root.osp.v1.FieldChange.verify(message.fieldChanges[i], long + 1);
                        if (error)
                            return "fieldChanges." + error;
                    }
                }
                if (message.baseClock != null && Object.hasOwnProperty.call(message, "baseClock")) {
                    var error = $root.osp.v1.VClock.verify(message.baseClock, long + 1);
                    if (error)
                        return "baseClock." + error;
                }
                if (message.timestampMs != null && Object.hasOwnProperty.call(message, "timestampMs"))
                    if (!$util.isInteger(message.timestampMs) && !(message.timestampMs && $util.isInteger(message.timestampMs.low) && $util.isInteger(message.timestampMs.high)))
                        return "timestampMs: integer|Long expected";
                return null;
            };

            /**
             * Creates an Operation message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof osp.v1.Operation
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {osp.v1.Operation} Operation
             */
            Operation.fromObject = function fromObject(object, long) {
                if (object instanceof $root.osp.v1.Operation)
                    return object;
                if (!$util.isObject(object))
                    throw TypeError(".osp.v1.Operation: object expected");
                if (long === undefined)
                    long = 0;
                if (long > $util.recursionLimit)
                    throw Error("maximum nesting depth exceeded");
                var message = new $root.osp.v1.Operation();
                if (object.opId != null)
                    message.opId = String(object.opId);
                if (object.deviceId != null)
                    message.deviceId = String(object.deviceId);
                if (object.lamport != null)
                    if ($util.Long)
                        message.lamport = $util.Long.fromValue(object.lamport, true);
                    else if (typeof object.lamport === "string")
                        message.lamport = parseInt(object.lamport, 10);
                    else if (typeof object.lamport === "number")
                        message.lamport = object.lamport;
                    else if (typeof object.lamport === "object")
                        message.lamport = new $util.LongBits(object.lamport.low >>> 0, object.lamport.high >>> 0).toNumber(true);
                if (object.collection != null)
                    message.collection = String(object.collection);
                if (object.recordId != null)
                    message.recordId = String(object.recordId);
                switch (object.kind) {
                default:
                    if (typeof object.kind === "number") {
                        message.kind = object.kind;
                        break;
                    }
                    break;
                case "OP_KIND_UNSPECIFIED":
                case 0:
                    message.kind = 0;
                    break;
                case "OP_KIND_INSERT":
                case 1:
                    message.kind = 1;
                    break;
                case "OP_KIND_UPDATE":
                case 2:
                    message.kind = 2;
                    break;
                case "OP_KIND_DELETE":
                case 3:
                    message.kind = 3;
                    break;
                case "OP_KIND_RESTORE":
                case 4:
                    message.kind = 4;
                    break;
                }
                if (object.fieldChanges) {
                    if (!Array.isArray(object.fieldChanges))
                        throw TypeError(".osp.v1.Operation.fieldChanges: array expected");
                    message.fieldChanges = [];
                    for (var i = 0; i < object.fieldChanges.length; ++i) {
                        if (!$util.isObject(object.fieldChanges[i]))
                            throw TypeError(".osp.v1.Operation.fieldChanges: object expected");
                        message.fieldChanges[i] = $root.osp.v1.FieldChange.fromObject(object.fieldChanges[i], long + 1);
                    }
                }
                if (object.baseClock != null) {
                    if (!$util.isObject(object.baseClock))
                        throw TypeError(".osp.v1.Operation.baseClock: object expected");
                    message.baseClock = $root.osp.v1.VClock.fromObject(object.baseClock, long + 1);
                }
                if (object.timestampMs != null)
                    if ($util.Long)
                        message.timestampMs = $util.Long.fromValue(object.timestampMs, true);
                    else if (typeof object.timestampMs === "string")
                        message.timestampMs = parseInt(object.timestampMs, 10);
                    else if (typeof object.timestampMs === "number")
                        message.timestampMs = object.timestampMs;
                    else if (typeof object.timestampMs === "object")
                        message.timestampMs = new $util.LongBits(object.timestampMs.low >>> 0, object.timestampMs.high >>> 0).toNumber(true);
                return message;
            };

            /**
             * Creates a plain object from an Operation message. Also converts values to other types if specified.
             * @function toObject
             * @memberof osp.v1.Operation
             * @static
             * @param {osp.v1.Operation} message Operation
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Operation.toObject = function toObject(message, options, q) {
                if (!options)
                    options = {};
                if (q === undefined)
                    q = 0;
                if (q > $util.recursionLimit)
                    throw Error("max depth exceeded");
                var object = {};
                if (options.arrays || options.defaults)
                    object.fieldChanges = [];
                if (options.defaults) {
                    object.opId = "";
                    object.deviceId = "";
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.lamport = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : typeof BigInt !== "undefined" && options.longs === BigInt ? long.toBigInt() : long;
                    } else
                        object.lamport = options.longs === String ? "0" : typeof BigInt !== "undefined" && options.longs === BigInt ? BigInt("0") : 0;
                    object.collection = "";
                    object.recordId = "";
                    object.kind = options.enums === String ? "OP_KIND_UNSPECIFIED" : 0;
                    object.baseClock = null;
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.timestampMs = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : typeof BigInt !== "undefined" && options.longs === BigInt ? long.toBigInt() : long;
                    } else
                        object.timestampMs = options.longs === String ? "0" : typeof BigInt !== "undefined" && options.longs === BigInt ? BigInt("0") : 0;
                }
                if (message.opId != null && Object.hasOwnProperty.call(message, "opId"))
                    object.opId = message.opId;
                if (message.deviceId != null && Object.hasOwnProperty.call(message, "deviceId"))
                    object.deviceId = message.deviceId;
                if (message.lamport != null && Object.hasOwnProperty.call(message, "lamport"))
                    if (typeof BigInt !== "undefined" && options.longs === BigInt)
                        object.lamport = typeof message.lamport === "number" ? BigInt(message.lamport) : $util.Long.fromBits(message.lamport.low >>> 0, message.lamport.high >>> 0, true).toBigInt();
                    else if (typeof message.lamport === "number")
                        object.lamport = options.longs === String ? String(message.lamport) : message.lamport;
                    else
                        object.lamport = options.longs === String ? $util.Long.prototype.toString.call(message.lamport) : options.longs === Number ? new $util.LongBits(message.lamport.low >>> 0, message.lamport.high >>> 0).toNumber(true) : message.lamport;
                if (message.collection != null && Object.hasOwnProperty.call(message, "collection"))
                    object.collection = message.collection;
                if (message.recordId != null && Object.hasOwnProperty.call(message, "recordId"))
                    object.recordId = message.recordId;
                if (message.kind != null && Object.hasOwnProperty.call(message, "kind"))
                    object.kind = options.enums === String ? $root.osp.v1.OpKind[message.kind] === undefined ? message.kind : $root.osp.v1.OpKind[message.kind] : message.kind;
                if (message.fieldChanges && message.fieldChanges.length) {
                    object.fieldChanges = [];
                    for (var j = 0; j < message.fieldChanges.length; ++j)
                        object.fieldChanges[j] = $root.osp.v1.FieldChange.toObject(message.fieldChanges[j], options, q + 1);
                }
                if (message.baseClock != null && Object.hasOwnProperty.call(message, "baseClock"))
                    object.baseClock = $root.osp.v1.VClock.toObject(message.baseClock, options, q + 1);
                if (message.timestampMs != null && Object.hasOwnProperty.call(message, "timestampMs"))
                    if (typeof BigInt !== "undefined" && options.longs === BigInt)
                        object.timestampMs = typeof message.timestampMs === "number" ? BigInt(message.timestampMs) : $util.Long.fromBits(message.timestampMs.low >>> 0, message.timestampMs.high >>> 0, true).toBigInt();
                    else if (typeof message.timestampMs === "number")
                        object.timestampMs = options.longs === String ? String(message.timestampMs) : message.timestampMs;
                    else
                        object.timestampMs = options.longs === String ? $util.Long.prototype.toString.call(message.timestampMs) : options.longs === Number ? new $util.LongBits(message.timestampMs.low >>> 0, message.timestampMs.high >>> 0).toNumber(true) : message.timestampMs;
                return object;
            };

            /**
             * Converts this Operation to JSON.
             * @function toJSON
             * @memberof osp.v1.Operation
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Operation.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for Operation
             * @function getTypeUrl
             * @memberof osp.v1.Operation
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            Operation.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/osp.v1.Operation";
            };

            return Operation;
        })();

        /**
         * OpKind enum.
         * @name osp.v1.OpKind
         * @enum {number}
         * @property {number} OP_KIND_UNSPECIFIED=0 OP_KIND_UNSPECIFIED value
         * @property {number} OP_KIND_INSERT=1 OP_KIND_INSERT value
         * @property {number} OP_KIND_UPDATE=2 OP_KIND_UPDATE value
         * @property {number} OP_KIND_DELETE=3 OP_KIND_DELETE value
         * @property {number} OP_KIND_RESTORE=4 OP_KIND_RESTORE value
         */
        v1.OpKind = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "OP_KIND_UNSPECIFIED"] = 0;
            values[valuesById[1] = "OP_KIND_INSERT"] = 1;
            values[valuesById[2] = "OP_KIND_UPDATE"] = 2;
            values[valuesById[3] = "OP_KIND_DELETE"] = 3;
            values[valuesById[4] = "OP_KIND_RESTORE"] = 4;
            return values;
        })();

        v1.Record = (function() {

            /**
             * Properties of a Record.
             * @memberof osp.v1
             * @interface IRecord
             * @property {string|null} [collection] Record collection
             * @property {string|null} [recordId] Record recordId
             * @property {number|Long|null} [revision] Record revision
             * @property {osp.v1.IVClock|null} [vectorClock] Record vectorClock
             * @property {boolean|null} [tombstone] Record tombstone
             * @property {Object.<string,osp.v1.IValue>|null} [fields] Record fields
             * @property {Object.<string,osp.v1.IFieldMeta>|null} [fieldMeta] Record fieldMeta
             * @property {number|Long|null} [updatedAtMs] Record updatedAtMs
             */

            /**
             * Constructs a new Record.
             * @memberof osp.v1
             * @classdesc Represents a Record.
             * @implements IRecord
             * @constructor
             * @param {osp.v1.IRecord=} [properties] Properties to set
             */
            function Record(properties) {
                this.fields = {};
                this.fieldMeta = {};
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Record collection.
             * @member {string} collection
             * @memberof osp.v1.Record
             * @instance
             */
            Record.prototype.collection = "";

            /**
             * Record recordId.
             * @member {string} recordId
             * @memberof osp.v1.Record
             * @instance
             */
            Record.prototype.recordId = "";

            /**
             * Record revision.
             * @member {number|Long} revision
             * @memberof osp.v1.Record
             * @instance
             */
            Record.prototype.revision = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * Record vectorClock.
             * @member {osp.v1.IVClock|null|undefined} vectorClock
             * @memberof osp.v1.Record
             * @instance
             */
            Record.prototype.vectorClock = null;

            /**
             * Record tombstone.
             * @member {boolean} tombstone
             * @memberof osp.v1.Record
             * @instance
             */
            Record.prototype.tombstone = false;

            /**
             * Record fields.
             * @member {Object.<string,osp.v1.IValue>} fields
             * @memberof osp.v1.Record
             * @instance
             */
            Record.prototype.fields = $util.emptyObject;

            /**
             * Record fieldMeta.
             * @member {Object.<string,osp.v1.IFieldMeta>} fieldMeta
             * @memberof osp.v1.Record
             * @instance
             */
            Record.prototype.fieldMeta = $util.emptyObject;

            /**
             * Record updatedAtMs.
             * @member {number|Long} updatedAtMs
             * @memberof osp.v1.Record
             * @instance
             */
            Record.prototype.updatedAtMs = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * Creates a new Record instance using the specified properties.
             * @function create
             * @memberof osp.v1.Record
             * @static
             * @param {osp.v1.IRecord=} [properties] Properties to set
             * @returns {osp.v1.Record} Record instance
             */
            Record.create = function create(properties) {
                return new Record(properties);
            };

            /**
             * Encodes the specified Record message. Does not implicitly {@link osp.v1.Record.verify|verify} messages.
             * @function encode
             * @memberof osp.v1.Record
             * @static
             * @param {osp.v1.IRecord} message Record message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Record.encode = function encode(message, writer, q) {
                if (!writer)
                    writer = $Writer.create();
                if (q === undefined)
                    q = 0;
                if (q > $util.recursionLimit)
                    throw Error("max depth exceeded");
                if (message.collection != null && Object.hasOwnProperty.call(message, "collection"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.collection);
                if (message.recordId != null && Object.hasOwnProperty.call(message, "recordId"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.recordId);
                if (message.revision != null && Object.hasOwnProperty.call(message, "revision"))
                    writer.uint32(/* id 3, wireType 0 =*/24).uint64(message.revision);
                if (message.vectorClock != null && Object.hasOwnProperty.call(message, "vectorClock"))
                    $root.osp.v1.VClock.encode(message.vectorClock, writer.uint32(/* id 4, wireType 2 =*/34).fork(), q + 1).ldelim();
                if (message.tombstone != null && Object.hasOwnProperty.call(message, "tombstone"))
                    writer.uint32(/* id 5, wireType 0 =*/40).bool(message.tombstone);
                if (message.fields != null && Object.hasOwnProperty.call(message, "fields"))
                    for (var keys = Object.keys(message.fields), i = 0; i < keys.length; ++i) {
                        writer.uint32(/* id 6, wireType 2 =*/50).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                        $root.osp.v1.Value.encode(message.fields[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork(), q + 1).ldelim().ldelim();
                    }
                if (message.fieldMeta != null && Object.hasOwnProperty.call(message, "fieldMeta"))
                    for (var keys = Object.keys(message.fieldMeta), i = 0; i < keys.length; ++i) {
                        writer.uint32(/* id 7, wireType 2 =*/58).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                        $root.osp.v1.FieldMeta.encode(message.fieldMeta[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork(), q + 1).ldelim().ldelim();
                    }
                if (message.updatedAtMs != null && Object.hasOwnProperty.call(message, "updatedAtMs"))
                    writer.uint32(/* id 8, wireType 0 =*/64).uint64(message.updatedAtMs);
                return writer;
            };

            /**
             * Encodes the specified Record message, length delimited. Does not implicitly {@link osp.v1.Record.verify|verify} messages.
             * @function encodeDelimited
             * @memberof osp.v1.Record
             * @static
             * @param {osp.v1.IRecord} message Record message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Record.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
            };

            /**
             * Decodes a Record message from the specified reader or buffer.
             * @function decode
             * @memberof osp.v1.Record
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {osp.v1.Record} Record
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Record.decode = function decode(reader, length, error, long) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (long === undefined)
                    long = 0;
                if (long > $Reader.recursionLimit)
                    throw Error("maximum nesting depth exceeded");
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.osp.v1.Record(), key, value;
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            message.collection = reader.string();
                            break;
                        }
                    case 2: {
                            message.recordId = reader.string();
                            break;
                        }
                    case 3: {
                            message.revision = reader.uint64();
                            break;
                        }
                    case 4: {
                            message.vectorClock = $root.osp.v1.VClock.decode(reader, reader.uint32(), undefined, long + 1);
                            break;
                        }
                    case 5: {
                            message.tombstone = reader.bool();
                            break;
                        }
                    case 6: {
                            if (message.fields === $util.emptyObject)
                                message.fields = {};
                            var end2 = reader.uint32() + reader.pos;
                            key = "";
                            value = null;
                            while (reader.pos < end2) {
                                var tag2 = reader.uint32();
                                switch (tag2 >>> 3) {
                                case 1:
                                    key = reader.string();
                                    break;
                                case 2:
                                    value = $root.osp.v1.Value.decode(reader, reader.uint32(), undefined, long + 1);
                                    break;
                                default:
                                    reader.skipType(tag2 & 7, long);
                                    break;
                                }
                            }
                            if (key === "__proto__")
                                $util.makeProp(message.fields, key);
                            message.fields[key] = value;
                            break;
                        }
                    case 7: {
                            if (message.fieldMeta === $util.emptyObject)
                                message.fieldMeta = {};
                            var end2 = reader.uint32() + reader.pos;
                            key = "";
                            value = null;
                            while (reader.pos < end2) {
                                var tag2 = reader.uint32();
                                switch (tag2 >>> 3) {
                                case 1:
                                    key = reader.string();
                                    break;
                                case 2:
                                    value = $root.osp.v1.FieldMeta.decode(reader, reader.uint32(), undefined, long + 1);
                                    break;
                                default:
                                    reader.skipType(tag2 & 7, long);
                                    break;
                                }
                            }
                            if (key === "__proto__")
                                $util.makeProp(message.fieldMeta, key);
                            message.fieldMeta[key] = value;
                            break;
                        }
                    case 8: {
                            message.updatedAtMs = reader.uint64();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7, long);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a Record message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof osp.v1.Record
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {osp.v1.Record} Record
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Record.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a Record message.
             * @function verify
             * @memberof osp.v1.Record
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Record.verify = function verify(message, long) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (long === undefined)
                    long = 0;
                if (long > $util.recursionLimit)
                    return "maximum nesting depth exceeded";
                if (message.collection != null && Object.hasOwnProperty.call(message, "collection"))
                    if (!$util.isString(message.collection))
                        return "collection: string expected";
                if (message.recordId != null && Object.hasOwnProperty.call(message, "recordId"))
                    if (!$util.isString(message.recordId))
                        return "recordId: string expected";
                if (message.revision != null && Object.hasOwnProperty.call(message, "revision"))
                    if (!$util.isInteger(message.revision) && !(message.revision && $util.isInteger(message.revision.low) && $util.isInteger(message.revision.high)))
                        return "revision: integer|Long expected";
                if (message.vectorClock != null && Object.hasOwnProperty.call(message, "vectorClock")) {
                    var error = $root.osp.v1.VClock.verify(message.vectorClock, long + 1);
                    if (error)
                        return "vectorClock." + error;
                }
                if (message.tombstone != null && Object.hasOwnProperty.call(message, "tombstone"))
                    if (typeof message.tombstone !== "boolean")
                        return "tombstone: boolean expected";
                if (message.fields != null && Object.hasOwnProperty.call(message, "fields")) {
                    if (!$util.isObject(message.fields))
                        return "fields: object expected";
                    var key = Object.keys(message.fields);
                    for (var i = 0; i < key.length; ++i) {
                        var error = $root.osp.v1.Value.verify(message.fields[key[i]], long + 1);
                        if (error)
                            return "fields." + error;
                    }
                }
                if (message.fieldMeta != null && Object.hasOwnProperty.call(message, "fieldMeta")) {
                    if (!$util.isObject(message.fieldMeta))
                        return "fieldMeta: object expected";
                    var key = Object.keys(message.fieldMeta);
                    for (var i = 0; i < key.length; ++i) {
                        var error = $root.osp.v1.FieldMeta.verify(message.fieldMeta[key[i]], long + 1);
                        if (error)
                            return "fieldMeta." + error;
                    }
                }
                if (message.updatedAtMs != null && Object.hasOwnProperty.call(message, "updatedAtMs"))
                    if (!$util.isInteger(message.updatedAtMs) && !(message.updatedAtMs && $util.isInteger(message.updatedAtMs.low) && $util.isInteger(message.updatedAtMs.high)))
                        return "updatedAtMs: integer|Long expected";
                return null;
            };

            /**
             * Creates a Record message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof osp.v1.Record
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {osp.v1.Record} Record
             */
            Record.fromObject = function fromObject(object, long) {
                if (object instanceof $root.osp.v1.Record)
                    return object;
                if (!$util.isObject(object))
                    throw TypeError(".osp.v1.Record: object expected");
                if (long === undefined)
                    long = 0;
                if (long > $util.recursionLimit)
                    throw Error("maximum nesting depth exceeded");
                var message = new $root.osp.v1.Record();
                if (object.collection != null)
                    message.collection = String(object.collection);
                if (object.recordId != null)
                    message.recordId = String(object.recordId);
                if (object.revision != null)
                    if ($util.Long)
                        message.revision = $util.Long.fromValue(object.revision, true);
                    else if (typeof object.revision === "string")
                        message.revision = parseInt(object.revision, 10);
                    else if (typeof object.revision === "number")
                        message.revision = object.revision;
                    else if (typeof object.revision === "object")
                        message.revision = new $util.LongBits(object.revision.low >>> 0, object.revision.high >>> 0).toNumber(true);
                if (object.vectorClock != null) {
                    if (!$util.isObject(object.vectorClock))
                        throw TypeError(".osp.v1.Record.vectorClock: object expected");
                    message.vectorClock = $root.osp.v1.VClock.fromObject(object.vectorClock, long + 1);
                }
                if (object.tombstone != null)
                    message.tombstone = Boolean(object.tombstone);
                if (object.fields) {
                    if (!$util.isObject(object.fields))
                        throw TypeError(".osp.v1.Record.fields: object expected");
                    message.fields = {};
                    for (var keys = Object.keys(object.fields), i = 0; i < keys.length; ++i) {
                        if (keys[i] === "__proto__")
                            $util.makeProp(message.fields, keys[i]);
                        if (!$util.isObject(object.fields[keys[i]]))
                            throw TypeError(".osp.v1.Record.fields: object expected");
                        message.fields[keys[i]] = $root.osp.v1.Value.fromObject(object.fields[keys[i]], long + 1);
                    }
                }
                if (object.fieldMeta) {
                    if (!$util.isObject(object.fieldMeta))
                        throw TypeError(".osp.v1.Record.fieldMeta: object expected");
                    message.fieldMeta = {};
                    for (var keys = Object.keys(object.fieldMeta), i = 0; i < keys.length; ++i) {
                        if (keys[i] === "__proto__")
                            $util.makeProp(message.fieldMeta, keys[i]);
                        if (!$util.isObject(object.fieldMeta[keys[i]]))
                            throw TypeError(".osp.v1.Record.fieldMeta: object expected");
                        message.fieldMeta[keys[i]] = $root.osp.v1.FieldMeta.fromObject(object.fieldMeta[keys[i]], long + 1);
                    }
                }
                if (object.updatedAtMs != null)
                    if ($util.Long)
                        message.updatedAtMs = $util.Long.fromValue(object.updatedAtMs, true);
                    else if (typeof object.updatedAtMs === "string")
                        message.updatedAtMs = parseInt(object.updatedAtMs, 10);
                    else if (typeof object.updatedAtMs === "number")
                        message.updatedAtMs = object.updatedAtMs;
                    else if (typeof object.updatedAtMs === "object")
                        message.updatedAtMs = new $util.LongBits(object.updatedAtMs.low >>> 0, object.updatedAtMs.high >>> 0).toNumber(true);
                return message;
            };

            /**
             * Creates a plain object from a Record message. Also converts values to other types if specified.
             * @function toObject
             * @memberof osp.v1.Record
             * @static
             * @param {osp.v1.Record} message Record
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Record.toObject = function toObject(message, options, q) {
                if (!options)
                    options = {};
                if (q === undefined)
                    q = 0;
                if (q > $util.recursionLimit)
                    throw Error("max depth exceeded");
                var object = {};
                if (options.objects || options.defaults) {
                    object.fields = {};
                    object.fieldMeta = {};
                }
                if (options.defaults) {
                    object.collection = "";
                    object.recordId = "";
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.revision = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : typeof BigInt !== "undefined" && options.longs === BigInt ? long.toBigInt() : long;
                    } else
                        object.revision = options.longs === String ? "0" : typeof BigInt !== "undefined" && options.longs === BigInt ? BigInt("0") : 0;
                    object.vectorClock = null;
                    object.tombstone = false;
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.updatedAtMs = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : typeof BigInt !== "undefined" && options.longs === BigInt ? long.toBigInt() : long;
                    } else
                        object.updatedAtMs = options.longs === String ? "0" : typeof BigInt !== "undefined" && options.longs === BigInt ? BigInt("0") : 0;
                }
                if (message.collection != null && Object.hasOwnProperty.call(message, "collection"))
                    object.collection = message.collection;
                if (message.recordId != null && Object.hasOwnProperty.call(message, "recordId"))
                    object.recordId = message.recordId;
                if (message.revision != null && Object.hasOwnProperty.call(message, "revision"))
                    if (typeof BigInt !== "undefined" && options.longs === BigInt)
                        object.revision = typeof message.revision === "number" ? BigInt(message.revision) : $util.Long.fromBits(message.revision.low >>> 0, message.revision.high >>> 0, true).toBigInt();
                    else if (typeof message.revision === "number")
                        object.revision = options.longs === String ? String(message.revision) : message.revision;
                    else
                        object.revision = options.longs === String ? $util.Long.prototype.toString.call(message.revision) : options.longs === Number ? new $util.LongBits(message.revision.low >>> 0, message.revision.high >>> 0).toNumber(true) : message.revision;
                if (message.vectorClock != null && Object.hasOwnProperty.call(message, "vectorClock"))
                    object.vectorClock = $root.osp.v1.VClock.toObject(message.vectorClock, options, q + 1);
                if (message.tombstone != null && Object.hasOwnProperty.call(message, "tombstone"))
                    object.tombstone = message.tombstone;
                var keys2;
                if (message.fields && (keys2 = Object.keys(message.fields)).length) {
                    object.fields = {};
                    for (var j = 0; j < keys2.length; ++j) {
                        if (keys2[j] === "__proto__")
                            $util.makeProp(object.fields, keys2[j]);
                        object.fields[keys2[j]] = $root.osp.v1.Value.toObject(message.fields[keys2[j]], options, q + 1);
                    }
                }
                if (message.fieldMeta && (keys2 = Object.keys(message.fieldMeta)).length) {
                    object.fieldMeta = {};
                    for (var j = 0; j < keys2.length; ++j) {
                        if (keys2[j] === "__proto__")
                            $util.makeProp(object.fieldMeta, keys2[j]);
                        object.fieldMeta[keys2[j]] = $root.osp.v1.FieldMeta.toObject(message.fieldMeta[keys2[j]], options, q + 1);
                    }
                }
                if (message.updatedAtMs != null && Object.hasOwnProperty.call(message, "updatedAtMs"))
                    if (typeof BigInt !== "undefined" && options.longs === BigInt)
                        object.updatedAtMs = typeof message.updatedAtMs === "number" ? BigInt(message.updatedAtMs) : $util.Long.fromBits(message.updatedAtMs.low >>> 0, message.updatedAtMs.high >>> 0, true).toBigInt();
                    else if (typeof message.updatedAtMs === "number")
                        object.updatedAtMs = options.longs === String ? String(message.updatedAtMs) : message.updatedAtMs;
                    else
                        object.updatedAtMs = options.longs === String ? $util.Long.prototype.toString.call(message.updatedAtMs) : options.longs === Number ? new $util.LongBits(message.updatedAtMs.low >>> 0, message.updatedAtMs.high >>> 0).toNumber(true) : message.updatedAtMs;
                return object;
            };

            /**
             * Converts this Record to JSON.
             * @function toJSON
             * @memberof osp.v1.Record
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Record.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for Record
             * @function getTypeUrl
             * @memberof osp.v1.Record
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            Record.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/osp.v1.Record";
            };

            return Record;
        })();

        v1.FieldMeta = (function() {

            /**
             * Properties of a FieldMeta.
             * @memberof osp.v1
             * @interface IFieldMeta
             * @property {number|Long|null} [lamport] FieldMeta lamport
             * @property {string|null} [writerDeviceId] FieldMeta writerDeviceId
             */

            /**
             * Constructs a new FieldMeta.
             * @memberof osp.v1
             * @classdesc Represents a FieldMeta.
             * @implements IFieldMeta
             * @constructor
             * @param {osp.v1.IFieldMeta=} [properties] Properties to set
             */
            function FieldMeta(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * FieldMeta lamport.
             * @member {number|Long} lamport
             * @memberof osp.v1.FieldMeta
             * @instance
             */
            FieldMeta.prototype.lamport = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * FieldMeta writerDeviceId.
             * @member {string} writerDeviceId
             * @memberof osp.v1.FieldMeta
             * @instance
             */
            FieldMeta.prototype.writerDeviceId = "";

            /**
             * Creates a new FieldMeta instance using the specified properties.
             * @function create
             * @memberof osp.v1.FieldMeta
             * @static
             * @param {osp.v1.IFieldMeta=} [properties] Properties to set
             * @returns {osp.v1.FieldMeta} FieldMeta instance
             */
            FieldMeta.create = function create(properties) {
                return new FieldMeta(properties);
            };

            /**
             * Encodes the specified FieldMeta message. Does not implicitly {@link osp.v1.FieldMeta.verify|verify} messages.
             * @function encode
             * @memberof osp.v1.FieldMeta
             * @static
             * @param {osp.v1.IFieldMeta} message FieldMeta message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            FieldMeta.encode = function encode(message, writer, q) {
                if (!writer)
                    writer = $Writer.create();
                if (q === undefined)
                    q = 0;
                if (q > $util.recursionLimit)
                    throw Error("max depth exceeded");
                if (message.lamport != null && Object.hasOwnProperty.call(message, "lamport"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.lamport);
                if (message.writerDeviceId != null && Object.hasOwnProperty.call(message, "writerDeviceId"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.writerDeviceId);
                return writer;
            };

            /**
             * Encodes the specified FieldMeta message, length delimited. Does not implicitly {@link osp.v1.FieldMeta.verify|verify} messages.
             * @function encodeDelimited
             * @memberof osp.v1.FieldMeta
             * @static
             * @param {osp.v1.IFieldMeta} message FieldMeta message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            FieldMeta.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
            };

            /**
             * Decodes a FieldMeta message from the specified reader or buffer.
             * @function decode
             * @memberof osp.v1.FieldMeta
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {osp.v1.FieldMeta} FieldMeta
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            FieldMeta.decode = function decode(reader, length, error, long) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (long === undefined)
                    long = 0;
                if (long > $Reader.recursionLimit)
                    throw Error("maximum nesting depth exceeded");
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.osp.v1.FieldMeta();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            message.lamport = reader.uint64();
                            break;
                        }
                    case 2: {
                            message.writerDeviceId = reader.string();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7, long);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a FieldMeta message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof osp.v1.FieldMeta
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {osp.v1.FieldMeta} FieldMeta
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            FieldMeta.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a FieldMeta message.
             * @function verify
             * @memberof osp.v1.FieldMeta
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            FieldMeta.verify = function verify(message, long) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (long === undefined)
                    long = 0;
                if (long > $util.recursionLimit)
                    return "maximum nesting depth exceeded";
                if (message.lamport != null && Object.hasOwnProperty.call(message, "lamport"))
                    if (!$util.isInteger(message.lamport) && !(message.lamport && $util.isInteger(message.lamport.low) && $util.isInteger(message.lamport.high)))
                        return "lamport: integer|Long expected";
                if (message.writerDeviceId != null && Object.hasOwnProperty.call(message, "writerDeviceId"))
                    if (!$util.isString(message.writerDeviceId))
                        return "writerDeviceId: string expected";
                return null;
            };

            /**
             * Creates a FieldMeta message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof osp.v1.FieldMeta
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {osp.v1.FieldMeta} FieldMeta
             */
            FieldMeta.fromObject = function fromObject(object, long) {
                if (object instanceof $root.osp.v1.FieldMeta)
                    return object;
                if (!$util.isObject(object))
                    throw TypeError(".osp.v1.FieldMeta: object expected");
                if (long === undefined)
                    long = 0;
                if (long > $util.recursionLimit)
                    throw Error("maximum nesting depth exceeded");
                var message = new $root.osp.v1.FieldMeta();
                if (object.lamport != null)
                    if ($util.Long)
                        message.lamport = $util.Long.fromValue(object.lamport, true);
                    else if (typeof object.lamport === "string")
                        message.lamport = parseInt(object.lamport, 10);
                    else if (typeof object.lamport === "number")
                        message.lamport = object.lamport;
                    else if (typeof object.lamport === "object")
                        message.lamport = new $util.LongBits(object.lamport.low >>> 0, object.lamport.high >>> 0).toNumber(true);
                if (object.writerDeviceId != null)
                    message.writerDeviceId = String(object.writerDeviceId);
                return message;
            };

            /**
             * Creates a plain object from a FieldMeta message. Also converts values to other types if specified.
             * @function toObject
             * @memberof osp.v1.FieldMeta
             * @static
             * @param {osp.v1.FieldMeta} message FieldMeta
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            FieldMeta.toObject = function toObject(message, options, q) {
                if (!options)
                    options = {};
                if (q === undefined)
                    q = 0;
                if (q > $util.recursionLimit)
                    throw Error("max depth exceeded");
                var object = {};
                if (options.defaults) {
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.lamport = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : typeof BigInt !== "undefined" && options.longs === BigInt ? long.toBigInt() : long;
                    } else
                        object.lamport = options.longs === String ? "0" : typeof BigInt !== "undefined" && options.longs === BigInt ? BigInt("0") : 0;
                    object.writerDeviceId = "";
                }
                if (message.lamport != null && Object.hasOwnProperty.call(message, "lamport"))
                    if (typeof BigInt !== "undefined" && options.longs === BigInt)
                        object.lamport = typeof message.lamport === "number" ? BigInt(message.lamport) : $util.Long.fromBits(message.lamport.low >>> 0, message.lamport.high >>> 0, true).toBigInt();
                    else if (typeof message.lamport === "number")
                        object.lamport = options.longs === String ? String(message.lamport) : message.lamport;
                    else
                        object.lamport = options.longs === String ? $util.Long.prototype.toString.call(message.lamport) : options.longs === Number ? new $util.LongBits(message.lamport.low >>> 0, message.lamport.high >>> 0).toNumber(true) : message.lamport;
                if (message.writerDeviceId != null && Object.hasOwnProperty.call(message, "writerDeviceId"))
                    object.writerDeviceId = message.writerDeviceId;
                return object;
            };

            /**
             * Converts this FieldMeta to JSON.
             * @function toJSON
             * @memberof osp.v1.FieldMeta
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            FieldMeta.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for FieldMeta
             * @function getTypeUrl
             * @memberof osp.v1.FieldMeta
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            FieldMeta.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/osp.v1.FieldMeta";
            };

            return FieldMeta;
        })();

        v1.Snapshot = (function() {

            /**
             * Properties of a Snapshot.
             * @memberof osp.v1
             * @interface ISnapshot
             * @property {string|null} [collection] Snapshot collection
             * @property {number|Long|null} [revision] Snapshot revision
             * @property {number|Long|null} [lamportFloor] Snapshot lamportFloor
             * @property {Array.<osp.v1.IRecord>|null} [records] Snapshot records
             */

            /**
             * Constructs a new Snapshot.
             * @memberof osp.v1
             * @classdesc Represents a Snapshot.
             * @implements ISnapshot
             * @constructor
             * @param {osp.v1.ISnapshot=} [properties] Properties to set
             */
            function Snapshot(properties) {
                this.records = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Snapshot collection.
             * @member {string} collection
             * @memberof osp.v1.Snapshot
             * @instance
             */
            Snapshot.prototype.collection = "";

            /**
             * Snapshot revision.
             * @member {number|Long} revision
             * @memberof osp.v1.Snapshot
             * @instance
             */
            Snapshot.prototype.revision = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * Snapshot lamportFloor.
             * @member {number|Long} lamportFloor
             * @memberof osp.v1.Snapshot
             * @instance
             */
            Snapshot.prototype.lamportFloor = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * Snapshot records.
             * @member {Array.<osp.v1.IRecord>} records
             * @memberof osp.v1.Snapshot
             * @instance
             */
            Snapshot.prototype.records = $util.emptyArray;

            /**
             * Creates a new Snapshot instance using the specified properties.
             * @function create
             * @memberof osp.v1.Snapshot
             * @static
             * @param {osp.v1.ISnapshot=} [properties] Properties to set
             * @returns {osp.v1.Snapshot} Snapshot instance
             */
            Snapshot.create = function create(properties) {
                return new Snapshot(properties);
            };

            /**
             * Encodes the specified Snapshot message. Does not implicitly {@link osp.v1.Snapshot.verify|verify} messages.
             * @function encode
             * @memberof osp.v1.Snapshot
             * @static
             * @param {osp.v1.ISnapshot} message Snapshot message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Snapshot.encode = function encode(message, writer, q) {
                if (!writer)
                    writer = $Writer.create();
                if (q === undefined)
                    q = 0;
                if (q > $util.recursionLimit)
                    throw Error("max depth exceeded");
                if (message.collection != null && Object.hasOwnProperty.call(message, "collection"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.collection);
                if (message.revision != null && Object.hasOwnProperty.call(message, "revision"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.revision);
                if (message.lamportFloor != null && Object.hasOwnProperty.call(message, "lamportFloor"))
                    writer.uint32(/* id 3, wireType 0 =*/24).uint64(message.lamportFloor);
                if (message.records != null && message.records.length)
                    for (var i = 0; i < message.records.length; ++i)
                        $root.osp.v1.Record.encode(message.records[i], writer.uint32(/* id 4, wireType 2 =*/34).fork(), q + 1).ldelim();
                return writer;
            };

            /**
             * Encodes the specified Snapshot message, length delimited. Does not implicitly {@link osp.v1.Snapshot.verify|verify} messages.
             * @function encodeDelimited
             * @memberof osp.v1.Snapshot
             * @static
             * @param {osp.v1.ISnapshot} message Snapshot message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Snapshot.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
            };

            /**
             * Decodes a Snapshot message from the specified reader or buffer.
             * @function decode
             * @memberof osp.v1.Snapshot
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {osp.v1.Snapshot} Snapshot
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Snapshot.decode = function decode(reader, length, error, long) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (long === undefined)
                    long = 0;
                if (long > $Reader.recursionLimit)
                    throw Error("maximum nesting depth exceeded");
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.osp.v1.Snapshot();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            message.collection = reader.string();
                            break;
                        }
                    case 2: {
                            message.revision = reader.uint64();
                            break;
                        }
                    case 3: {
                            message.lamportFloor = reader.uint64();
                            break;
                        }
                    case 4: {
                            if (!(message.records && message.records.length))
                                message.records = [];
                            message.records.push($root.osp.v1.Record.decode(reader, reader.uint32(), undefined, long + 1));
                            break;
                        }
                    default:
                        reader.skipType(tag & 7, long);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a Snapshot message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof osp.v1.Snapshot
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {osp.v1.Snapshot} Snapshot
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Snapshot.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a Snapshot message.
             * @function verify
             * @memberof osp.v1.Snapshot
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Snapshot.verify = function verify(message, long) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (long === undefined)
                    long = 0;
                if (long > $util.recursionLimit)
                    return "maximum nesting depth exceeded";
                if (message.collection != null && Object.hasOwnProperty.call(message, "collection"))
                    if (!$util.isString(message.collection))
                        return "collection: string expected";
                if (message.revision != null && Object.hasOwnProperty.call(message, "revision"))
                    if (!$util.isInteger(message.revision) && !(message.revision && $util.isInteger(message.revision.low) && $util.isInteger(message.revision.high)))
                        return "revision: integer|Long expected";
                if (message.lamportFloor != null && Object.hasOwnProperty.call(message, "lamportFloor"))
                    if (!$util.isInteger(message.lamportFloor) && !(message.lamportFloor && $util.isInteger(message.lamportFloor.low) && $util.isInteger(message.lamportFloor.high)))
                        return "lamportFloor: integer|Long expected";
                if (message.records != null && Object.hasOwnProperty.call(message, "records")) {
                    if (!Array.isArray(message.records))
                        return "records: array expected";
                    for (var i = 0; i < message.records.length; ++i) {
                        var error = $root.osp.v1.Record.verify(message.records[i], long + 1);
                        if (error)
                            return "records." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a Snapshot message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof osp.v1.Snapshot
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {osp.v1.Snapshot} Snapshot
             */
            Snapshot.fromObject = function fromObject(object, long) {
                if (object instanceof $root.osp.v1.Snapshot)
                    return object;
                if (!$util.isObject(object))
                    throw TypeError(".osp.v1.Snapshot: object expected");
                if (long === undefined)
                    long = 0;
                if (long > $util.recursionLimit)
                    throw Error("maximum nesting depth exceeded");
                var message = new $root.osp.v1.Snapshot();
                if (object.collection != null)
                    message.collection = String(object.collection);
                if (object.revision != null)
                    if ($util.Long)
                        message.revision = $util.Long.fromValue(object.revision, true);
                    else if (typeof object.revision === "string")
                        message.revision = parseInt(object.revision, 10);
                    else if (typeof object.revision === "number")
                        message.revision = object.revision;
                    else if (typeof object.revision === "object")
                        message.revision = new $util.LongBits(object.revision.low >>> 0, object.revision.high >>> 0).toNumber(true);
                if (object.lamportFloor != null)
                    if ($util.Long)
                        message.lamportFloor = $util.Long.fromValue(object.lamportFloor, true);
                    else if (typeof object.lamportFloor === "string")
                        message.lamportFloor = parseInt(object.lamportFloor, 10);
                    else if (typeof object.lamportFloor === "number")
                        message.lamportFloor = object.lamportFloor;
                    else if (typeof object.lamportFloor === "object")
                        message.lamportFloor = new $util.LongBits(object.lamportFloor.low >>> 0, object.lamportFloor.high >>> 0).toNumber(true);
                if (object.records) {
                    if (!Array.isArray(object.records))
                        throw TypeError(".osp.v1.Snapshot.records: array expected");
                    message.records = [];
                    for (var i = 0; i < object.records.length; ++i) {
                        if (!$util.isObject(object.records[i]))
                            throw TypeError(".osp.v1.Snapshot.records: object expected");
                        message.records[i] = $root.osp.v1.Record.fromObject(object.records[i], long + 1);
                    }
                }
                return message;
            };

            /**
             * Creates a plain object from a Snapshot message. Also converts values to other types if specified.
             * @function toObject
             * @memberof osp.v1.Snapshot
             * @static
             * @param {osp.v1.Snapshot} message Snapshot
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Snapshot.toObject = function toObject(message, options, q) {
                if (!options)
                    options = {};
                if (q === undefined)
                    q = 0;
                if (q > $util.recursionLimit)
                    throw Error("max depth exceeded");
                var object = {};
                if (options.arrays || options.defaults)
                    object.records = [];
                if (options.defaults) {
                    object.collection = "";
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.revision = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : typeof BigInt !== "undefined" && options.longs === BigInt ? long.toBigInt() : long;
                    } else
                        object.revision = options.longs === String ? "0" : typeof BigInt !== "undefined" && options.longs === BigInt ? BigInt("0") : 0;
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.lamportFloor = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : typeof BigInt !== "undefined" && options.longs === BigInt ? long.toBigInt() : long;
                    } else
                        object.lamportFloor = options.longs === String ? "0" : typeof BigInt !== "undefined" && options.longs === BigInt ? BigInt("0") : 0;
                }
                if (message.collection != null && Object.hasOwnProperty.call(message, "collection"))
                    object.collection = message.collection;
                if (message.revision != null && Object.hasOwnProperty.call(message, "revision"))
                    if (typeof BigInt !== "undefined" && options.longs === BigInt)
                        object.revision = typeof message.revision === "number" ? BigInt(message.revision) : $util.Long.fromBits(message.revision.low >>> 0, message.revision.high >>> 0, true).toBigInt();
                    else if (typeof message.revision === "number")
                        object.revision = options.longs === String ? String(message.revision) : message.revision;
                    else
                        object.revision = options.longs === String ? $util.Long.prototype.toString.call(message.revision) : options.longs === Number ? new $util.LongBits(message.revision.low >>> 0, message.revision.high >>> 0).toNumber(true) : message.revision;
                if (message.lamportFloor != null && Object.hasOwnProperty.call(message, "lamportFloor"))
                    if (typeof BigInt !== "undefined" && options.longs === BigInt)
                        object.lamportFloor = typeof message.lamportFloor === "number" ? BigInt(message.lamportFloor) : $util.Long.fromBits(message.lamportFloor.low >>> 0, message.lamportFloor.high >>> 0, true).toBigInt();
                    else if (typeof message.lamportFloor === "number")
                        object.lamportFloor = options.longs === String ? String(message.lamportFloor) : message.lamportFloor;
                    else
                        object.lamportFloor = options.longs === String ? $util.Long.prototype.toString.call(message.lamportFloor) : options.longs === Number ? new $util.LongBits(message.lamportFloor.low >>> 0, message.lamportFloor.high >>> 0).toNumber(true) : message.lamportFloor;
                if (message.records && message.records.length) {
                    object.records = [];
                    for (var j = 0; j < message.records.length; ++j)
                        object.records[j] = $root.osp.v1.Record.toObject(message.records[j], options, q + 1);
                }
                return object;
            };

            /**
             * Converts this Snapshot to JSON.
             * @function toJSON
             * @memberof osp.v1.Snapshot
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Snapshot.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for Snapshot
             * @function getTypeUrl
             * @memberof osp.v1.Snapshot
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            Snapshot.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/osp.v1.Snapshot";
            };

            return Snapshot;
        })();

        v1.OpAck = (function() {

            /**
             * Properties of an OpAck.
             * @memberof osp.v1
             * @interface IOpAck
             * @property {string|null} [opId] OpAck opId
             * @property {boolean|null} [accepted] OpAck accepted
             * @property {osp.v1.IErrorInfo|null} [error] OpAck error
             * @property {number|Long|null} [revision] OpAck revision
             */

            /**
             * Constructs a new OpAck.
             * @memberof osp.v1
             * @classdesc Represents an OpAck.
             * @implements IOpAck
             * @constructor
             * @param {osp.v1.IOpAck=} [properties] Properties to set
             */
            function OpAck(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * OpAck opId.
             * @member {string} opId
             * @memberof osp.v1.OpAck
             * @instance
             */
            OpAck.prototype.opId = "";

            /**
             * OpAck accepted.
             * @member {boolean} accepted
             * @memberof osp.v1.OpAck
             * @instance
             */
            OpAck.prototype.accepted = false;

            /**
             * OpAck error.
             * @member {osp.v1.IErrorInfo|null|undefined} error
             * @memberof osp.v1.OpAck
             * @instance
             */
            OpAck.prototype.error = null;

            /**
             * OpAck revision.
             * @member {number|Long} revision
             * @memberof osp.v1.OpAck
             * @instance
             */
            OpAck.prototype.revision = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * Creates a new OpAck instance using the specified properties.
             * @function create
             * @memberof osp.v1.OpAck
             * @static
             * @param {osp.v1.IOpAck=} [properties] Properties to set
             * @returns {osp.v1.OpAck} OpAck instance
             */
            OpAck.create = function create(properties) {
                return new OpAck(properties);
            };

            /**
             * Encodes the specified OpAck message. Does not implicitly {@link osp.v1.OpAck.verify|verify} messages.
             * @function encode
             * @memberof osp.v1.OpAck
             * @static
             * @param {osp.v1.IOpAck} message OpAck message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            OpAck.encode = function encode(message, writer, q) {
                if (!writer)
                    writer = $Writer.create();
                if (q === undefined)
                    q = 0;
                if (q > $util.recursionLimit)
                    throw Error("max depth exceeded");
                if (message.opId != null && Object.hasOwnProperty.call(message, "opId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.opId);
                if (message.accepted != null && Object.hasOwnProperty.call(message, "accepted"))
                    writer.uint32(/* id 2, wireType 0 =*/16).bool(message.accepted);
                if (message.error != null && Object.hasOwnProperty.call(message, "error"))
                    $root.osp.v1.ErrorInfo.encode(message.error, writer.uint32(/* id 3, wireType 2 =*/26).fork(), q + 1).ldelim();
                if (message.revision != null && Object.hasOwnProperty.call(message, "revision"))
                    writer.uint32(/* id 4, wireType 0 =*/32).uint64(message.revision);
                return writer;
            };

            /**
             * Encodes the specified OpAck message, length delimited. Does not implicitly {@link osp.v1.OpAck.verify|verify} messages.
             * @function encodeDelimited
             * @memberof osp.v1.OpAck
             * @static
             * @param {osp.v1.IOpAck} message OpAck message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            OpAck.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
            };

            /**
             * Decodes an OpAck message from the specified reader or buffer.
             * @function decode
             * @memberof osp.v1.OpAck
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {osp.v1.OpAck} OpAck
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            OpAck.decode = function decode(reader, length, error, long) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (long === undefined)
                    long = 0;
                if (long > $Reader.recursionLimit)
                    throw Error("maximum nesting depth exceeded");
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.osp.v1.OpAck();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            message.opId = reader.string();
                            break;
                        }
                    case 2: {
                            message.accepted = reader.bool();
                            break;
                        }
                    case 3: {
                            message.error = $root.osp.v1.ErrorInfo.decode(reader, reader.uint32(), undefined, long + 1);
                            break;
                        }
                    case 4: {
                            message.revision = reader.uint64();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7, long);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes an OpAck message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof osp.v1.OpAck
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {osp.v1.OpAck} OpAck
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            OpAck.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an OpAck message.
             * @function verify
             * @memberof osp.v1.OpAck
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            OpAck.verify = function verify(message, long) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (long === undefined)
                    long = 0;
                if (long > $util.recursionLimit)
                    return "maximum nesting depth exceeded";
                if (message.opId != null && Object.hasOwnProperty.call(message, "opId"))
                    if (!$util.isString(message.opId))
                        return "opId: string expected";
                if (message.accepted != null && Object.hasOwnProperty.call(message, "accepted"))
                    if (typeof message.accepted !== "boolean")
                        return "accepted: boolean expected";
                if (message.error != null && Object.hasOwnProperty.call(message, "error")) {
                    var error = $root.osp.v1.ErrorInfo.verify(message.error, long + 1);
                    if (error)
                        return "error." + error;
                }
                if (message.revision != null && Object.hasOwnProperty.call(message, "revision"))
                    if (!$util.isInteger(message.revision) && !(message.revision && $util.isInteger(message.revision.low) && $util.isInteger(message.revision.high)))
                        return "revision: integer|Long expected";
                return null;
            };

            /**
             * Creates an OpAck message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof osp.v1.OpAck
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {osp.v1.OpAck} OpAck
             */
            OpAck.fromObject = function fromObject(object, long) {
                if (object instanceof $root.osp.v1.OpAck)
                    return object;
                if (!$util.isObject(object))
                    throw TypeError(".osp.v1.OpAck: object expected");
                if (long === undefined)
                    long = 0;
                if (long > $util.recursionLimit)
                    throw Error("maximum nesting depth exceeded");
                var message = new $root.osp.v1.OpAck();
                if (object.opId != null)
                    message.opId = String(object.opId);
                if (object.accepted != null)
                    message.accepted = Boolean(object.accepted);
                if (object.error != null) {
                    if (!$util.isObject(object.error))
                        throw TypeError(".osp.v1.OpAck.error: object expected");
                    message.error = $root.osp.v1.ErrorInfo.fromObject(object.error, long + 1);
                }
                if (object.revision != null)
                    if ($util.Long)
                        message.revision = $util.Long.fromValue(object.revision, true);
                    else if (typeof object.revision === "string")
                        message.revision = parseInt(object.revision, 10);
                    else if (typeof object.revision === "number")
                        message.revision = object.revision;
                    else if (typeof object.revision === "object")
                        message.revision = new $util.LongBits(object.revision.low >>> 0, object.revision.high >>> 0).toNumber(true);
                return message;
            };

            /**
             * Creates a plain object from an OpAck message. Also converts values to other types if specified.
             * @function toObject
             * @memberof osp.v1.OpAck
             * @static
             * @param {osp.v1.OpAck} message OpAck
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            OpAck.toObject = function toObject(message, options, q) {
                if (!options)
                    options = {};
                if (q === undefined)
                    q = 0;
                if (q > $util.recursionLimit)
                    throw Error("max depth exceeded");
                var object = {};
                if (options.defaults) {
                    object.opId = "";
                    object.accepted = false;
                    object.error = null;
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.revision = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : typeof BigInt !== "undefined" && options.longs === BigInt ? long.toBigInt() : long;
                    } else
                        object.revision = options.longs === String ? "0" : typeof BigInt !== "undefined" && options.longs === BigInt ? BigInt("0") : 0;
                }
                if (message.opId != null && Object.hasOwnProperty.call(message, "opId"))
                    object.opId = message.opId;
                if (message.accepted != null && Object.hasOwnProperty.call(message, "accepted"))
                    object.accepted = message.accepted;
                if (message.error != null && Object.hasOwnProperty.call(message, "error"))
                    object.error = $root.osp.v1.ErrorInfo.toObject(message.error, options, q + 1);
                if (message.revision != null && Object.hasOwnProperty.call(message, "revision"))
                    if (typeof BigInt !== "undefined" && options.longs === BigInt)
                        object.revision = typeof message.revision === "number" ? BigInt(message.revision) : $util.Long.fromBits(message.revision.low >>> 0, message.revision.high >>> 0, true).toBigInt();
                    else if (typeof message.revision === "number")
                        object.revision = options.longs === String ? String(message.revision) : message.revision;
                    else
                        object.revision = options.longs === String ? $util.Long.prototype.toString.call(message.revision) : options.longs === Number ? new $util.LongBits(message.revision.low >>> 0, message.revision.high >>> 0).toNumber(true) : message.revision;
                return object;
            };

            /**
             * Converts this OpAck to JSON.
             * @function toJSON
             * @memberof osp.v1.OpAck
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            OpAck.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for OpAck
             * @function getTypeUrl
             * @memberof osp.v1.OpAck
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            OpAck.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/osp.v1.OpAck";
            };

            return OpAck;
        })();

        v1.SyncPush = (function() {

            /**
             * Properties of a SyncPush.
             * @memberof osp.v1
             * @interface ISyncPush
             * @property {Array.<osp.v1.IOperation>|null} [ops] SyncPush ops
             */

            /**
             * Constructs a new SyncPush.
             * @memberof osp.v1
             * @classdesc Represents a SyncPush.
             * @implements ISyncPush
             * @constructor
             * @param {osp.v1.ISyncPush=} [properties] Properties to set
             */
            function SyncPush(properties) {
                this.ops = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * SyncPush ops.
             * @member {Array.<osp.v1.IOperation>} ops
             * @memberof osp.v1.SyncPush
             * @instance
             */
            SyncPush.prototype.ops = $util.emptyArray;

            /**
             * Creates a new SyncPush instance using the specified properties.
             * @function create
             * @memberof osp.v1.SyncPush
             * @static
             * @param {osp.v1.ISyncPush=} [properties] Properties to set
             * @returns {osp.v1.SyncPush} SyncPush instance
             */
            SyncPush.create = function create(properties) {
                return new SyncPush(properties);
            };

            /**
             * Encodes the specified SyncPush message. Does not implicitly {@link osp.v1.SyncPush.verify|verify} messages.
             * @function encode
             * @memberof osp.v1.SyncPush
             * @static
             * @param {osp.v1.ISyncPush} message SyncPush message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SyncPush.encode = function encode(message, writer, q) {
                if (!writer)
                    writer = $Writer.create();
                if (q === undefined)
                    q = 0;
                if (q > $util.recursionLimit)
                    throw Error("max depth exceeded");
                if (message.ops != null && message.ops.length)
                    for (var i = 0; i < message.ops.length; ++i)
                        $root.osp.v1.Operation.encode(message.ops[i], writer.uint32(/* id 1, wireType 2 =*/10).fork(), q + 1).ldelim();
                return writer;
            };

            /**
             * Encodes the specified SyncPush message, length delimited. Does not implicitly {@link osp.v1.SyncPush.verify|verify} messages.
             * @function encodeDelimited
             * @memberof osp.v1.SyncPush
             * @static
             * @param {osp.v1.ISyncPush} message SyncPush message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SyncPush.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
            };

            /**
             * Decodes a SyncPush message from the specified reader or buffer.
             * @function decode
             * @memberof osp.v1.SyncPush
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {osp.v1.SyncPush} SyncPush
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SyncPush.decode = function decode(reader, length, error, long) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (long === undefined)
                    long = 0;
                if (long > $Reader.recursionLimit)
                    throw Error("maximum nesting depth exceeded");
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.osp.v1.SyncPush();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            if (!(message.ops && message.ops.length))
                                message.ops = [];
                            message.ops.push($root.osp.v1.Operation.decode(reader, reader.uint32(), undefined, long + 1));
                            break;
                        }
                    default:
                        reader.skipType(tag & 7, long);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a SyncPush message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof osp.v1.SyncPush
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {osp.v1.SyncPush} SyncPush
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SyncPush.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a SyncPush message.
             * @function verify
             * @memberof osp.v1.SyncPush
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            SyncPush.verify = function verify(message, long) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (long === undefined)
                    long = 0;
                if (long > $util.recursionLimit)
                    return "maximum nesting depth exceeded";
                if (message.ops != null && Object.hasOwnProperty.call(message, "ops")) {
                    if (!Array.isArray(message.ops))
                        return "ops: array expected";
                    for (var i = 0; i < message.ops.length; ++i) {
                        var error = $root.osp.v1.Operation.verify(message.ops[i], long + 1);
                        if (error)
                            return "ops." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a SyncPush message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof osp.v1.SyncPush
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {osp.v1.SyncPush} SyncPush
             */
            SyncPush.fromObject = function fromObject(object, long) {
                if (object instanceof $root.osp.v1.SyncPush)
                    return object;
                if (!$util.isObject(object))
                    throw TypeError(".osp.v1.SyncPush: object expected");
                if (long === undefined)
                    long = 0;
                if (long > $util.recursionLimit)
                    throw Error("maximum nesting depth exceeded");
                var message = new $root.osp.v1.SyncPush();
                if (object.ops) {
                    if (!Array.isArray(object.ops))
                        throw TypeError(".osp.v1.SyncPush.ops: array expected");
                    message.ops = [];
                    for (var i = 0; i < object.ops.length; ++i) {
                        if (!$util.isObject(object.ops[i]))
                            throw TypeError(".osp.v1.SyncPush.ops: object expected");
                        message.ops[i] = $root.osp.v1.Operation.fromObject(object.ops[i], long + 1);
                    }
                }
                return message;
            };

            /**
             * Creates a plain object from a SyncPush message. Also converts values to other types if specified.
             * @function toObject
             * @memberof osp.v1.SyncPush
             * @static
             * @param {osp.v1.SyncPush} message SyncPush
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            SyncPush.toObject = function toObject(message, options, q) {
                if (!options)
                    options = {};
                if (q === undefined)
                    q = 0;
                if (q > $util.recursionLimit)
                    throw Error("max depth exceeded");
                var object = {};
                if (options.arrays || options.defaults)
                    object.ops = [];
                if (message.ops && message.ops.length) {
                    object.ops = [];
                    for (var j = 0; j < message.ops.length; ++j)
                        object.ops[j] = $root.osp.v1.Operation.toObject(message.ops[j], options, q + 1);
                }
                return object;
            };

            /**
             * Converts this SyncPush to JSON.
             * @function toJSON
             * @memberof osp.v1.SyncPush
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            SyncPush.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for SyncPush
             * @function getTypeUrl
             * @memberof osp.v1.SyncPush
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            SyncPush.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/osp.v1.SyncPush";
            };

            return SyncPush;
        })();

        v1.SyncPullRequest = (function() {

            /**
             * Properties of a SyncPullRequest.
             * @memberof osp.v1
             * @interface ISyncPullRequest
             * @property {string|null} [collection] SyncPullRequest collection
             * @property {number|Long|null} [sinceLamport] SyncPullRequest sinceLamport
             * @property {number|null} [maxOps] SyncPullRequest maxOps
             */

            /**
             * Constructs a new SyncPullRequest.
             * @memberof osp.v1
             * @classdesc Represents a SyncPullRequest.
             * @implements ISyncPullRequest
             * @constructor
             * @param {osp.v1.ISyncPullRequest=} [properties] Properties to set
             */
            function SyncPullRequest(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * SyncPullRequest collection.
             * @member {string} collection
             * @memberof osp.v1.SyncPullRequest
             * @instance
             */
            SyncPullRequest.prototype.collection = "";

            /**
             * SyncPullRequest sinceLamport.
             * @member {number|Long} sinceLamport
             * @memberof osp.v1.SyncPullRequest
             * @instance
             */
            SyncPullRequest.prototype.sinceLamport = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * SyncPullRequest maxOps.
             * @member {number} maxOps
             * @memberof osp.v1.SyncPullRequest
             * @instance
             */
            SyncPullRequest.prototype.maxOps = 0;

            /**
             * Creates a new SyncPullRequest instance using the specified properties.
             * @function create
             * @memberof osp.v1.SyncPullRequest
             * @static
             * @param {osp.v1.ISyncPullRequest=} [properties] Properties to set
             * @returns {osp.v1.SyncPullRequest} SyncPullRequest instance
             */
            SyncPullRequest.create = function create(properties) {
                return new SyncPullRequest(properties);
            };

            /**
             * Encodes the specified SyncPullRequest message. Does not implicitly {@link osp.v1.SyncPullRequest.verify|verify} messages.
             * @function encode
             * @memberof osp.v1.SyncPullRequest
             * @static
             * @param {osp.v1.ISyncPullRequest} message SyncPullRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SyncPullRequest.encode = function encode(message, writer, q) {
                if (!writer)
                    writer = $Writer.create();
                if (q === undefined)
                    q = 0;
                if (q > $util.recursionLimit)
                    throw Error("max depth exceeded");
                if (message.collection != null && Object.hasOwnProperty.call(message, "collection"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.collection);
                if (message.sinceLamport != null && Object.hasOwnProperty.call(message, "sinceLamport"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.sinceLamport);
                if (message.maxOps != null && Object.hasOwnProperty.call(message, "maxOps"))
                    writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.maxOps);
                return writer;
            };

            /**
             * Encodes the specified SyncPullRequest message, length delimited. Does not implicitly {@link osp.v1.SyncPullRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof osp.v1.SyncPullRequest
             * @static
             * @param {osp.v1.ISyncPullRequest} message SyncPullRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SyncPullRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
            };

            /**
             * Decodes a SyncPullRequest message from the specified reader or buffer.
             * @function decode
             * @memberof osp.v1.SyncPullRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {osp.v1.SyncPullRequest} SyncPullRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SyncPullRequest.decode = function decode(reader, length, error, long) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (long === undefined)
                    long = 0;
                if (long > $Reader.recursionLimit)
                    throw Error("maximum nesting depth exceeded");
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.osp.v1.SyncPullRequest();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            message.collection = reader.string();
                            break;
                        }
                    case 2: {
                            message.sinceLamport = reader.uint64();
                            break;
                        }
                    case 3: {
                            message.maxOps = reader.uint32();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7, long);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a SyncPullRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof osp.v1.SyncPullRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {osp.v1.SyncPullRequest} SyncPullRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SyncPullRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a SyncPullRequest message.
             * @function verify
             * @memberof osp.v1.SyncPullRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            SyncPullRequest.verify = function verify(message, long) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (long === undefined)
                    long = 0;
                if (long > $util.recursionLimit)
                    return "maximum nesting depth exceeded";
                if (message.collection != null && Object.hasOwnProperty.call(message, "collection"))
                    if (!$util.isString(message.collection))
                        return "collection: string expected";
                if (message.sinceLamport != null && Object.hasOwnProperty.call(message, "sinceLamport"))
                    if (!$util.isInteger(message.sinceLamport) && !(message.sinceLamport && $util.isInteger(message.sinceLamport.low) && $util.isInteger(message.sinceLamport.high)))
                        return "sinceLamport: integer|Long expected";
                if (message.maxOps != null && Object.hasOwnProperty.call(message, "maxOps"))
                    if (!$util.isInteger(message.maxOps))
                        return "maxOps: integer expected";
                return null;
            };

            /**
             * Creates a SyncPullRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof osp.v1.SyncPullRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {osp.v1.SyncPullRequest} SyncPullRequest
             */
            SyncPullRequest.fromObject = function fromObject(object, long) {
                if (object instanceof $root.osp.v1.SyncPullRequest)
                    return object;
                if (!$util.isObject(object))
                    throw TypeError(".osp.v1.SyncPullRequest: object expected");
                if (long === undefined)
                    long = 0;
                if (long > $util.recursionLimit)
                    throw Error("maximum nesting depth exceeded");
                var message = new $root.osp.v1.SyncPullRequest();
                if (object.collection != null)
                    message.collection = String(object.collection);
                if (object.sinceLamport != null)
                    if ($util.Long)
                        message.sinceLamport = $util.Long.fromValue(object.sinceLamport, true);
                    else if (typeof object.sinceLamport === "string")
                        message.sinceLamport = parseInt(object.sinceLamport, 10);
                    else if (typeof object.sinceLamport === "number")
                        message.sinceLamport = object.sinceLamport;
                    else if (typeof object.sinceLamport === "object")
                        message.sinceLamport = new $util.LongBits(object.sinceLamport.low >>> 0, object.sinceLamport.high >>> 0).toNumber(true);
                if (object.maxOps != null)
                    message.maxOps = object.maxOps >>> 0;
                return message;
            };

            /**
             * Creates a plain object from a SyncPullRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof osp.v1.SyncPullRequest
             * @static
             * @param {osp.v1.SyncPullRequest} message SyncPullRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            SyncPullRequest.toObject = function toObject(message, options, q) {
                if (!options)
                    options = {};
                if (q === undefined)
                    q = 0;
                if (q > $util.recursionLimit)
                    throw Error("max depth exceeded");
                var object = {};
                if (options.defaults) {
                    object.collection = "";
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.sinceLamport = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : typeof BigInt !== "undefined" && options.longs === BigInt ? long.toBigInt() : long;
                    } else
                        object.sinceLamport = options.longs === String ? "0" : typeof BigInt !== "undefined" && options.longs === BigInt ? BigInt("0") : 0;
                    object.maxOps = 0;
                }
                if (message.collection != null && Object.hasOwnProperty.call(message, "collection"))
                    object.collection = message.collection;
                if (message.sinceLamport != null && Object.hasOwnProperty.call(message, "sinceLamport"))
                    if (typeof BigInt !== "undefined" && options.longs === BigInt)
                        object.sinceLamport = typeof message.sinceLamport === "number" ? BigInt(message.sinceLamport) : $util.Long.fromBits(message.sinceLamport.low >>> 0, message.sinceLamport.high >>> 0, true).toBigInt();
                    else if (typeof message.sinceLamport === "number")
                        object.sinceLamport = options.longs === String ? String(message.sinceLamport) : message.sinceLamport;
                    else
                        object.sinceLamport = options.longs === String ? $util.Long.prototype.toString.call(message.sinceLamport) : options.longs === Number ? new $util.LongBits(message.sinceLamport.low >>> 0, message.sinceLamport.high >>> 0).toNumber(true) : message.sinceLamport;
                if (message.maxOps != null && Object.hasOwnProperty.call(message, "maxOps"))
                    object.maxOps = message.maxOps;
                return object;
            };

            /**
             * Converts this SyncPullRequest to JSON.
             * @function toJSON
             * @memberof osp.v1.SyncPullRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            SyncPullRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for SyncPullRequest
             * @function getTypeUrl
             * @memberof osp.v1.SyncPullRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            SyncPullRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/osp.v1.SyncPullRequest";
            };

            return SyncPullRequest;
        })();

        v1.SyncPullResponse = (function() {

            /**
             * Properties of a SyncPullResponse.
             * @memberof osp.v1
             * @interface ISyncPullResponse
             * @property {string|null} [collection] SyncPullResponse collection
             * @property {number|Long|null} [sinceLamport] SyncPullResponse sinceLamport
             * @property {Array.<osp.v1.IOperation>|null} [ops] SyncPullResponse ops
             * @property {boolean|null} [hasMore] SyncPullResponse hasMore
             */

            /**
             * Constructs a new SyncPullResponse.
             * @memberof osp.v1
             * @classdesc Represents a SyncPullResponse.
             * @implements ISyncPullResponse
             * @constructor
             * @param {osp.v1.ISyncPullResponse=} [properties] Properties to set
             */
            function SyncPullResponse(properties) {
                this.ops = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * SyncPullResponse collection.
             * @member {string} collection
             * @memberof osp.v1.SyncPullResponse
             * @instance
             */
            SyncPullResponse.prototype.collection = "";

            /**
             * SyncPullResponse sinceLamport.
             * @member {number|Long} sinceLamport
             * @memberof osp.v1.SyncPullResponse
             * @instance
             */
            SyncPullResponse.prototype.sinceLamport = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * SyncPullResponse ops.
             * @member {Array.<osp.v1.IOperation>} ops
             * @memberof osp.v1.SyncPullResponse
             * @instance
             */
            SyncPullResponse.prototype.ops = $util.emptyArray;

            /**
             * SyncPullResponse hasMore.
             * @member {boolean} hasMore
             * @memberof osp.v1.SyncPullResponse
             * @instance
             */
            SyncPullResponse.prototype.hasMore = false;

            /**
             * Creates a new SyncPullResponse instance using the specified properties.
             * @function create
             * @memberof osp.v1.SyncPullResponse
             * @static
             * @param {osp.v1.ISyncPullResponse=} [properties] Properties to set
             * @returns {osp.v1.SyncPullResponse} SyncPullResponse instance
             */
            SyncPullResponse.create = function create(properties) {
                return new SyncPullResponse(properties);
            };

            /**
             * Encodes the specified SyncPullResponse message. Does not implicitly {@link osp.v1.SyncPullResponse.verify|verify} messages.
             * @function encode
             * @memberof osp.v1.SyncPullResponse
             * @static
             * @param {osp.v1.ISyncPullResponse} message SyncPullResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SyncPullResponse.encode = function encode(message, writer, q) {
                if (!writer)
                    writer = $Writer.create();
                if (q === undefined)
                    q = 0;
                if (q > $util.recursionLimit)
                    throw Error("max depth exceeded");
                if (message.collection != null && Object.hasOwnProperty.call(message, "collection"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.collection);
                if (message.sinceLamport != null && Object.hasOwnProperty.call(message, "sinceLamport"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.sinceLamport);
                if (message.ops != null && message.ops.length)
                    for (var i = 0; i < message.ops.length; ++i)
                        $root.osp.v1.Operation.encode(message.ops[i], writer.uint32(/* id 3, wireType 2 =*/26).fork(), q + 1).ldelim();
                if (message.hasMore != null && Object.hasOwnProperty.call(message, "hasMore"))
                    writer.uint32(/* id 4, wireType 0 =*/32).bool(message.hasMore);
                return writer;
            };

            /**
             * Encodes the specified SyncPullResponse message, length delimited. Does not implicitly {@link osp.v1.SyncPullResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof osp.v1.SyncPullResponse
             * @static
             * @param {osp.v1.ISyncPullResponse} message SyncPullResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SyncPullResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
            };

            /**
             * Decodes a SyncPullResponse message from the specified reader or buffer.
             * @function decode
             * @memberof osp.v1.SyncPullResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {osp.v1.SyncPullResponse} SyncPullResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SyncPullResponse.decode = function decode(reader, length, error, long) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (long === undefined)
                    long = 0;
                if (long > $Reader.recursionLimit)
                    throw Error("maximum nesting depth exceeded");
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.osp.v1.SyncPullResponse();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            message.collection = reader.string();
                            break;
                        }
                    case 2: {
                            message.sinceLamport = reader.uint64();
                            break;
                        }
                    case 3: {
                            if (!(message.ops && message.ops.length))
                                message.ops = [];
                            message.ops.push($root.osp.v1.Operation.decode(reader, reader.uint32(), undefined, long + 1));
                            break;
                        }
                    case 4: {
                            message.hasMore = reader.bool();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7, long);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a SyncPullResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof osp.v1.SyncPullResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {osp.v1.SyncPullResponse} SyncPullResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SyncPullResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a SyncPullResponse message.
             * @function verify
             * @memberof osp.v1.SyncPullResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            SyncPullResponse.verify = function verify(message, long) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (long === undefined)
                    long = 0;
                if (long > $util.recursionLimit)
                    return "maximum nesting depth exceeded";
                if (message.collection != null && Object.hasOwnProperty.call(message, "collection"))
                    if (!$util.isString(message.collection))
                        return "collection: string expected";
                if (message.sinceLamport != null && Object.hasOwnProperty.call(message, "sinceLamport"))
                    if (!$util.isInteger(message.sinceLamport) && !(message.sinceLamport && $util.isInteger(message.sinceLamport.low) && $util.isInteger(message.sinceLamport.high)))
                        return "sinceLamport: integer|Long expected";
                if (message.ops != null && Object.hasOwnProperty.call(message, "ops")) {
                    if (!Array.isArray(message.ops))
                        return "ops: array expected";
                    for (var i = 0; i < message.ops.length; ++i) {
                        var error = $root.osp.v1.Operation.verify(message.ops[i], long + 1);
                        if (error)
                            return "ops." + error;
                    }
                }
                if (message.hasMore != null && Object.hasOwnProperty.call(message, "hasMore"))
                    if (typeof message.hasMore !== "boolean")
                        return "hasMore: boolean expected";
                return null;
            };

            /**
             * Creates a SyncPullResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof osp.v1.SyncPullResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {osp.v1.SyncPullResponse} SyncPullResponse
             */
            SyncPullResponse.fromObject = function fromObject(object, long) {
                if (object instanceof $root.osp.v1.SyncPullResponse)
                    return object;
                if (!$util.isObject(object))
                    throw TypeError(".osp.v1.SyncPullResponse: object expected");
                if (long === undefined)
                    long = 0;
                if (long > $util.recursionLimit)
                    throw Error("maximum nesting depth exceeded");
                var message = new $root.osp.v1.SyncPullResponse();
                if (object.collection != null)
                    message.collection = String(object.collection);
                if (object.sinceLamport != null)
                    if ($util.Long)
                        message.sinceLamport = $util.Long.fromValue(object.sinceLamport, true);
                    else if (typeof object.sinceLamport === "string")
                        message.sinceLamport = parseInt(object.sinceLamport, 10);
                    else if (typeof object.sinceLamport === "number")
                        message.sinceLamport = object.sinceLamport;
                    else if (typeof object.sinceLamport === "object")
                        message.sinceLamport = new $util.LongBits(object.sinceLamport.low >>> 0, object.sinceLamport.high >>> 0).toNumber(true);
                if (object.ops) {
                    if (!Array.isArray(object.ops))
                        throw TypeError(".osp.v1.SyncPullResponse.ops: array expected");
                    message.ops = [];
                    for (var i = 0; i < object.ops.length; ++i) {
                        if (!$util.isObject(object.ops[i]))
                            throw TypeError(".osp.v1.SyncPullResponse.ops: object expected");
                        message.ops[i] = $root.osp.v1.Operation.fromObject(object.ops[i], long + 1);
                    }
                }
                if (object.hasMore != null)
                    message.hasMore = Boolean(object.hasMore);
                return message;
            };

            /**
             * Creates a plain object from a SyncPullResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof osp.v1.SyncPullResponse
             * @static
             * @param {osp.v1.SyncPullResponse} message SyncPullResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            SyncPullResponse.toObject = function toObject(message, options, q) {
                if (!options)
                    options = {};
                if (q === undefined)
                    q = 0;
                if (q > $util.recursionLimit)
                    throw Error("max depth exceeded");
                var object = {};
                if (options.arrays || options.defaults)
                    object.ops = [];
                if (options.defaults) {
                    object.collection = "";
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.sinceLamport = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : typeof BigInt !== "undefined" && options.longs === BigInt ? long.toBigInt() : long;
                    } else
                        object.sinceLamport = options.longs === String ? "0" : typeof BigInt !== "undefined" && options.longs === BigInt ? BigInt("0") : 0;
                    object.hasMore = false;
                }
                if (message.collection != null && Object.hasOwnProperty.call(message, "collection"))
                    object.collection = message.collection;
                if (message.sinceLamport != null && Object.hasOwnProperty.call(message, "sinceLamport"))
                    if (typeof BigInt !== "undefined" && options.longs === BigInt)
                        object.sinceLamport = typeof message.sinceLamport === "number" ? BigInt(message.sinceLamport) : $util.Long.fromBits(message.sinceLamport.low >>> 0, message.sinceLamport.high >>> 0, true).toBigInt();
                    else if (typeof message.sinceLamport === "number")
                        object.sinceLamport = options.longs === String ? String(message.sinceLamport) : message.sinceLamport;
                    else
                        object.sinceLamport = options.longs === String ? $util.Long.prototype.toString.call(message.sinceLamport) : options.longs === Number ? new $util.LongBits(message.sinceLamport.low >>> 0, message.sinceLamport.high >>> 0).toNumber(true) : message.sinceLamport;
                if (message.ops && message.ops.length) {
                    object.ops = [];
                    for (var j = 0; j < message.ops.length; ++j)
                        object.ops[j] = $root.osp.v1.Operation.toObject(message.ops[j], options, q + 1);
                }
                if (message.hasMore != null && Object.hasOwnProperty.call(message, "hasMore"))
                    object.hasMore = message.hasMore;
                return object;
            };

            /**
             * Converts this SyncPullResponse to JSON.
             * @function toJSON
             * @memberof osp.v1.SyncPullResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            SyncPullResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for SyncPullResponse
             * @function getTypeUrl
             * @memberof osp.v1.SyncPullResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            SyncPullResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/osp.v1.SyncPullResponse";
            };

            return SyncPullResponse;
        })();

        return v1;
    })();

    return osp;
})();

module.exports = $root;
