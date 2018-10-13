import '@babel/polyfill'

import { cache, serialize } from '@/todoist/cache'

import { AlfredError } from './workflow/error'
import { Notification } from './workflow/notifier'
import { getSettings } from './workflow/settings'
import { TodoistWorkflow } from './workflow/todoist-workflow'

const argv = Object.assign([], process.argv)
argv.splice(0, 2)
const type = argv.shift()
const query = argv.join(' ')
const todoistWorkflow = TodoistWorkflow()

function handleError(err: Error) {
  let error = new AlfredError(err.message, err.name, err.stack)
  console.log('Error log', arguments)

  return Notification(Object.assign(error, { query })).write()
}

function handleSerialization() {
  serialize(cache.dump()).catch(handleError)
}

if (type === 'read') {
  todoistWorkflow.read(query)
} else if (type === 'create') {
  todoistWorkflow.create(query)
} else if (type === 'submit') {
  todoistWorkflow.submit(Object.assign(JSON.parse(query), { due_lang: getSettings().language }))
} else if (type === 'remove') {
  todoistWorkflow.remove(JSON.parse(query))
} else if (type === 'settings' && query.trim() !== '') {
  let [key, value] = query.trim().split(' ')
  todoistWorkflow.editSetting(key, value)
} else if (type === 'settings') {
  todoistWorkflow.settings()
} else if (type === 'settings:store') {
  todoistWorkflow.storeSetting(JSON.parse(query))
} else {
  Notification(new AlfredError(`Invalid command ${type} (${query})`)).write()
}

process.on('beforeExit', handleSerialization)
process.on('uncaughtException', handleError)
process.on('unhandledRejection', handleError)
