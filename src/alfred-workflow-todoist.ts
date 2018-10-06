import '@babel/polyfill'

import { AlfredError } from './workflow/error'
import { Notification } from './workflow/notifier'
import { TodoistWorkflow } from './workflow/todoist-workflow'

const argv = Object.assign([], process.argv)
argv.splice(0, 2)
const type = argv.shift()
const query = argv.join(' ')
const todoistWorkflow = TodoistWorkflow()

function handleError(err: Error) {
  let error = new AlfredError(err.message, err.name, err.stack)
  return Notification(Object.assign(error, { query })).write()
}

if (type === 'read') {
  todoistWorkflow.read(query).catch(handleError)
} else if (type === 'create') {
  todoistWorkflow.create(query).catch(handleError)
} else if (type === 'submit') {
  todoistWorkflow.submit(JSON.parse(query)).catch(handleError)
} else if (type === 'remove') {
  todoistWorkflow.remove(JSON.parse(query)).catch(handleError)
} else if (type === 'settings' && query.trim() !== '') {
  let [key, value] = query.trim().split(' ')
  todoistWorkflow.editSetting(key, value).catch(handleError)
} else if (type === 'settings') {
  todoistWorkflow.settings().catch(handleError)
} else if (type === 'settings:store') {
  todoistWorkflow.storeSetting(JSON.parse(query)).catch(handleError)
}
