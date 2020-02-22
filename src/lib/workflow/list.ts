import { createCall } from '../cli-arguments';
import settingsStore from '@/lib/stores/settings-store';
import { Item } from '@/lib/workflow';

const EMPTY_ITEM = new Item({
  title: "Sorry, I've got nothing to show you",
  subtitle: 'Try again or check out the documentation',
  arg: createCall({
    name: 'openUrl',
    args: 'https://github.com/moranje/alfred-workflow-todoist',
  }),
  quicklookurl: 'https://github.com/moranje/alfred-workflow-todoist',
});

function toStdOut(items: Item[]): string {
  if (items.length > 0) {
    return JSON.stringify({ items }, undefined, '  ');
  }

  return JSON.stringify({ items: [EMPTY_ITEM] }, undefined, '  ');
}

export interface List {
  /**
   * A collection of list items.
   */
  _items: Item[];
}

export class List {
  constructor(items: Item[] = []) {
    this._items = [];
    this.items = items;
  }

  get items(): Item[] {
    const maxItems = settingsStore().get('max_items');

    return this._items.slice(0, maxItems);
  }

  set items(items: Item[]) {
    this._items = items;
  }

  addItem(item: Item): List {
    this._items.push(item);

    return this;
  }

  addList(list: List): List {
    list.items.forEach(item => this.addItem(item));

    return this;
  }

  clear(): List {
    this.items = [];

    return this;
  }

  public write(): void {
    process.stdout.write(`${toStdOut(this._items)}\n`);
  }
}

export const workflowList = new List();
