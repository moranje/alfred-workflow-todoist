import { AlfredError } from '@/project';
import { Item, List, View } from '@/workflow';
import formatDistance from 'date-fns/formatDistance';
import { de, enUS, es, fr, it, nl, ptBR, ru, sv, zhCN } from 'date-fns/locale';
import compose from 'stampit';

// import da from 'date-fns/locale/da'
// import ko from 'date-fns/locale/ko'
// import pl from 'date-fns/locale/pl'
// import ja from 'date-fns/locale/ja';

/** @hidden */
const LOCALES = {
  da: enUS,
  de,
  en: enUS,
  es,
  fr,
  it,
  ja: enUS,
  ko: enUS,
  nl,
  pl: enUS,
  pt: ptBR,
  ru,
  sv,
  zh: zhCN
}

/** @hidden */
export const Task: todoist.TaskFactory = compose({
  init(this: todoist.ResponseTask, task: todoist.ResponseTask = { content: '' }) {
    if (!task.content || task.content === '') {
      throw new AlfredError(`A task must have a content (${task.content}) property`)
    }

    Object.assign(this, task)
  }
})

/** @hidden */
export const TaskList: todoist.TaskListFactory = compose(
  List,
  {
    init(
      this: todoist.TaskListInstance,
      {
        tasks = [],
        action = 'COMPLETE',
        locale = 'en'
      }: { tasks: todoist.Task[]; action: string; locale: todoist.locale }
    ) {
      tasks.forEach((task: todoist.Task) => {
        const { content, project, labels = [], priority, due, due_string } = task
        let view = View()
        let name = (project && project.name) || ''
        let date: Date

        if (due && due.date) {
          date = new Date(due.date)
        }

        if (due && due.datetime) {
          date = new Date(due.datetime)
        }

        let item = Item({
          arg: task,
          title: `${action}: ${content}`,
          subtitle: view.template(
            ({ upperCase, ws, when }) =>
              `${when(name, upperCase(name), 'INBOX')}${when(
                labels.length > 0,
                `${ws(10)}\uFF20 ${labels.map(label => label.name)}`,
                ''
              )}${when(
                priority && priority > 1,
                `${ws(10)}\u203C ${priority && 5 - priority}`,
                ''
              )}${when(
                date,
                `${ws(10)}\u29D6 ${formatDistance(date, new Date(), {
                  addSuffix: true,
                  locale: LOCALES[locale]
                })}`,
                ''
              )}${when(due_string, `${ws(10)}\u29D6 ${due_string}`, '')}`
          )
        })

        this.items.push(item)
      })
    }
  }
)
