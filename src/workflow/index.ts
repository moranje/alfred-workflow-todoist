export { Item } from './item';
export { Writable } from './writable';
export { List } from './list';
export { view } from './view';
export { Notification } from './notification';

/**
 * Generate a UUID (v4).
 */
export function uuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
    /[xy]/g,
    (c: string) => {
      const r = (Math.random() * 16) | 0;

      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    }
  );
}
