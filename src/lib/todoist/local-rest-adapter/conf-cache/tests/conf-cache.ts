/* eslint-disable jest/no-hooks */
jest.mock('@/lib/todoist/local-rest-adapter/conf-cache');

import { CacheStore } from '@/lib/todoist/local-rest-adapter/conf-cache';

// TODO: mock fs.writeWileSync()

let store;

describe('unit: Cache timestamp store', () => {
  beforeEach(() => {
    store = new CacheStore({});
  });

  it.todo('should test something');
});
