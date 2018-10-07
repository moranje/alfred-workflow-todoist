const shell = require('shelljs')
const zip = require('bestzip')
const mkdirp = require('mkdirp')

shell.exec('rollup -c rollup.config.ts', { silent: true })

mkdirp('dist/workflow/notifier')
shell.cp(
  '-r',
  'node_modules/node-notifier/vendor/terminal-notifier.app',
  'dist/workflow/notifier/terminal-notifier.app'
)
shell.sed('-i', '../vendor/', './notifier/', 'dist/workflow/alfred-workflow-todoist.js')
shell.exec(
  'typedoc --out docs --name "Alfred Workflow Todoist" --readme README.md --target es6 --theme minimal --exclude "grammer.ts" --mode file src',
  { silent: true }
)
shell.exec('ts-node tools/move-files.ts moveFromTemp', { silent: true })
