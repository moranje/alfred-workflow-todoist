import { SETTINGS_PATH } from '@/utils/references'
import { AlfredError } from '@/workflow/error'
import { files } from '@/workflow/files'
import { Notification } from '@/workflow/notifier'
import { Schema } from '@/workflow/settings-schema'
import { Item, List, uuid } from '@/workflow/workflow'
import AJV from 'ajv'
import compose from 'stampit'
import writeJsonFile from 'write-json-file'

export interface Settings {
  [index: string]: string | number | boolean
  token: string
  language: string
  max_items: number
  uuid: string
  cache_timeout: number
  anonymous_statistics: boolean
}

const ajv = new AJV({ allErrors: true })

const SettingsList = compose(
  List,
  {
    init(this: List, { settings }: { settings: Settings }) {
      this.items = this.items || []

      Object.keys(Schema.properties).forEach((key: string) => {
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
      if (!Schema.properties[key]) {
        this.items.push(
          Item({
            title: 'NO SUCH SETTING',
            subtitle: 'Alas, but dust yourself off and try again',
            valid: false
          })
        )
      } else {
        let subtitle = `Current value: ${settings[key]}`
        let valid = '\u2713'

        if (getErrors(key, value, settings).length > 0) {
          subtitle += ` (${Schema.properties[key].explanation})`
          valid = '\u2715'
        }

        if (Schema.properties[key].type === 'boolean') {
          this.items.push(
            Item({
              title: 'New: true',
              subtitle: `Current value: ${settings[key]}`,
              arg: { key, value: true }
            })
          )
          this.items.push(
            Item({
              title: 'New: false',
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
        } else {
          this.items.push(
            Item({
              title: 'NO SUCH SETTING',
              subtitle: 'Alas, but dust yourself off and try again',
              valid: false
            })
          )
        }
      }
    }
  }
)

function formatValidationErrors(errors: any[]) {
  return errors
    .map((err: any) => {
      return `${err.dataPath.replace('.', '')} ${err.message} (${err.params.allowedValues})`
    })
    .join('. ')
}

function createDefault() {
  const starter: Settings = {
    token: '',
    language: 'en',
    max_items: 9,
    cache_timeout: 3600,
    uuid: uuid(),
    anonymous_statistics: true
  }
  let validate = ajv.compile(Schema)

  if (validate(starter)) {
    return starter
  }

  throw new AlfredError(formatValidationErrors(validate.errors || []))
}

function castSettingTypes(settings: Settings) {
  let typeCast: Settings = settings

  Object.entries(settings).forEach(([key, value]) => {
    if (Schema.properties[key] && Schema.properties[key].type === 'boolean') {
      if (typeof value === 'boolean') {
        typeCast[key] = value
      } else if (value === 'true') {
        typeCast[key] = true
      } else if (value === 'false') {
        typeCast[key] = false
      } else {
        throw new Error(`Setting ${key} should a boolean type, was ${value}`)
      }
    } else if (Schema.properties[key] && Schema.properties[key].type === 'number') {
      if (typeof value === 'number') {
        typeCast[key] = value
      } else if (!isNaN(+value)) {
        typeCast[key] = +value
      } else {
        throw new Error(`Setting ${key} should a number type, was ${value}`)
      }
    } else {
      typeCast[key] = value
    }
  })

  return typeCast
}

function getErrors(key: string, value: string | number | boolean, settings: Settings) {
  let updated = Object.assign({}, settings, { [key]: value })
  let validate = ajv.compile(Schema)

  if (!validate(castSettingTypes(updated))) {
    return validate.errors || []
  }

  return []
}

export function getSettings(): Settings {
  // Reintroduce defaults when a setting goes missing
  return castSettingTypes(Object.assign(createDefault(), files.settings))
}

export function getSetting(setting: string): primitiveNonEmpty {
  let settings = getSettings()

  return settings[setting]
}

export function list() {
  let settings = getSettings()
  let settingsList = SettingsList({ settings })

  return settingsList.write()
}

export function edit(key: string, value: string | number | boolean) {
  let settings = getSettings()
  let settingList = SettingList({ key, value, settings })

  return settingList.write()
}

export function update({ key, value }: { key: string; value: string | number | boolean }) {
  let settings = getSettings()
  let errors = getErrors(key, value, settings)

  if (errors.length === 0) {
    return writeJsonFile(SETTINGS_PATH, Object.assign(settings, { [key]: value })).then(() => {
      return Notification({ message: 'Setting updated' }).write()
    })
  } else {
    return Promise.reject(new AlfredError(formatValidationErrors(errors || [])))
  }
}
