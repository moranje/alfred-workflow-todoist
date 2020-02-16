import { TodoistTask } from 'todoist-rest-api';

import { createCall } from '@/lib/cli-args';
import {
  listLabels,
  listPriorities,
  listProjects,
  listRefreshItem,
  listSections,
} from '@/lib/commands/helpers';
import { AlfredError, Errors } from '@/lib/error';
import settingsStore from '@/lib/stores/settings-store';
import { parser } from '@/lib/todoist/parser';
import { Item, List, workflowList } from '@/lib/workflow';
import readTasksView from '@/lib/workflow/views/read-tasks';

import { getApi, requestError } from '../todoist';
import { ENV } from '../utils';

function assertNoComma(query: string): void | never {
  const index = query.indexOf(',');
  if (index !== -1) {
    const subtitle = `The character "," is a probably a mistake: "${query.slice(
      0,
      index + 1
    )}" <-`;
    throw new AlfredError(Errors.ParserError, subtitle, {
      title: "I don't understand what you mean...",
      isSafe: true,
    });
  }
}

async function getProjectById(id: number): Promise<string> {
  const [project] = (
    await getApi()
      .v1.project.findAll()
      .catch(error => {
        /* istanbul ignore next */
        throw requestError(error);
      })
  ).filter(project => project.id === id) ?? [{}];

  return project.name;
}

async function getLabelsByIds(ids: number[]): Promise<string> {
  const labels = (
    await getApi()
      .v1.label.findAll()
      .catch(error => {
        /* istanbul ignore next */
        throw requestError(error);
      })
  ).filter(label => ids.indexOf(label.id) !== -1);

  return labels.map(label => label.name).join(',');
}

async function getSectionById(id: number): Promise<string> {
  const [section] = (
    await getApi()
      .v1.section.findAll()
      .catch(error => {
        /* istanbul ignore next */
        throw requestError(error);
      })
  ).filter(section => section.id === id) ?? [{}];

  return section.name;
}

async function subtitleDisplayList(task: TodoistTask): Promise<string[]> {
  const options = [];

  if (task.section_id) {
    options.push(`\u00A7 ${await getSectionById(task.section_id)}`);
  }
  if (task.label_ids && task.label_ids.length > 0) {
    options.push(`\uFF20 ${await getLabelsByIds(task.label_ids)}`);
  }
  if (task.priority && task.priority > 1) {
    options.push(`\u203C ${5 - task.priority}`);
  }
  if (task.due?.date) options.push(`\u29D6 ${task.due?.date}`);

  return options;
}

interface CollectionResult<T> {
  readonly result: T[];
  filterOrNone(
    key: keyof T | null | undefined,
    match: number | null | undefined
  ): CollectionResult<T>;
  filterAnyOrNone(
    keys: T[keyof T] | null | undefined,
    matches: (number | null | undefined)[]
  ): CollectionResult<T>;
}

function collection<T extends TodoistTask>(
  collection: T[]
): CollectionResult<T> {
  return {
    get result(): T[] {
      return collection;
    },

    filterOrNone(
      key: keyof T | null | undefined,
      match: number | null | undefined
    ): CollectionResult<T> {
      if (key === 'priority' && match) {
        collection.find((element: T) => element[key.toString()] === match);
      }

      if (
        key != null &&
        match != null &&
        collection.find((element: T) => element[key.toString()] === match)
      ) {
        collection = collection.filter(
          (element: T) => element[key.toString()] === match
        );
      }

      return this;
    },

    filterAnyOrNone(
      keys: T[keyof T] | null | undefined,
      matches: (number | null | undefined)[]
    ): CollectionResult<T> {
      if (
        keys != null &&
        matches != null &&
        collection.find((element: T) =>
          element.label_ids?.find(id => matches.indexOf(id) !== -1)
        )
      ) {
        collection = collection.filter((element: T) =>
          element.label_ids?.find(id => matches.indexOf(id) !== -1)
        );
      }

      return this;
    },
  };
}

function filter(
  tasks: TodoistTask[],
  {
    projectId,
    labelIds = [],
    priority,
    sectionId,
  }: {
    projectId?: number | null;
    labelIds: (number | null)[];
    priority?: number;
    sectionId?: number | null;
  }
): TodoistTask[] {
  return collection(tasks)
    .filterOrNone('project_id', projectId)
    .filterAnyOrNone('labels_ids', labelIds)
    .filterOrNone('priority', priority)
    .filterOrNone('section_id', sectionId).result;
}

async function mapTasks(tasks: TodoistTask[]): Promise<Item[]> {
  return Promise.all(
    tasks.map(async task => {
      return new Item(
        Object.assign(
          {
            arg: createCall({ name: 'remove', args: task }),
          },
          readTasksView({
            title: [task.content],
            heading: await getProjectById(task.project_id),
            subtitle: await subtitleDisplayList(task),
          })
        ) as Item
      );
    })
  );
}

/**
 * Find and list todoist tasks.
 *
 * @param query A task query string.
 */
export async function read(query: string): Promise<void> {
  assertNoComma(query);
  const parsed = parser(query);

  if (parsed == null) return workflowList.write();
  if (parsed.currentToken === 'project') return listProjects(query);
  if (parsed.currentToken === 'label') return listLabels(query);
  if (parsed.currentToken === 'priority') return listPriorities(query);
  if (parsed.currentToken === 'section') return listSections(query, parsed);

  const tasks = await getApi()
    .v1.task.query(['content'], parsed.content)
    .catch(error => {
      throw requestError(error);
    });
  const filteredTasks = filter(tasks, {
    projectId: parsed.project?.id,
    labelIds: (parsed.labels || []).map(label => label.id),
    priority: parsed.priority,
    sectionId: parsed.section?.id,
  });
  const list = await mapTasks(
    filteredTasks.slice(0, settingsStore().get('max_items'))
  );
  list.push(listRefreshItem('task'));

  return new List(list).addList(workflowList).write();
}
