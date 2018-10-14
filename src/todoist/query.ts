import { LabelAdapter, ProjectAdapter } from '@/todoist/rest-api-v8'
import { getSetting } from '@/workflow/settings'
import compose from 'stampit'

import { Item, List } from '../workflow/workflow'
import { LabelList } from './label'
import parser from './parser'
import { ProjectList } from './project'
import { Task, TaskList } from './task'

interface ParsedTask {}

export function init(query: string, locale: string) {
  let parsed = parser(query)

  if (parsed.last().type === 'project') {
    return showProjects(query)
  } else if (parsed.last().type === 'label') {
    return showLabels(query)
  } else if (parsed.last().type === 'priority') {
    return showPriorities(query)
  }

  return Promise.resolve(createTask(parsed, locale))
}

function createTask(parsed: ParsedTask, locale: string) {
  let task = Task(parsed)
  let taskList = TaskList({ tasks: [task], action: 'CREATE', locale })

  return taskList.write()
}

async function showProjects(query: string) {
  let project = query.replace(/^.*#/, '').replace(/\[|\]/g, '')
  let projects = await ProjectAdapter({ token: getSetting('token') }).query(project, 'name')

  return ProjectList({ projects, query }).write()
}

async function showLabels(query: string) {
  let label = query.replace(/^.*@/, '')
  let labels = await LabelAdapter({ token: getSetting('token') }).query(label, 'name')

  return LabelList({ labels, query }).write()
}

function showPriorities(query: string) {
  let priority = query.replace(/^.*?!!/, '').replace(/^.*?p/, '')
  let priorityNames: { [index: string]: string } = {
    '1': 'urgent',
    '2': 'high',
    '3': 'medium',
    '4': 'low'
  }
  let Priority = compose(
    Item,
    {
      init(this: Item, title: number) {
        this.title = `${title}`
        this.subtitle = `Set priority to ${priorityNames[`${title}`]}`
        this.autocomplete = `${query
          .replace(/(^.*!!)[1-4]$/, '$1')
          .replace(/(^.*?p)[1-4]$/, '$1')}${title} `
        this.valid = false
      }
    }
  )

  if (+priority >= 1 && +priority <= 4) {
    return List({ items: [Priority(+priority)] }).write()
  }

  return List({
    items: [Priority(1), Priority(2), Priority(3), Priority(4)]
  }).write()
}
