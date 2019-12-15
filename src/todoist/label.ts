import { AlfredError } from '@/project';
import { Item, List } from '@/workflow';

export class Label {
  name: string;
  id: number;

  constructor(name = '', id = -1) {
    if (!name && name === '') {
      throw new AlfredError(`A label must have a name (${name}) property`);
    }

    if (!id || id === -1) {
      throw new AlfredError(`A label must have a id (${id}) property`);
    }

    this.name = name;
    this.id = id;
  }
}

export class LabelList extends List {
  constructor(labels: Label[] = [], query = '') {
    super(
      labels.map(
        label =>
          new Item({
            title: label.name,
            subtitle: `Add label ${label.name} to task`,
            autocomplete: `${query.replace(/(^.*@).*/, '$1')}${label.name} `,
            valid: false,
          })
      )
    );
  }
}
