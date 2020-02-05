import { TaskAdapter } from 'todoist-rest-api';

import { CacheStore } from '@/lib/todoist/local-rest-adapter/conf-cache';

import { LocalRESTAdapter } from '.';
import { ResourceName, Store } from './types';
export default class LocalTaskAdapter<
  Name extends ResourceName
> extends LocalRESTAdapter<Name> {
  taskAdapter: TaskAdapter<'task'>;
  // The 'type' parameter is used for type inference
  constructor(type: Name, token: string, store: CacheStore<Store>) {
    super(type, token, store);

    this.taskAdapter = new TaskAdapter('task', token);
  }

  async close(id: number): Promise<boolean> {
    const isClosed = await this.taskAdapter.close(id);

    if (isClosed) {
      this.removeCacheItem(id);
    }

    return isClosed;
  }

  async reopen(id: number): Promise<boolean> {
    const isReopened = await this.taskAdapter.reopen(id);
    const task = await this.taskAdapter.find(id);

    if (task != null) {
      this.addCacheItem(task);
    }

    return isReopened;
  }
}
