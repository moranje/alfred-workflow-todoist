import '@babel/polyfill';

import { AlfredError, cache, Command, getSetting, handleError, serialize } from '@/project';

/**
 * CLI argument parsing
 */

/** @hidden */
const argv = Object.assign([], process.argv)
argv.splice(0, 2)
/** @hidden */
const type = argv.shift()
/** @hidden */
const query = argv.join(' ')
/** @hidden */
const command = Command()

/**
 * Serialize cache back to JSON
 *
 * @hidden
 */
function handleSerialization() {
  return serialize(cache.dump()).catch(handleError)
}

/**
 * CLI option logic
 */

if (type === 'read') {
  command
    .read(query)
    .catch(handleError)
    .finally(handleSerialization)
} else if (type === 'create') {
  try {
    command.create(query)
  } catch (error) {
    handleError(error)
  } finally {
    handleSerialization()
  }
} else if (type === 'submit') {
  command
    .submit(Object.assign(JSON.parse(query), { due_lang: getSetting('language') }))
    .catch(handleError)
    .finally(handleSerialization)
} else if (type === 'remove') {
  command
    .remove(JSON.parse(query))
    .catch(handleError)
    .finally(handleSerialization)
} else if (type === 'settings' && query.trim() !== '') {
  let [key, value] = query.trim().split(' ')
  command.verifySetting(key, value)
} else if (type === 'settings') {
  command.listSettings()
} else if (type === 'settings:store') {
  command.saveSetting(JSON.parse(query)).catch(handleError)
} else {
  handleError(new AlfredError(`Invalid command ${type} (${query})`))
}

/**
 * Catch any unhandled exception or rejected promise and handle here
 */

process.on('uncaughtException', handleError)
process.on('unhandledRejection', handleError)
