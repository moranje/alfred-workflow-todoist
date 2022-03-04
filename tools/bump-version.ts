const shell = require('shelljs')
const { readFileSync } = require('fs')
const writeJsonFile = require('write-json-file')

const pkg = JSON.parse(readFileSync('package.json'))

shell.exec(`/usr/libexec/PlistBuddy -c "Set version ${pkg.version}" "dist/workflow/info.plist"`, {
  silent: true,
})

shell.exec(`/usr/libexec/PlistBuddy -c "Set :variables:node_flags" "dist/workflow/info.plist"`, {
  silent: true,
})

shell.exec(`/usr/libexec/PlistBuddy -c "Set :variables:node_path" "dist/workflow/info.plist"`, {
  silent: true,
})

writeJsonFile('dist/workflow/workflow.json', { version: pkg.version, updated: new Date() })
