import { AlfredError, Errors } from '@/lib/error';
import settingsStore, { Settings } from '@/lib/stores/settings-store';
import { ENV } from '@/lib/utils';
import { notification } from '@/lib/workflow';

/**
 * Write a value to the settings.json.
 *
 * @param options A settings key value pair.
 */
export async function writeSetting({
  key,
  value,
}: {
  key: keyof Settings;
  value: string | number | boolean;
}): Promise<void> {
  if (key != null && value != null) {
    try {
      settingsStore(ENV.meta.dataPath).set(key, value);
      notification({
        subtitle: 'Setting updated',
        message: `Setting ${key} is now ${value}`,
      });
    } catch (error) {
      throw new AlfredError(Errors.External, error.message, {
        title: 'Setting failed to update',
        error,
      });
    }
  } else {
    return notification({
      subtitle: 'Nothing was changed.',
      message: `No input received`,
    });
  }
}
