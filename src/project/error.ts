import { Notification } from '@/workflow';
import plist from 'fast-plist';
import { readFileSync } from 'fs';
import osName from 'os-name';

const argv = Object.assign([], process.argv)
argv.splice(0, 2)
argv.shift()
const query = argv.join(' ')

let alfredVersion = 'unknown'
let workflowVersion = 'unknown'

try {
  workflowVersion = plist.parse(readFileSync(`${process.cwd()}/info.plist`, 'utf8')).version
  alfredVersion = plist.parse(
    readFileSync('/Applications/Alfred 3.app/Contents/Info.plist', 'utf8')
  ).CFBundleShortVersionString
} catch (error) {
  // Do nothing
}

const ERROR_ENV = {
  QUERY: query,
  OSX_VERSION: osName(),
  NODE_VERSION: process.version,
  ALFRED_VERSION: alfredVersion,
  WORKFLOW_VERSION: workflowVersion
}

export class AlfredError extends Error {
  QUERY?: string
  OSX_VERSION?: string
  NODE_VERSION?: string
  ALFRED_VERSION?: string
  WORKFLOW_VERSION?: string
  constructor(message: string, name?: string, stack?: any) {
    super(message)

    this.name = name || this.constructor.name
    Object.assign(this, ERROR_ENV)

    if (stack) {
      this.stack = stack
    } else {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}

export function handleError(err: Error) {
  let error = new AlfredError(err.message, err.name, err.stack)
  console.log('Error log', arguments)

  return Notification(Object.assign(error, { query })).write()
}
