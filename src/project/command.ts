import {
  getSetting,
  getSettings,
  WORKFLOW_JSON,
  WORKFLOW_PATH,
  FILES,
  list,
  removeObject,
  save,
  verify
} from '@/project'
import { LabelAdapter, ProjectAdapter, Query, TaskAdapter, TaskList } from '@/todoist'
import { Item, List, Notification } from '@/workflow'
import omit from 'lodash.omit'
import compose from 'stampit'
import got from 'got'
import writeJsonFile from 'write-json-file'

/** @hidden */
async function replaceNamesWithIds(task: todoist.Task) {
  let allProjects = await ProjectAdapter({ token: getSetting('token') }).findAll()
  let allLabels = await LabelAdapter({ token: getSetting('token') }).findAll()

  if (task && task.labels) {
    Object.assign(task, { label_ids: [] }, task)

    task.labels.forEach((label: todoist.Label) => {
      let matchedLabel = allLabels.find((aLabel: todoist.Label) => aLabel.name === `${label}`)

      // @ts-ignore: is properly checked as far a I can see
      if (matchedLabel) task.label_ids.push(matchedLabel.id)
    })
  }

  if (task && task.project) {
    let matchedProject = allProjects.find((aProject: todoist.Project) => {
      // @ts-ignore: object is possibly undefined
      return aProject.name === task.project
    })

    if (matchedProject) task.project_id = matchedProject.id
  }

  return omit(task, ['labels', 'project'])
}

/** @hidden */
export const Command: project.CommandFactory = compose({
  methods: {
    /**
     * Get a list of tasks from Todoist
     *
     * @param {string} query
     * @returns {Promise<void>}
     */
    async read(this: project.CommandInstance, query?: string): Promise<void> {
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

    /**
     * Parse a todoist task and extra information from Alfred input
     *
     * @param {string} query
     * @returns {Promise<void>}
     */
    create(this: project.CommandInstance, query: string) {
      return Query({ query, language: getSetting('language') }).parse()
    },

    /**
     * Submit a 'created' task back to Todoist
     *
     * @param {todoist.Task} task
     * @returns {Promise<void>}
     */
    async submit(this: project.CommandInstance, task: todoist.Task) {
      let apiTask = await replaceNamesWithIds(task)
      let { statusCode, body } = await TaskAdapter({ token: getSetting('token') }).create(apiTask)
      await TaskAdapter({ token: getSetting('token') }).find(body.id)

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

    /**
     * Remove a task from to todoist by id
     *
     * @param {todoist.Task} task
     * @returns {Promise<void>}
     */
    async remove(this: project.CommandInstance, task: todoist.Task) {
      let { statusCode } = await TaskAdapter({ token: getSetting('token') }).close(task.id)

      if (statusCode === 204) {
        if (task.id) removeObject('tasks', task.id)

        return Notification({ message: 'Task completed' }).write()
      }

      return Notification({ message: 'Task might not actually be completed' }).write()
    },

    /**
     * Display a list of possible settings
     */
    listSettings(this: project.CommandInstance) {
      return list()
    },

    /**
     * Checks if a settings is valid when changing one
     *
     * @param {string} key
     * @param {string | number | boolean} value
     */
    verifySetting(this: project.CommandInstance, key: string, value: string | number | boolean) {
      return verify(key, value)
    },

    /**
     * Saves a project setting back to disk
     *
     * @param {*} setting
     * @returns {Promise<void>}
     */
    saveSetting(
      this: project.CommandInstance,
      setting: { key: string; value: string | number | boolean }
    ) {
      return save(Object.assign(setting))
    },

    updateWorkflowVersion() {
      let timePassed = new Date().getTime() - new Date(FILES.workflowConfig.updated).getTime()
      if (timePassed < 604800000 /* One week */) return

      got('https://raw.githubusercontent.com/moranje/alfred-workflow-todoist/master/package.json', {
        json: true
      })
        .then(response => {
          if (response.body.version > FILES.workflowConfig.version) {
            Notification({
              message: `Workflow update available (v${response.body.version})`,
              open: `https://github.com/moranje/alfred-workflow-todoist/releases/latest/download/Alfred.Workflow.Todoist.alfredworkflow`,
              hideSuccessLogs: true
            }).write()

            writeJsonFile(WORKFLOW_JSON, {
              version: FILES.workflowConfig.version,
              updated: new Date()
            })
          }
        })
        .catch(err => {
          Notification({
            subtitle: `Couldn't update workflow`,
            message: `${err.message}`,
            hideSuccessLogs: true
          }).write()
        })
    }
  }
})
