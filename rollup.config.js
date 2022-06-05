import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: './main.ts',
  output: {
    file: 'index.js',
    format: 'cjs',
    strict: false,
    banner: "#! /usr/bin/env node\n"
  },
  plugins:[
    nodeResolve(),
    commonjs(),
    typescript()
  ]
}
