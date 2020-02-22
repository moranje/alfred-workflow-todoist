/* eslint-disable jest/no-hooks */
jest.mock('@/lib/stores/settings-store');
import { mockProcessStdout, mockProcessStderr } from 'jest-mock-process';
import { checkForWorkflowUpdate } from '../updater';
import settingsStore from '../stores/settings-store';
import { workflowList } from '../workflow/list';
import nock from 'nock';
import { REMOTE_FIXTURES } from '../../tests/helpers/fixtures';

let mockStdout: jest.SpyInstance;
let mockStderr: jest.SpyInstance;

const scope = nock(
  'https://api.github.com/repos/moranje/alfred-workflow-todoist'
);

describe('unit: Updater', () => {
  beforeEach(() => {
    mockStdout = mockProcessStdout();
    mockStderr = mockProcessStderr();
  });

  afterEach(() => {
    settingsStore().set('last_update', new Date(2000).toISOString());
    mockStdout.mockRestore();
    mockStderr.mockRestore();
    workflowList.clear();
    nock.cleanAll();
  });

  it('Should show an update list item when a new release is available', async () => {
    expect.assertions(1);

    scope
      .get('/releases')
      .once()
      .reply(200, REMOTE_FIXTURES.releases)
      .persist();

    await checkForWorkflowUpdate();

    expect(workflowList.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          subtitle: expect.stringMatching(/The latest version is v99.8.4/),
        }),
      ])
    );
  });

  it('Should show an update list item when a new prerelease is available', async () => {
    expect.assertions(1);

    scope
      .get('/releases')
      .once()
      .reply(200, REMOTE_FIXTURES.releases)
      .persist();

    settingsStore().set('pre_releases', true);
    await checkForWorkflowUpdate();

    expect(workflowList.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          subtitle: expect.stringMatching(
            /The latest version is v100.0.0-alpha.1/
          ),
        }),
      ])
    );

    settingsStore().set('pre_releases', false);
  });

  it('Should skip update if the time since last update is shorter than that specified in `update_checks` setting', async () => {
    expect.assertions(1);

    scope
      .get('/releases')
      .once()
      .reply(200, REMOTE_FIXTURES.releases)
      .persist();

    settingsStore().set('last_update', new Date().toISOString());
    await checkForWorkflowUpdate();

    expect(workflowList.items).toEqual([]);
  });

  it('Should should handle empty last_update ', async () => {
    expect.assertions(1);

    scope
      .get('/releases')
      .once()
      .reply(200, REMOTE_FIXTURES.releases)
      .persist();

    settingsStore().set('last_update', undefined);
    await checkForWorkflowUpdate();

    expect(new Date(settingsStore().get('last_update')).getDate()).toEqual(
      new Date().getDate()
    );
  });

  it('should throw an error if the release has no assets', async () => {
    expect.assertions(1);

    scope
      .get('/releases')
      .once()
      .reply(200, [{ prerelease: false, tag_name: 'v99.9.9' }])
      .persist();

    await expect(checkForWorkflowUpdate()).rejects.toThrow(
      /Invalid release assets/
    );
  });

  it('should always throw hidden errors from updater', async () => {
    expect.assertions(1);

    scope
      .get('/releases')
      .once()
      .reply(500)
      .persist();

    await expect(checkForWorkflowUpdate()).rejects.toThrow(
      // Will be AlfredError instance
      expect.objectContaining({ hide: true })
    );
  });

  afterAll(() => {
    nock.restore();
  });
});
