import compareVersions from 'compare-versions';

import { getCurrentCall } from '@/lib/cli-arguments';
import command from '@/lib/command';
import { AlfredError, Errors, funnelError } from '@/lib/error';
import { checkForWorkflowUpdate } from '@/lib/updater';
import { ENV } from '@/lib/utils';

// Needed for normalizing sentry paths
global.__rootdir__ = __dirname || process.cwd();

async function main(): Promise<void | null> {
  const call = getCurrentCall();

  /**
   * Updater.
   */
  if (call.name === 'parse' || call.name === 'read') {
    // Should never break the flow of the app
    await checkForWorkflowUpdate().catch(funnelError);
  }

  /**
   * Command distribution.
   */
  return command(call);
}

/**
 * Make sure minimum node version is satisfied.
 */
if (compareVersions.compare(process.version, ENV.requirements.nodejs, '>=')) {
  main().catch(funnelError);
} else {
  funnelError(
    new AlfredError(
      Errors.InvalidNodeJS,
      'Please upgrade your Node.js version to 10.x or higher for this workflow to work',
      { isSafe: true }
    )
  );
}
