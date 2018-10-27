/******************************************************************************
 * COPIED FROM STAMPIT DECLARATION FILE
 *
 * Importing it would turn this file into a module which means sepearte imports
 * for each interface. That ins't a problem per se but it also breaks jest. For
 * now this is an acceptable workaround.
 *****************************************************************************/

/**
 * Function used as .init() argument.
 * @hidden
 */
type Init = (factoryArg: any, ctx?: Context) => any

/**
 * The stamp Descriptor
 * @hidden
 */
interface Descriptor {
  /** Create a new stamp based on this descriptor */
  (...composables: Composable[]): stampit.Stamp
  /**
   * A hash containing methods (functions) of any future created instance.
   */
  methods?: {}
  /**
   * Initialization function(s) which will be called per each newly created
   * instance.
   */
  initializers?: Init[]
  /**
   * Properties which will shallowly copied into any future created instance.
   */
  properties?: {}
  /**
   * Properties which will be mixed to the new and any other stamp which this stamp will be composed with.
   */
  staticProperties?: {}
  /** Deeply merged properties of object instances */
  deepProperties?: {}
  /** ES5 Property Descriptors applied to object instances */
  propertyDescriptors?: {}
  /** Deeply merged properties of Stamps */
  staticDeepProperties?: {}
  /** ES5 Property Descriptors applied to Stamps */
  staticPropertyDescriptors?: {}
  /** A configuration object to be shallowly assigned to Stamps */
  configuration?: {}
  /** A configuration object to be deeply merged to Stamps */
  deepConfiguration?: {}
}

/**
 * Any composable object (stamp or descriptor)
 * @hidden
 */
type Composable = stampit.Stamp | Descriptor

/**
 * The .init() function argument.
 * @hidden
 */
interface Context {
  /**
   * The object which has been just instantiated.
   */
  instance: any

  /**
   * The stamp the object has been instantiated with.
   */
  stamp: stampit.Stamp

  /**
   * The arguments list passed to the stamp.
   */
  args: any[]
}

/** @hidden */
declare namespace stampit {
  /**
   * A factory function that will produce new objects using the
   * prototypes that are passed in or composed.
   */
  interface Stamp {
    /**
     * Invokes the stamp and returns a new object instance.
     * @param state Properties you wish to set on the new objects.
     * @param encloseArgs The remaining arguments are passed to all .enclose() functions.
     * WARNING Avoid using two different .enclose() functions that expect different arguments.
     * .enclose() functions that take arguments should not be considered safe to compose
     * with other .enclose() functions that also take arguments. Taking arguments with
     * an .enclose() function is an anti-pattern that should be avoided, when possible.
     * @return A new object composed of the Stamps and prototypes provided.
     */
    (state?: {}, ...encloseArgs: any[]): any

    /**
     * Just like calling stamp(), stamp.create() invokes the stamp and returns a new instance.
     * @param state Properties you wish to set on the new objects.
     * @param encloseArgs The remaining arguments are passed to all .enclose() functions.
     * WARNING Avoid using two different .enclose() functions that expect different arguments.
     * .enclose() functions that take arguments should not be considered safe to compose
     * with other .enclose() functions that also take arguments. Taking arguments with
     * an .enclose() function is an anti-pattern that should be avoided, when possible.
     * @return A new object composed of the Stamps and prototypes provided.
     */
    create(state?: {}, ...encloseArgs: any[]): any

    /**
     * Stamp metadata/composer function
     */
    compose: Descriptor

    /**
     * Add methods to the methods prototype.  Creates and returns new Stamp. Chainable.
     * @param methods Object(s) containing map of method names and bodies for delegation.
     * @return A new Stamp.
     */
    methods(...methods: Array<{}>): Stamp

    /**
     * Take n objects and add them to the state prototype. Creates and returns new Stamp. Chainable.
     * @param states Object(s) containing map of property names and values to clone for each new object.
     * @return A new Stamp.
     */
    refs(...states: Array<{}>): Stamp

    /**
     * Take a variable number of objects and shallow assign them to any future
     * created instance of the Stamp. Creates and returns new Stamp. Chainable.
     * @param objects Object(s) to shallow assign for each new object.
     * @return A new Stamp.
     */
    props(...objects: Array<{}>): Stamp

    /**
     * Take a variable number of objects and shallow assign them to any future
     * created instance of the Stamp. Creates and returns new Stamp. Chainable.
     * @param objects Object(s) to shallow assign for each new object.
     * @return A new Stamp.
     */
    properties(...objects: Array<{}>): Stamp

