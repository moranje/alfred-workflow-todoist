export interface ViewOptions {
  /**
   * The action. This will become a capitalized string at the start of a an
   * `Item` title.
   *
   * @example
   * ```js
   * view({ action: 'save', ... })
   * ```
   * List item in Alfred:
   * ```
   *          --------------------------------------
   * title    | SAVE:
   *          --------------------------------------
   * ```
   */
  action?: string;
  /**
   * An array of strings to be inserted into the title, seperated by the spacer.
   *
   * @example
   * ```js
   * view({ title: ['Rocky', 'Zuma', 'Rubble'], spacer: ' ,', ... })
   * ```
   * List item in Alfred:
   * ```
   *          --------------------------------------
   * title    | Rocky, Zuma, Rubble
   *          --------------------------------------
   * ```
   */
  title: string[];
  /**
   * The heading. This will become a capitalized string at the start of a an
   * `Item` subtitle.
   *
   * @example
   * ```js
   * view({
   *   action: 'On a roll!',
   *   title: ['Rocky', 'Zuma', 'Rubble'],
   *   heading: 'Mission',
   *   spacer: ' ,',
   *   ...
   * })
   * ```
   * List item in Alfred:
   * ```
   *          --------------------------------------
   * title    | ON A ROLL!: Rocky, Zuma, Rubble
   *          --------------------------------------
   * subtitle | MISSION
   *          --------------------------------------
   * ```
   */
  heading?: string;
  /**
   * An array of subtitle strings that will be concatenated into the subtitle
   * property of the `Item` instance.
   *
   * @example
   * ```js
   * view({
   *   action: 'On a roll!',
   *   title: ['Rocky', 'Zuma', 'Rubble'],
   *   heading: 'Mission',
   *   subtitle: ['save Goodway', 'save Cap Turbot'],
   *   spacer: ' ,',
   *   ...
   * })
   * ```
   * List item in Alfred:
   * ```
   *          ---------------------------------------
   * title    | ON A ROLL!: Rocky, Zuma, Rubble
   *          ---------------------------------------
   * subtitle | MISSION save Goodway, save Cap Turbot
   *          ---------------------------------------
   * ```
   */
  subtitle?: string[];
  /**
   * The spacer to use to concatenate title and subtile lists. Defaults to `tab`
   * (`⇥`).
   */
  spacer?: string;
}

export interface ItemView {
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
}

export type StringElement = string;

export type ListElement = string[];

/**
 * This is my take on a view in Alfred.
 *
 * @param options The view options.
 * @returns An `Item`-like object that can be merged into an `Item` instance.
 */
export function view({
  action,
  heading,
  title = [],
  subtitle = [],
  spacer = '\t',
}: ViewOptions): ItemView {
  return {
    title: `${action?.toLocaleUpperCase()}: ${title.join(spacer)}`,
    subtitle: [heading?.toLocaleUpperCase(), ...subtitle].join(spacer),
  };
}
