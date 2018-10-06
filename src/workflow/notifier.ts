import _ from 'lodash'
import notifier from 'node-notifier'
import open from 'opn'
import osName from 'os-name'
import compose from 'stampit'

import { AlfredError } from './error'

const NOTIFICATION_DEFAULTS = {
  title: 'ALFRED WORKFLOW TODOIST',
  subtitle: '✓ Happy days!',
  message: "There's nothing to say.",
  sound: false,
  icon: `${process.cwd()}/icon.png`,
  contentImage: '',
  open: '',
  wait: void 0,
  timeout: void 0,
  closeLabel: void 0,
  actions: '',
  dropdownLabel: '',
  reply: false
}

export interface NotificationOptions {
  title: string
  subtitle: string
  message: string
  sound: boolean // Case Sensitive string for location of sound file; or use one of macOS' native sounds (see below)
  icon: string // Absolute Path to Triggering Icon
  contentImage: string // Absolute Path to Attached Image (Content Image)
  open: string // URL to open on Click
  wait: boolean // Wait for User Action against Notification or times out. Same as timeout = 5 seconds

  // New in latest version. See `example/macInput.js` for usage
  timeout: number // Takes precedence over wait if both are defined.
  closeLabel: string // String. Label for cancel button
  actions: string // String | Array<String>. Action label or list of labels in case of dropdown
  dropdownLabel: string // String. Label to be used if multiple actions
  reply: boolean // Boolean. If notification should take input. Value passed as third argument in callback and event emitter.
  error?: AlfredError
}

function logError(error: AlfredError) {
  console.log(
    [
      `${error.name}: ${error.message}\n`,
      'ALFRED WORKFLOW TODOIST',
      '----------------------------------------',
      `os: ${osName()}`,
      `query: ${error.QUERY}`,
      `node.js: ${error.NODE_VERSION}`,
      `alfred: ${error.ALFRED_VERSION}`,
      `workflow: ${error.WORKFLOW_VERSION}`,
      `Stack: ${error.stack}`
    ]
      .join('\n')
      // Hide token from log by default
      .replace(/[0-9a-fA-F]{40}/gm, '<token>')
  )
}

function notification(
  options: NotificationOptions,
  onClick?: (notifierObject: any, option: any, meta: any) => void,
  onTimeout?: (notifierObject: any, option: any, meta: any) => void
) {
  let onClickFallback = (notifier: any, opts: any, meta: any) => {
    if (opts.open) {
      open(opts.open).catch(openError => {
        logError(new AlfredError(openError.name, openError.message, openError.stack))
      })
    }
  }

  notifier.notify(_.omit(options, ['error']), (err, response) => {
    // Response is response from notification
    if (err) {
      console.log('Something went wrong\n', err)
      logError(new AlfredError(err.name, err.message, err.stack))
    }

    if (options.error) {
      console.log('Something went wrong\n')
      logError(options.error)
    }
  })

  notifier.on('click', onClick || onClickFallback)

  // notifier.on('timeout', (notifierObject: any, opts: any, meta: any) => {
  //   // console.log('Timeout\n')
  // })
}

export const Notification = compose({
  init(output: AlfredError | NotificationOptions) {
    let values = Object.assign({}, output)

    if (output instanceof Error) {
      let name = output.name.charAt(0).toUpperCase() + output.name.substring(1) || 'Error'

      values = Object.assign({
        title: 'ALFRED WORKFLOW TODOIST',
        subtitle: '✕ How unfortunate...',
        message: `${name}: ${output.message}`,
        error: output
      })
    }

    Object.assign(this, NOTIFICATION_DEFAULTS, values)
  },

  methods: {
    write(this: NotificationOptions, onClick?: any, onTimeout?: any) {
      notification(this, onClick, onTimeout)
    }
  }
})
