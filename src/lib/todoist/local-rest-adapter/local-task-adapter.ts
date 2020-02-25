import { TaskAdapter, GetResourceByName } from 'todoist-rest-api';
import equal from 'deep-equal';

import { Store } from './types';
import { LocalRESTAdapter } from '.';
import { CacheStore } from '@/lib/todoist/local-rest-adapter/conf-cache';
import { Language } from '@/lib/stores/settings-store';

export default class LocalTaskAdapter<
  Name extends 'task'
> extends LocalRESTAdapter<Name> {
  taskAdapter: TaskAdapter<'task'>;
  // The 'type' parameter is used for type inference
  constructor(type: Name, token: string, store: CacheStore<Store>) {
    super(type, token, store);

    this.taskAdapter = new TaskAdapter('task', token);
  }

  async findAll(options?: {
    project_id?: number;
    label_id?: number;
    filter?: string;
    lang?: Language;
    skipCache?: boolean;
  }): Promise<GetResourceByName<Name>[]> {
    const cache = this.peekAll() as GetResourceByName<Name>[];

    if (cache.length > 0 && options?.skipCache !== true && !options?.filter) {
      return cache;
    }

    // Shouldn't be passed along to the API request
    const parameters = {
      project_id: options?.project_id,
      label_id: options?.label_id,
      filter: options?.filter,
      lang: options?.lang,
    };

    const remote = await this.taskAdapter.findAll(parameters);
    if (!equal(remote, this.store.get(this.type))) {
      const typeSafeRemote = remote as Store[Name];
      this.store.set(this.type, typeSafeRemote);
    }

    // @ts-ignore: should really find a way to please the typescript compiler
    return remote;
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
