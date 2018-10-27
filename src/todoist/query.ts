import { getSetting } from '@/project';
import { LabelAdapter, LabelList, parser, ProjectAdapter, ProjectList, Task, TaskList } from '@/todoist';
import { Item, List } from '@/workflow';
import compose from 'stampit';

/** @hidden */
function createTask(parsed: todoist.Parsed, locale: string) {
  let task = Task(parsed)
  let taskList = TaskList({ tasks: [task], action: 'CREATE', locale })

  return taskList.write()
}

/** @hidden */
async function showProjects(query: string) {
  let project = query.replace(/^.*#/, '').replace(/\[|\]/g, '')
  let projects = await ProjectAdapter({ token: getSetting('token') }).query(project, 'name')

  return ProjectList({ projects, query }).write()
}

/** @hidden */
async function showLabels(query: string) {
  let label = query.replace(/^.*@/, '')
  let labels = await LabelAdapter({ token: getSetting('token') }).query(label, 'name')

  return LabelList({ labels, query }).write()
}

/** @hidden */
function showPriorities(query: string) {
  let priority = query.replace(/^.*?!!/, '').replace(/^.*?p/, '')
  let priorityNames: { [index: string]: string } = {
    '1': 'urgent',
    '2': 'high',
    '3': 'medium',
    '4': 'low'
  }

  const Priority: workflow.PriorityFactory = compose(
    Item,
    {
      init(this: workflow.ItemInstance, title: number) {
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

/** @hidden */
export const Query: todoist.QueryFactory = compose({
  init(this: todoist.QueryInstance, { query, locale }: { query: string; locale: todoist.locale }) {
    this.query = query
    this.locale = locale || 'en'
    this.parsed = parser(query)
  },

  methods: {
    parse(this: todoist.QueryInstance) {
      if (this.parsed && this.parsed.last('type') === 'project') {
        return showProjects(this.query)
      } else if (this.parsed && this.parsed.last('type') === 'label') {
        return showLabels(this.query)
      } else if (this.parsed && this.parsed.last('type') === 'priority') {
        return showPriorities(this.query)
      }

      return Promise.resolve(createTask(this.parsed, this.locale))
    }
  }
})
