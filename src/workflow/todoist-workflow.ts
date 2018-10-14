import { Label } from '@/todoist/label'
import { Project } from '@/todoist/project'
import { init } from '@/todoist/query'
import { LabelAdapter, ProjectAdapter, TaskAdapter } from '@/todoist/rest-api-v8'
import { Task, TaskList } from '@/todoist/task'
import { Notification } from '@/workflow/notifier'
import { edit, getSetting, getSettings, list, update } from '@/workflow/settings'
import { Item, List } from '@/workflow/workflow'
import omit from 'lodash.omit'
import compose from 'stampit'

interface Workflow {}

async function replaceNamesWithIds(task: Task) {
  let allProjects = await ProjectAdapter({ token: getSetting('token') }).findAll()
  let allLabels = await LabelAdapter({ token: getSetting('token') }).findAll()

  if (task && task.labels) {
    Object.assign(task, { label_ids: [] }, task)

    task.labels.forEach((label: Label) => {
      let matchedLabel = allLabels.find((aLabel: Label) => aLabel.name === `${label}`)

      // @ts-ignore: is properly checked as far a I can see
      if (matchedLabel) task.label_ids.push(matchedLabel.id)
    })
  }

  if (task && task.project) {
    let matchedProject = allProjects.find((aProject: Project) => {
      // @ts-ignore: object is possibly undefined
      return aProject.name === task.project
    })

    if (matchedProject) task.project_id = matchedProject.id
  }

  return omit(task, ['labels', 'project'])
}

export const TodoistWorkflow = compose({
  methods: {
    async read(this: Workflow, query: string) {
      let tasks = await TaskAdapter({ token: getSettings().token }).query(query)

      if (tasks.length > 0) {
        return TaskList({
          tasks,
          locale: getSetting('language')
        }).write()
      }

      return List({
        items: [
          Item({
            title: "SORRY: There's just nothing here...",
            subtitle: "Don't let that get you down though, try something less specific",
            valid: false
          })
        ]
      }).write()
    },

    create(this: Workflow, query: string) {
      // @ts-ignore: don't know how to express this in typescript but this will
      // be a string
      return init(query, getSetting('language'))
    },

    async submit(this: Workflow, task: Task) {
      let apiTask = await replaceNamesWithIds(task)
      let { statusCode, body } = await TaskAdapter({ token: getSetting('token') }).create(apiTask)

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
    },

    async remove(this: Workflow, task: Task) {
      let { statusCode } = await TaskAdapter({ token: getSetting('token') }).remove(task.id)

      if (statusCode === 204) {
        return Notification({ message: 'Task completed' }).write()
      }

      return Notification({ message: 'Task might not actually be completed' }).write()
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
