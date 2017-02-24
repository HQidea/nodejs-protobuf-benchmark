# nodejs-protobuf-benchmark

## packages

+ protobufjs: https://github.com/dcodeIO/protobuf.js

+ google-protobuf: https://github.com/google/protobuf/tree/master/js

## run

+ node index.js

## results

On an i5(1.4 GHz) running node 6.9.0 it yields:

```
benchmarking encoding performance ...

protobufjs.encode to buffer x 362,191 ops/sec ±7.76% (67 runs sampled)
google-protobuf.serializeBinary to Uint8Array x 49,607 ops/sec ±19.88% (69 runs sampled)

protobufjs.encode to buffer was fastest
google-protobuf.serializeBinary to Uint8Array was 87.7% slower

benchmarking decoding performance ...

protobufjs.decode from buffer x 794,321 ops/sec ±3.45% (72 runs sampled)
google-protobuf.deserializeBinary from Uint8Array x 160,974 ops/sec ±2.48% (77 runs sampled)

protobufjs.decode from buffer was fastest
google-protobuf.deserializeBinary from Uint8Array was 79.5% slower

benchmarking message from object performance ...

protobufjs.fromObject x 1,468,331 ops/sec ±2.61% (75 runs sampled)

benchmarking message to object performance ...

protobufjs.toObject x 2,506,193 ops/sec ±4.08% (72 runs sampled)
google-protobuf.toObject x 3,257,352 ops/sec ±2.21% (77 runs sampled)

   google-protobuf.toObject was fastest
        protobufjs.toObject was 24.4% slower
```

inspired by protobufjs's benchmark
