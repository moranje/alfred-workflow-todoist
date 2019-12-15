import { spawn } from 'child_process';
import { ENV, NOTIFIER_PATH, AlfredError } from '@/project';

interface NotificationOptions {
  /**
   * The notification title
   */
  title?: string;

  /**
   * The notification subtitle
   */
  subtitle?: string;

  /**
   * The notification message
   */
  message: string;

  /**
   * Case Sensitive string for location of sound file; or use one of macOS'
   * native sounds (see below)
   */
  sound?: boolean;

  /**
   * Absolute Path to Triggering Icon
   */
  icon?: string;

  /**
   * Absolute Path to Attached Image (Content Image)
   */
  contentImage?: string;

  /**
   * URL to open on Click
   */
  open?: string;

  /**
   * Wait for User Action against Notification or times out. Same as timeout
   * = 5 seconds
   */
  wait?: boolean;

  /**
   * Takes precedence over wait if both are defined.
   */
  timeout?: number;

  /**
   * Label for cancel button
   */
  closeLabel?: string;

  /**
   * Action label or list of labels in case of dropdown
   */
  actions?: string | string[];

  /**
   * Label to be used if multiple actions
   */
  dropdownLabel?: string;

  /**
   * If notification should take input. Value passed as third argument in callback and event emitter.
   */
  reply?: boolean;

  /**
   * Hide success messages from logs
   */
  hideSuccessLogs?: boolean;
}

export interface Notification extends NotificationOptions {
  /**
   * An error object.
   */
  error?: AlfredError;
}

/** @hidden */
const NOTIFICATION_DEFAULTS: NotificationOptions = {
  title: 'ALFRED WORKFLOW TODOIST',
  subtitle: '✓ Happy days!',
  message: "There's nothing to say.",
  icon: `${process.cwd()}/icon.png`,
  timeout: 5,
  hideSuccessLogs: false,
};

/**
 * Formatted error logs
 */
function logError(error: AlfredError): void {
  return console.error(
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
  );
}

/**
 * Create a notification with optional click and timeout calbacks
 *
 * @hidden
 */

function notify(options: workflow.NotificationOptions): void {
  let sender = 'com.runningwithcrayons.Alfred';

  if (ENV.ALFRED_VERSION.split('.').shift() === '3') {
    sender += '-3';
  }

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
  );

  // Stop alfred from waiting for the notification to finish
  child.unref();
}

export class Notification {
  constructor(output: AlfredError | NotificationOptions) {
    let values = Object.assign({}, output);

    if (output instanceof Error) {
      const name =
        output.name.charAt(0).toUpperCase() + output.name.substring(1) ||
        'Error';

      values = Object.assign({
        title: 'ALFRED WORKFLOW TODOIST',
        subtitle: '✕ How unfortunate...',
        message: `${name}: ${output.message}`,
        error: output,
      });
    }

    Object.assign(this, NOTIFICATION_DEFAULTS, values);
  }

  /**
   * Send output to notification and optionally to stdout
   */
  write(): void {
    if (this.error) {
      logError(this.error);
      return notify(this);
    }

    if (!this.hideSuccessLogs) {
      console.log(`${this.title}: ${this.subtitle}\n\n${this.message}\n`);
    }

    return notify(this);
  }
}
