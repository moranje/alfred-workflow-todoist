import md5 from 'md5';

interface Icon {
  type?: string;
  path?: string;
}

type ModifierKey = 'cmd' | 'alt' | 'ctrl' | 'shift' | 'fn';

interface ModifierOptions {
  valid: boolean;
  arg: string;
  subtitle: string;
  icon?: {
    type?: string;
    path?: string;
  };
  variables: {
    [key: string]: string;
  };
}

interface Text {
  copy?: string;
  largetype?: string;
}

export interface Item {
  [key: string]:
    | string
    | boolean
    | Icon
    | Record<ModifierKey, ModifierOptions>
    | Text
    | undefined;
  /**
   * This is a unique identifier for the item which allows help Alfred to learn
   * about this item for subsequent sorting and ordering of the user's actioned
   * results.
   */
  uid?: string;
  /**
   * The title displayed in the result row. There are no options for this
   * element and it is essential that this element is populated.
   *
   * @example
   * ```json
   * { "title": "Desktop" }
   * ```
   */
  title: string;
  /**
   * The subtitle displayed in the result row. This element is optional.
   *
   * @example
   * ```json
   * { "subtitle": "~/Desktop" }
   * ```
   */
  subtitle?: string;
  /**
   * The argument which is passed through the workflow to the connected output
   * action.
   *
   * @example
   * ```json
   *  { "arg": "~/Desktop" }
   * ```
   *
   * While the arg attribute is optional, it's highly recommended that you
   * populate this as it's the string which is passed to your connected output
   * actions. If excluded, you won't know which result item the user has
   * selected.
   */
  arg?: string;
  /**
   * The icon displayed in the result row. Workflows are run from their workflow
   * folder, so you can reference icons stored in your workflow relatively.
   *
   * @example
   * ```json
   * {
   *   "icon": {
   *     "type": "fileicon",
   *     "path": "~/Desktop"
   *   }
   * }
   * ```
   *
   * By omitting the `"type"`, Alfred will load the file path itself, for
   * example a png. By using `"type": "fileicon"`, Alfred will get the icon for
   * the specified path. Finally, by using `"type": "filetype"`, you can get the
   * icon of a specific file, for example `"path": "public.png"`
   */
  icon?: Icon;
  /**
   * If this `item` is valid or not. If an item is valid then Alfred will action
   * this `item` when the user presses return. If the item is not valid, Alfred
   * will do nothing. This allows you to intelligently prevent Alfred from
   * actioning a result based on the current {query} passed into your script.
   *
   * If you exclude the valid attribute, Alfred assumes that your `item` is
   * valid.
   */
  valid?: boolean;
  /**
   * From Alfred 3.5, the `match` field enables you to define what Alfred
   * matches against when the workflow is set to "Alfred Filters Results". If
   * match is present, it fully replaces matching on the title property.
   *
   * ```json
   * { "match": "my family photos" }
   * ```.
   *
   * Note that the `match` field is always treated as case insensitive, and
   * intelligently treated as diacritic insensitive. If the search query
   * contains a diacritic, the `match` becomes diacritic sensitive.
   *
   * This option pairs well with the "[Alfred Filters Results](https://www.alfredapp.com/help/workflows/inputs/script-filter/#alfred-filters-results)" Match Mode option.
   */
  match?: string;
  /**
   * An optional but recommended string you can provide which is populated into
   * Alfred's search field if the user auto-complete's the selected result (`⇥`
   * by default).
   *
   * If the `item` is set as `"valid": false`, the auto-complete text is
   * populated into Alfred's search field when the user actions the result.
   */
  autocomplete?: string;
  /**
   * By specifying `"type": "file"`, this makes Alfred treat your result as a
   * file on your system. This allows the user to perform actions on the file
   * like they can with Alfred's standard file filters.
   *
   * When returning files, Alfred will check if the file exists before
   * presenting that result to the user. This has a very small performance
   * implication but makes the results as predictable as possible. If you would
   * like Alfred to skip this check as you are certain that the files you are
   * returning exist, you can use `"type": "file:skipcheck"`.
   */
  type?: 'default' | 'file' | 'file:skipcheck';
  /**
   * The mod element gives you control over how the modifier keys react. You
   * can now define the valid attribute to mark if the result is valid based on
   * the modifier selection and set a different arg to be passed out if
   * actioned with the modifier.
   *
   * @example
   * ```json
   * {
   *   "mods": {
   *     "alt": {
   *       "valid": true,
   *       "arg": "alfredapp.com/powerpack",
   *       "subtitle": "https://www.alfredapp.com/powerpack/"
   *     },
   *     "cmd": {
   *       "valid": true,
   *       "arg": "alfredapp.com/shop/",
   *       "subtitle": "https://www.alfredapp.com/shop/"
   *     },
   *   }
   * }
   * ```
   *
   * From Alfred 3.4.1, you can define an `icon` and `variables` for each
   * object in the `mods` object.
   *
   * See [Variables / Session Variables](https://www.alfredapp.com/help/workflows/inputs/script-filter/json/#variables) for more info about using variables.
   */
  mod?: Record<ModifierKey, ModifierOptions>;
  /**
   * The text element defines the text the user will get when copying the
   * selected result row with ⌘C or displaying large type with ⌘L.
   *
   * @example
   * ```json
   * {
   *   "text": {
   *     "copy": "https://www.alfredapp.com/ (text here to copy)",
   *     "largetype": "https://www.alfredapp.com/ (text here for large type)"
   *   }
   * }
   * ```
   *
   * If these are not defined, you will inherit Alfred's standard behaviour
   * where the arg is copied to the Clipboard or used for Large Type.
   */
  text?: Text;
  /**
   * A Quick Look URL which will be visible if the user uses the Quick Look
   * feature within Alfred (tapping shift, or cmd+y). Note that quicklookurl
   * will also accept a file path, both absolute and relative to home using ~/.
   *
   * @example
   * ```json
   * { "quicklookurl": "https://www.alfredapp.com/" }
   * ```
   */
  quicklookurl?: string;
}

export class Item {
  constructor({
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
  }: Item) {
    Object.assign(this, {
      uid,
      title,
      subtitle,
      icon,
      arg,
      type,
      valid,
      autocomplete,
      match,
      mod,
      text,
      quicklookurl,
    });
  }
}
