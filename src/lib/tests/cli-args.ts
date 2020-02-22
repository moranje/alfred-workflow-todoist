import mockArgv from 'mock-argv';
// import { createCall } from '@/lib/cli-args';

type CallName =
  | 'parse'
  | 'read'
  | 'readSettings'
  | 'openUrl'
  | 'create'
  | 'remove'
  | 'writeSetting'
  | 'refreshCache'
  | 'anything'; // for testing purposes

function escape(string: string): string {
  return String(string).replace(/[\\]/g, function(char) {
    switch (char) {
      // case '"':
      //   return '\\"';
      case '\\':
        return '\\' + char;
    }
  });
}

function cliArgs(callName: CallName, input: any): string {
  return `{"name": "${callName}", "args": "${escape(input.toString())}"}`;
}

describe('unit: CLI', () => {
  beforeEach(() => jest.resetModules());

  it('should escape characters invalid to JSON during deserialization', async () => {
    expect.assertions(1);

    const characters = '\\ " \t \n \r \b \f';
    await mockArgv([cliArgs('read', characters)], async () => {
      const { getCurrentCall } = await import('@/lib/cli-args');

      const cli = getCurrentCall();

      expect(cli.args).toBe(characters);
    });
  });

  it('should throw if call is not a valid JSON string', async () => {
    expect.assertions(1);

    await mockArgv([{}], async () => {
      const { getCurrentCall } = await import('@/lib/cli-args');

      expect(() => {
        const cli = getCurrentCall();
      }).toThrow(/Expected a JSON string/);
    });
  });

  it("should throw if call doesn't have a name property", async () => {
    expect.assertions(1);

    await mockArgv(['{}'], async () => {
      const { getCurrentCall } = await import('@/lib/cli-args');

      expect(() => {
        const cli = getCurrentCall();
      }).toThrow(/Expected call.name to be a string/);
    });
  });

  it("should throw if call doesn't have an args property", async () => {
    expect.assertions(1);

    await mockArgv(['{"name": "read"}'], async () => {
      const { getCurrentCall } = await import('@/lib/cli-args');

      expect(() => {
        const cli = getCurrentCall();
      }).toThrow(/Property args should not be null or undefined/);
    });
  });

  it('should serialize to a JSON parsable string', async () => {
    expect.assertions(1);

    const { createCall } = await import('@/lib/cli-args');

    const characters = '\\ " \t \n \r \b \f';
    const call = createCall({
      name: 'create',
      args: characters,
    });

    expect(JSON.parse(call).args).toBe(characters);
  });

  it('should label "parse" as a user facing call', async () => {
    expect.assertions(1);

    await mockArgv([cliArgs('parse', '')], async () => {
      const { isUserFacingCall } = await import('@/lib/cli-args');
      expect(isUserFacingCall()).toBe(true);
    });
  });

  it('should label "read" as a user facing call', async () => {
    expect.assertions(1);

    await mockArgv([cliArgs('read', '')], async () => {
      const { isUserFacingCall } = await import('@/lib/cli-args');
      expect(isUserFacingCall()).toBe(true);
    });
  });

  it('should label "readSettings" as a user facing call', async () => {
    expect.assertions(1);

    await mockArgv([cliArgs('readSettings', '')], async () => {
      const { isUserFacingCall } = await import('@/lib/cli-args');
      expect(isUserFacingCall()).toBe(true);
    });
  });

  it('should label "openUrl" as non-user facing call', async () => {
    expect.assertions(1);

    await mockArgv([cliArgs('openUrl', '')], async () => {
      const { isUserFacingCall } = await import('@/lib/cli-args');
      expect(isUserFacingCall()).toBe(false);
    });
  });

  it('should label "create" as non-user facing call', async () => {
    expect.assertions(1);

    await mockArgv([cliArgs('create', '')], async () => {
      const { isUserFacingCall } = await import('@/lib/cli-args');
      expect(isUserFacingCall()).toBe(false);
    });
  });

  it('should label "remove" as non-user facing call', async () => {
    expect.assertions(1);

    await mockArgv([cliArgs('remove', '')], async () => {
      const { isUserFacingCall } = await import('@/lib/cli-args');
      expect(isUserFacingCall()).toBe(false);
    });
  });

  it('should label "writeSetting" as non-user facing call', async () => {
    expect.assertions(1);

    await mockArgv([cliArgs('writeSetting', '')], async () => {
      const { isUserFacingCall } = await import('@/lib/cli-args');
      expect(isUserFacingCall()).toBe(false);
    });
  });

  it('should label "refreshCache" as non-user facing call', async () => {
    expect.assertions(1);

    await mockArgv([cliArgs('refreshCache', '')], async () => {
      const { isUserFacingCall } = await import('@/lib/cli-args');
      expect(isUserFacingCall()).toBe(false);
    });
  });

  it('should label unknown calls as user facing', async () => {
    expect.assertions(1);

    await mockArgv([cliArgs('anything', '')], async () => {
      const { isUserFacingCall } = await import('@/lib/cli-args');
      expect(isUserFacingCall()).toBe(true);
    });
  });
});
