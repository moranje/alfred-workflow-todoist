import { RewriteFrames } from '@sentry/integrations';
import * as Sentry from '@sentry/node';

import { ENV } from './utils';
import settingsStore from '@/lib/stores/settings-store';

/**
 * Initialize an a Sentry logging instance if allowed by the user.
 *
 * @returns A `Sentry` instance or nothing if the user does not allow online
 * error collection.
 */
export function init(): typeof Sentry | null {
  if (settingsStore().get('error_tracking') === true) {
    Sentry.init({
      dsn: 'https://fcddabe319894f7bb07321c9d93ae3a2@sentry.io/1454575',
      release: ENV.workflow.version,
      attachStacktrace: true,
      environment: process.env.NODE_ENV,
      integrations: [
        new RewriteFrames({
          root: global.__rootdir__,
        }),
      ],
    });

    /* istanbul ignore next */
    Sentry.configureScope(function(scope) {
      scope.setUser({ id: settingsStore().get('uuid') });
      scope.setTag('osx', ENV.meta.osx);
      scope.setTag('nodejs', ENV.meta.nodejs);
      if (ENV.meta.alfred) scope.setTag('alfred', ENV.meta.alfred);
      if (ENV.workflow.uid) scope.setTag('workflow', ENV.workflow.uid);
    });

    return Sentry;
  }

  return null;
}
