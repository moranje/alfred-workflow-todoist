import compareVersions from 'compare-versions';
import got from 'got';

import { createCall } from '@/lib/cli-args';
import settingsStore from '@/lib/stores/settings-store';
import { ENV } from '@/lib/utils';
import { Item, workflowList } from '@/lib/workflow';

import updateStore from './stores/update-store';

// TODO: Add decent testing for updater, as it must not break

export const GITHUB_PACKAGE_URL =
  'https://raw.githubusercontent.com/moranje/alfred-workflow-todoist/master/package.json';

/**
 * Check for workflow update on Github.
 */
export async function checkForWorkflowUpdate(): Promise<void> {
  const timePassed =
    new Date().getTime() - new Date(updateStore().get('updated')).getTime();

  if (
    timePassed <
    settingsStore(ENV.meta.dataPath).get('update_checks') *
      1000 /* Milliseconds */
  ) {
    return;
  }

  const { body: remote } = await got(GITHUB_PACKAGE_URL, {
    responseType: 'json',
  });

  // No alpha en beta updates bij default
  if (/.*(?:alpha|beta).*/.test(remote.version)) {
    if (settingsStore(ENV.meta.dataPath).get('pre_releases') === false) return;
  }

  const currentVersion = updateStore().get('version');
  if (compareVersions.compare(remote.version, currentVersion, '>')) {
    workflowList.addItem(
      new Item({
        arg: createCall({
          name: 'openUrl',
          args:
            'https://github.com/moranje/alfred-workflow-todoist/releases/latest/download/Alfred.Workflow.Todoist.alfredworkflow',
        }),
        title: `Download workflow update`,
        subtitle: `The latest version is v${remote.version} you are on v${currentVersion}`,
        quicklookurl:
          'https://github.com/moranje/alfred-workflow-todoist/blob/master/CHANGELOG.md',
      })
    );
    workflowList.addItem(
      new Item({
        arg: createCall({
          name: 'openUrl',
          args:
            'https://github.com/moranje/alfred-workflow-todoist/blob/master/CHANGELOG.md',
        }),
        title: `Open changelog`,
        subtitle: `See what's changed in the current version`,
        quicklookurl:
          'https://github.com/moranje/alfred-workflow-todoist/blob/master/CHANGELOG.md',
      })
    );
  }
}
