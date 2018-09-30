import formatDistance from 'date-fns/formatDistance'
import { de, enUS, es, fr, it, nl, ptBR, ru, sv, zhCN } from 'date-fns/locale'
import compose from 'stampit'

import { Item, List, View } from '../workflow/workflow'
import { Label } from './label'
import { Project } from './project'

// import da from 'date-fns/locale/da'
// import ko from 'date-fns/locale/ko'
// import pl from 'date-fns/locale/pl'
// import ja from 'date-fns/locale/ja';
export type locale =
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
  | 'zh'

const locales = {
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

export interface Task {
  [index: string]:
    | undefined
    | string
    | number
    | number[]
    | Label[]
    | Project
    | {
        date?: string
        recurring?: boolean
        datetime?: string
        string?: string
        timezone?: string
      }
  content: string
  due?: {
    date?: string
    recurring?: boolean
    datetime?: string
    string?: string
    timezone?: string
  }
  due_string?: string
  due_lang?: string
  id?: number
  label_ids?: number[]
  project_id?: number
  url?: string
  priority?: number
  project?: Project
  labels?: Label[]
}

// interface TaskPrivate {
//   [index: string]:
//     | undefined
//     | string
//     | number
//     | number[]
//     | {
//         date?: string
//         recurring?: boolean
//         datetime?: string
//         string?: string
//         timezone?: string
//       }
//   _content?: string
//   _due?: {
//     date?: string
//     recurring?: boolean
//     datetime?: string
//     string?: string
//     timezone?: string
//   }
//   _due_string?: string
//   _due_lang?: string
//   _id?: number
//   _label_ids?: number[]
//   _project_id?: number
//   _url?: string
//   _priority?: number
// }

export interface TaskList extends List {}

export const Task = compose({
  init(this: Task, task: Task = { content: '' }) {
    if (!task.content || task.content === '') {
      throw new Error(`A task must have a content (${task.content}) property`)
    }

    // Store tasks properties as private ("_"-prefixed) properties
    // for (let prop in task) {
    //   Object.assign(this, { [`_${prop}`]: task[prop] })
    // }
    Object.assign(this, task)
  }
})

export const TaskList = compose(
  List,
  {
    init(
      this: List,
      {
        tasks = [],
        action = 'COMPLETE',
        locale = 'en'
      }: { tasks: Task[]; action: string; locale: locale }
    ) {
      tasks.forEach((task: Task) => {
        const { content, project, labels = [], priority, due, due_string } = task
        let view: View = View()
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
                  locale: locales[locale]
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
