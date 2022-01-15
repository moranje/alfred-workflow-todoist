const inquirer = require('inquirer')
const shelljs = require('shelljs')

const dataPath = `${process.env.HOME}/Library/Application Support/Alfred 3/Workflow Data/com.alfred-workflow-todoist`
const cachePath = `${process.env.HOME}/Library/Caches/com.runningwithcrayons.Alfred-3/Workflow Data/com.alfred-workflow-todoist`
const cwd = process.cwd()

function uuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
    .replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0

      const v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
    .toUpperCase()
}

inquirer
  .prompt([
    {
      name: 'path',
      type: 'input',
      message: "What is the path of the folder Alfred stores it's workflows in?",
    },
  ])
  .then((answers: any) => {
    // Setup a symlink from workflow folder pointing to dist/workflow in the repo
    const uid = uuid()
    shelljs.mkdir('-p', `${cwd}/dist`)
    shelljs.ln('-s', `${cwd}/dist/workflow`, `${answers.path}/user.workflow.${uid}`)

    shelljs.mkdir('-p', cachePath)
    shelljs.mkdir('-p', dataPath)
    shelljs.rm('-rf', 'data', 'cache')
    shelljs.ln('-s', dataPath, `data`)
    shelljs.ln('-s', cachePath, `cache`)
  })
  .catch((err: Error) => {
    console.error("That didn't go as planned\n", err)
  })
