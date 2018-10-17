export { Item } from '@/workflow/item'
export { Writable } from '@/workflow/writable'
export { List } from '@/workflow/list'
export { View } from '@/workflow/view'
export { Notification } from '@/workflow/notification'

/**
 * Generate a UUID (v4).
 *
 * @since  2016-07-03
 * @return {String}
 */
export function uuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0

    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
