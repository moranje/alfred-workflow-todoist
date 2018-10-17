import { Writable } from '@/workflow';
import compose from 'stampit';

export const List = compose(
  Writable,
  {
    props: {
      items: []
    },

    /**
     * @constructor
     * @param {List} list
     */
    init(this: workflow.List, { items = [] }: { items: any }) {
      this.items = items || []
    }
  }
)
