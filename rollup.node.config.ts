import * as fs from "fs";

import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";

const pkg = JSON.parse(fs.readFileSync("./package.json", "utf-8"));
const banner = `/**
 * @module ${pkg.name}
 * @version ${pkg.version}
 * @file ${pkg.description}
 * @copyright ${pkg.author.name} ${new Date().getFullYear()}
 * @license ${pkg.license}
 * @see [Github]{@link ${pkg.homepage}}
*/`;

export default {
    input: "src/index.ts",
    output: [
        {
            file: pkg.exports.require,
            format: "cjs",
            banner,
            exports: "auto",
            sourcemap: true,
        },
        { file: pkg.exports.import, format: "es", banner, sourcemap: true },
    ],
    plugins: [
        typescript({ tsconfig: "./tsconfig.json" }),
        json(),
        resolve(),
        commonjs(),
        terser(),
    ],
};
