import * as grammar from '@/todoist/grammar';
import nearley from 'nearley';
import { Task, TaskRequest } from '.';

interface Token {
  [index: string]: string | (() => string);
  type: string;
  value: string;
  toString(): string;
}

export interface Parsed {
  [index: string]:
    | undefined
    | string
    | Token
    | Token[]
    | (() => Token | string)
    | (() => TaskRequest);
  content: string;
  priority: string;
  project?: Token;
  labels: Token[];
  person?: Token;
  due_string?: string;
  last(key?: 'type' | 'value'): Token | string;
  toJSON(): TaskRequest;
}

/** @hidden */
function organize([results]: Token[][]): TaskRequest {
  // Defaults
  const tokens: Parsed = {
    content: '<Give a name to this task>',
    labels: [],
    priority: '1',
    last(key?: 'type' | 'value') {
      if (
        key &&
        results[results.length - 1] &&
        results[results.length - 1][key]
      ) {
        return results[results.length - 1][key];
      }

      return results[results.length - 1] || [];
    },
    toJSON() {
      return {
        content: this.content,
        priority: Number(this.priority ?? 1),
        due_string: this.due_string ?? void 0,
        project: this.project ? `${this.project}` : void 0,
        project_id: this.project_id,
        labels:
          this.labels && this.labels.length > 0
            ? this.labels.map(label => `${label}`)
            : void 0,
        label_ids:
          this.label_ids && this.label_ids.length > 0 ? this.label_ids : void 0,
      };
    },
  };

  results.forEach(token => {
    if (token.type === 'content') {
      if (token.value.trim() !== '') {
        tokens.content += token.value.trim();
        tokens.content = tokens.content.replace(
          '<Give a name to this task>',
          ''
        );
      }
    } else if (token.type === 'label') {
      tokens.labels.push(token);
    } else if (token.type === 'priority') {
      tokens.priority = String(5 - Number(token.value));
    } else if (token.type === 'date') {
      tokens.due_string = token.value;
    } else {
      tokens[token.type] = token;
    }
  });

  return tokens;
}

/**
 * Parse a string.
 *
 * @param {string} text
 * @returns The parsed blocks of the string
 */
export function parser(text: string): Parsed {
  const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

  parser.feed(text);

  return organize(parser.results);
}
