const shell = require('shelljs')
const zip = require('bestzip')
const mkdirp = require('mkdirp')
const fs = require('fs')

const WHITE_LIST = [
  'dist/workflow/notifier/terminal-notifier.app/Contents/MacOS/terminal-notifier',
  'dist/workflow/alfred-workflow-todoist.js',
  'dist/workflow/alfred-workflow-todoist.js.map',
  'dist/workflow/icon.png',
  'dist/workflow/info.plist'
]

let err = shell.exec('rollup -c rollup.config.ts', { silent: true }).stderr

if (err) {
  shell.exec('ts-node tools/move-files.ts moveFromTemp', { silent: true })
}

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

WHITE_LIST.forEach((path: string) => {
  if (!fs.existsSync(`${process.cwd()}/${path}`)) {
    throw new Error(`Missing file after build: ${process.cwd()}/${path}`)
  }
})

console.log('Build completed succesfully')
