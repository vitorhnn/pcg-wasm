import pkg from './package.json';
import wasm from '@rollup/plugin-wasm';

export default {
    input: './random.js',
    plugins: [
        wasm({ sync: ['./dist/pcg.wasm'] }),
    ],
    output: [
        { file: pkg.main, format: 'cjs' },
        { file: pkg.module, format: 'es' },
    ],
}
