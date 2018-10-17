declare module 'fast-plist'

declare type primitiveNonEmpty = string | number | boolean

declare namespace todoist {

}

/**
 * Alfred workflow logic
 */
declare namespace workflow {
  /**
   * A mixin that formats the way output is sent to stdout
   */
  export interface Writable {
    write: (...params: any[]) => void
    object: (arg: Object) => string
  }

  /**
   * A text view object
   */
  export interface View {
    upperCase: (text: string) => string
    lowerCase: (text: string) => string
    sentenceCase: (text: string) => string
    when: (condition: any, truthy: string, falsy: string) => string
    ws: (quantity: number) => string
    template: (
      fn: (
        {
          upperCase,
          lowerCase,
          sentenceCase,
          ws,
          when
        }: {
          upperCase: (text: string) => string
          lowerCase: (text: string) => string
          sentenceCase: (text: string) => string
          when: (condition: any, truthy: string, falsy: string) => string
          ws: (quantity: number) => string
        }
      ) => string
    ) => string
  }

  /**
   * An Alfred List Item
   */
  export interface Item {
    /**
     * The title displayed in the result row. There are no options for this
     * element and it is essential that this element is populated.
     */
    title: string

    /**
     * The subtitle displayed in the result row.
     */
    subtitle?: string

    /**
     * The icon displayed in the result row. Workflows are run from their
     * workflow folder, so you can reference icons stored in your workflow
     * relatively.
     */
    icon?: {
      type: string
      path: string
    }

    /**
     * This is a unique identifier for the item which allows help Alfred to learn
     * about this item for subsequent sorting and ordering of the user's actioned
     * results.
     *
     * It is important that you use the same UID throughout subsequent executions
     * of your script to take advantage of Alfred's knowledge and sorting. If you
     * would like Alfred to always show the results in the order you return them
     * from your script, exclude the UID field.
     *
     * @memberof Item#uid
     */
    uid?: string

    /**
     * The argument which is passed through the workflow to the connected output
     * action.
     */
    arg?: string

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
    type?: 'default' | 'file' | 'file:skipcheck'

    /**
     * If this item is valid or not. If an item is valid then Alfred will action
     * this item when the user presses return. If the item is not valid, Alfred
     * will do nothing. This allows you to intelligently prevent Alfred from
     * actioning a result based on the current {query} passed into your script.
     *
     * If you exclude the valid attribute, Alfred assumes that your item is valid.
     */
    valid?: boolean

    /**
     * From Alfred 3.5, the match field enables you to define what Alfred matches
     * against when the workflow is set to "Alfred Filters Results". If match is
     * present, it fully replaces matching on the title property.
     *
     * ```json
     * {
     *   "match": "my family photos"
     * }
     * ```
     * Note that the match field is always treated as case insensitive, and
     * intelligently treated as diacritic insensitive. If the search query
     * contains a diacritic, the match becomes diacritic sensitive.
     */
    match?: string

    /**
     * An optional but recommended string you can provide which is populated into
     * Alfred's search field if the user auto-complete's the selected result (⇥
     * by default).
     *
     * If the item is set as `"valid": false`, the auto-complete text is
     * populated into Alfred's search field when the user actions the result.
     */
    autocomplete?: string

    /**
     * The mod element gives you control over how the modifier keys react. You
     * can now define the valid attribute to mark if the result is valid based on
     * the modifier selection and set a different arg to be passed out if
     * actioned with the modifier.
     *
     * ```json
     * {
     *   "mods": {
     *     "alt": {
     *         "valid": true,
     *         "arg": "alfredapp.com/powerpack",
     *         "subtitle": "https://www.alfredapp.com/powerpack/"
     *     },
     *     "cmd": {
     *         "valid": true,
     *         "arg": "alfredapp.com/powerpack/buy/",
     *         "subtitle": "https://www.alfredapp.com/powerpack/buy/"
     *     },
     *   }
     * }
     * ```
     */
    mod?: {
      alt?: {
        valid: boolean
        arg: string
        subtitle: string
      }
      cmd?: {
        valid: boolean
        arg: string
        subtitle: string
      }
    }

    /**
     * The text element defines the text the user will get when copying the
     * selected result row with ⌘C or displaying large type with ⌘L.
     *
     * ```json
     * {
     *   "text": {
     *     "copy": "https://www.alfredapp.com/ (text here to copy)",
     *     "largetype": "https://www.alfredapp.com/ (text here for large type)"
     *   }
     * }
     * ```
     *
     * If these are not defined, you will inherit Alfred's standard behaviour \
     * where the arg is copied to the Clipboard or used for Large Type.
     */
    text: {
      copy: string
      largetype: string
    }

    /**
     * A Quick Look URL which will be visible if the user uses the Quick Look
     * feature within Alfred (tapping shift, or cmd+y). Note that quicklookurl
     * will also accept a file path, both absolute and relative to home using ~/.
     *
     * ```json
     * {
     *   "quicklookurl": "https://www.alfredapp.com/"
     * }
     * ```
     */
    quicklookurl?: string
  }

  /**
   * A collection of Items
   */
  export interface List extends Writable {
    /**
     * A collection of list items
     */
    items: Item[]

    /**
     * Write to stdout.
     *
     * @param {any[]} params
     */
    write: (...params: any[]) => void
  }

  /**
   * Alfred notification options
   */
  export interface NotificationOptions {
    title: string
    subtitle: string
    message: string
    sound: boolean // Case Sensitive string for location of sound file; or use one of macOS' native sounds (see below)
    icon: string // Absolute Path to Triggering Icon
    contentImage: string // Absolute Path to Attached Image (Content Image)
    open: string // URL to open on Click
    wait: boolean // Wait for User Action against Notification or times out. Same as timeout = 5 seconds

    // New in latest version. See `example/macInput.js` for usage
    timeout: number // Takes precedence over wait if both are defined.
    closeLabel: string // String. Label for cancel button
    actions: string // String | Array<String>. Action label or list of labels in case of dropdown
    dropdownLabel: string // String. Label to be used if multiple actions
    reply: boolean // Boolean. If notification should take input. Value passed as third argument in callback and event emitter.
    error?: project.AlfredError
  }

  /**
   * An alfred notification
   */
  export interface Notification {
    /**
     * @constructor
     */
    init: (output: project.AlfredError | NotificationOptions) => void
    write: (onClick?: any, onTimeout?: any) => void
  }
}

declare namespace project {
  /**
   * An extension of the base Error that incorperates workflow
   * environment variables.
   *
   * @export
   * @interface AlfredError
   * @extends {Error}
   */
  export interface AlfredError extends Error {
    QUERY?: string
    OSX_VERSION?: string
    NODE_VERSION?: string
    ALFRED_VERSION?: string
    WORKFLOW_VERSION?: string
  }
}
