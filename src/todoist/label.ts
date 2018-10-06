import { AlfredError } from '@/workflow/error'
import compose from 'stampit'

import { List } from '../workflow/workflow'

export interface Label {
  [index: string]: string | number
  name: string
  id: number
}

export interface LabelList extends List {}

export const Label = compose({
  /**
   * @constructor
   * @param {Label} label A new label
   */
  init(this: Label, label: Label = { name: '', id: -1 }) {
    if (!label.name && label.name === '') {
      throw new AlfredError(`A label must have a name (${label.name}) property`)
    }

    if (!label.id || label.id === -1) {
      throw new AlfredError(`A label must have a id (${label.id}) property`)
    }

    Object.assign(this, label)
  }
})

export const LabelList = compose(
  List,
  {}
)
