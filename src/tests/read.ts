/* eslint-disable jest/no-hooks */
import '@/tests/helpers/nock-requests';

import { mockProcessStderr, mockProcessStdout } from 'jest-mock-process';

import command from '@/lib/command';

jest.mock('@/lib/stores/settings-store');
jest.mock('@/lib/stores/update-store');
jest.mock('@/lib/todoist/local-rest-adapter/conf-cache');

let stdoutSpy: jest.SpyInstance;
let stderrSpy: jest.SpyInstance;

describe('integration: Read()', () => {
  beforeEach(() => {
    stdoutSpy = mockProcessStdout();
    stderrSpy = mockProcessStderr();
  });

  afterEach(() => {
    stdoutSpy.mockReset();
    stderrSpy.mockReset();
  });

  it('should find all tasks from cache with empty user input', async () => {
    expect.assertions(1);
    await command({ name: 'read', args: '' });

    expect(stdoutSpy.mock.calls[0][0]).toContainAllAlfredItemsWith('title', [
      'COMPLETE: Get milk (local)',
      'COMPLETE: Plan a thing (local)',
      'COMPLETE: Buy the thing (local)',
      'COMPLETE: Sign up for dance class (local)',
      'COMPLETE: Project review (local)',
      'REFRESH CACHE',
    ]);
  });

  it('should fuzzy filter tasks from user input', async () => {
    expect.assertions(1);
    await command({ name: 'read', args: 'sufdc' });

    expect(stdoutSpy.mock.calls[0][0]).toContainAllAlfredItemsWith('title', [
      'COMPLETE: Sign up for dance class (local)',
      'REFRESH CACHE',
    ]);
  });

  it('should filter tasks by project', async () => {
    expect.assertions(1);
    await command({ name: 'read', args: '#Waiting<3> ' });

    expect(stdoutSpy.mock.calls[0][0]).toContainAllAlfredItemsWith('title', [
      'COMPLETE: Buy the thing (local)',
      'REFRESH CACHE',
    ]);
  });

  it('should list projects', async () => {
    expect.assertions(1);
    await command({ name: 'read', args: '#N' });

    expect(stdoutSpy.mock.calls[0][0]).toContainAllAlfredItemsWith('title', [
      'Inbox (local)',
      'Next Actions (local)',
      'Waiting (local)',
      'REFRESH CACHE',
    ]);
  });

  it('should filter tasks by label', async () => {
    expect.assertions(1);
    await command({ name: 'read', args: '@15min<1> ' });

    expect(stdoutSpy.mock.calls[0][0]).toContainAllAlfredItemsWith('title', [
      'COMPLETE: Get milk (local)',
      'COMPLETE: Plan a thing (local)',
      'REFRESH CACHE',
    ]);
  });

  it('should list labels', async () => {
    expect.assertions(1);
    await command({ name: 'read', args: '@1' });

    expect(stdoutSpy.mock.calls[0][0]).toContainAllAlfredItemsWith('title', [
      '15min_local',
      '1hour_local',
      'REFRESH CACHE',
    ]);
  });

  it('should filter tasks by priority', async () => {
    expect.assertions(1);
    await command({ name: 'read', args: '!!2 ' });

    expect(stdoutSpy.mock.calls[0][0]).toContainAllAlfredItemsWith('title', [
      'COMPLETE: Plan a thing (local)',
      'REFRESH CACHE',
    ]);
  });

  it('should list priorties', async () => {
    expect.assertions(1);
    await command({ name: 'read', args: '!!' });

    expect(stdoutSpy.mock.calls[0][0]).toContainAllAlfredItemsWith('title', [
      '1',
      '2',
      '3',
      '4',
    ]);
  });

  it('should filter tasks by (project) sections', async () => {
    expect.assertions(1);
    await command({ name: 'read', args: '#Inbox<1> ::[To do]<1> ' });

    expect(stdoutSpy.mock.calls[0][0]).toContainAllAlfredItemsWith('title', [
      'COMPLETE: Get milk (local)',
      'REFRESH CACHE',
    ]);
  });

  it('should list (project) sections', async () => {
    expect.assertions(1);
    await command({ name: 'read', args: '#Inbox<1> ::' });

    expect(stdoutSpy.mock.calls[0][0]).toContainAllAlfredItemsWith('title', [
      'To do (local)',
      'Doing (local)',
      'Done (local)',
      'REFRESH CACHE',
    ]);
  });

  it('should report that a project is required for a section to be listed', async () => {
    expect.assertions(1);
    await expect(command({ name: 'read', args: '::' })).rejects.toThrow(
      'Add a project before you add a section'
    );
  });

  it.todo(
    'should always query the todoist API directly if a todoist filter is entered (skip cache)'
  );

  it('should show a parser error list item if unexpected input is encountered', async () => {
    expect.assertions(2);

    await expect(command({ name: 'read', args: '#<' })).rejects.toThrow(
      'The character "<" is a probably a mistake: "#<" <-'
    );
    await expect(command({ name: 'read', args: ',' })).rejects.toThrow(
      'The character "," is a probably a mistake: "," <-'
    );
  });
});
