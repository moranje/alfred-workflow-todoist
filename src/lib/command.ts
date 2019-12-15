import {
  parse,
  read,
  create,
  remove,
  readSettings,
  writeSetting,
} from './commands';
import { handleError } from './error';

export type MethodName =
  | 'parse'
  | 'read'
  | 'create'
  | 'remove'
  | 'readSettings'
  | 'writeSetting';

export default function command(methodName: MethodName, query: string) {
  if (methodName === 'parse') {
    parse(query).catch(error => handleError(error));
  } else if (methodName === 'read') {
    read(query).catch(error => handleError(error));
  } else if (methodName === 'create') {
    create(query).catch(error => handleError(error));
  } else if (methodName === 'remove') {
    remove(query).catch(error => handleError(error));
  } else if (methodName === 'readSettings') {
    readSettings(query).catch(error => handleError(error));
  } else if (methodName === 'writeSetting') {
    writeSetting(query).catch(error => handleError(error));
  }
}