    /**
     * Take a variable number of objects and deeply merge them to any future
     * created instance of the Stamp. Creates and returns a new Stamp.
     * Chainable.
     * @param deepObjects The object(s) to deeply merge for each new object
     * @returns A new Stamp
     */
    deepProps(...deepObjects: Array<{}>): Stamp

    /**
     * Take a variable number of objects and deeply merge them to any future
     * created instance of the Stamp. Creates and returns a new Stamp.
     * Chainable.
     * @param deepObjects The object(s) to deeply merge for each new object
     * @returns A new Stamp
     */
    deepProperties(...deepObjects: Array<{}>): Stamp

    /**
     * @deprecated Use .init() instead.
     */
    enclose(...functions: Init[]): Stamp

    /**
     * @deprecated Use .init() instead.
     */
    enclose(...functions: Array<{}>): Stamp

    /**
     * Take in a variable number of functions and add them to the enclose
     * prototype as initializers.
     * @param functions Initializer functions used to create private data and
     * privileged methods
     * @returns A new stamp
     */
    init(...functions: Init[]): Stamp

    /**
     * Take in a variable number of functions and add them to the enclose
     * prototype as initializers.
     * @param functions Initializer functions used to create private data and
     * privileged methods
     * @returns A new stamp
     */
    init(functions: Init[]): Stamp

    /**
     * Take in a variable number of functions and add them to the enclose
     * prototype as initializers.
     * @param functions Initializer functions used to create private data and
     * privileged methods
     * @returns A new stamp
     */
    initializers(...functions: Init[]): Stamp

    /**
     * Take in a variable number of functions and add them to the enclose
     * prototype as initializers.
     * @param functions Initializer functions used to create private data and
     * privileged methods
     * @returns A new stamp
     */
    initializers(functions: Init[]): Stamp

    /**
     * Take n objects and add them to a new stamp and any future stamp it composes with.
     * Creates and returns new Stamp. Chainable.
     * @param statics Object(s) containing map of property names and values to mixin into each new stamp.
     * @return A new Stamp.
     */
    statics(...statics: Array<{}>): Stamp

    /**
     * Take n objects and add them to a new stamp and any future stamp it composes with.
     * Creates and returns new Stamp. Chainable.
     * @param statics Object(s) containing map of property names and values to mixin into each new stamp.
     * @return A new Stamp.
     */
    staticProperties(...statics: Array<{}>): Stamp

    /**
     * Deeply merge a variable number of objects and add them to a new stamp and
     * any future stamp it composes. Creates and returns a new Stamp. Chainable.
     * @param deepStatics The object(s) containing static properties to be
     * merged
     * @returns A new stamp
     */
    deepStatics(...deepStatics: Array<{}>): Stamp

    /**
     * Deeply merge a variable number of objects and add them to a new stamp and
     * any future stamp it composes. Creates and returns a new Stamp. Chainable.
     * @param deepStatics The object(s) containing static properties to be
     * merged
     * @returns A new stamp
     */
    staticDeepProperties(...deepStatics: Array<{}>): Stamp

    /**
     * Shallowly assign properties of Stamp arbitrary metadata and add them to
     * a new stamp and any future Stamp it composes. Creates and returns a new
     * Stamp. Chainable.
     * @param confs The object(s) containing metadata properties
     * @returns A new Stamp
     */
    conf(...confs: Array<{}>): Stamp

    /**
     * Shallowly assign properties of Stamp arbitrary metadata and add them to
     * a new stamp and any future Stamp it composes. Creates and returns a new
     * Stamp. Chainable.
     * @param confs The object(s) containing metadata properties
     * @returns A new Stamp
     */
    configuration(...confs: Array<{}>): Stamp

    /**
     * Deeply merge properties of Stamp arbitrary metadata and add them to a new
     * Stamp and any future Stamp it composes. Creates and returns a new Stamp.
     * Chainable.
     * @param deepConfs The object(s) containing metadata properties
     * @returns A new Stamp
     */
    deepConf(...deepConfs: Array<{}>): Stamp

    /**
     * Deeply merge properties of Stamp arbitrary metadata and add them to a new
     * Stamp and any future Stamp it composes. Creates and returns a new Stamp.
     * Chainable.
     * @param deepConfs The object(s) containing metadata properties
     * @returns A new Stamp
     */
    deepConfiguration(...deepConfs: Array<{}>): Stamp

