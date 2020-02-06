import { exec } from 'shelljs';
import zip from 'bestzip';

exec('npm run bump-version', { silent: true });

zip({
  source: '*',
  destination: '"../Alfred Workflow Todoist.alfredworkflow"',
  cwd: 'dist/workflow/',
})
  .then(() => {
    console.log('all done!');
  })
  .catch((err: Error) => {
    console.error(err.stack);
    process.exit(1);
  });
