import { AlfredError } from '@/project'
import { Item, List } from '@/workflow'
import compose from 'stampit'

/** @hidden */
export const Label: todoist.LabelFactory = compose({
  /**
   * @constructor
   * @param {Label} label A new label
   */
  init(this: todoist.LabelInstance, label: todoist.Label = { name: '', id: -1 }) {
    if (!label.name && label.name === '') {
      throw new AlfredError(`A label must have a name (${label.name}) property`)
    }

    if (!label.id || label.id === -1) {
      throw new AlfredError(`A label must have a id (${label.id}) property`)
    }

    Object.assign(this, label)
  }
})

/** @hidden */
export const LabelList: todoist.LabelListFactory = compose(List, {
  init(
    this: todoist.LabelListInstance,
    { labels = [], query }: { labels: todoist.Label[]; query: string }
  ) {
    labels.forEach((label: todoist.Label) => {
      this.items.push(
        Item({
          title: label.name,
          subtitle: `Add label ${label.name} to task`,
          autocomplete: `${query.replace(/(^.*@).*/, '$1')}${label.name} `,
          valid: false
        })
      )
    })
  }
})
