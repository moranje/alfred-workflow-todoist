import nearley from 'nearley';
import { AlfredError, Errors } from '../error';
import {
  IdToken,
  ParsedTodoistTaskOptions,
  TodoistToken,
  ValueToken,
} from '@types';

import grammar from '@/lib/todoist/grammar';

function parserAdapter([results]: TodoistToken[][]): ParsedTodoistTaskOptions {
  return results.reduce<ParsedTodoistTaskOptions>(
    (accumulator, current) => {
      Object.assign(accumulator, { currentToken: current.type });

      if (current.type === 'project') {
        return Object.assign({}, accumulator, { project: current });
      } else if (current.type === 'label') {
        return Object.assign({}, accumulator, {
          labels: [...(accumulator.labels as IdToken[]), current],
        });
      } else if (current.type === 'priority') {
        if (!current.priority) return Object.assign({}, accumulator);

        return Object.assign({}, accumulator, {
          priority: Number(5 - current.priority),
        });
      } else if (current.type === 'section') {
        return Object.assign({}, accumulator, { section: current });
      } else if (current.type === 'filter') {
        return Object.assign({}, accumulator, { filter: current.value });
      } else if (current.type === 'date') {
        return Object.assign({}, accumulator, { date: current.value });
      }

      // Content
      if (accumulator.content.length === 0) {
        return Object.assign({}, accumulator, {
          content: accumulator.content + (current as ValueToken).value.trim(),
        });
      }

      return Object.assign({}, accumulator, {
        content: `${
          accumulator.content
        } ${(current as ValueToken).value.trim()}`.trim(),
      });
    },
    {
      currentToken: '',
      content: '',
      labels: [] as IdToken[],
    } as ParsedTodoistTaskOptions
  );
}

/**
 * Parse a task string.
 *
 * @param text Any text.
 * @example
 * ```
 * Get milk #Home !!3, tomorrow
 * ```
 * @returns An object with the parsing result.
 */
export function parser(text: string): ParsedTodoistTaskOptions | void {
  try {
    // @ts-ignore: problem with nearley types
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

    parser.feed(text);

    return parserAdapter(parser.results);
  } catch (error) {
    const syntaxError = /.*?at line 1 col (\d+).*?/;
    const title = "I don't understand what you mean...";
    let subtitle =
      "'Read the docs on github if you are unsure why this is happening'";
    if (error.message.match(syntaxError)) {
      const [, match] = error.message.match(syntaxError);

      subtitle = `The character "${text.slice(
        +match - 1,
        +match
      )}" is a probably a mistake: "${text.slice(0, +match)}" <-`;
    }

    throw new AlfredError(Errors.ParserError, subtitle, {
      title,
      error,
      isSafe: true,
    });
  }
}
