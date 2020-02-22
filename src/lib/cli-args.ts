import { TodoistTask, TodoistTaskOptions } from 'todoist-rest-api';
import { isPrimitive } from 'util';

import { Settings } from '@/lib/stores/settings-store';

import { ResourceName } from './todoist/local-rest-adapter';

type Arg =
  | string
  | TodoistTaskOptions
  | TodoistTask
  | {
      key: string;
      value: string | number | boolean;
    };

export type Call =
  | {
      name: 'parse' | 'read' | 'readSettings' | 'openUrl';
      args: string;
    }
  | {
      name: 'create';
      args: TodoistTaskOptions;
    }
  | {
      name: 'remove';
      args: TodoistTask;
    }
  | {
      name: 'writeSetting';
      args: {
        key: keyof Settings;
        value: string | number | boolean;
      };
    }
  | {
      name: 'refreshCache';
      args: ResourceName;
    };

const [, , ...argv] = process.argv;
export const callNames: { [key: string]: boolean } = {
  parse: true,
  read: true,
  readSettings: true,
  openUrl: true,
  create: true,
  remove: true,
  writeSetting: true,
  refreshCache: true,
};

function assertValidArgs(args: Arg): asserts args is Arg {
  if (args == null) {
    throw new TypeError(
      `Property args should not be null or undefined, was ${args}`
    );
  }
}

function assertValidCall(call: Call): asserts call is Call {
  // istanbul ignore next: shouldn't be possible in codebase
  if (!call || isPrimitive(call)) {
    throw new TypeError(`The call should be a an object, was ${call}`);
  }

  if (!call.name || typeof call.name !== 'string') {
    throw new TypeError(
      `Expected call.name to be a string was ${
        call.name
      } (of type ${typeof call.name})`
    );
  }

  if (!callNames[call.name.toString()]) {
    throw new TypeError(
      `Expected call.name to be one of parse, read, readSettings, openUrl, create, remove, writeSetting, refreshCache, was ${call.name}`
    );
  }

  assertValidArgs(call.args);
}

function serialize(call: Call): string | never {
  assertValidCall(call);

  return JSON.stringify(call);
}

function escape(string: string): string {
  // @ts-ignore: is valid
  return String(string).replace(/["\\\b\f\n\r\t]/g, char => {
    switch (char) {
      case '"':
        return '\\"';
      case '\b':
        return '\\b';
      case '\f':
        return '\\f';
      case '\n':
        return '\\n';
      case '\r':
        return '\\r';
      case '\t':
        return '\\t';
      default:
        return char;
    }
  });
}

function deserialize(serialized: string): Call | never {
  const escaped = serialized.replace(
    /"args": "([\s\S]+?)"}/,
    (match, input) => {
      return `"args": "${escape(input)}"}`;
    }
  );

  try {
    const call = JSON.parse(escaped) as Call;
    assertValidCall(call);

    return call;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new TypeError(
        `Expected a JSON string, got '${escaped}' (${typeof escaped})`
      );
    }

    throw new TypeError(error.message);
  }
}

/**
 * Retrieves the call passed to current alfred input or action.
 *
 * @returns A `Call` object.
 */
export function getCurrentCall(): Call {
  return deserialize(argv.join(' '));
}

/**
 * Validates and creates a serialized call.
 *
 * @param call A `Call` object.
 * @returns A serialized call.
 */
export function createCall(call: Call): string {
  return serialize(call);
}

/**
 * Wether the current call expects user input. User input is read through stdin
 * which means logging to stdout may break the user experience.
 *
 * @returns True when a the call is user facing.
 */
export function isUserFacingCall(): boolean {
  let call;
  try {
    call = getCurrentCall();
  } catch (error) {
    // Err on the side of caution.
    return true;
  }

  return (
    call.name === 'parse' ||
    call.name === 'read' ||
    call.name === 'readSettings'
  );
}
