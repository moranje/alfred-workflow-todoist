import compose from 'stampit'

import { Item, List } from '../workflow/workflow'
import parser from './parser'
import { Task, TaskList } from './task'

// import { LabelList } from './label';
// import { ProjectList } from './project';
interface ParsedTask {}

export function init(query: string, locale: string) {
  let parsed = parser(query)

  // if (parsed.last === 'project') {
  // } else if (parsed.last === 'label') {
  // } else
  if (parsed.last().type === 'priority') {
    return showPriorities(query)
  }

  return createTask(parsed, locale)
}

function createTask(parsed: ParsedTask, locale: string) {
  let task = Task(parsed)
  let taskList = TaskList({ tasks: [task], action: 'CREATE', locale })

  return taskList.write()
}

// function showProjects() {
//   let projectList = ProjectList()

//   return projectList.write()
// }

// function showLabels() {
//   let labelList = LabelList()

//   return labelList.write()
// }

function showPriorities(query: string) {
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
        this.autocomplete = `${query.replace(/!![1-4]/, '!!')}${title}`
        this.valid = false
      }
    }
  )
  let priorityList = List({ items: [Priority(1), Priority(2), Priority(3), Priority(4)] })

  return priorityList.write()
}
