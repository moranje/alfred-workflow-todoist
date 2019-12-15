import { getSetting } from '@/project';
import {
  LabelAdapter,
  LabelList,
  parser,
  ProjectAdapter,
  ProjectList,
  Task,
  TaskList,
  Label,
} from '@/todoist';
import { Item, List } from '@/workflow';
import { Parsed } from './parser';

type locale =
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
  | 'zh';

/** @hidden */
function createTask(parsed: Task, locale: string): void {
  const task = new Task(parsed);
  const taskList = new TaskList([task], 'CREATE', locale);

  return taskList.write();
}

/** @hidden */
async function showProjects(query: string): Promise<void> {
  const project = query.replace(/^.*#/, '').replace(/\[|\]/g, '');
  const projects = await new ProjectAdapter(
    getSetting('token') as string
  ).query(project, 'name');

  return new ProjectList(projects, query).write();
}

/** @hidden */
async function showLabels(query: string): Promise<void> {
  const label = query.replace(/^.*@/, '');
  const labels: Label[] = await new LabelAdapter(
    getSetting('token') as string
  ).query(label, 'name');

  return new LabelList(labels, query).write();
}

/** @hidden */
function showPriorities(query: string): void {
  const priority = query.replace(/^.*?!!/, '').replace(/^.*?p/, '');
  const priorityNames: { [index: string]: string } = {
    1: 'urgent',
    2: 'high',
    3: 'medium',
    4: 'low',
  };

  class Priority extends Item {
    constructor(title: number) {
      super({
        title: `${title}`,
        subtitle: `Set priority to ${priorityNames[`${title}`]}`,
        autocomplete: `${query
          .replace(/(^.*!!)[1-4]$/, '$1')
          .replace(/(^.*?p)[1-4]$/, '$1')}${title} `,
        valid: false,
      });
    }
  }

  if (Number(priority) >= 1 && Number(priority) <= 4) {
    return new List([new Priority(Number(priority))]).write();
  }

  return new List([
    new Priority(1),
    new Priority(2),
    new Priority(3),
    new Priority(4),
  ]).write();
}

export interface Query {
  query: string;
  locale: locale;
  parsed: Parsed;
}

export class Query {
  constructor(query: string, locale: locale) {
    this.query = query;
    this.locale = locale || 'en';
    this.parsed = parser(query);
  }

  parse(): Promise<void> {
    if (this.parsed && this.parsed.last('type') === 'project') {
      return showProjects(this.query);
    }

    if (this.parsed && this.parsed.last('type') === 'label') {
      return showLabels(this.query);
    }

    if (this.parsed && this.parsed.last('type') === 'priority') {
      return Promise.resolve(showPriorities(this.query));
    }

    return Promise.resolve(createTask(this.parsed, this.locale));
  }
}
