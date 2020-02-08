import { exec } from 'shelljs';
import { zip } from 'zip-a-folder';
import chalk = require('chalk');

let err = exec('npm run bump-version', { silent: true }).stderr;

if (err) {
  console.error(`Could not bump version number:\n\n${chalk.red(err)}`);
  process.exit(1);
}

zip(
  `${process.cwd()}/dist/workflow`,
  `${process.cwd()}/dist/Alfred Workflow Todoist.alfredworkflow`
)
  .then(() => {
    console.log(
      `Done: created ${chalk.green(`Alfred Workflow Todoist.alfredworkflow`)}`
    );
  })
  .catch((err: Error) => {
    console.error(err.stack);
    process.exit(1);
  });
