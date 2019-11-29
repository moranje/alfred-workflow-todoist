import { ENV } from "@/project";
import { Notification } from '@/workflow';

/** @hidden */
const argv = Object.assign([], process.argv)
argv.splice(0, 2)
argv.shift()
/** @hidden */
const query = argv.join(' ')

/** @hidden */
const ERROR_ENV = {
  QUERY: query,
  OSX_VERSION: ENV.OSX_VERSION,
  NODE_VERSION: ENV.NODE_VERSION,
  ALFRED_VERSION: ENV.ALFRED_VERSION,
  WORKFLOW_VERSION: ENV.WORKFLOW_VERSION
}

/**
 * An extension of the base Error that incorperates workflow
 * environment variables.
 *
 * @hidden
 */
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

  return Notification(Object.assign(error, { query })).write()
}
