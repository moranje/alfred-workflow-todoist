import inquirer from 'inquirer';
import { mkdir, ln, rm } from 'shelljs';
import { existsSync } from 'fs';

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
    // Setup a symlink from workflow folder pointing to dist/workflow in the repo
    const uid = uuid();
    mkdir('-p', `${cwd}/dist`);
    ln('-s', `${cwd}/dist/workflow`, `${answers.path}/user.workflow.${uid}`);

    mkdir('-p', cachePath);
    mkdir('-p', dataPath);
    rm('-rf', 'data', 'cache');
    ln('-s', dataPath, `data`);
    ln('-s', cachePath, `cache`);
  })
  .catch((err: Error) => {
    console.error("That didn't go as planned\n", err);
  });
