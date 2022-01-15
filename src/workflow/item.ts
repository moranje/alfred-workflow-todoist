import { Writable } from '@/workflow'
import md5 from 'md5'
import compose from 'stampit'

/**
 * A workflow item.
 *
 * @hidden
 */
export const Item: workflow.ItemFactory = compose(Writable, {
  /**
   * @constructor
   * @param {workflow.Item} item
   */
  init(
    this: workflow.ItemInstance,
    {
      uid = void 0,
      title = '',
      subtitle = void 0,
      icon = { path: 'icon.png' },
      arg = void 0,
      type = 'default',
      valid = true,
      autocomplete = void 0,
      match = void 0,
      mod = void 0,
      text = void 0,
      quicklookurl = void 0,
    }
  ) {
    Object.assign(this, {
      uid: uid || md5(this.title + this.subtitle),
      title,
      subtitle,
      icon,
      arg: typeof 'object' ? JSON.stringify(arg) : arg,
      type,
      valid,
      autocomplete,
      match,
      mod,
      text,
      quicklookurl,
    })
  },
})
