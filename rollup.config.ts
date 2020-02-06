import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import typescript from '@wessberg/rollup-plugin-ts';
import builtin from 'builtin-modules';
import filesize from 'rollup-plugin-filesize';
import externals from 'rollup-plugin-node-externals';
import sourceMaps from 'rollup-plugin-sourcemaps';
import { terser } from 'rollup-plugin-terser';

const pkg = require('./package.json');

const libraryName = 'alfred-workflow-todoist';

let plugins = [
  replace({
    // Needed for Conf
    'commonjsRequire.cache': 'require.cache',
  }),

  externals(),

  // Allow json resolution
  json(),

  typescript({
    transpiler: 'babel',
  }),

  resolve({
    // mainFields: ['main'],
  }),

  commonjs({
    // ignore: ['worker_threads'],
    // include: [/node_modules/],
    // namedExports: {
    //   conf: ['Conf'],
    // },
  }),

  sourceMaps(),

  filesize(),
];

if (process.env.NODE_ENV === 'production') {
  plugins = [...plugins, terser()];
}

export default {
  input: `src/${libraryName}.ts`,
  output: [{ file: pkg.main, format: 'cjs', sourcemap: 'inline' }],
  treeshake: true,
  watch: {
    include: 'src/**',
  },
  external: builtin,
  inlineDynamicImports: true,
  plugins: plugins,
};
