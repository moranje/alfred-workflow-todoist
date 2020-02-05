import { Chance } from 'chance';

import lexer from '../lexer';

jest.mock('@/lib/stores/settings-store');

const NUMBER_OF_RUNS = 10000;
const anything = [
  'abcdefghijklmnopqrstuvwxyz',
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  '0123456789',
  '$%^&*()<>[]{}:;?.,-+_=""\'`~±§#@\\|/',
  '                           ',
].join();

describe('unit: Lexer', () => {
  it('should tokenize every text character as a single token', () => {
    expect.assertions(1);

    lexer.reset('Get milk');
    const tokens: any[] = Array.from(lexer);

    expect(tokens.map(token => token.type)).toStrictEqual(['content']);
  });

  it('should tokenize regular text with emoticon', () => {
    expect.assertions(1);

    lexer.reset('Get the 🚙');
    const tokens: any[] = Array.from(lexer);

    expect(tokens.map(token => token.type)).toStrictEqual(['content']);
  });

  it('should tokenize project', () => {
    expect.assertions(1);

    lexer.reset('#inbox<1>');
    const tokens: any[] = Array.from(lexer);

    expect(tokens.map(token => token.type)).toStrictEqual([
      'pound',
      'name',
      'braceOpen',
      'tid',
      'braceClose',
    ]);
  });

  it('should tokenize project with emoticon', () => {
    expect.assertions(1);

    lexer.reset('#[🚙 Car]<2>');
    const tokens: any[] = Array.from(lexer);

    expect(tokens.map(token => token.type)).toStrictEqual([
      'pound',
      'bracketOpen',
      'name',
      'bracketClose',
      'braceOpen',
      'tid',
      'braceClose',
    ]);
  });

  it('should tokenize label', () => {
    expect.assertions(1);

    lexer.reset('@at_home<2>');
    const tokens: any[] = Array.from(lexer);

    expect(tokens.map(token => token.type)).toStrictEqual([
      'at',
      'name',
      'braceOpen',
      'tid',
      'braceClose',
    ]);
  });

  it('should tokenize label with emoticon', () => {
    expect.assertions(1);

    lexer.reset('@🚙_Car<2>');
    const tokens: any[] = Array.from(lexer);

    expect(tokens.map(token => token.type)).toStrictEqual([
      'at',
      'name',
      'braceOpen',
      'tid',
      'braceClose',
    ]);
  });

  it('should tokenize hyphenated label', () => {
    expect.assertions(1);

    lexer.reset('@at-home<2>');
    const tokens: any[] = Array.from(lexer);

    expect(tokens.map(token => token.type)).toStrictEqual([
      'at',
      'name',
      'braceOpen',
      'tid',
      'braceClose',
    ]);
  });

  it('should tokenize priority (p1-4)', () => {
    expect.assertions(1);

    lexer.reset('p1');
    const tokens: any[] = Array.from(lexer);

    expect(tokens.map(token => token.type)).toStrictEqual(['priority']);
  });

  it('should tokenize priority (!!)', () => {
    expect.assertions(1);

    lexer.reset('!!1');
    const tokens: any[] = Array.from(lexer);

    expect(tokens.map(token => token.type)).toStrictEqual([
      'doubleExclamation',
      'number',
    ]);
  });

  it('should tokenize section', () => {
    expect.assertions(1);

    lexer.reset('::Todo<3>');
    const tokens: any[] = Array.from(lexer);

    expect(tokens.map(token => token.type)).toStrictEqual([
      'colon',
      'name',
      'braceOpen',
      'tid',
      'braceClose',
    ]);
  });

  it('should tokenize a block section', () => {
    expect.assertions(1);

    lexer.reset('::[To do]<3>');
    const tokens: any[] = Array.from(lexer);

    expect(tokens.map(token => token.type)).toStrictEqual([
      'colon',
      'bracketOpen',
      'name',
      'bracketClose',
      'braceOpen',
      'tid',
      'braceClose',
    ]);
  });

  it('should tokenize task filter', () => {
    expect.assertions(1);

    lexer.reset('"7 days & @waiting"');
    const tokens: any[] = Array.from(lexer);

    expect(tokens.map(token => token.type)).toStrictEqual([
      'filterStart',
      'filter',
      'filterEnd',
    ]);
  });

  it('should tokenize spaces as content', () => {
    expect.assertions(1);

    lexer.reset('!!1 ');
    const tokens: any[] = Array.from(lexer);

    expect(tokens.map(token => token.type)).toStrictEqual([
      'doubleExclamation',
      'number',
      'content',
    ]);
  });

  it('should tokenize date', () => {
    expect.assertions(1);

    lexer.reset(',maandag');
    const tokens: any[] = Array.from(lexer);

    expect(tokens.map(token => token.type)).toStrictEqual(['comma', 'date']);
  });

  it('should tokenize complex query', () => {
    expect.assertions(1);

    lexer.reset('Get milk #inbox<1> @at_home<2> p2,maandag');
    const tokens: any[] = Array.from(lexer);

    expect(tokens.map(token => token.type)).toStrictEqual([
      'content',
      'pound',
      'name',
      'braceOpen',
      'tid',
      'braceClose',
      'content',
      'at',
      'name',
      'braceOpen',
      'tid',
      'braceClose',
      'content',
      'priority',
      'comma',
      'date',
    ]);
  });

  // eslint-disable-next-line jest/prefer-expect-assertions
  it.skip('should tokenize any rondom string of characters', () => {
    expect.assertions(NUMBER_OF_RUNS);

    for (let index = 0; index < NUMBER_OF_RUNS; index++) {
      lexer.reset(Chance().string({ pool: anything }));
      const tokens: any[] = Array.from(lexer);

      expect(() => tokens.map(token => token.type)).not.toThrow();
    }
  });
});
