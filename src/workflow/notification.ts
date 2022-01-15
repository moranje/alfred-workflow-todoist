import compose from 'stampit'
import { spawn } from 'child_process'
import { ENV, NOTIFIER_PATH } from '@/project'

/** @hidden */
const NOTIFICATION_DEFAULTS: workflow.NotificationOptions = {
  title: 'ALFRED WORKFLOW TODOIST',
  subtitle: '✓ Happy days!',
  message: "There's nothing to say.",
  icon: `${process.cwd()}/icon.png`,
  timeout: 5,
  hideSuccessLogs: false,
}

/**
 * Formatted error logs
 *
 * @param {project.AlfredError} error
 *
 * @private
 * @hidden
 */
function logError(error: project.AlfredError) {
  return console.log(
    [
      `${error.name}: ${error.message}\n`,
      'ALFRED WORKFLOW TODOIST',
      '----------------------------------------',
      `os: macOS ${error.OSX_VERSION}`,
      `query: ${error.QUERY}`,
      `node.js: ${error.NODE_VERSION}`,
      `alfred: ${error.ALFRED_VERSION}`,
      `workflow: ${error.WORKFLOW_VERSION}`,
      `Stack: ${error.stack}`,
    ]
      .join('\n')
      // Hide token from log by default
      .replace(/[0-9a-fA-F]{40}/gm, '<token hidden>')
  )
}

/**
 * Create a notification with optional click and timeout calbacks
 *
 * @param {workflow.NotificationOptions} options
 * @param {(notifierObject: any, option: any, meta: any) => void} [onClick]
 * @param {(notifierObject: any, option: any, meta: any) => void} [onTimeout]
 *
 * @private
 * @hidden
 */

function notify(options: workflow.NotificationOptions) {
  let sender = 'com.runningwithcrayons.Alfred'

  if (ENV.ALFRED_VERSION.split('.').shift() === '3') sender += '-3'

  const child = spawn(
    NOTIFIER_PATH,
    [
      '-title',
      `"${options.title}"`,
      '-subtitle',
      `"${options.subtitle}"`,
      '-message',
      `"${options.message}"`,
      '-appIcon',
      `${options.icon}`,
      '-sender',
      `${sender}`,
      '-open',
      `"${options.open}"`,
      '-timeout',
      `${options.timeout}`,
      // '> /dev/null 2>&1 &'
    ],
    {
      detached: true,
      stdio: 'ignore',
    }
  )

  // Stop alfred from waiting for the notification to finish
  child.unref()
}

/**
 * An alfred notification
 *
 * @private
 * @hidden
 */
export const Notification: workflow.NotificationFactory = compose({
  /**
   * @constructor
   * @param {(project.AlfredError | workflow.NotificationOptions)} output
   */
  init(output: project.AlfredError | workflow.NotificationOptions) {
    let values = Object.assign({}, output)

    if (output instanceof Error) {
      const name = output.name.charAt(0).toUpperCase() + output.name.substring(1) || 'Error'

      values = Object.assign({
        title: 'ALFRED WORKFLOW TODOIST',
        subtitle: '✕ How unfortunate...',
        message: `${name}: ${output.message}`,
        error: output,
      })
    }

    Object.assign(this, NOTIFICATION_DEFAULTS, values)
  },

  methods: {
    /**
     * Send output to notification and optionally to stdout
     *
     * @param {workflow.NotificationOptions} this
     * @param {Function} [onClick]
     * @param {Function} [onTimeout]
     */
    write(this: workflow.NotificationOptions) {
      if (this.error) {
        logError(this.error)
        return notify(this)
      }

      if (!this.hideSuccessLogs) {
        console.log(`${this.title}: ${this.subtitle}\n\n${this.message}\n`)
      }

      return notify(this)
    },
  },
})
