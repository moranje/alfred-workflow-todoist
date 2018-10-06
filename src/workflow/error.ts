import plist from 'fast-plist'
import { readFileSync } from 'fs'
import osName from 'os-name'

const argv = Object.assign([], process.argv)
argv.splice(0, 2)
const type = argv.shift()
const query = argv.join(' ')
const ERROR_ENV = {
  QUERY: query,
  OSX_VERSION: osName(),
  NODE_VERSION: process.version,
  ALFRED_VERSION: plist.parse(
    readFileSync('/Applications/Alfred 3.app/Contents/Info.plist', 'utf8')
  ).CFBundleShortVersionString,
  WORKFLOW_VERSION: plist.parse(readFileSync(`${process.cwd()}/info.plist`, 'utf8')).version
}

export interface AlfredError extends Error {
  QUERY: string
  OSX_VERSION: string
  NODE_VERSION: string
  ALFRED_VERSION: string
  WORKFLOW_VERSION: string
}

export class AlfredError extends Error {
  constructor(message: string, name?: string, stack?: any) {
    super(message)

    this.name = name || this.constructor.name
    Object.assign(this, ERROR_ENV)

    if (stack) {
      this.stack = stack
    } else if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor)
    } else {
      this.stack = new AlfredError(message).stack
    }
  }
}
