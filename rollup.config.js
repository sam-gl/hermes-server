import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import external from 'rollup-plugin-peer-deps-external';

import pkg from "./package.json" assert { type: "json" };

export default {
  input: "src/app.ts",
  output: {
    file: pkg.main,
    format: 'cjs'
  },
  plugins: [
    external(),
    resolve(),
    typescript({ tsconfig: './tsconfig.json' })
  ]
}