"use strict";

var protobuf  = require("protobufjs"),
    newSuite  = require("./suite"),
    data      = require("./bench.json");

var root = protobuf.loadSync(require.resolve("./bench.proto")),
    Test = root.resolveAll().lookup("Test");

var assert = require('assert');
var Long = require("long");
var Test2 = require('./bench_pb').Test;

function convertDataToArray(data) {
    if (data.low && data.high && data.unsigned !== undefined) {
        return new Long(data.low, data.high, data.unsigned).toString();
    }
    return Object.keys(data).map((key) => {
        return isObject(data[key]) ? convertDataToArray(data[key]) : data[key];
    });
}

function isObject(data) {
    return data && typeof data === 'object' && !Array.isArray(data);
}

var arr = convertDataToArray(data);
var t2 = new Test2(arr);

// protobuf.util.codegen.verbose = true;

var buf = Test.encode(data).finish();
var uint8 = t2.serializeBinary();

assert(buf.equals(Buffer.from(uint8.buffer)));

// warm up
// process.stdout.write("warming up ...\n");
// var i;
// for (i = 0; i < 500000; ++i)
//     Test.encode(data).finish();
// for (i = 0; i < 1000000; ++i)
//     Test.decode(buf);
// for (i = 0; i < 500000; ++i)
//     Test.verify(data);
// process.stdout.write("\n");

// give the optimizer some time to do its job
setTimeout(function() {
    newSuite("encoding")
    .add("protobufjs.encode to buffer", function() {
        Test.encode(data).finish();
    })
    .add("google-protobuf.serializeBinary to Uint8Array", function() {
        new Test2(arr).serializeBinary();
    })
    .run();

    newSuite("decoding")
    .add("protobufjs.decode from buffer", function() {
        Test.decode(buf); // no allocation overhead, if you wondered
    })
    .add("google-protobuf.deserializeBinary from Uint8Array", function() {
        Test2.deserializeBinary(uint8);
    })
    .run();

    var dataMessage = Test.from(data);
    var dataObject = dataMessage.toObject();
    var dataMessage2 = new Test2(arr);
    var dataObject2 = dataMessage2.toObject();

    newSuite("message from object")
    .add("protobufjs.fromObject", function() {
        Test.fromObject(dataObject);
    })
    .run();
    
    newSuite("message to object")
    .add("protobufjs.toObject", function() {
        Test.toObject(dataMessage);
    })
    .add("google-protobuf.toObject", function() {
        Test2.toObject(false, dataMessage2);
    })
    .run();

}, 3000);
