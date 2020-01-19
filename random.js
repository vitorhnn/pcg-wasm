import pcg from './dist/pcg.wasm';

const instance = pcg(['rand_u32']);

const { memory, rand_u32: rand_u32_impl } = instance.exports;

export default class Random {
    constructor(seedHi, seedLo) {  
        this.stateHi = 0;
        this.stateLo = 0;
        this.memoryView = new Uint32Array(memory.buffer);

        this.randU32();

        // JS -> WASM calls are cheap, but this is one time only and I cba to create C function for this
        this.stateHi += seedHi;
        this.stateLo += seedLo;

        if (this.stateLo < seedLo) {
            this.stateHi += 1;
        }

        this.randU32();
    }

    static fromBigInt(bigint) {
        const u64 = BigInt.asUintN(64, bigint);

        const hiBits = Number(bigint & 0xFFFFFFFFn);
        const loBits = Number(bigint >> 32n);

        return new Random(hiBits, loBits);
    }

    randU32() {
        rand_u32_impl(0, this.stateHi, this.stateLo);
        const [rand, newHi, newLo] = this.memoryView;

        this.stateHi = newHi;
        this.stateLo = newLo;

        return rand;
    }
}
