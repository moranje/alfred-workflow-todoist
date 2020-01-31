const inquirer = require('inquirer');
const shell = require('shelljs');

inquirer
  .prompt([
    {
      name: 'call',
      type: 'input',
      message: 'Enter the todoist-workflow call',
      default: 'parse',
    },
    {
      name: 'query',
      type: 'input',
      message: 'Enter your todoist query',
      default: 'Get milk #Home<1> @groceries<2> !!2, today',
    },
    {
      name: 'workflow',
      type: 'input',
      message: 'Enter the path of the workflow folder',
      default: `${process.cwd()}/dist/workflow/`,
    },
  ])
  .then((answers: any) => {
    process.chdir(answers.workflow);

    shell.exec(
      'alfred_workflow_data="$HOME/Library/Application Support/Alfred 3/Workflow Data/com.alfred-workflow-todoist" ' +
        'alfred_workflow_cache="$HOME/Library/Caches/com.runningwithcrayons.Alfred-3/Workflow Data/com.alfred-workflow-todoist" ' +
        `ndb alfred-workflow-todoist.js ${
          answers.call
        } "${answers.query.replace(/"/g, '\\"')}"`
    );
  });
