import { isPrimitive } from 'util';
import { TodoistTask, TodoistTaskOptions } from 'todoist-rest-api';

import { ResourceName } from './todoist/local-rest-adapter';
import { Settings } from '@/lib/stores/settings-store';

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

function assertValidArgs(args: Arg): asserts args is Arg {
  if (args == null) {
    throw new TypeError(
      `Property args should not be null or undefined, was ${args}`
    );
  }
}

function assertValidCall(call: Call): asserts call is Call {
  if (!call || isPrimitive(call)) {
    throw new TypeError(`The call should be a an object, was ${call}`);
  }

  if (!call.name || typeof call.name !== 'string') {
    throw new TypeError(
      `Expected call.name to be a string was ${call.name} (${typeof call.name})`
    );
  }

  assertValidArgs(call.args);
}

function serialize(call: Call): string | never {
  assertValidCall(call);

  return JSON.stringify(call);
}

function deserialize(serialized: string): Call | never {
  if (typeof serialized !== 'string') {
    throw new TypeError(
      `Expected a string in deserialize, got ${serialized} (${typeof serialized})`
    );
  }

  try {
    const call = JSON.parse(serialized) as Call;
    assertValidCall(call);

    return call;
  } catch (error) {
    throw new TypeError(
      `Expected a JSON string, got '${serialized}' (${typeof serialized})`
    );
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
  } catch {
    // Err on the side of caution.
    return true;
  }

  return (
    call.name === 'parse' ||
    call.name === 'read' ||
    call.name === 'readSettings'
  );
}
