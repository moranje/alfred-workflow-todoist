/* eslint-disable jest/no-hooks */
import { CacheStore } from '@/lib/todoist/local-rest-adapter/conf-cache';
import { LOCAL_FIXTURES } from '@/tests/helpers/fixtures';
import fs from 'fs';
import { spyOnImplementing } from 'jest-mock-process';

// jest.mock('write-file-atomic', (path: string, data: any) => {});
// let fsMock = spyOnImplementing(fs, 'writeFileSync', (...args: any) => args);

let store = new CacheStore({
  cwd: 'src/tests/stores',
  configName: 'cache',
  cacheTimeout: 100,
});

describe('unit: Cache timestamp store', () => {
  beforeEach(() => {
    store.reset();
    store.set('TASK', LOCAL_FIXTURES.tasks);
  });

  it('.get()', () => {
    expect.assertions(2);

    expect(store.get('<missing>')).toBeUndefined();
    expect(store.get('TASK')).toEqual(LOCAL_FIXTURES.tasks);
  });

  it('.set()', () => {
    expect.assertions(1);
    store.set('ITEM', 'Item');

    expect(store.get('ITEM')).toBe('Item');
  });

  it.todo('.has()');

  it.todo('.reset()');

  it.todo('.isExipred()');

  // afterAll(() => {
  //   fsMock.mockRestore();
  // });
});
