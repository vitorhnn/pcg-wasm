#include <stdint.h>
#include <emscripten.h>

// Constants taken from O'Neill's reference C implementation
// https://github.com/imneme/pcg-c/blob/83252d9c23df9c82ecb42210afed61a7b42402d7/include/pcg_variants.h#L279
const static uint64_t MULTIPLIER = 6364136223846793005;
// https://github.com/imneme/pcg-c/blob/83252d9c23df9c82ecb42210afed61a7b42402d7/include/pcg_variants.h#L284
const static uint64_t INCREMENT = 1442695040888963407;

struct rand32_ret {
    uint32_t random;
    uint32_t hiState;
    uint32_t loState;
};

EMSCRIPTEN_KEEPALIVE
struct rand32_ret rand_u32(uint32_t hiOld, uint32_t loOld)
{
    struct rand32_ret ret;

    uint64_t oldstate = (uint64_t) hiOld << 32 | loOld;

    uint64_t state = oldstate * MULTIPLIER + INCREMENT;
    uint32_t xorshifted = ((oldstate >> 18) ^ oldstate) >> 27;
    uint32_t rot = oldstate >> 59;

    ret.random = (xorshifted >> rot) | (xorshifted << ((-rot) & 31));
    ret.hiState = state >> 32;
    ret.loState = state & 0xFFFFFFFF;

    return ret;
}
