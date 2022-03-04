import commonjs from 'rollup-plugin-commonjs'
import json from 'rollup-plugin-json'
import resolve from 'rollup-plugin-node-resolve'
import sourceMaps from 'rollup-plugin-sourcemaps'
import typescript from 'rollup-plugin-typescript2'

const pkg = require('./package.json')

const libraryName = 'alfred-workflow-todoist'

export default {
  input: `src/${libraryName}.ts`,
  output: [{ file: pkg.main, format: 'cjs', sourcemap: true }],
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: [
    'assert',
    'child_process',
    'constants',
    'crypto',
    'events',
    'fs',
    'http',
    'https',
    'net',
    'path',
    'stream',
    'url',
    'util',
    'os',
    'worker_treads',
    'zlib',
  ],
  watch: {
    include: 'src/**',
  },
  plugins: [
    // Allow json resolution
    json(),

    // Compile TypeScript files
    typescript({ useTsconfigDeclarationDir: true }),

    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    commonjs({
      ignore: ['worker_threads'],
    }),
    // Allow node_modules resolution, so you can use 'external' to control
    // which external modules to include in the bundle
    // https://github.com/rollup/rollup-plugin-node-resolve#usage
    resolve(),

    // Resolve source maps to the original source
    sourceMaps(),
  ],
}
