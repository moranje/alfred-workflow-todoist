import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@wessberg/rollup-plugin-ts';
// import { cjsToEsm } from '@wessberg/cjs-to-esm-transformer';
import filesize from 'rollup-plugin-filesize';
import sourceMaps from 'rollup-plugin-sourcemaps';
import { terser } from 'rollup-plugin-terser';
import { builtinModules } from 'module';
import pkg from './package.json';

const libraryName = 'alfred-workflow-todoist';
let plugins = [
  // Allow json resolution
  json(),

  resolve(),

  typescript({
    // transformers: [cjsToEsm()],
    // transpiler: 'babel',
  }),

  commonjs({
    ignore: ['worker_threads'],
    namedExports: {
      lru_map: ['LRUMap'],
    },
  }),

  sourceMaps(),

  filesize(),
];

if (process.env.NODE_ENV === 'production') {
  plugins = [...plugins, terser()];
}

export default {
  input: `src/${libraryName}.ts`,
  output: [{ file: pkg.main, format: 'cjs', sourcemap: true }],
  treeshake: true,
  watch: {
    include: 'src/**',
  },
  external: [...builtinModules],
  // inlineDynamicImports: true,
  plugins: plugins,
};