    /**
     * Apply ES5 property descriptors to object instances created by the new
     * Stamp returned by the function and any future Stamp it composes. Creates
     * and returns a new stamp. Chainable.
     * @param descriptors
     * @returns A new Stamp
     */
    propertyDescriptors(...descriptors: Array<{}>): Stamp

    /**
     * Apply ES5 property descriptors to a Stamp and any future Stamp it
     * composes. Creates and returns a new stamp. Chainable.
     * @param descriptors
     * @returns A new Stamp
     */
    staticPropertyDescriptors(...descriptors: Array<{}>): Stamp
  }
}

/**********************************************************
 * WORKFLOW DECLARATIONS
 *********************************************************/

/**
 * @hidden
 */
declare module 'fast-plist'

/**
 * Alfred workflow logic
 */
declare namespace workflow {
  /**
   * An instance of a WritableFactory
   */
  export interface WritableInstance {
    /**
     * Write to stdout.
     *
     * @param {any[]} params
     */
    write: (...params: any[]) => void

    /**
     * Write to stdout.
     *
     * @param {Object} arg
     * @private
     */
    object: (arg: Object) => string
  }

  /**
   * A WritableFactory (pure function) constructor
   */
  export interface WritableFactory extends stampit.Stamp {
    /**
     * @constructor
     */
    (): WritableInstance
  }

  /**
   * A callback function with bound helper functions
   */
  interface ViewCallbacks {
    /**
     * Convert a string to upper case.
     *
     * @memberof ViewCallbacks
     * @param {string} text
     *
     * @returns The string in upper case.
     */
    upperCase: (text: string) => string

    /**
     * Convert a string to lower case.
     *
     * @memberof ViewCallbacks
     * @param {string} text
     *
     * @returns The string in lower case.
     */
    lowerCase: (text: string) => string

    /**
     * Convert a string to sentence case.
     *
     * @memberof ViewCallbacks
     * @param {string} text
     *
     * @returns The string in sentence case.
     */
    sentenceCase: (text: string) => string

    /**
     * When the first parameter is truthy return second parameter, when it is
     * falsy return the third parameter.
     *
     * @memberof ViewCallbacks
     * @param {*} condition
     * @param {string} truthy
     * @param {string} falsy
     *
     * @returns The second or third parameter.
     */
    when: (condition: any, truthy: string, falsy: string) => string

    /**
     * Returns a number of whitespace characters
     *
     * @memberof ViewCallbacks
     * @param {number} quantity
     *
     * @return A string consisting of a number of whitespace characters.
     */
    ws: (quantity: number) => string
  }

  /**
   * An instance of a ViewFactory
   */
  export interface ViewInstance extends ViewCallbacks {
    template: (
      fn: ({ upperCase, lowerCase, sentenceCase, ws, when }: ViewCallbacks) => string
    ) => string
  }

  /**
   * A ViewFactory (pure function) constructor
   */
  export interface ViewFactory extends stampit.Stamp {
    /**
     * @constructor
     */
    (): ViewInstance
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
     */
    uid?: string

