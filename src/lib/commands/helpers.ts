import FuzzySearch from 'fuzzy-search';
import { TodoistTaskOptions } from 'todoist-rest-api';

import { ResourceName } from '../todoist/local-rest-adapter';
import { getApi, requestError } from '../todoist';
import { AlfredError, Errors } from '../error';
import { createCall } from '@/lib/cli-arguments';
import settingsStore from '@/lib/stores/settings-store';
import { Item, List } from '@/lib/workflow';

import { ParsedTodoistTaskOptions } from '@types';

/**
 * Creates a cache refresh list item.
 *
 * @param type The resource type.
 * @returns An `Item` object.
 */
export function listRefreshItem(type: ResourceName): Item {
  return new Item({
    title: `REFRESH CACHE`,
    subtitle: `Hit ENTER ↵ to refresh ${type} cache`,
    valid: true,
    arg: createCall({ name: 'refreshCache', args: type }),
  });
}

/**
 * Create a list of project items.
 *
 * @param query A task query string.
 * @returns An `List` object.
 */
export async function listProjects(query: string): Promise<void> {
  const projects = await getApi()
    .v1.project.query(['name'], query.replace(/^.*#/, ''))
    .catch(error => {
      throw requestError(error);
    });

  const list = projects.map(project => {
    return new Item({
      title: project.name,
      subtitle: `Add project ${project.name} to task`,
      autocomplete: `${query.replace(/(^.*#).*/, '$1')}${project.name}<${
        project.id
      }> `,
      valid: false,
    });
  });
  list.push(listRefreshItem('project'));

  return new List(list).write();
}

/**
 * Create a list of label items.
 *
 * @param query A task query string.
 * @returns An `List` object.
 */
export async function listLabels(query: string): Promise<void> {
  const labels = await getApi()
    .v1.label.query(['name'], query.replace(/^.*@/, ''))
    .catch(error => {
      throw requestError(error);
    });

  const list = labels.map(label => {
    return new Item({
      title: label.name,
      subtitle: `Add label ${label.name} to task`,
      autocomplete: `${query.replace(/(^.*@).*/, '$1')}${label.name}<${
        label.id
      }> `,
      valid: false,
    });
  });
  list.push(listRefreshItem('label'));

  return new List(list).write();
}

/**
 * Create a list of project section items.
 *
 * @param query A task query string.
 * @param parsed A `ParsedTodoistTaskOptions` object.
 * @returns An `List` object.
 */
export async function listSections(
  query: string,
  parsed: ParsedTodoistTaskOptions
): Promise<void> {
  if (parsed.project == null || parsed.project.id == null) {
    throw new AlfredError(
      Errors.InvalidArgument,
      'Add a project before you add a section',
      { isSafe: true, title: 'Sections belong to a project' }
    );
  }

  const sections = await getApi()
    .v1.section.findAll()
    .catch(error => {
      throw requestError(error);
    });

  const searcher = new FuzzySearch(
    sections.filter(section => section.project_id === parsed.project?.id),
    ['name'],
    {
      sort: true,
    }
  );
  const projectSections = searcher.search(query.replace(/^.*::/, ''));

  const list = projectSections.map(section => {
    return new Item({
      title: section.name,
      subtitle: `Add section ${section.name} to task`,
      autocomplete: `${query.replace(/(^.*::).*/, '$1')}${section.name}<${
        section.id
      }> `,
      valid: false,
    });
  });
  list.push(listRefreshItem('section'));

  return new List(list).write();
}

/**
 * Create a list of priority items.
 *
 * @param query A task query string.
 * @returns An `List` object.
 */
export async function listPriorities(query: string): Promise<void> {
  const priorityNames = ['urgent', 'high', 'medium', 'low'];

  const list = priorityNames.map((name, index) => {
    return new Item({
      title: `${index + 1}`,
      subtitle: `Set priority to ${name}`,
      autocomplete: `${query
        .replace(/(^.*!!)[1-4]$/, '$1')
        .replace(/(^.*?p)[1-4]$/, '$1')}${index + 1} `,
      valid: false,
    });
  });

  return new List(list).write();
}

/**
 * Adapt ParsedTodoistTaskOptions to TodoistTaskOptions.
 *
 * @param parsed A `ParsedTodoistTaskOptions` object.
 * @returns A `TodoistTaskOptions` object.
 */
export function toTaskOptions(
  parsed: ParsedTodoistTaskOptions
): TodoistTaskOptions {
  return {
    content: parsed.content,
    project_id: parsed.project?.id ?? undefined,
    // @ts-ignore: label.id will always be a number when mapping
    label_ids: parsed.labels
      ?.filter(label => label.id !== null)
      .map(label => label.id),
    priority: parsed.priority,
    section_id: parsed.section?.id ?? undefined,
    due_string: parsed.date,
    due_lang: settingsStore().get('language'),
  };
}
