# nodejs-protobuf-benchmark

## packages

+ protobufjs: https://github.com/dcodeIO/protobuf.js

+ google-protobuf: https://github.com/google/protobuf/tree/master/js

+ pbf: https://github.com/mapbox/pbf

## run

+ node index.js

## results

On an i5(1.4 GHz) running node 6.9.0 it yields:

```
benchmarking encoding performance ...

protobufjs.encode to buffer x 455,766 ops/sec ±2.28% (79 runs sampled)
protobufjs.encode to Uint8Array x 256,879 ops/sec ±2.48% (78 runs sampled)
google-protobuf.serializeBinary to buffer with sharing memory x 51,748 ops/sec ±36.49% (76 runs sampled)
google-protobuf.serializeBinary to buffer with copying x 60,586 ops/sec ±2.53% (78 runs sampled)
google-protobuf.serializeBinary to Uint8Array x 72,340 ops/sec ±2.14% (76 runs sampled)
pbf.write to buffer with sharing memory x 146,368 ops/sec ±5.45% (57 runs sampled)
pbf.write to buffer with copying x 138,944 ops/sec ±5.81% (58 runs sampled)
pbf.write to Uint8Array x 163,152 ops/sec ±5.84% (59 runs sampled)

protobufjs.encode to buffer was fastest
protobufjs.encode to Uint8Array was 43.7% slower
google-protobuf.serializeBinary to buffer with sharing memory was 91.5% slower
google-protobuf.serializeBinary to buffer with copying was 86.7% slower
google-protobuf.serializeBinary to Uint8Array was 84.1% slower
pbf.write to buffer with sharing memory was 68.8% slower
pbf.write to buffer with copying was 70.5% slower
    pbf.write to Uint8Array was 65.4% slower

benchmarking decoding performance ...

protobufjs.decode from buffer x 1,011,902 ops/sec ±2.16% (81 runs sampled)
protobufjs.decode from Uint8Array with sharing memory x 1,277,010 ops/sec ±2.25% (78 runs sampled)
protobufjs.decode from Uint8Array with copying x 612,017 ops/sec ±2.57% (80 runs sampled)
google-protobuf.deserializeBinary from buffer x 148,015 ops/sec ±2.22% (78 runs sampled)
google-protobuf.deserializeBinary from Uint8Array x 193,736 ops/sec ±2.36% (81 runs sampled)
pbf.read from buffer x 334,678 ops/sec ±2.16% (78 runs sampled)
pbf.read from Uint8Array x 608,753 ops/sec ±2.09% (80 runs sampled)

protobufjs.decode from Uint8Array with sharing memory was fastest
protobufjs.decode from buffer was 20.7% slower
protobufjs.decode from Uint8Array with copying was 52.2% slower
google-protobuf.deserializeBinary from buffer was 88.4% slower
google-protobuf.deserializeBinary from Uint8Array was 84.8% slower
       pbf.read from buffer was 73.8% slower
   pbf.read from Uint8Array was 52.3% slower

benchmarking message from object performance ...

protobufjs.fromObject x 1,699,952 ops/sec ±2.17% (79 runs sampled)

benchmarking message to object performance ...

protobufjs.toObject x 2,890,178 ops/sec ±2.08% (81 runs sampled)
google-protobuf.toObject x 3,637,612 ops/sec ±2.07% (79 runs sampled)

   google-protobuf.toObject was fastest
        protobufjs.toObject was 20.6% slower
```

inspired by protobufjs's benchmark
