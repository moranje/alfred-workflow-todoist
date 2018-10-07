const inquirer = require('inquirer')
const shell = require('shelljs')

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
    },
    {
      name: 'workflow',
      type: 'input',
      message: 'Enter the path of the workflow folder'
    }
  ])
  .then((answers: any) => {
    process.chdir(answers.workflow)

    shell.exec(
      `node --inspect-brk alfred-workflow-todoist.js ${answers.call} "${answers.query.replace(
        /"/g,
        '\\"'
      )}"`
    )
  })
