const shell = require('shelljs')
const { readFileSync } = require('fs')

const pkg = JSON.parse(readFileSync('package.json') as any)

shell.exec(`/usr/libexec/PlistBuddy -c "Set version ${pkg.version}" "dist/workflow/info.plist"`, {
  silent: true
})
