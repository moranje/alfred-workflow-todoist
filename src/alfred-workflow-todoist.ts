import '@babel/polyfill';

import { cache, serialize } from '@/workflow/cache';
import { AlfredError, handleError } from '@/workflow/error';
import { getSetting } from '@/workflow/settings';
import { TodoistWorkflow } from '@/workflow/todoist-workflow';

const argv = Object.assign([], process.argv)
argv.splice(0, 2)
const type = argv.shift()
const query = argv.join(' ')
const todoistWorkflow = TodoistWorkflow()

function handleSerialization() {
  return serialize(cache.dump()).catch(handleError)
}

if (type === 'read') {
  todoistWorkflow
    .read(query)
    .catch(handleError)
    .finally(handleSerialization)
} else if (type === 'create') {
  todoistWorkflow
    .create(query)
    .catch(handleError)
    .finally(handleSerialization)
} else if (type === 'submit') {
  todoistWorkflow
    .submit(Object.assign(JSON.parse(query), { due_lang: getSetting('language') }))
    .catch(handleError)
    .finally(handleSerialization)
} else if (type === 'remove') {
  todoistWorkflow
    .remove(JSON.parse(query))
    .catch(handleError)
    .finally(handleSerialization)
} else if (type === 'settings' && query.trim() !== '') {
  let [key, value] = query.trim().split(' ')
  todoistWorkflow.editSetting(key, value)
} else if (type === 'settings') {
  todoistWorkflow.settings()
} else if (type === 'settings:store') {
  todoistWorkflow.storeSetting(JSON.parse(query)).catch(handleError)
} else {
  handleError(new AlfredError(`Invalid command ${type} (${query})`))
}

process.on('uncaughtException', handleError)
process.on('unhandledRejection', handleError)
