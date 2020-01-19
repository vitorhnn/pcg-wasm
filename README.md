# PCG-WASM: an implementation of the Permuted Congruential Generator PRNG

This is a *toy* implementation of the PCG algorithm in C, compiled to WASM using emscripten and loaded via @rollup/plugin-wasm. It was built in one night and is probably terribly broken.

It is *NOT* a cryptographically secure PRNG, do *not* use it for such purposes!

Many thanks to icefox and his [oorandom](https://hg.sr.ht/~icefox/oorandom) crate for Rust, which inspired me to build this!
