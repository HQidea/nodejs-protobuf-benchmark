'use strict';

var assert = require('assert');
var newSuite = require('./suite');
var json = require('./bench.json');
var Long = require('long');
var _ = require('lodash');

function isObject(data) {
    return data && typeof data === 'object' && !Array.isArray(data);
}

function long2String(obj) {
    if (obj.low && obj.high && obj.unsigned !== undefined) {
        return new Long(obj.low, obj.high, obj.unsigned).toString();
    }
    return obj;
}

function object2Array(obj) {
    return Object.keys(obj).map((key) => {
        var converted = long2String(obj[key]);
        return isObject(converted) ? object2Array(converted) : converted;
    });
}

function replaceLong(obj) {
    Object.keys(obj).forEach((key) => {
        var converted = long2String(obj[key]);
        obj[key] = isObject(converted) ? replaceLong(converted) : converted;
    });
    return obj;
}


/* protobufjs */
var protobufjs = require('protobufjs');
var root = protobufjs.loadSync(require.resolve('./bench.proto'));
var Test1 = root.resolveAll().lookup('Test');
var data1 = _.cloneDeep(json);
var buf1 = Test1.encode(data1).finish();
var uint8_1 = new Uint8Array(buf1);

/* google-protobuf */
var Test2 = require('./bench_pb').Test;
var data2 = object2Array(_.cloneDeep(json));
var t2 = new Test2(data2);
var uint8_2 = t2.serializeBinary();
var buf2 = Buffer.from(uint8_2.buffer);

/* pbf */
var Pbf = require('pbf');
var pbf = new Pbf();
var Test3 = require('./bench_pbf.js').Test;
var data3 = replaceLong(_.cloneDeep(json));
Test3.write(data3, pbf);
var uint8_3 = pbf.finish();
var buf3 = Buffer.from(uint8_3);


/* assert buffers equality */
assert(buf1.equals(buf2));
assert(buf1.equals(buf3));


/* startup */
newSuite('encoding')
.add('protobufjs.encode to buffer', function() {
    Test1.encode(data1).finish();
})
.add('protobufjs.encode to Uint8Array', function() {
    new Uint8Array(Test1.encode(data1).finish());
})
.add('google-protobuf.serializeBinary to buffer with sharing memory', function() {
    Buffer.from(new Test2(data2).serializeBinary().buffer);
})
.add('google-protobuf.serializeBinary to buffer with copying', function() {
    Buffer.from(new Test2(data2).serializeBinary());
})
.add('google-protobuf.serializeBinary to Uint8Array', function() {
    new Test2(data2).serializeBinary();
})
.add('pbf.write to buffer with sharing memory', function() {
    var pbf = new Pbf();
    Test3.write(data3, pbf);
    Buffer.from(pbf.finish().buffer);  // has extra bytes (0)
})
.add('pbf.write to buffer with copying', function() {
    var pbf = new Pbf();
    Test3.write(data3, pbf);
    Buffer.from(pbf.finish());
})
.add('pbf.write to Uint8Array', function() {
    var pbf = new Pbf();
    Test3.write(data3, pbf);
    pbf.finish();
})
.run();

newSuite('decoding')
.add('protobufjs.decode from buffer', function() {
    Test1.decode(buf1); // no allocation overhead, if you wondered
})
.add('protobufjs.decode from Uint8Array with sharing memory', function() {
    Test1.decode(Buffer.from(uint8_1).buffer);
})
.add('protobufjs.decode from Uint8Array with copying', function() {
    Test1.decode(Buffer.from(uint8_1));
})
.add('google-protobuf.deserializeBinary from buffer', function() {
    Test2.deserializeBinary(new Uint8Array(buf2));
})
.add('google-protobuf.deserializeBinary from Uint8Array', function() {
    Test2.deserializeBinary(uint8_2);
})
.add('pbf.read from buffer', function() {
    var pbf = new Pbf(new Uint8Array(buf3));
    Test3.read(pbf);
})
.add('pbf.read from Uint8Array', function() {
    var pbf = new Pbf(uint8_3);
    Test3.read(pbf);
})
.run();


var dataMessage1 = Test1.from(data1);
var dataObject1 = dataMessage1.toObject();
var dataMessage2 = new Test2(data2);
var dataObject2 = dataMessage2.toObject();

newSuite('message from object')
.add('protobufjs.fromObject', function() {
    Test1.fromObject(dataObject1);
})
.run();

newSuite('message to object')
.add('protobufjs.toObject', function() {
    Test1.toObject(dataMessage1);
})
.add('google-protobuf.toObject', function() {
    Test2.toObject(false, dataMessage2);
})
.run();
