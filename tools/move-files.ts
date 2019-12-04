const mkdirp = require('mkdirp')
const shell = require('shelljs')

const argv = Object.assign([], process.argv)
argv.splice(0, 2)
const call: 'moveToTemp' | 'moveFromTemp' | undefined = argv.shift()

const dataPath = `${
  process.env.HOME
}/Library/Application Support/Alfred 3/Workflow Data/com.alfred-workflow-todoist`
const cachePath = `${
  process.env.HOME
}/Library/Caches/com.runningwithcrayons.Alfred-3/Workflow Data/com.alfred-workflow-todoist`
const cwd = process.cwd()
const TEMP_FOLDER = 'assets'

function noop() {
  console.log('Please try: ts-node tools/move-files.ts [call]\n\n\tcall: moveToTemp | moveFromTemp')
}

function moveToTemp() {
  mkdirp(`${TEMP_FOLDER}`)
  shell.cp('dist/workflow/info.plist', `${TEMP_FOLDER}/info.plist`)
  shell.cp('dist/workflow/icon.png', `${TEMP_FOLDER}/icon.png`)
  shell.cp('dist/workflow/workflow.json', `${TEMP_FOLDER}/workflow.json`)
  // shell.cp('-R', 'dist/workflow/images/', `${TEMP_FOLDER}/images`)
}

function moveFromTemp() {
  mkdirp(`dist/workflow`)
  let plist = shell.cp(`${TEMP_FOLDER}/info.plist`, 'dist/workflow/info.plist').stderr
  let icon = shell.cp(`${TEMP_FOLDER}/icon.png`, 'dist/workflow/icon.png').stderr
  let workflowConfig = shell.cp(`${TEMP_FOLDER}/workflow.json`, 'dist/workflow/workflow.json')
    .stderr
  // shell.cp('-R', `${TEMP_FOLDER}/images/`, 'dist/workflow/images/')

  if (!plist && !icon && !workflowConfig) {
    shell.rm('-rf', `${TEMP_FOLDER}/info.plist`)
    shell.rm('-rf', `${TEMP_FOLDER}/icon.png`)
    shell.rm('-rf', `${TEMP_FOLDER}/workflow.json`)
    // shell.rm('-rf', `${TEMP_FOLDER}/images/`)
  }
}

if (call === 'moveToTemp') {
  moveToTemp()
} else if (call === 'moveFromTemp') {
  moveFromTemp()
} else {
  noop()
}
