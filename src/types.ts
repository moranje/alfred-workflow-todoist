/**
 * Todoist parser.
 */
export interface ParsedTodoistTaskOptions {
  currentToken: string;
  content: string;
  labels?: IdToken[];
  project?: IdToken;
  priority?: number;
  section?: IdToken;
  date?: string;
  filter?: string;
}

export type IdToken = {
  name: string;
  type: 'project' | 'label' | 'section';
  id: number | null;
};

export type PriorityToken = {
  priority?: number;
  type: 'priority';
};

export type ValueToken = {
  value: string;
  type: 'date' | 'filter' | 'content';
};

export type TodoistToken = IdToken | PriorityToken | ValueToken;

export type AlfredProperty =
  | 'uid'
  | 'title'
  | 'subtitle'
  | 'arg'
  | 'type'
  | 'valid'
  | 'autocomplete'
  | 'match'
  | 'quicklookurl';

/**
 * Jest matchers.
 */

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
  namespace jest {
    interface Matchers<R> {
      /**
       * Check if input is a valid alfred list.
       */
      toBeValidAlfredList(): R;
      /**
       * Check if input is a list of `n` items.
       *
       * @param length The expected length.
       */
      toBeAlfredListOfLength(length: number): R;
      /**
       * Check if list has items with properties machtijng the list of matches.
       *
       * @param property An `Item` property.
       * @param matches A list of matches. Each item property is matched
       * against the match with the same index.
       */
      toContainAllAlfredItemsWith(
        property: AlfredProperty,
        matches: string[]
      ): R;
    }
  }
}
