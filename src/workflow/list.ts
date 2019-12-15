import { Writable, Item } from '@/workflow';

export interface List {
  /**
   * A collection of list items
   */
  items: Item[];
}

export class List extends Writable {
  constructor(items: Item[] = []) {
    super();

    this.items = items;
  }
}
