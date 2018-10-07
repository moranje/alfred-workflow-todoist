import compose from 'stampit'

import { init } from '../todoist/query'
import { TaskAdapter } from '../todoist/rest-api-v8'
import { Task, TaskList } from '../todoist/task'
import { Notification } from './notifier'
import { edit, getSettings, list, update } from './settings'

interface Workflow {}

// import { Item } from './workflow';
export const TodoistWorkflow = compose({
  methods: {
    async read(this: Workflow, query: string) {
      return TaskAdapter({ token: (await getSettings()).token })
        .query(query)
        .then(async (tasks: any) => {
          let taskList: TaskList = TaskList({
            tasks,
            locale: (await getSettings()).language
          })

          taskList.write({ items: taskList.items })
        })
    },

    async create(this: Workflow, query: string) {
      let locale = (await getSettings()).language
      return init(query, locale)
    },

    async submit(this: Workflow, task: Task) {
      return TaskAdapter({ token: (await getSettings()).token })
        .create(task)
        .then(({ statusCode, body }: any) => {
          if (statusCode === 200) {
            return Notification({
              message: 'Task added',
              open: `https://todoist.com/showTask?id=${body.id}`
            }).write()
          }

          return Notification({
            message: 'Task probably added',
            open: `https://todoist.com/showTask?id=${body.id}`
          }).write()
        })
    },

    async remove(this: Workflow, task: Task) {
      return TaskAdapter({ token: (await getSettings()).token })
        .remove(task.id)
        .then(({ statusCode }: any) => {
          if (statusCode === 204) {
            return Notification({ message: 'Task completed' }).write()
          }

          return Notification({ message: 'Task probably completed' }).write()
        })
    },

    settings(this: Workflow) {
      return list()
    },

    editSetting(this: Workflow, key: string, value: string | number | boolean) {
      return edit(key, value)
    },

    storeSetting(this: Workflow, setting: { key: string; value: string | number | boolean }) {
      return update(Object.assign(setting))
    }
  }
})
