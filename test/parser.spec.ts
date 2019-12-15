import { parser } from '@/todoist/parser';

describe('Unit: Parser', () => {
  it('should parse every content character as a single token', () => {
    const ast = parser(
      'Get milk #[In box] @at_home @15min p2 +Martien,maandag'
    );

    expect(`${ast.content}`).toBe('Get milk');
    expect(`${ast.project}`).toBe('In box');
    expect(`${ast.labels}`).toBe('at_home,15min');
    expect(`${ast.priority}`).toBe('3'); // Server priority
    expect(`${ast.due_string}`).toBe('maandag');
    expect(`${ast.person}`).toBe('Martien');
  });

  it('should parse single exclamation character as content', () => {
    const ast = parser('!');

    expect(`${ast.content}`).toBe('!');
    expect(`${ast.priority}`).toBe('1'); // default server priority
  });

  it('should parse double exclamations as priority', () => {
    const ast = parser('!!');

    expect(`${ast.last('type')}`).toBe('priority');
  });

  it('should parse spaces as content', () => {
    const ast = parser('!!4 ');

    expect(`${ast.content}`).toBe('<Give a name to this task>');
    expect(`${ast.last('type')}`).toBe('content');
  });

  it('should parse @ as label', () => {
    const ast = parser('@');

    expect(`${ast.labels}`).toBe('');
    expect(`${ast.last('type')}`).toBe('label');
  });
});
