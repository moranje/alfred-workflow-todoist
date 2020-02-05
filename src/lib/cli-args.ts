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

const argv: string[] = Object.assign([], process.argv);
argv.splice(0, 2);

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
