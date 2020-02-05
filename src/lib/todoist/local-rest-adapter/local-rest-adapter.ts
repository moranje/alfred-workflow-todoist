import equal from 'deep-equal';
import FuzzySearch from 'fuzzy-search';
import {
  GetResourceByName,
  GetResourceOptionsByName,
  RESTAdapter,
} from 'todoist-rest-api';

import { CacheStore } from '@/lib/todoist/local-rest-adapter/conf-cache';

import { ResourceName, Store } from './types';

export default class LocalRESTAdapter<
  Name extends ResourceName
> extends RESTAdapter<Name> {
  store: CacheStore<Store>;
  constructor(type: Name, token: string, store: CacheStore<Store>) {
    super(type, token);

    if (store == null) {
      throw new Error(
        `Expected the first argument to be Conf object was ${store}`
      );
    }

    this.store = store;
  }

  // FIXME: resource should be a todoist resource type, but I can't figure out
  // how to make this work
  protected addCacheItem(resource: any): void {
    const cache = this.peekAll();

    cache.push(resource);

    this.store.set(this.type, cache);
  }

  protected removeCacheItem(id: number): void {
    const cache = this.peekAll();

    // 'item' should never be undefined
    const index = cache.findIndex((item: any) => item.id === id);
    cache.splice(index, 1);

    this.store.set(this.type, cache);
    // Clear any remaining cache store references
    this.store.has(this.type);
  }

  /**
   * Locally query cached resources.
   *
   * @param keys The resource keys to search for matches.
   * @param value The value to match against the resource keys.
   * @returns A resource array.
   */
  queryLocal(keys: string[], value: any): GetResourceByName<Name>[] {
    const all = this.peekAll() || [];

    // @ts-ignore: Note sure why the following isn't returning the right type
    // FuzzySearch<GetStoreItemType<Store[Name]>>(all, keys)
    const searcher = new FuzzySearch(all, keys);

    return searcher.search(`${value}`);
  }

  /**
   * Synchronously fetch resource item from cache.
   *
   * @param id The resource item id.
   * @returns The cached resource item.
   */
  peek(id: number): GetResourceByName<Name> {
    const [first] = this.queryLocal(['id'], id);

    return first;
  }

  /**
   * Synchronously fetch all of the resource from cache.
   *
   * @param id The resource id.
   * @returns The cached resource.
   */
  peekAll(): Store[Name] {
    return this.store.get(this.type);
  }

  /**
   * Locally query remotely fetched resources.
   *
   * @param keys The resource keys to search for matches.
   * @param value The value to match against the resource keys.
   * @returns A resource array (promise).
   */
  async query(
    keys: string[] = [],
    value: string
  ): Promise<GetResourceByName<Name>[]> {
    const all = await this.findAll();

    const searcher = new FuzzySearch<GetResourceByName<Name>>(all, keys);

    return searcher.search(value);
  }

  /**
   * Returns a JSON object containing a REST resource object related to the given
   * id.
   *
   * @param id The resource id.
   */
  async find(id: number): Promise<GetResourceByName<Name>> {
    const cache = this.peek(id);

    if (cache != null) return cache;

    return super.find(id);
  }

  /**
   * Returns a JSON-encoded array containing all REST resources.
   *
   * @param options SkipCache: boolean, allows for the cache to be bypassed and
   * directly query the API.
   */
  async findAll(options?: any): Promise<GetResourceByName<Name>[]> {
    const cache = this.peekAll() as GetResourceByName<Name>[];

    if (cache != null && !options?.skipCache) return cache;

    const remote = await super.findAll(options);
    if (!equal(remote, this.store.get(this.type))) {
      const typeSafeRemote = remote as Store[Name];
      this.store.set(this.type, typeSafeRemote);
    }

    return remote;
  }

  /**
   * Creates a new REST resource and returns the JSON object according for it.
   *
   * @param data The data to create a task with.
   */
  async create(
    data: GetResourceOptionsByName<Name>
  ): Promise<GetResourceByName<Name>> {
    const resource = await super.create(data);

    if (resource != null) {
      this.addCacheItem(resource);
    }

    return resource;
  }

  /**
   * Updates the REST resource for the given id and returns true when the
   * request is successful.
   *
   * @param id The resource id.
   * @param data The data to update a task with.
   */
  async update(
    id: number,
    data: GetResourceOptionsByName<Name>
  ): Promise<boolean> {
    const isUpdated = await super.update(id, data);

    if (isUpdated) {
      const current = this.peek(id);
      const updated = Object.assign({}, current, data);

      this.removeCacheItem(id);
      this.addCacheItem(updated);
    }

    return isUpdated;
  }

  /**
   * Deletes a REST resource and returns an empty response.
   *
   * @param id The resource id.
   */
  async remove(id: number): Promise<boolean> {
    const isRemoved = await super.remove(id);

    if (isRemoved) {
      this.removeCacheItem(id);
    }

    return isRemoved;
  }
}
