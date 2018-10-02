import compose from 'stampit'

import { init } from '../todoist/query'
import { TaskAdapter } from '../todoist/rest-api-v8'
import { Task, TaskList } from '../todoist/task'
import { edit, getSettings, list, update } from './settings'
import { Notification } from './workflow'

interface Workflow {
  paths: { data: string; cache: string }
}

// import { Item } from './workflow';
export const TodoistWorkflow = compose({
  init(this: Workflow) {
    this.paths = {
      data: `${
        process.env.HOME
      }/Library/Application Support/Alfred 3/Workflow Data/com.alfred-workflow-todoist`,
      cache: `${
        process.env.HOME
      }/Library/Caches/com.runningwithcrayons.Alfred-3/Workflow Data/com.alfred-workflow-todoist`
    }
  },

  methods: {
    async read(this: Workflow) {
      return TaskAdapter({ token: (await getSettings(this.paths.data)).token })
        .findAll()
        .then(async (tasks: any) => {
          let taskList: TaskList = TaskList({
            tasks,
            locale: (await getSettings(this.paths.data)).language
          })

          taskList.write({ items: taskList.items })
        })
    },

    async create(this: Workflow, query: string) {
      let locale = (await getSettings(this.paths.data)).language
      return init(query, locale)
    },

    async submit(this: Workflow, task: Task) {
      return TaskAdapter({ token: (await getSettings(this.paths.data)).token })
        .create(task)
        .then(({ statusCode, body }: any) => {
          if (statusCode === 200) {
            return Notification().write(`Task added`)
          }

          return Notification().write(`Task probably added`)
        })
    },

    async remove(this: Workflow, task: Task) {
      return TaskAdapter({ token: (await getSettings(this.paths.data)).token })
        .remove(task.id)
        .then(({ statusCode }: any) => {
          if (statusCode === 204) {
            return Notification().write(`Task completed`)
          }

          return Notification().write(`Task probably completed`)
        })
    },

    settings(this: Workflow) {
      return list(this.paths.data)
    },

    editSetting(this: Workflow, key: string, value: string | number | boolean) {
      return edit(key, value, this.paths.data)
    },

    storeSetting(this: Workflow, setting: { key: string; value: string | number | boolean }) {
      return update(Object.assign(setting, { path: this.paths.data }))
    }
  }
})
