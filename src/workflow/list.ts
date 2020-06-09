import { Writable } from '@/workflow'
import compose from 'stampit'

/** @hidden */
export const List: workflow.ListFactory = compose(Writable, {
  /**
   * @constructor
   * @param {workflow.ListInstance} list
   */
  init(this: workflow.ListInstance, { items = [] }: { items: workflow.Item[] | undefined }) {
    this.items = items
  }
})
