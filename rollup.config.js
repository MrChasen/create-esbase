import typescript from '@rollup/plugin-typescript';
export default {
  input: './main.ts',
  output: {
    file: 'index.js',
    format: 'cjs',
    strict: false,
    banner: "#! /usr/bin/env node\n"
  },
  plugins:[
    typescript()
  ]
}
