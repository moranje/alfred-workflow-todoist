/* eslint-disable jest/no-hooks */
import { mockProcessStderr, mockProcessStdout } from 'jest-mock-process';

import command from '@/lib/command';

jest.mock('@/lib/stores/settings-store');
jest.mock('@/lib/todoist/local-rest-adapter/conf-cache');

let stdoutSpy: jest.SpyInstance;
let stderrSpy: jest.SpyInstance;

describe('integration: Parse()', () => {
  beforeEach(() => {
    stdoutSpy = mockProcessStdout();
    stderrSpy = mockProcessStderr();
  });

  it('should parse empty input', async () => {
    expect.assertions(1);
    await command({ name: 'parse', args: '' });

    expect(stdoutSpy.mock.calls[0][0]).toContainAllAlfredItemsWith('title', [
      'ADD TASK: ',
    ]);
  });

  it('should parse the task title', async () => {
    expect.assertions(1);
    await command({ name: 'parse', args: 'Get milk' });

    expect(stdoutSpy.mock.calls[0][0]).toContainAllAlfredItemsWith('title', [
      'ADD TASK: Get milk',
    ]);
  });

  it('should parse the project', async () => {
    expect.assertions(1);
    await command({ name: 'parse', args: '#Work<1> ' });

    expect(stdoutSpy.mock.calls[0][0]).toContainAllAlfredItemsWith('subtitle', [
      'WORK',
    ]);
  });

  it('should parse labels', async () => {
    expect.assertions(1);
    await command({ name: 'parse', args: '@15min<1> @at_home<6> ' });

    expect(stdoutSpy.mock.calls[0][0]).toContainAllAlfredItemsWith('subtitle', [
      'INBOX\t＠ 15min,at_home',
    ]);
  });

  it('should parse the section', async () => {
    expect.assertions(1);
    await command({ name: 'parse', args: '#Inbox<1> ::Doing<2> ' });

    expect(stdoutSpy.mock.calls[0][0]).toContainAllAlfredItemsWith('subtitle', [
      'INBOX\t§ Doing',
    ]);
  });

  it('should parse the priority', async () => {
    expect.assertions(1);
    await command({ name: 'parse', args: '!!2 ' });

    expect(stdoutSpy.mock.calls[0][0]).toContainAllAlfredItemsWith('subtitle', [
      'INBOX\t‼ 2',
    ]);
  });

  it('should parse the date', async () => {
    expect.assertions(1);
    await command({ name: 'parse', args: ', tomorrow' });

    expect(stdoutSpy.mock.calls[0][0]).toContainAllAlfredItemsWith('subtitle', [
      'INBOX\t⧖ tomorrow',
    ]);
  });

  it('should show a parser error list item if unexpected input is encountered', async () => {
    expect.assertions(2);

    await expect(command({ name: 'parse', args: '@<' })).rejects.toThrow(
      'The character "<" is a probably a mistake: "@<" <-'
    );
    await expect(command({ name: 'parse', args: '"' })).rejects.toThrow(
      "The character '\"' is a probably a mistake: '\"' <-"
    );
  });
});
