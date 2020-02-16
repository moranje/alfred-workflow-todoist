import {
  create,
  openUrl,
  parse,
  read,
  readSettings,
  refreshCache,
  remove,
  writeSetting,
} from './commands';
import { Call } from '@/lib/cli-args';
import { AlfredError, Errors } from '@/lib/error';

/**
 * A method runner.
 *
 * @param call A `Call` object.
 */
export default async function command(call: Call): Promise<void | null> {
  if (call.name === 'parse') {
    return parse(call.args);
  } else if (call.name === 'read') {
    return read(call.args);
  } else if (call.name === 'create') {
    return create(call.args);
  } else if (call.name === 'remove') {
    return remove(call.args);
  } else if (call.name === 'readSettings') {
    return readSettings(call.args);
  } else if (call.name === 'writeSetting') {
    return writeSetting(call.args);
  } else if (call.name === 'refreshCache') {
    return refreshCache(call.args);
  } else if (call.name === 'openUrl') {
    return openUrl(call.args);
  }

  throw new AlfredError(
    Errors.InvalidArgument,
    `Expected application to be called with either 'parse', 'read', 'create', 'remove', 'readSettings', 'writeSettings' or 'refreshCache', was ${call.name}`
  );
}
