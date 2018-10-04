import Ajv from 'ajv'
import jsonfile from 'jsonfile'
import compose from 'stampit'

import { uuid } from '../todoist/rest-api-v8'
import { Schema } from './settings-schema'
import { Item, List, Notification } from './workflow'

const path = `${
  process.env.HOME
}/Library/Application Support/Alfred 3/Workflow Data/com.alfred-workflow-todoist`
export interface Settings {
  [index: string]: string | number | boolean
  token: string
  language: string
  max_items: number
  uuid: string
  anonymous_statistics: boolean
}

const ajv = new Ajv({ allErrors: true })
const validate = ajv.compile(Schema)
const SettingsList = compose(
  List,
  {
    init(this: List, { settings }: { settings: Settings }) {
      this.items = this.items || []

      Object.keys(settings).forEach((key: string) => {
        if (key !== 'uuid') {
          this.items.push(
            Item({
              title: `SETTING: ${key}`,
              subtitle: `${Schema.properties[key].explanation}`,
              autocomplete: ` ${key}`,
              valid: false
            })
          )
        }
      })
    }
  }
)

const SettingList = compose(
  List,
  {
    init(
      this: List,
      {
        key = '',
        value = '',
        settings
      }: { key: string; value: string | number | boolean; settings: Settings }
    ) {
      this.items = this.items || []
      let subtitle = `Current value: ${settings[key]}`
      let valid = `\u2713`

      // Type cast value to a number
      if (Schema.properties[key].type === 'number') {
        value = +value
      }

      if (!isValid(key, value, settings)) {
        subtitle += ` (${Schema.properties[key].explanation})`
        valid = `\u2715`
      }

      if (Schema.properties[key].type === 'boolean') {
        this.items.push(
          Item({
            title: `New: true`,
            subtitle: `Current value: ${settings[key]}`,
            arg: { key, value: true }
          })
        )
        this.items.push(
          Item({
            title: `New: false `,
            subtitle: `Current value: ${settings[key]}`,
            arg: { key, value: false }
          })
        )
      } else if (Schema.properties[key].type === 'string') {
        this.items.push(
          Item({
            title: `New: ${value} (${valid})`,
            subtitle,
            arg: { key, value }
          })
        )
      } else if (Schema.properties[key].type === 'number') {
        this.items.push(
          Item({
            title: `New: ${value} (${valid})`,
            subtitle,
            arg: { key, value: +value }
          })
        )
      }
    }
  }
)

function createDefault() {
  const starter: Settings = {
    token: '',
    language: 'en',
    max_items: 9,
    cache_timeout: 3600,
    uuid: uuid(),
    anonymous_statistics: true
  }

  if (!validate(starter)) {
    return starter
  }

  throw validate.errors
}

export async function getSettings() {
  let settings: Settings

  try {
    settings = await import(`${path}/settings.json`)
  } catch (err) {
    settings = createDefault()
  }

  // Reintroduce defaults when a setting goes missing
  return Object.assign(createDefault(), settings)
}

export async function list() {
  let settings: Settings = await getSettings()
  let settingsList = SettingsList({ settings })

  return settingsList.write()
}

export async function edit(key: string, value: string | number | boolean) {
  let settings: Settings = await getSettings()
  let settingList = SettingList({ key, value, settings })

  return settingList.write()
}

export async function update({ key, value }: { key: string; value: string | number | boolean }) {
  let settings: Settings = await getSettings()

  if (isValid(key, value, settings)) {
    jsonfile.writeFileSync(`${path}/settings.json`, Object.assign(settings, { [key]: value }))

    return Notification().write('Setting updated')
  }

  return Notification().write(new Error(`Can't set ${key} to ${value}`))
}

export function isValid(key: string, value: string | number | boolean, settings: Settings) {
  let updated = Object.assign({}, settings, { [key]: value })

  return validate(updated)
}

export function getErrors(key: string, value: string | number | boolean, settings: Settings) {
  let updated = Object.assign({}, settings, { [key]: value })
  validate(updated)

  return validate.errors
}