    /**
     * The argument which is passed through the workflow to the connected output
     * action.
     */
    arg?: any

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
    text?: {
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
   * An instance of an ItemFactory
   */
  export interface ItemInstance extends Item, WritableInstance {}

  /**
   * A ItemFactory (pure function) constructor
   */
  export interface ItemFactory extends stampit.Stamp {
    /**
     * @constructor
     * @param {Item} item
     */
    (item: Item): ItemInstance
  }
  /**
   * An instance of an ListFactory
   */
  export interface ListInstance extends WritableInstance {
    /**
     * A collection of list items
     */
    items: Item[]
  }

  /**
   * A ListFactory (pure function) constructor
   */
  export interface ListFactory extends stampit.Stamp {
    /**
     * @constructor
     * @param {*} list
     */
    ({ items }: { items: Item[] | undefined }): ListInstance
  }

  /**
   * A PriorityFactory (pure function) constructor
   */
  export interface PriorityFactory extends stampit.Stamp {
    /**
     * @constructor
     * @param {number} title
     */
    (title: number): ItemInstance
  }

  /**
   * Alfred notification options
   */
  export interface NotificationOptions {
    /**
     * The notification title
     */
    title?: string

    /**
     * The notification subtitle
     */
    subtitle?: string

    /**
     * The notification message
     */
    message: string

    /**
     * Case Sensitive string for location of sound file; or use one of macOS'
     * native sounds (see below)
     */
    sound?: boolean

    /**
     * Absolute Path to Triggering Icon
     */
    icon?: string

    /**
     * Absolute Path to Attached Image (Content Image)
     */
    contentImage?: string

    /**
     * URL to open on Click
     */
    open?: string

    /**
     * Wait for User Action against Notification or times out. Same as timeout
     * = 5 seconds
     */
    wait?: boolean

    /**
     * Takes precedence over wait if both are defined.
     */
    timeout?: number

    /**
     * Label for cancel button
     */
    closeLabel?: string

    /**
     * Action label or list of labels in case of dropdown
     */
    actions?: string | string[]

    /**
     * Label to be used if multiple actions
     */
    dropdownLabel?: string

    /**
     * If notification should take input. Value passed as third argument in callback and event emitter.
     */
    reply?: boolean

    /**
     * An error object.
     */
    error?: project.AlfredError
  }

  /**
   * An instance of an NotificationFactory
   */
  export interface NotificationInstance extends NotificationOptions {
    write: (onClick?: any, onTimeout?: any) => void
  }

  /**
   * A NotificationFactory (pure function) constructor
   */
  export interface NotificationFactory extends stampit.Stamp {
    /**
     * @constructor
     * @param {project.AlfredError | NotificationOptions} output
     */
    (output: project.AlfredError | NotificationOptions): NotificationInstance
  }
}

declare namespace todoist {
  export type locale =
    | 'da'
    | 'de'
    | 'en'
    | 'es'
    | 'fr'
    | 'it'
    | 'ja'
    | 'ko'
    | 'nl'
    | 'pl'
    | 'pt'
    | 'ru'
    | 'sv'
    | 'zh'

  /**
   * An instance of a AdapterFactory
   */
  export interface AdapterInstance {
    /**
     * The resource type.
     */
    type: 'task' | 'project' | 'label'

    /**
     * The todoist api url
     */
    uri: string

    /**
     * The API token.
     */
    token: string

    /**
     * A pre-configured got object
     */
    got: any

    /**
     * Returns items of a type based on a query. Returns all items when qeurr
     * is falsy.
     *
     * @param {string} query
     * @param {string} [key='content']
     * @returns {Promise<any>}
     */
    query: (query: string, key: string) => Promise<any>

    /**
     * POST an item of a type to Todoist
     *
     * @param {*} data
     * @returns {Promise<any>}
     */
    create: (data: any) => Promise<any>

    /**
     * POST an item of a type to Todoist replacing a known value
     *
     * @param {number} id
     * @param {*} data
     * @returns {Promise<any>}
     */
    update: (id: number, data: any) => Promise<any>

    /**
     * API call to delete a single item.
     *
     * @param {number} id
     * @returns {Promise<any>}
     */
    remove: (id: number) => Promise<any>
  }

  /**
   * An AdapterFactory (pure function) constructor
   */
  export interface AdapterFactory extends stampit.Stamp {
    /**
     * @constructor
     */
    ({ type, uri, token }: { type: string; uri: string; token: string }): AdapterInstance
  }

  /**
   * An instance of a TaskAdapterFactory
   */
  export interface TaskAdapterInstance extends AdapterInstance {
    /**
     * Find a task by it's id.
     *
     * @param {number} id
     * @returns A task instance
     */
    find: (id: number) => Promise<Task>

    /**
     * Get all tasks
     *
     * @returns All tasks
     */
    findAll: () => Promise<Task[]>

    /**
     * Retrieve a tasks labels an projects by id.
     *
     * @param {TaskAdapterInstance} this
     * @param {Task} task
     * @returns {Promise<Task>}
     */
    getRelationships: (task: Task) => Promise<Task>
  }

  /**
   * A TaskAdapterFactory (pure function) constructor
   */
  export interface TaskAdapterFactory extends AdapterFactory {
    /**
     * @constructor
     */
    ({ type, uri, token }: { type: string; uri: string; token: string }): TaskAdapterInstance
  }

  /**
   * An instance of a ProjectAdapterFactory
   */
  export interface ProjectAdapterInstance extends AdapterInstance {
    /**
     * Find a project by it's id.
     *
     * @param {number} id
     * @returns A project instance
     */
    find: (id: number) => Promise<Project>

    /**
     * Get all projects
     *
     * @returns All projects
     */
    findAll: () => Promise<Project[]>
  }

