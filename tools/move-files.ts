import mkdirp from 'mkdirp';
import { cp } from 'shelljs';

const [, , call] = process.argv;
const TEMP_FOLDER = 'assets';

function noop() {
  console.log(
    'Please try: ts-node tools/move-files.ts [call]\n\n\tcall: copyToTemp | copyFromTemp'
  );
}

function copyFromTemp() {
  mkdirp.sync(`dist/workflow`);
  cp(`${TEMP_FOLDER}/info.plist`, 'dist/workflow/info.plist').stderr;
  cp(`${TEMP_FOLDER}/icon.png`, 'dist/workflow/icon.png').stderr;
  cp(`${TEMP_FOLDER}/workflow.json`, 'dist/workflow/workflow.json').stderr;
  cp(`${TEMP_FOLDER}/check-node.sh`, 'dist/workflow/check-node.sh').stderr;
  // cp('-R', `${TEMP_FOLDER}/images/`, 'dist/workflow/images/')
}

if (call === 'copyFromTemp') {
  copyFromTemp();
} else {
  noop();
}
