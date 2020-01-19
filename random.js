import pcg from './dist/pcg.wasm';

const instance = pcg(['rand_u32']);

const { memory, rand_u32: rand_u32_impl } = instance.exports;
const memoryView = new Uint32Array(memory.buffer);

export default class Random {
    constructor(seedHi, seedLo) {  
        this.stateHi = 0;
        this.stateLo = 0;

        this.randU32();

        // JS -> WASM calls are cheap, but this is one time only and I cba to create C function for this
        this.stateHi = (this.stateHi + seedHi) >>> 0;
        this.stateLo = (this.stateLo + seedLo) >>> 0;

        if (this.stateLo < seedLo) {
            this.stateHi = (this.stateHi + 1) >>> 0;
        }

        this.randU32();
    }

    static fromBigInt(bigint) {
        const u64 = BigInt.asUintN(64, bigint);

        const hiBits = Number(u64 >> 32n);
        const loBits = Number(u64 & 0x00000000FFFFFFFFn);

        return new Random(hiBits, loBits);
    }

    randU32() {
        rand_u32_impl(0, this.stateHi, this.stateLo);
        const [rand, newHi, newLo] = memoryView;

        this.stateHi = newHi;
        this.stateLo = newLo;

        return rand;
    }
}
