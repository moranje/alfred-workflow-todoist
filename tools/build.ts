const shell = require('shelljs')
const zip = require('bestzip')
const mkdirp = require('mkdirp')
const fs = require('fs')

const WHITE_LIST = [
  'dist/workflow/notifier/terminal-notifier.app/Contents/MacOS/terminal-notifier',
  'dist/workflow/alfred-workflow-todoist.js',
  'dist/workflow/alfred-workflow-todoist.js.map',
  'dist/workflow/icon.png',
  'dist/workflow/info.plist',
  'dist/workflow/workflow.json',
]

const err = shell.exec('rollup -c rollup.config.ts').stderr

if (err) {
  shell.exec('ts-node tools/move-files.ts moveFromTemp', { silent: true })
}

mkdirp('dist/workflow/notifier')
shell.cp(
  '-r',
  'node_modules/node-notifier/vendor/mac.noindex/terminal-notifier.app',
  'dist/workflow/notifier/terminal-notifier.app'
)
shell.sed('-i', '../vendor/mac.noindex/', './notifier/', 'dist/workflow/alfred-workflow-todoist.js')
shell.exec('npx typedoc src', { silent: true })
shell.exec('ts-node tools/move-files.ts moveFromTemp', { silent: true })

WHITE_LIST.forEach((path: string) => {
  if (!fs.existsSync(`${process.cwd()}/${path}`)) {
    throw new Error(`Missing file after build: ${process.cwd()}/${path}`)
  }
})

console.log('Build completed succesfully')
