import { exec } from 'shelljs';
import { zip } from 'zip-a-folder';

exec('npm run bump-version', { silent: true });

zip(
  `${process.cwd()}/dist/workflow`,
  `${process.cwd()}/dist/Alfred Workflow Todoist.alfredworkflow`
)
  .then(() => {
    console.log('all done!');
  })
  .catch((err: Error) => {
    console.error(err.stack);
    process.exit(1);
  });
