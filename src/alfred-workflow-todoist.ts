/* eslint simple-import-sort/sort: 0 */
import compareVersions from 'compare-versions';

import { getCurrentCall } from '@/lib/cli-args';
import command from '@/lib/command';
import { AlfredError, Errors, funnelError } from '@/lib/error';
import { checkForWorkflowUpdate } from '@/lib/updater';
import { ENV } from '@/lib/utils';

async function main(): Promise<void | null> {
  const call = getCurrentCall();

  /**
   * Updater.
   */
  if (call.name === 'parse' || call.name === 'read') {
    await checkForWorkflowUpdate();
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
