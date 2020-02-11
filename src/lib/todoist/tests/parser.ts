import { ParsedTodoistTaskOptions } from '@types';

import { parser } from '@/lib/todoist/parser';

jest.mock('@/lib/stores/settings-store');

type T = ParsedTodoistTaskOptions;

describe('unit: Parser', () => {
  /**
   * Text.
   */
  it('should handle empty text', () => {
    expect.assertions(2);

    const todo = parser('') as T;

    expect(() => parser('')).not.toThrow();
    expect(todo.content).toBe('');
  });

  it('should tokenize unicode characters as text', () => {
    expect.assertions(1);

    const todo = parser('Get 🌹') as T;

    expect(`${todo.content}`).toBe('Get 🌹');
  });

  it('should parse spaces as content', () => {
    expect.assertions(2);

    const todo = parser('!!4 ') as T;

    expect(`${todo.content}`).toBe('');
    expect(todo.currentToken).toBe('content');
  });

  it('should concatenate text seperated by other tokens', () => {
    expect.assertions(1);

    const todo = parser(
      'Get milk #Work<2> while running @15min<7> and meditating'
    ) as T;

    expect(todo.content).toBe('Get milk while running and meditating');
  });

  /**
   * Project.
   */
  it('should tokenize unicode characters in projects', () => {
    expect.assertions(1);

    const todo = parser('#[🌹 Beauty]') as T;

    expect(`${todo.project?.name}`).toBe('🌹 Beauty');
  });

  it('should parse # as an empty project', () => {
    expect.assertions(2);

    const todo = parser('#') as T;

    expect(`${todo.project?.name}`).toBe('');
    expect(todo.currentToken).toBe('project');
  });

  it('should parse incomplete project notations as project', () => {
    expect.assertions(10);

    expect((parser('#Work') as T).project).toHaveProperty('name', 'Work');
    expect((parser('#Work<') as T).project).toHaveProperty('name', 'Work');
    expect((parser('#Work<3') as T).project).toHaveProperty('name', 'Work');
    expect((parser('#Work<3>') as T).project).toHaveProperty('name', 'Work');
    expect((parser('#[') as T).project).toHaveProperty('name', '');
    expect((parser('#[Work') as T).project).toHaveProperty('name', 'Work');
    expect((parser('#[Work]') as T).project).toHaveProperty('name', 'Work');
    expect((parser('#[Work]<') as T).project).toHaveProperty('name', 'Work');
    expect((parser('#[Work]<3') as T).project).toHaveProperty('name', 'Work');
    expect((parser('#[Work]<3>') as T).project).toHaveProperty('name', 'Work');
  });

  it("should throw if whitespace or '<' characters are used directly after the pound sign (project)", () => {
    expect.assertions(4);

    expect(() => parser('# ')).toThrow(
      /The character .*? is a probably a mistake/
    );
    expect(() => parser('#<')).toThrow(
      /The character .*? is a probably a mistake/
    );
    expect(() => parser('#[ ')).toThrow(
      /The character .*? is a probably a mistake/
    );
    expect(() => parser('#[<')).toThrow(
      /The character .*? is a probably a mistake/
    );
  });

  it('should throw if any non-number value follows the opening brace (project)', () => {
    expect.assertions(4);

    expect(() => parser('#Work< ')).toThrow(
      /The character .*? is a probably a mistake/
    );
    expect(() => parser('#Work<id')).toThrow(
      /The character .*? is a probably a mistake/
    );
    expect(() => parser('#[Work]< ')).toThrow(
      /The character .*? is a probably a mistake/
    );
    expect(() => parser('#[Work]<id')).toThrow(
      /The character .*? is a probably a mistake/
    );
  });

  /**
   * Labels.
   */
  it('should parse @ as an empty label', () => {
    expect.assertions(2);

    const todo = parser('@') as T;

    expect(`${todo.labels[0].name}`).toBe('');
    expect(todo.currentToken).toBe('label');
  });

  it('should parse incomplete label notations as label', () => {
    expect.assertions(4);

    const expected = { name: '15min', type: 'label' };
    expect((parser('@15min') as T).labels).toStrictEqual(
      expect.arrayContaining([expect.objectContaining(expected)])
    );
    expect((parser('@15min<') as T).labels).toStrictEqual(
      expect.arrayContaining([expect.objectContaining(expected)])
    );
    expect((parser('@15min<3') as T).labels).toStrictEqual(
      expect.arrayContaining([expect.objectContaining(expected)])
    );
    expect((parser('@15min<3>') as T).labels).toStrictEqual(
      expect.arrayContaining([expect.objectContaining(expected)])
    );
  });

  it('should parse multiple labels', () => {
    expect.assertions(2);

    const todo = parser('@15min<1> @at_home<3> @fridays<2>') as T;

    const expected = { type: 'label' };
    expect(todo.labels).toStrictEqual(
      expect.arrayContaining([expect.objectContaining(expected)])
    );
    expect(`${todo.labels?.map(label => label.name).join(',')}`).toBe(
      '15min,at_home,fridays'
    );
  });

  it("should throw if whitespace or '<' characters are used directly after the at sign (labels)", () => {
    expect.assertions(2);

    expect(() => parser('@ ')).toThrow(
      /The character .*? is a probably a mistake/
    );
    expect(() => parser('@<')).toThrow(
      /The character .*? is a probably a mistake/
    );
  });

  it('should throw if any non-number value follows the opening brace (labels)', () => {
    expect.assertions(2);

    expect(() => parser('@15min< ')).toThrow(
      /The character .*? is a probably a mistake/
    );
    expect(() => parser('@15min<id')).toThrow(
      /The character .*? is a probably a mistake/
    );
  });

  /**
   * Section.
   */
  it('should parse two consective colons as an empty section', () => {
    expect.assertions(2);

    const todo = parser('::') as T;

    expect(`${todo.section?.name}`).toBe('');
    expect(todo.currentToken).toBe('section');
  });

  it('should parse incomplete section notations as section', () => {
    expect.assertions(10);

    expect((parser('::Doing') as T).section).toHaveProperty('name', 'Doing');
    expect((parser('::Doing<') as T).section).toHaveProperty('name', 'Doing');
    expect((parser('::Doing<3') as T).section).toHaveProperty('name', 'Doing');
    expect((parser('::Doing<3>') as T).section).toHaveProperty('name', 'Doing');
    expect((parser('::[') as T).section).toHaveProperty('name', '');
    expect((parser('::[Doing') as T).section).toHaveProperty('name', 'Doing');
    expect((parser('::[Doing]') as T).section).toHaveProperty('name', 'Doing');
    expect((parser('::[Doing]<') as T).section).toHaveProperty('name', 'Doing');
    expect((parser('::[Doing]<3') as T).section).toHaveProperty(
      'name',
      'Doing'
    );
    expect((parser('::[Doing]<3>') as T).section).toHaveProperty(
      'name',
      'Doing'
    );
  });

  it("should throw if whitespace or '<' characters are used directly after the colon sign (section)", () => {
    expect.assertions(4);

    expect(() => parser(':: ')).toThrow(
      /The character .*? is a probably a mistake/
    );
    expect(() => parser('::<')).toThrow(
      /The character .*? is a probably a mistake/
    );
    expect(() => parser('::[ ')).toThrow(
      /The character .*? is a probably a mistake/
    );
    expect(() => parser('::[<')).toThrow(
      /The character .*? is a probably a mistake/
    );
  });

  it('should throw if any non-number value follows the opening brace (section)', () => {
    expect.assertions(4);

    expect(() => parser('::Doing< ')).toThrow(
      /The character .*? is a probably a mistake/
    );
    expect(() => parser('::Doing<id')).toThrow(
      /The character .*? is a probably a mistake/
    );
    expect(() => parser('::[Doing]< ')).toThrow(
      /The character .*? is a probably a mistake/
    );
    expect(() => parser('::[Doing]<id')).toThrow(
      /The character .*? is a probably a mistake/
    );
  });

  /**
   * Priority.
   */
  it('should parse double exclamations as an empty priority', () => {
    expect.assertions(2);

    const todo = parser('!!') as T;

    expect(todo.priority).toBeUndefined();
    expect(todo.currentToken).toBe('priority');
  });

  it('should parse double exclamations with number betwen 1 and 4 as project', () => {
    expect.assertions(1);

    const todo = parser('!!3') as T;

    expect(todo.priority).toBe(2);
  });

  it('should parse p-form priority', () => {
    expect.assertions(1);

    const todo = parser('p3') as T;

    expect(todo.priority).toBe(2);
  });

  it('should throw if double exclamation marks are followed by anything other than 1-4', () => {
    expect.assertions(1);

    expect(() => parser('!!5')).toThrow(
      /The character .*? is a probably a mistake/
    );
  });

  /**
   * Date.
   */
  it('should parse a single comma as an empty date string', () => {
    expect.assertions(2);

    const todo = parser(',') as T;

    expect(`${todo.date}`).toBe('');
    expect(todo.currentToken).toBe('date');
  });

  it('should parse anything after a comma as date', () => {
    expect.assertions(1);

    const todo = parser(',any time') as T;

    expect(`${todo.date}`).toBe('any time');
  });

  /**
   * Filter.
   */
  it('should parse anything starting " as an empty filter', () => {
    expect.assertions(2);

    const todo = parser('"') as T;

    expect(todo.filter).toBe('');
    expect(todo.currentToken).toBe('filter');
  });

  it('should parse an two consecutive filter quotes as a filter', () => {
    expect.assertions(2);

    const todo = parser('""') as T;

    expect(todo.filter).toBe('');
    expect(todo.currentToken).toBe('filter');
  });

  it('should parse incomplete filter notations as filter', () => {
    expect.assertions(2);

    expect((parser('"Filter') as T).filter).toBe('Filter');
    expect((parser('"Filter"') as T).filter).toBe('Filter');
  });

  /**
   * All.
   */
  it('should parse every content character as a single token', () => {
    expect.assertions(7);

    const todo = parser(
      'Get milk #[In box]<1> ::Doing<13> @at_home<2> @15min<3> p2 "This is a filter",maandag'
    ) as T;

    expect(`${todo.content}`).toBe('Get milk');
    expect(`${todo.project?.name}`).toBe('In box');
    expect(`${todo.labels?.map(label => label.name).join(',')}`).toBe(
      'at_home,15min'
    ); // Holds an array
    expect(`${todo.priority}`).toBe('3'); // Server priority
    expect(`${todo.date}`).toBe('maandag');
    expect(`${todo.section?.name}`).toBe('Doing');
    expect(`${todo.filter}`).toBe('This is a filter');
  });
});
