/* eslint-disable jest/no-hooks */
import { CacheTimestampStore as cache } from '../cache-timestamp-store';

describe('unit: Cache timestamp store', () => {
  beforeEach(() => {
    cache.clear();
  });

  it('should return an empty store uninitialized', () => {
    expect.assertions(1);

    expect(cache.store).toStrictEqual({});
  });

  it('should allow setting multiple store keys at once', () => {
    expect.assertions(1);

    const store = {
      task: Date.now(),
      project: Date.now(),
      label: Date.now(),
    };
    cache.store = store;

    expect(cache.store).toStrictEqual(store);
  });

  it('should not allow modifying timestamp by reference', () => {
    expect.assertions(1);

    const store = cache.store;
    store['task'] = Date.now();

    // NOTE: testing cacheStore().getItem() is not needed since primitive values are immutable
    expect(cache.store).toStrictEqual({});
  });

  it('getTimestamp() should not allow getting non-string keys', () => {
    expect.assertions(2);

    // @ts-ignore
    expect(() => cache.getTimestamp(41)).toThrow(
      'Expected key to be a string, was 41 (number)'
    );
    // @ts-ignore
    expect(() => cache.getTimestamp(Symbol(41))).toThrow(
      'Expected key to be a string, was Symbol(41) (symbol)'
    );
  });

  it('getTimestamp() should retrieve set items', () => {
    expect.assertions(1);

    const KEY = 'task';
    const VALUE = Date.now();
    cache.setTimestamp(KEY, VALUE);

    expect(cache.getTimestamp(KEY)).toBe(VALUE);
  });

  it('setTimestamp() should not allow setting non-string keys', () => {
    expect.assertions(2);

    // @ts-ignore
    expect(() => cache.setTimestamp(41, Date.now())).toThrow(
      'Expected key to be a string, was 41 (number)'
    );

    // @ts-ignore
    expect(() => cache.setTimestamp(Symbol(41, Date.now()))).toThrow(
      'Expected key to be a string, was Symbol(41) (symbol)'
    );
  });

  it('setTimestamp() should not allow setting non-postive-number timestamps', () => {
    expect.assertions(1);

    // @ts-ignore
    expect(() => cache.setTimestamp('task', '41')).toThrow(
      'Expected value to be a number, was 41 (string)'
    );
  });

  it('setTimestamp() should only except a valid number as values', () => {
    expect.assertions(1);

    expect(() => cache.setTimestamp('task', NaN)).toThrow(
      'Expected value to be a number, was NaN (number)'
    );
  });

  it('clearTimestamp() should clear a timestamp by key', () => {
    expect.assertions(1);

    const KEY = 'task';
    cache.setTimestamp(KEY, Date.now());
    cache.deleteTimestamp(KEY);

    expect(cache.getTimestamp(KEY)).toBeUndefined();
  });

  it('clear() should clear all timestamps in store', () => {
    expect.assertions(1);

    const store = {
      task: Date.now(),
      project: Date.now(),
      label: Date.now(),
    };
    cache.store = store;
    cache.clear();

    expect(cache.store).toStrictEqual({});
  });

  it("has() should be false when a key doesn't exist", () => {
    expect.assertions(1);

    expect(cache.has('task')).toBe(false);
  });

  it('has() should be false when a key is expired', () => {
    expect.assertions(1);

    const KEY = 'task';
    const date = new Date();
    date.setDate(date.getDate() - 1); // One day ago
    cache.setTimestamp(KEY, date.getTime());

    expect(cache.has(KEY)).toBe(false);
  });

  it('has() should be true when a key is not expired', () => {
    expect.assertions(1);

    const KEY = 'task';
    const date = new Date();
    date.setDate(date.getDate() + 1); // Tomorrow
    cache.setTimestamp(KEY, date.getTime());

    expect(cache.has(KEY)).toBe(true);
  });

  it('has() should delete the timestamp when it has expired', () => {
    expect.assertions(1);

    const KEY = 'task';
    const date = new Date();
    date.setDate(date.getDate() - 1); // One day ago
    cache.setTimestamp(KEY, date.getTime());
    cache.has(KEY);

    expect(cache.store).toStrictEqual({});
  });

  it('isExpired() should return true for missing timestamps', () => {
    expect.assertions(1);

    expect(cache.isExpired('task')).toBe(true);
  });

  it('isExpired() should return true when the timestamp is in the past', () => {
    expect.assertions(1);

    const KEY = 'task';
    const date = new Date();
    date.setDate(date.getDate() - 1); // One day ago
    const VALUE = date.getTime();

    cache.setTimestamp(KEY, VALUE);

    expect(cache.isExpired(KEY)).toBe(true);
  });

  it('isExpired() should return false when the timestamp is in the future', () => {
    expect.assertions(1);

    const KEY = 'task';
    const date = new Date();
    date.setDate(date.getDate() + 1); // Tomorrow
    const VALUE = date.getTime();

    cache.setTimestamp(KEY, VALUE);

    expect(cache.isExpired(KEY)).toBe(false);
  });
});
