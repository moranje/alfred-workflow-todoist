import { AlfredError } from '@/project';
import { Item, List } from '@/workflow';
import formatDistance from 'date-fns/formatDistance';
import parseISO from 'date-fns/parseISO';
import {
  da,
  de,
  enUS,
  es,
  fr,
  it,
  ja,
  ko,
  nl,
  pl,
  pt,
  ru,
  sv,
  zhCN,
} from 'date-fns/locale';
import { Project, Label } from '@/todoist';
import { Interface } from 'readline';

/** @hidden */
const LOCALES: { [key: string]: Locale } = {
  da,
  de,
  en: enUS,
  es,
  fr,
  it,
  ja,
  ko,
  nl,
  pl,
  pt,
  ru,
  sv,
  zh: zhCN,
};

export interface TaskRequest {
  /**
   * Task’s project id (read-only).
   */
  project_id?: number;

  /**
   * ID of section task belongs to.
   */
  section_id?: number;

  /**
   * Task content.
   */
  content: string;
  /**
   * Array of label ids, associated with a task.
   */
  label_ids?: number[];

  /**
   * ID of parent task (read-only, absent for top-level tasks).
   */
  parent?: number;

  /**
   * Position under the same parent or project for top-level tasks (read-only).
   */
  order?: number;

  /**
   * Task priority from 1 (normal, default value) to 4 (urgent).
   */
  priority?: number;

  /**
   * Human defined task due date(ex.: “next Monday”, “Tomorrow”).Value is set using local(not UTC) time.
   */
  due_string?: string;

  /**
   * Specific date in YYYY - MM - DD format relative to user’s timezone.
   */
  due_date?: string;

  /**
   * Specific date and time in RFC3339 format in UTC.
   */
  due_datetime?: string;

  /**
   * 2-letter code specifying language in case due_string is not written in English.
   */
  due_lang?: string;
}

export interface Task {
  comment_count?: number;
  completed?: boolean;
  content: string;
  due?: {
    date?: string;
    datetime?: string;
    string?: string;
    timezone?: string;
  };
  id?: number;
  label_ids?: number[];
  order?: number;
  priority?: number;
  project_id?: number;
  section_id?: number;
  url?: string;
}

export class TaskRequest {
  constructor(options: TaskRequest = { content: '' }) {
    if (!options.content || options.content === '') {
      throw new AlfredError(
        `A task must have a content (${options.content}) property`
      );
    }

    Object.assign(this, options);
  }
}

export class Task {
  constructor(options: Task = { content: '' }) {
    if (!options.content || options.content === '') {
      throw new AlfredError(
        `A task must have a content (${options.content}) property`
      );
    }

    Object.assign(this, options);
  }
}

export class TaskList extends List {
  constructor(
    tasks: Task[] | TaskRequest[] = [],
    action = 'COMPLETE',
    locale = 'en'
  ) {
    super(
      tasks.map((task: Task | TaskRequest) => {
        const { content, project, labels = [], priority, due } = task as Task;
        const { due_string } = task as TaskRequest;
        const view = View();
        const name = project?.name ?? '';
        let date: string;

        if (due?.date) {
          date = due.date;
        }

        if (due?.datetime) {
          date = due.datetime;
        }

        return new Item({
          arg: task.toString(),
          title: `${action}: ${content}`,
          subtitle: view.template(({ upperCase, ws, when }) => {
            // Project name
            let subtitle = `${when(name, upperCase(name), 'INBOX')}`;

            // Label
            subtitle += `${when(
              labels.length > 0,
              `${ws(10)}\uFF20 ${labels.map(label => label.name)}`,
              ''
            )}`;

            // Priority
            subtitle += `${when(
              priority && priority > 1,
              `${ws(10)}\u203C ${priority && 5 - priority}`,
              ''
            )}`;

            // Due date (in local language)
            if (date) {
              subtitle += `${when(
                date,
                `${ws(10)}\u29D6 ${formatDistance(parseISO(date), new Date(), {
                  addSuffix: true,
                  locale: LOCALES[locale],
                })}`,
                ''
              )}`;
            }

            // Alternative due date
            subtitle += `${when(
              due_string,
              `${ws(10)}\u29D6 ${due_string}`,
              ''
            )}`;

            return subtitle;
          }),
        });
      })
    );
  }
}
