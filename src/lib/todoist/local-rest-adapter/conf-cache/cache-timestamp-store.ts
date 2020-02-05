interface Store {
  [key: string]: number;
}

// Private store
let store: Store = {};

function assertKeyIsString(key: {}): asserts key is string {
  if (typeof key !== 'string') {
    throw new TypeError(
      `Expected key to be a string, was ${key.toString()} (${typeof key})`
    );
  }
}

function assertValueIsTimestamp(value: unknown): asserts value is number {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 0) {
    throw new TypeError(
      `Expected value to be a number, was ${value} (${typeof value})`
    );
  }
}

/**
 * A cache-timestamp store. Only stores a key and it's timestamp.
 */
export const CacheTimestampStore = {
  /**
   * Retrieve the current timestamp store.
   *
   * @returns A copy of the store.
   */
  get store(): Store {
    // Copy store: prevent direct access
    return Object.assign({}, store);
  },

  /**
   * Create a new timestamp store.
   *
   * @param $store A store object.
   */
  set store($store: Store) {
    this.clear();
    Object.keys($store).forEach(key =>
      this.setTimestamp(key, $store[key.toString()])
    );
  },

  /**
   * Clear al store timestamp values.
   */
  clear(): void {
    store = {};
  },

  /**
   * Retrieve a timestamp by it's key.
   *
   * @param key A resource name.
   * @returns A timestamp.
   */
  getTimestamp(key: string): number {
    assertKeyIsString(key);

    return store[key.toString()];
  },

  /**
   * Set a timestamp to a resource.
   *
   * @param key A resource name.
   * @param timestamp A timestamp (in milliseconds).
   */
  setTimestamp(key: string, timestamp: number): void {
    assertKeyIsString(key);
    assertValueIsTimestamp(timestamp);

    store[key.toString()] = timestamp;
  },

  /**
   * Remove a timestamp from the store.
   *
   * @param key A resource name.
   */
  deleteTimestamp(key: string): void {
    assertKeyIsString(key);

    delete store[key.toString()];
  },

  /**
   * Check if a resource has a timestamp. Will be false if a timestamp has
   * expired. If an expired timestamp is encountered it will be deleted from the
   * store.
   *
   * @param key A resource name.
   * @returns True if the key is found and has not expired, false otherwise.
   */
  has(key: string): boolean {
    if (this.getTimestamp(key) == null) return false;

    if (this.isExpired(key) === true) {
      this.deleteTimestamp(key);
      return false;
    }

    return true;
  },

  /**
   * Test if a timestamp has expired. Returns false if no timestamp is found.
   *
   * @param key A resource name.
   * @returns True if the key is found and has not expired.
   */
  isExpired(key: string): boolean {
    if (this.getTimestamp(key) == null) return true;

    if (this.getTimestamp(key) >= Date.now()) return false;

    return true;
  },
};
