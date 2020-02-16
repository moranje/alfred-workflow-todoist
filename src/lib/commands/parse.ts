import settingsStore from '../stores/settings-store';
import { AlfredError, Errors } from '../error';
import { ParsedTodoistTaskOptions } from '@types';

import { createCall } from '@/lib/cli-args';
import {
  listLabels,
  listPriorities,
  listProjects,
  listSections,
  toTaskOptions,
} from '@/lib/commands/helpers';
import { parser } from '@/lib/todoist/parser';
import { Item } from '@/lib/workflow';
import { List, workflowList } from '@/lib/workflow/list';
import createView from '@/lib/workflow/views/create-task';

function assertNoQoutes(query: string): void | never {
  const wrapper = settingsStore().get('filter_wrapper');
  const quote = wrapper === '"' ? "'" : '"';
  const index = query.indexOf(wrapper);
  if (index !== -1) {
    const subtitle = `The character ${quote}${wrapper}${quote} is a probably a mistake: ${quote}${query.slice(
      0,
      index + 1
    )}${quote} <-`;
    throw new AlfredError(Errors.ParserError, subtitle, {
      title: "I don't understand what you mean...",
      isSafe: true,
    });
  }
}

function subtitleDisplayList(parsed: ParsedTodoistTaskOptions): string[] {
  const options = [];

  if (parsed.section) options.push(`\u00A7 ${parsed.section?.name}`);
  if (parsed.labels && parsed.labels.length > 0) {
    options.push(`\uFF20 ${parsed.labels.map(label => label.name)}`);
  }
  if (parsed.priority) options.push(`\u203C ${5 - parsed.priority}`);
  if (parsed.date) options.push(`\u29D6 ${parsed.date}`);

  return options;
}

/**
 * Parse task string and return a `List` `Item` with the result.
 *
 * @param query A task query string.
 */
export async function parse(query: string): Promise<void> {
  assertNoQoutes(query);
  const parsed = parser(query);

  // Parsing error
  if (parsed == null) return workflowList.write();
  if (parsed.currentToken === 'project') return listProjects(query);
  if (parsed.currentToken === 'label') return listLabels(query);
  if (parsed.currentToken === 'priority') return listPriorities(query);
  if (parsed.currentToken === 'section') return listSections(query, parsed);

  return new List([
    new Item(
      Object.assign(
        {
          arg: createCall({ name: 'create', args: toTaskOptions(parsed) }),
        },
        createView({
          title: [parsed.content],
          heading: parsed.project?.name,
          subtitle: subtitleDisplayList(parsed),
        })
      ) as Item
    ),
  ])
    .addList(workflowList)
    .write();
}