  /**
   * A ProjectAdapterFactory (pure function) constructor
   */
  export interface ProjectAdapterFactory extends AdapterFactory {
    /**
     * @constructor
     */
    ({ type, uri, token }: { type: string; uri: string; token: string }): ProjectAdapterInstance
  }

  /**
   * An instance of a LabelAdapterFactory
   */
  export interface LabelAdapterInstance extends AdapterInstance {
    /**
     * Find a label by it's id.
     *
     * @param {number} id
     * @returns A label instance
     */
    find: (id: number) => Promise<Label>

    /**
     * Get all labels
     *
     * @returns All labels
     */
    findAll: () => Promise<Label[]>
  }

  /**
   * A LabelAdapterFactory (pure function) constructor
   */
  export interface LabelAdapterFactory extends AdapterFactory {
    /**
     * @constructor
     */
    ({ type, uri, token }: { type: string; uri: string; token: string }): LabelAdapterInstance
  }

  /**
   * An instance of a QueryFactory
   */
  export interface QueryInstance {
    query: string
    locale: locale
    parsed: any
    parse: () => Promise<void>
  }

  /**
   * A QueryFactory (pure function) constructor
   */
  export interface QueryFactory extends stampit.Stamp {
    /**
     * @constructor
     */
    ({ query, locale }: { query: string; locale: locale }): QueryInstance
  }

  /**
   * A todoist task as the todoist API expects it
   */
  export interface RequestTask {
    /**
     * Task content.
     */
    content: string

    /**
     * Task project id. If not set, task is put to user’s Inbox.
     */
    project_id?: number

    /**
     * Non-zero integer value used by clients to sort tasks inside project.
     */
    order?: number

    /**
     * Ids of labels associated with the task.
     */
    label_ids?: number[]

    /**
     * Task priority from 1 (normal) to 4 (urgent).
     */
    priority?: number

    /**
     * [Human defined]{@link https://todoist.com/Help/DatesTimes} task due date (ex.: “next Monday”, “Tomorrow”). Value is set using local (not UTC) time.
     */
    due_string?: string

    /**
     * Specific date in YYYY-MM-DD format relative to user’s timezone.
     */
    due_date?: string

    /**
     * Specific date and time in [RFC3339]{@link https://www.ietf.org/rfc/rfc3339.txt} format in UTC.
     */
    due_datetime?: string

    /**
     * 2-letter code specifying language in case due_string is not written in
     * English.
     */
    due_lang?: string
  }

  /**
   * A todoist task as received by the todoist API
   */
  export interface ResponseTask {
    comment_count?: number
    completed?: boolean
    content: string
    due?: {
      date?: string
      recurring?: boolean
      datetime?: string
      string?: string
      timezone?: string
    }
    id?: number
    order?: number
    indent?: number
    priority?: number
    project_id?: number
    url?: string
  }

  /**
   * A todoist task interface
   */
  export interface Task extends RequestTask, ResponseTask {
    [index: string]:
      | undefined
      | string
      | number
      | number[]
      | boolean
      | Label[]
      | Project
      | {
          date?: string
          recurring?: boolean
          datetime?: string
          string?: string
          timezone?: string
        }
    project?: ProjectInstance
    labels?: LabelInstance[]
  }

  /**
   * An instance of a TaskFactory
   */
  export interface TaskInstance extends Task {}

  /**
   * A TaskFactory (pure function) constructor
   */
  export interface TaskFactory extends stampit.Stamp {
    /**
     * @constructor
     */
    (task: Task): TaskInstance
  }

  /**
   * An instance of a TaskListFactory
   */
  export interface TaskListInstance extends workflow.ListInstance {}

  /**
   * A TaskListFactory (pure function) constructor
   */
  export interface TaskListFactory extends workflow.ListFactory {
    /**
     * @constructor
     */
    ({ tasks, action, locale }: { tasks: Task[]; action: string; locale: locale }): TaskListInstance
  }

  export interface Project {
    [index: string]: string | number
    name: string
    id: number
  }

  /**
   * An instance of a ProjectFactory
   */
  export interface ProjectInstance extends Project {}

  /**
   * A ProjectFactory (pure function) constructor
   */
  export interface ProjectFactory extends stampit.Stamp {
    /**
     * @constructor
     */
    (project: Project): ProjectInstance
  }

  /**
   * An instance of a ProjectListFactory
   */
  export interface ProjectListInstance extends workflow.ListInstance {}

