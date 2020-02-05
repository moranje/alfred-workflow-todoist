import { spawn } from 'child_process';

import { ENV } from '@/lib/utils';

const GROUP_ID = 'alfred.workflow.todoist';

interface NotificationOptions {
  /**
   * The title of the notification. This defaults to 'ALFRED WORKFLOW TODOIST'.
   */
  title?: string;
  /**
   * The subtitle of the notification.
   */
  subtitle?: string;
  /**
   * The message body of the notification.
   */
  message: string;
  /**
   * Specify an image `iconPath` to display instead of the application icon.
   */
  iconPath?: string;
  /**
   * Open `url` when the user clicks the notification.
   */
  url?: string;
}

/**
 * A MacOs notification using terminal-notifier.
 *
 * @param options The notification parameters.
 */
export function notification({
  title = 'ALFRED WORKFLOW TODOIST',
  subtitle,
  message,
  iconPath = `${process.cwd()}/icon.png`,
  url,
}: NotificationOptions): void {
  let cli = [
    `-title`,
    `"${title.toUpperCase()}"`,
    `-group`,
    `"${GROUP_ID}"`,
    `-remove`,
    `"${GROUP_ID}"`,
    `-appIcon`,
    `"${iconPath}"`,
  ];

  if (subtitle) {
    cli = [...cli, `-subtitle`, `"${subtitle}"`];
  }

  if (message) {
    cli = [...cli, `-message`, `"${message}"`];
  }

  if (url) {
    cli = [...cli, `-open`, `"${url}"`];
  }

  const child = spawn(ENV.workflow.notifierPath, cli, {
    detached: true,
    stdio: 'ignore',
  });

  // Stop alf,red from waiting for the notification to finish
  child.unref();
}
