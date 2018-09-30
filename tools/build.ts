const shell = require('shelljs')
const zip = require('bestzip')

shell.exec('rollup -c rollup.config.ts', { silent: true })
shell.exec('typedoc --out docs --target es6 --theme minimal --mode file src', { silent: true })

zip({
  source: '*',
  destination: '"../Alfred Workflow Todoist.alfredworkflow"',
  cwd: 'dist/workflow/'
})
  .then(() => {
    console.log('all done!')
  })
  .catch((err: Error) => {
    console.error(err.stack)
    process.exit(1)
  })
