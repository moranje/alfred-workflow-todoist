import crypto = require('crypto');
import fs = require('fs');
import { WorkflowItem } from './interfaces';

/**
 * Output to the workflow console
 *
 * @author moranje
 * @since  2017-06-12
 * @param  {Object|String}   output Any output.
 * @return {String}                 Stringified output.
 */
export function write(output: any): void {
  return console.log(JSON.stringify(output));
}

/**
 * A error wrapper for write.
 *
 * @author moranje
 * @since  2017-06-12
 * @param  {Object|String} output The error
 * @return {String}               The error string output
 */
export function writeError(output: any): void {
  console.log('Error:', JSON.stringify(output));
}

/**
 * Sugar for serializing files
 *
 * @author moranje
 * @since  2017-06-11
 * @param  {Object}   data The object to serialize.
 * @param  {String}   path The path to serialize to.
 * @return {void}
 */
export function writeToFile(data: any, path: string): void {
  fs.writeFile(path, JSON.stringify(data), err => {
    if (err) return writeError(err);
  });
}

/**
 * Class item
 *
 * @author moranje
 * @since  2017-06-12
 * @param  {Object} options Item options
 * @return {Item}           A workflow item
 */
export class Item {
  title: string;
  uid: string;
  arg: string;
  type: string;
  valid: boolean;
  autocomplete: string;
  icon: string;
  subtitle: string;
  constructor(options: WorkflowItem) {
    if (!options.title) {
      throw new Error('Items need at least a title to work');
    }

    this.title = options.title;

    // Optional values
    this.uid =
      options.uid ||
      crypto.createHash('md5').update(options.title).digest('hex');
    this.arg = options.arg || '';
    this.type = options.type || 'default';
    this.valid = options.valid !== undefined ? options.valid : true;
    this.autocomplete = options.autocomplete || '';
    this.icon = options.icon || 'icon.png';
    this.subtitle = options.subtitle || 'Hit ENTER';
  }

  /**
   * Set workflow item title.
   *
   * @author moranje
   * @since  2017-06-20
   * @param  {String}   title The title name.
   */
  setTitle(title: string): void {
    this.title = title;
  }

  /**
   * Set workflow item subtitle.
   *
   * @author moranje
   * @since  2017-06-20
   * @param  {String}   subtitle The subtitle name.
   */
  setSubtitle(subtitle: string): void {
    this.subtitle = subtitle;
  }

  /**
   * Set workflow item argument.
   *
   * @author moranje
   * @since  2017-06-20
   * @param  {String}   arg The workflow argument.
   */
  setArg(arg: string): void {
    this.arg = arg;
  }

  /**
   * Output item instance to console.
   *
   * @author moranje
   * @since  2017-06-20
   */
  write(): void {
    write(this);
  }
}

/**
 * Class list
 *
 * @author moranje
 * @since  2017-06-12
 * @param  {Object}      items An array of items
 * @return {List}              A list of items
 */
export class List {
  items: Array<Item>;
  constructor(items: Array<WorkflowItem> = []) {
    this.items = [];

    items.forEach(item => {
      this.items.push(new Item(item));
    });
  }

  /**
   * Add a workflow item to the list.
   *
   * @author moranje
   * @since  2017-06-20
   * @param  {WorkflowItem} item An Alfred workflow item.
   */
  add(item: WorkflowItem): void {
    this.items.push(new Item(item));
  }

  /**
   * Return a list with a secified number of items.
   *
   * @author moranje
   * @since  2017-06-20
   * @param  {Number}   number The amount of items.
   * @return {List}            A List instance.
   */
  capAt(number: number): List {
    return new List(this.items.slice(0, number));
  }

  /**
   * Output list instance to console.
   *
   * @author moranje
   * @since  2017-06-20
   */
  write(): void {
    write({ items: this.items });
  }
}
