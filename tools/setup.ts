import inquirer from 'inquirer';
import { mkdir, ln, rm } from 'shelljs';
import { existsSync } from 'fs';
import chalk from 'chalk';

let dataPath = '';
let cachePath = '';

const cwd = process.cwd();
if (
  existsSync(
    `${process.env.HOME}/Library/Application Support/Alfred 3/Workflow Data/com.alfred-workflow-todoist`
  )
) {
  // Alfred 3
  dataPath = `${process.env.HOME}/Library/Application Support/Alfred 3/Workflow Data/com.alfred-workflow-todoist`;
} else if (
  existsSync(
    `${process.env.HOME}/Library/Application Support/Alfred/Workflow Data/com.alfred-workflow-todoist`
  )
) {
  // Alfred 4
  dataPath = `${process.env.HOME}/Library/Application Support/Alfred/Workflow Data/com.alfred-workflow-todoist`;
} else {
  throw new Error(
    'No valid data path for Alfred found, are you using version <3 or >4?'
  );
}

if (
  existsSync(
    `${process.env.HOME}/Library/Caches/com.runningwithcrayons.Alfred-3/Workflow Data/com.alfred-workflow-todoist`
  )
) {
  // Alfred 3
  cachePath = `${process.env.HOME}/Library/Caches/com.runningwithcrayons.Alfred-3/Workflow Data/com.alfred-workflow-todoist`;
} else if (
  existsSync(
    `${process.env.HOME}/Library/Caches/com.runningwithcrayons.Alfred-3/Workflow Data/com.alfred-workflow-todoist`
  )
) {
  // Alfred 4
  cachePath = `${process.env.HOME}/Library/Caches/com.runningwithcrayons.Alfred-3/Workflow Data/com.alfred-workflow-todoist`;
} else {
  throw new Error(
    'No valid cache path for Alfred found, are you using version <3 or >4?'
  );
}

function uuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
    .replace(/[xy]/g, c => {
      const r = (Math.random() * 16) | 0;

      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    })
    .toUpperCase();
}

inquirer
  .prompt([
    {
      name: 'path',
      type: 'input',
      message:
        "What is the path of the folder Alfred stores it's workflows in?",
    },
  ])
  .then((answers: any) => {
    // Setup a symlink from workflow folder pointing to dist/workflow in the
    // repo
    const uid = uuid();
    let error = '';
    error += mkdir('-p', `${cwd}/dist`).stderr ?? '';
    error +=
      ln('-s', `${cwd}/dist/workflow`, `${answers.path}/user.workflow.${uid}`)
        .stderr ?? '';

    error += mkdir('-p', cachePath).stderr ?? '';
    error += mkdir('-p', dataPath).stderr ?? '';
    error += rm('-rf', 'data', 'cache').stderr ?? '';
    error += ln('-s', dataPath, `data`).stderr ?? '';
    error += ln('-s', cachePath, `cache`).stderr ?? '';

    if (error) throw new Error(error);

    let folder = `${answers.path}/user.workflow.${uid}`;
    console.info(
      `${chalk.bold.green('Setup finished:')}\n\n${chalk.underline(
        'dist/workflow'
      )} is now linked to ${chalk.underline(folder)}`
    );
  })
  .catch((err: Error) => {
    console.error(`${chalk.bold.red('Setup failed:')}\n\n`, err);
  });
// /Users/martien/MEGA/Projects/Alfred/Alfred.alfredpreferences/workflows
