import Conf from 'conf';

export type UpdateConfig = {
  version: string;
  updated: string;
};

let instance: Conf<UpdateConfig> | null = null;

function createStore(): Conf {
  return new Conf<UpdateConfig>({
    configName: 'workflow',
    cwd: process.cwd(),
    schema: {
      version: {
        type: 'string',
      },
      updated: {
        type: 'string',
      },
    },
  });
}

/**
 * A store instance to query the workflow.json update config file.
 *
 * @returns A `Conf` instance.
 */
export default function updateStore(): Conf<UpdateConfig> {
  if (instance != null) return instance;
  instance = createStore();

  return instance;
}
