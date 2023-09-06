import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import external from "rollup-plugin-peer-deps-external";
import sourcemaps from "rollup-plugin-sourcemaps";
import copy from "rollup-plugin-copy";
import watch from "rollup-plugin-watch";

import pkg from "./package.json" assert { type: "json" };

export default {
  input: "src/app.ts",
  output: {
    file: pkg.main,
    format: "cjs",
    sourcemap: true
  },
  plugins: [
    watch({ dir: "src/pages" }), // Rollup only watches for changes in the dependency chain from the input. Handlebars templates aren't imported in that way.
    commonjs(),
    json(),
    external(),
    resolve(),
    typescript({ tsconfig: "./tsconfig.json" }),
    sourcemaps(),
    copy({
      targets: [{ src: "src/pages", dest: "dist" }]
    })
  ],
  external: [/node_modules/]
};
