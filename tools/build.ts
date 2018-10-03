const shell = require('shelljs')
const zip = require('bestzip')

shell.exec('rollup -c rollup.config.ts', { silent: true })
shell.exec('typedoc --out docs --target es6 --theme minimal --mode file src', { silent: true })
shell.exec('ts-node tools/move-files.ts moveFromTemp', { silent: true })
