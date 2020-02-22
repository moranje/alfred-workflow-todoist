import compare from 'compare-versions';
import got from 'got';

import { createCall } from '@/lib/cli-arguments';
import { AlfredError, Errors } from '@/lib/error';
import logger from '@/lib/logger';
import settingsStore from '@/lib/stores/settings-store';
import { ENV } from '@/lib/utils';
import { Item, workflowList } from '@/lib/workflow';

export interface Release {
  url: string;
  assets_url: string;
  html_url: string;
  id: number;
  tag_name: string;
  target_commitish: string;
  name: string;
  prerelease: boolean;
  created_at: string;
  published_at: string;
  assets?: (Asset | null)[] | null;
  body: string;
}

export interface Asset {
  url: string;
  id: number;
  name: string;
  label: string;
  state: string;
  size: number;
  download_count: number;
  created_at: string;
  updated_at: string;
  browser_download_url: string;
}

const RELEASES_URL =
  'https://api.github.com/repos/moranje/alfred-workflow-todoist/releases';

function getReleases(
  releases: Release[]
): { latest: Release | undefined; prerelease: Release | undefined } {
  let latest, prerelease;
  for (const [, release] of releases.entries()) {
    if (release.prerelease === true && !prerelease) {
      prerelease = release;
    }

    if (release.prerelease === false && !latest) {
      latest = release;
    }
  }

  return { latest, prerelease };
}

function isUpdateCheckNeeded(): boolean {
  const now = Date.now();
  const lastUpdate = settingsStore().get('last_update') ?? now;
  const updateInterval =
    settingsStore().get('update_checks') * 1000; /* Milliseconds */
  const timePassed = now - new Date(lastUpdate).getTime();

  // Do not keep nagging
  settingsStore().set('last_update', new Date().toISOString());

  if (timePassed > updateInterval) return true;

  return false;
}

function addRelease(release: Release, current: string): void {
  const [workflow] = release.assets || [];

  if (workflow) {
    workflowList.addItem(
      new Item({
        arg: createCall({
          name: 'openUrl',
          args: workflow.browser_download_url,
        }),
        title: `Download workflow update`,
        subtitle: `The latest version is ${release.tag_name} you are on v${current}`,
        quicklookurl: release.html_url,
      })
    );
    workflowList.addItem(
      new Item({
        arg: createCall({
          name: 'openUrl',
          args: release.html_url,
        }),
        title: `Open changelog`,
        subtitle: `See what's changed in the latest version`,
        quicklookurl: release.html_url,
      })
    );
  } else {
    throw new AlfredError(Errors.UpdaterError, 'Invalid release assets');
  }
}

/**
 * Check github for new releases (or prereleases). This should not interrupt the
 * workflow of a user.
 */
export async function checkForWorkflowUpdate(): Promise<void> {
  try {
    if (isUpdateCheckNeeded() === false) return;

    const { body: releases } = await got(RELEASES_URL, {
      responseType: 'json',
    });

    const { latest, prerelease } = getReleases(releases);
    const hasPrereleases = settingsStore().get('pre_releases');

    if (
      hasPrereleases === true &&
      prerelease &&
      /* current < prerelease */
      compare(ENV.workflow.version, prerelease.tag_name) === -1
    ) {
      return addRelease(prerelease, ENV.workflow.version);
    }

    /* current < latest */
    if (latest && compare(ENV.workflow.version, latest.tag_name) === -1) {
      return addRelease(latest, ENV.workflow.version);
    }

    // istanbul ignore next: no need to test here
    logger().info('Update check completed, no new updates found.');
  } catch (error) {
    throw new AlfredError(Errors.UpdaterError, error.message, {
      hide: true,
      title: 'A problem with the silent updater check has occurred',
      error,
    });
  }
}
