const shell = require('shelljs');
const zip = require('bestzip');
const mkdirp = require('mkdirp');
const fs = require('fs');

const WHITE_LIST = [
  'dist/workflow/notifier/terminal-notifier.app/Contents/MacOS/terminal-notifier',
  'dist/workflow/alfred-workflow-todoist.js',
  'dist/workflow/icon.png',
  'dist/workflow/info.plist',
  'dist/workflow/workflow.json',
  'dist/workflow/check-node.sh',
];

let err = null;

if (process.env.NODE_ENV === 'production') {
  err = shell.exec('npx rollup -c rollup.config.ts').stderr;
} else {
  err = shell.exec('npx rollup -c rollup.config.ts -w').stderr;
}

if (err) {
  shell.exec('ts-node tools/move-files.ts copyFromTemp', { silent: true });
}

mkdirp('dist/workflow/notifier');
shell.exec(
  'curl -sSL https://github.com/julienXX/terminal-notifier/releases/latest/download/terminal-notifier-2.0.0.zip > terminal-notifier.zip',
  { silent: true }
);
shell.exec('unzip terminal-notifier.zip -d dist/workflow/notifier', {
  silent: true,
});
shell.rm('-rf', 'terminal-notifier.zip', {
  silent: true,
});
shell.rm('-rf', 'dist/src/*', {
  silent: true,
});

shell.exec('ts-node tools/move-files.ts copyFromTemp', { silent: true });

WHITE_LIST.forEach((path: string) => {
  if (!fs.existsSync(`${process.cwd()}/${path}`)) {
    throw new Error(`Missing file after build: ${process.cwd()}/${path}`);
  }
});

console.log('Build completed successfully');