  /**
   * A ProjectListFactory (pure function) constructor
   */
  export interface ProjectListFactory extends workflow.ListFactory {
    /**
     * @constructor
     */
    ({ projects, query }: { projects: Project[]; query: string }): ProjectListInstance
  }

  export interface ProjectList extends workflow.ListInstance {}

  export interface Label {
    [index: string]: string | number
    name: string
    id: number
  }
  /**
   * An instance of a LabelFactory
   */
  export interface LabelInstance extends Label {}

  /**
   * A LabelFactory (pure function) constructor
   */
  export interface LabelFactory extends stampit.Stamp {
    /**
     * @constructor
     */
    (label: Label): LabelInstance
  }

  /**
   * An instance of a LabelListFactory
   */
  export interface LabelListInstance extends workflow.ListInstance {}

  /**
   * A LabelListFactory (pure function) constructor
   */
  export interface LabelListFactory extends workflow.ListFactory {
    /**
     * @constructor
     */
    ({ labels, query }: { labels: Label[]; query: string }): LabelListInstance
  }

  export interface LabelList extends workflow.ListInstance {}

  /**
   * A lexed token.
   */
  export interface Token {
    [index: string]: string | (() => string)
    type: string
    value: string
    toString(): string
  }

  /**
   * Parse a string.
   *
   * @param {string} text
   * @returns The parsed blocks of the string
   */
  export interface Parsed {
    [index: string]:
      | undefined
      | string
      | Token
      | Token[]
      | (() => Token | string)
      | (() => ParsedToJSON)
    content: string
    priority: string
    project?: Token
    labels: Token[]
    person?: Token
    due_string?: string
    last(key?: 'type' | 'value'): Token | string
    toJSON(): ParsedToJSON
  }

  /**
   * The contents of a parsed task
   */
  export interface ParsedToJSON {
    content: string
    priority: number
    due_string: string | undefined
    project: string | undefined
    project_id: number | undefined
    labels: string[] | undefined
    label_ids: number[] | undefined
  }
}

declare namespace project {
  /**
   * A file path reference to settings.json. This is used to store workflow
   * settings.
   */
  export const SETTINGS_PATH: string

  /**
   * A file path reference to the cache.json. This is used to store todoist APi
   * call responses.
   */
  export const CACHE_PATH: string

  /**
   * The imported project settings and todoist cache
   */
  export interface FILES {
    settings: Settings
    cache: any
  }

  /**
   * An extension of the base Error that incorperates workflow
   * environment variables.
   */
  export class AlfredError extends Error {
    QUERY?: string
    OSX_VERSION?: string
    NODE_VERSION?: string
    ALFRED_VERSION?: string
    WORKFLOW_VERSION?: string
    constructor(message: string, name?: string, stack?: any)
  }

  /**
   * A factory function that creates a command instance
   */
  export interface CommandFactory extends stampit.Stamp {
    /**
     * @constructor
     */
    (): CommandInstance
  }

  /**
   * A command instance. This is the starting point for all calls eminating
   * from the workflow.
   */
  export interface CommandInstance {
    /**
     * Get a list of tasks from Todoist
     *
     * @param {string} query
     * @returns {Promise<void>}
     */
    read(query?: string): Promise<void>

    /**
     * Parse a todoist task and extra information from Alfred input
     *
     * @param {string} query
     * @returns {Promise<void>}
     */
    create(query: string): Promise<void>

    /**
     * Submit a 'created' task back to Todoist
     *
     * @param {todoist.Task} task
     * @returns {Promise<void>}
     */
    submit(task: todoist.Task): Promise<void>

    /**
     * Remove a task from to todoist by id
     *
     * @param {todoist.Task} task
     * @returns {Promise<void>}
     */
    remove(task: todoist.Task): Promise<void>

    /**
     * Display a list of possible settings
     */
    listSettings(): void

    /**
     * Checks if a settings is valid when changing one
     *
     * @param {string} key
     * @param {string | number | boolean} value
     */
    verifySetting(key: string, value: string | number | boolean): void

    /**
     * Saves a project setting back to disk
     *
     * @param {*} setting
     * @returns {Promise<void>}
     */
    saveSetting(setting: { key: string; value: string | number | boolean }): Promise<void>
  }

  /**
   * A settings object.
   */
  export interface Settings {
    [index: string]: string | number | boolean
    token: string
    language: string
    max_items: number
    uuid: string
    cache_timeout: number
    anonymous_statistics: boolean
  }
}
