const inquirer = require('inquirer')
const shell = require('shelljs')

const dataPath = `${
  process.env.HOME
}/Library/Application Support/Alfred 3/Workflow Data/com.alfred-workflow-todoist`
const cachePath = `${
  process.env.HOME
}/Library/Caches/com.runningwithcrayons.Alfred-3/Workflow Data/com.alfred-workflow-todoist`

inquirer
  .prompt([
    {
      name: 'call',
      type: 'input',
      message: 'Enter the todoist-workflow call'
    },
    {
      name: 'query',
      type: 'input',
      message: 'Enter your todoist query'
    }
  ])
  .then((answers: any) => {
    shell.exec(
      `node --inspect-brk dist/workflow/alfred-workflow-todoist.js ${
        answers.call
      } "${dataPath}" "${cachePath}" "${answers.query.replace(/"/g, '\\"')}"`
    )
  })
