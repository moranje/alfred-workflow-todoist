const STORE: { [key: string]: string } = {
  version: '5.8.4',
  updated: '2019-12-26T20:29:31.634Z',
};

/**
 *
 */
export default function createStore() {
  const map = new Map();

  Object.keys(STORE).forEach((key: string) => map.set(key, STORE[key]));

  return map;
}
