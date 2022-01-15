import { AlfredError } from '@/project'
import { Item, List, View } from '@/workflow'
import formatDistance from 'date-fns/formatDistance'
import parseISO from 'date-fns/parseISO'
import { de, enUS, es, fr, it, ja, nl, ptBR, ru, sv, zhCN } from 'date-fns/locale'
import compose from 'stampit'

/** @hidden */
const LOCALES = {
  da: enUS,
  de,
  en: enUS,
  es,
  fr,
  it,
  ja,
  ko: enUS,
  nl,
  pl: enUS,
  pt: ptBR,
  ru,
  sv,
  zh: zhCN,
}

/** @hidden */
export const Task: todoist.TaskFactory = compose({
  init(this: todoist.ResponseTask, task: todoist.ResponseTask = { content: '' }) {
    if (!task.content || task.content === '') {
      throw new AlfredError(`A task must have a content (${task.content}) property`)
    }

    Object.assign(this, task)
  },
})

/** @hidden */
export const TaskList: todoist.TaskListFactory = compose(List, {
  init(
    this: todoist.TaskListInstance,
    {
      tasks = [],
      action = 'COMPLETE',
      locale = 'en',
    }: { tasks: todoist.Task[]; action: string; locale: todoist.locale }
  ) {
    tasks.forEach((task: todoist.Task) => {
      const { content, project, labels = [], priority, due, due_string } = task
      const view = View()
      let name = (project && project.name) || ''
      let date: string

      if (due && due.date) {
        date = due.date
      }

      if (due && due.datetime) {
        date = due.datetime
      }

      let item = Item({
        arg: task,
        title: `${action}: ${content}`,
        subtitle: view.template(({ upperCase, ws, when }) => {
          // Project name
          let subtitle = `${when(name, upperCase(name), 'INBOX')}`

          // Label
          subtitle += `${when(
            labels.length > 0,
            `${ws(10)}\uFF20 ${labels.map((label) => label.name)}`,
            ''
          )}`

          // Priority
          subtitle += `${when(
            priority && priority > 1,
            `${ws(10)}\u203C ${priority && 5 - priority}`,
            ''
          )}`

          // Due date (in local language)
          if (date) {
            subtitle += `${when(
                  date,
              `${ws(10)}\u29D6 ${formatDistance(parseISO(date), new Date(), {
                addSuffix: true,
                    locale: LOCALES[locale]
                  })}`,
              ''
                )}`}

          }

          // Alternative due date
          subtitle += `${when(due_string, `${ws(10)}\u29D6 ${due_string}`, '')}`

          return subtitle
        }),
      })

      this.items.push(item)
    })
  },
})
