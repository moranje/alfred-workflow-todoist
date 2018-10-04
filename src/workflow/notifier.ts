import plist from 'fast-plist'
import { readFileSync } from 'fs'
import osName from 'os-name'
import compose from 'stampit'

// import notifier from 'node-notifier';
const infoPlist: any = plist.parse(readFileSync(`${process.cwd()}/info.plist`, 'utf8'))
const alfredPlist: any = plist.parse(
  readFileSync('/Applications/Alfred 3.app/Contents/Info.plist', 'utf8')
)

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
  closeLabel: '',
  actions: '',
  dropdownLabel: '',
  reply: false,
  type: 'notification',
  query: '',
  stack: ''
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
  type?: 'notification' | 'error'
  query?: string
  stack?: string
}

interface AlfredError extends Error {
  query: string
}

// export function notification(
//   options: NotificationOptions
//   // onClick: (notifierObject: any, option: any) => void,
//   // onTimeout: (notifierObject: any, option: any) => void
// ) {
//   notifier.notify(options, function(err, response) {
//     // Response is response from notification
//     return console.log(err, response)
//   })

//   notifier.on('click', function() {
//     return console.log(arguments)
//   })
//   notifier.on('timeout', function() {
//     return console.log(arguments)
//   })
// }

export const Notification = compose({
  init(output: AlfredError | NotificationOptions) {
    let values = Object.assign({}, output)

    if (output instanceof Error) {
      let name = output.name.charAt(0).toUpperCase() + output.name.substring(1) || 'Error'

      values = Object.assign({
        title: 'ALFRED WORKFLOW TODOIST',
        subtitle: '✕ How unfortunate...',
        message: `${name}: ${output.message}`,
        query: output.query,
        stack: output.stack,
        type: 'error'
      })
    }

    Object.assign(this, NOTIFICATION_DEFAULTS, values)
  },

  methods: {
    write(this: NotificationOptions) {
      if (this.type === 'error') {
        console.log(
          [
            `${this.message}\n`,
            'ALFRED WORKFLOW TODOIST',
            '----------------------------------------',
            `os: ${osName()}`,
            `query: ${this.query}`,
            `node.js: ${process.version}`,
            `alfred: ${alfredPlist.CFBundleShortVersionString}`,
            `workflow: ${infoPlist.version}`,
            `Stack: ${this.stack}`
          ].join('\n')
        )
      } else {
        console.log(this.message)
      }
    }
  }
})
