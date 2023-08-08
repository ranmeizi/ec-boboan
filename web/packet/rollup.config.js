import typescript from "rollup-plugin-typescript2";
import commonjs from "@rollup/plugin-commonjs";
import dts from "rollup-plugin-dts";

const plugin = [
  typescript(),
  commonjs()
];
const config = [
  {
    input: "index.ts",
    plugins: plugin,
    output: [
      {
        file: "dist/index.js",
        format: 'cjs'
      }
    ]
  },
  {
    input: "index.ts",
    plugins: [dts.default()],
    output: [{ file: "dist/types.d.ts", format: "cjs" }]
  }
];

export default config;
