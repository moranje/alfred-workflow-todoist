import { exec, rm } from 'shelljs';
import { existsSync } from 'fs';
import chalk from 'chalk';
import mkdirp from 'mkdirp';

const [, , arg] = process.argv;
const WHITE_LIST = [
  'dist/workflow/notifier/terminal-notifier.app/Contents/MacOS/terminal-notifier',
  'dist/workflow/alfred-workflow-todoist.js',
  'dist/workflow/alfred-workflow-todoist.js.map',
  'dist/workflow/icon.png',
  'dist/workflow/info.plist',
  'dist/workflow/workflow.json',
  'dist/workflow/check-node.sh',
];

let err = null;

process.env.NODE_ENV = process.env.NODE_ENV ?? 'development';
if (arg === 'production' || process.env.NODE_ENV === 'production') {
  process.env.NODE_ENV = 'production';
}

console.log(
  chalk.green('Starting build ') +
    `in ${chalk.yellow(process.env.NODE_ENV)} mode`
);
if (process.env.NODE_ENV === 'production') {
  err = exec('npx rollup -c rollup.config.ts').stderr;
} else {
  err = exec('npx rollup -c rollup.config.ts -w').stderr;
}

if (err) {
  exec('ts-node tools/move-files.ts copyFromTemp', { silent: true });
}

mkdirp.sync('dist/workflow/notifier');
exec(
  'curl -sSL https://github.com/julienXX/terminal-notifier/releases/latest/download/terminal-notifier-2.0.0.zip > terminal-notifier.zip',
  { silent: true }
);
exec('unzip terminal-notifier.zip -d dist/workflow/notifier', {
  silent: true,
});
rm('-rf', 'terminal-notifier.zip');
rm('-rf', 'dist/src/*');

exec('ts-node tools/move-files.ts copyFromTemp', { silent: true });

let missing: string[] = [];
WHITE_LIST.forEach((path: string) => {
  if (!existsSync(`${process.cwd()}/${path}`)) {
    missing.push(path);
  }
});

if (missing.length > 0) {
  console.error(chalk.red('Build completed with errors:'));
  missing.forEach(path => {
    console.log(
      `Missing file after build: ${chalk.underline(
        process.cwd()
      )}/${chalk.red.underline(path)}`
    );
  });
  process.exit(1);
} else {
  console.log(chalk.green('Build completed successfully'));
}
