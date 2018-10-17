import { Writable } from '@/workflow';
import md5 from 'md5';
import compose from 'stampit';

// **********************************************
// Module
// **********************************************

/**
 * A workflow item.
 */
export const Item = compose(
  Writable,
  {
    /**
     * @constructor
     * @param {Item} item
     */
    init(
      this: workflow.Item,
      {
        uid = '',
        arg = '',
        type = 'default',
        valid = true,
        autocomplete = '',
        title = '',
        subtitle = '',
        icon = { path: 'icon.png' }
      }
    ) {
      Object.assign(this, {
        arg: typeof 'object' ? JSON.stringify(arg) : arg,
        type,
        valid,
        autocomplete,
        title,
        subtitle,
        icon
      })

      this.uid = uid || md5(this.title + this.subtitle)
    }
  }
)
