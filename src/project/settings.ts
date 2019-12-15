import { AlfredError, FILES, Schema, SETTINGS_PATH } from '@/project';
import { Item, List, Notification, uuid } from '@/workflow';
import AJV from 'ajv';
import compose from 'stampit';
import writeJsonFile from 'write-json-file';

/** @hidden */
const ajv = new AJV({ allErrors: true });

const SettingList = compose(List, {
  init(
    this: workflow.ListInstance,
    {
      key = '',
      value = '',
      settings,
    }: {
      key: string;
      value: string | number | boolean;
      settings: project.Settings;
    }
  ) {
    this.items = this.items || [];
    if (!Schema.properties[key]) {
      this.items.push(
        Item({
          title: 'NO SUCH SETTING',
          subtitle: 'Alas, but dust yourself off and try again',
          valid: false,
        })
      );
    } else {
      let subtitle = `Current value: ${settings[key]}`;
      let valid = '\u2713';

      // eslint-disable-next-line
      if (getErrors(key, value, settings).length > 0) {
        subtitle += ` (${Schema.properties[key].explanation})`;
        valid = '\u2715';
      }

      if (Schema.properties[key].type === 'boolean') {
        this.items.push(
          Item({
            title: 'New: true',
            subtitle: `Current value: ${settings[key]}`,
            arg: { key, value: true },
          })
        );
        this.items.push(
          Item({
            title: 'New: false',
            subtitle: `Current value: ${settings[key]}`,
            arg: { key, value: false },
          })
        );
      } else if (Schema.properties[key].type === 'string') {
        this.items.push(
          Item({
            title: `New: ${value} (${valid})`,
            subtitle,
            arg: { key, value },
          })
        );
      } else if (Schema.properties[key].type === 'number') {
        this.items.push(
          Item({
            title: `New: ${value} (${valid})`,
            subtitle,
            arg: { key, value: +value },
          })
        );
      } else {
        this.items.push(
          new Item({
            title: `SETTING: ${key}`,
            subtitle: `${Schema.properties[key].explanation}`,
            autocomplete: ` ${key}`,
            valid: false,
          })
        );
      }
    }
  },
});

/** @hidden */
function formatValidationErrors(errors: any[]) {
  return errors.map((err: any) => {
    return `${err.dataPath.replace('.', '')} ${err.message} (${
      err.params.allowedValues
    })`;
  });
}

/** @hidden */
function castSettingTypes(settings: project.Settings): project.Settings {
  const typeCast: project.Settings = settings;

  Object.entries(settings).forEach(([key, value]) => {
    if (Schema.properties[key] && Schema.properties[key].type === 'boolean') {
      if (typeof value === 'boolean') {
        typeCast[key] = value;
      } else if (value === 'true') {
        typeCast[key] = true;
      } else if (value === 'false') {
        typeCast[key] = false;
      } else {
        throw new Error(`Setting ${key} should a boolean type, was ${value}`);
      }
    } else if (
      Schema.properties[key] &&
      Schema.properties[key].type === 'number'
    ) {
      if (typeof value === 'number') {
        typeCast[key] = value;
      } else if (!isNaN(Number(value))) {
        typeCast[key] = Number(value);
      } else {
        throw new Error(`Setting ${key} should a number type, was ${value}`);
      }
    } else {
      typeCast[key] = value;
    }
  });

  return typeCast;
}

/** @hidden */
function getErrors(
  key: string,
  value: string | number | boolean,
  settings: project.Settings
): AJV.ErrorObject[] {
  const updated = Object.assign({}, settings, { [key]: value });
  const validate = ajv.compile(Schema);

  if (!validate(castSettingTypes(updated))) {
    return validate.errors ?? [];
  }

  return [];
}

/** @hidden */
function createDefault(): project.Settings {
  const starter: project.Settings = {
    token: '',
    language: 'en',
    max_items: 9,
    cache_timeout: 3600,
    uuid: uuid(),
    anonymous_statistics: true,
  };
  const validate = ajv.compile(Schema);

  if (validate(starter)) {
    return starter;
  }

  throw new AlfredError(formatValidationErrors(validate.errors ?? []));
}

export function getSettings(): project.Settings {
  // Reintroduce defaults when a setting goes missing
  return castSettingTypes(Object.assign(createDefault(), FILES.settings));
}

export function getSetting(setting: string): string | number | boolean {
  const settings = getSettings();

  return settings[setting];
}

export function list(): void {
  const settings = getSettings();
  const settingsList = SettingsList({ settings });

  return settingsList.write();
}

export function verify(key: string, value: string | number | boolean): void {
  const settings = getSettings();
  const settingList = SettingList({ key, value, settings });

  return settingList.write();
}

export async function save({
  key,
  value,
}: {
  key: string;
  value: string | number | boolean;
}): Promise<void> {
  const settings = getSettings();
  const errors = getErrors(key, value, settings);

  if (errors.length === 0) {
    await writeJsonFile(
      SETTINGS_PATH,
      Object.assign(settings, { [key]: value })
    );

    return Notification({ message: 'Setting updated' }).write();
  }

  throw new AlfredError(formatValidationErrors(errors || []));
}
