// @ts-nocheck
// Generated automatically by nearley, version 2.19.0
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d: any[]): any {
  return d[0];
}
declare var pound: any;
declare var name: any;
declare var braceOpen: any;
declare var tid: any;
declare var braceClose: any;
declare var bracketOpen: any;
declare var bracketClose: any;
declare var at: any;
declare var priority: any;
declare var doubleExclamation: any;
declare var number: any;
declare var colon: any;
declare var comma: any;
declare var date: any;
declare var filterStart: any;
declare var filter: any;
declare var filterEnd: any;
declare var content: any;
import lexer from '@/lib/todoist/lexer';
interface NearleyToken {
  value: any;
  [key: string]: any;
}

interface NearleyLexer {
  reset: (chunk: string, info: any) => void;
  next: () => NearleyToken | undefined;
  save: () => any;
  formatError: (token: NearleyToken) => string;
  has: (tokenType: string) => boolean;
}

interface NearleyRule {
  name: string;
  symbols: NearleySymbol[];
  postprocess?: (d: any[], loc?: number, reject?: {}) => any;
}

type NearleySymbol =
  | string
  | { literal: any }
  | { test: (token: any) => boolean };

interface Grammar {
  Lexer: NearleyLexer | undefined;
  ParserRules: NearleyRule[];
  ParserStart: string;
}

const grammar: Grammar = {
  Lexer: lexer,
  ParserRules: [
    { name: 'Query$ebnf$1', symbols: [] },
    { name: 'Query$ebnf$1$subexpression$1', symbols: ['Element', 'Content'] },
    {
      name: 'Query$ebnf$1',
      symbols: ['Query$ebnf$1', 'Query$ebnf$1$subexpression$1'],
      postprocess: d => d[0].concat([d[1]]),
    },
    {
      name: 'Query',
      symbols: ['Content', 'Query$ebnf$1'],
      postprocess: ([first, rest]) => {
        return [first, ...[].concat(...rest)].filter(el => el);
      },
    },
    { name: 'Element', symbols: ['Project'], postprocess: id },
    { name: 'Element', symbols: ['Label'], postprocess: id },
    { name: 'Element', symbols: ['Priority'], postprocess: id },
    { name: 'Element', symbols: ['Date'], postprocess: id },
    { name: 'Element', symbols: ['Section'], postprocess: id },
    { name: 'Element', symbols: ['Filter'], postprocess: id },
    {
      name: 'Project',
      symbols: [
        lexer.has('pound') ? { type: 'pound' } : pound,
        lexer.has('name') ? { type: 'name' } : name,
        lexer.has('braceOpen') ? { type: 'braceOpen' } : braceOpen,
        lexer.has('tid') ? { type: 'tid' } : tid,
        lexer.has('braceClose') ? { type: 'braceClose' } : braceClose,
      ],
      postprocess: ([_, name, __, id]) => {
        return {
          name: name.value,
          type: 'project',
          id: +id.value,
        };
      },
    },
    {
      name: 'Project',
      symbols: [
        lexer.has('pound') ? { type: 'pound' } : pound,
        lexer.has('name') ? { type: 'name' } : name,
        lexer.has('braceOpen') ? { type: 'braceOpen' } : braceOpen,
        lexer.has('tid') ? { type: 'tid' } : tid,
      ],
      postprocess: ([_, name, __, id]) => {
        return {
          name: name.value,
          type: 'project',
          id: +id.value,
        };
      },
    },
    {
      name: 'Project',
      symbols: [
        lexer.has('pound') ? { type: 'pound' } : pound,
        lexer.has('name') ? { type: 'name' } : name,
        lexer.has('braceOpen') ? { type: 'braceOpen' } : braceOpen,
      ],
      postprocess: ([_, name]) => {
        return {
          name: name.value,
          type: 'project',
          id: null,
        };
      },
    },
    {
      name: 'Project',
      symbols: [
        lexer.has('pound') ? { type: 'pound' } : pound,
        lexer.has('name') ? { type: 'name' } : name,
      ],
      postprocess: ([_, name]) => {
        return {
          name: name.value,
          type: 'project',
          id: null,
        };
      },
    },
    {
      name: 'Project',
      symbols: [
        lexer.has('pound') ? { type: 'pound' } : pound,
        lexer.has('bracketOpen') ? { type: 'bracketOpen' } : bracketOpen,
        lexer.has('name') ? { type: 'name' } : name,
        lexer.has('bracketClose') ? { type: 'bracketClose' } : bracketClose,
        lexer.has('braceOpen') ? { type: 'braceOpen' } : braceOpen,
        lexer.has('tid') ? { type: 'tid' } : tid,
        lexer.has('braceClose') ? { type: 'braceClose' } : braceClose,
      ],
      postprocess: ([_, __, name, ___, id]) => {
        return {
          name: name.value,
          type: 'project',
          id: +id.value,
        };
      },
    },
    {
      name: 'Project',
      symbols: [
        lexer.has('pound') ? { type: 'pound' } : pound,
        lexer.has('bracketOpen') ? { type: 'bracketOpen' } : bracketOpen,
        lexer.has('name') ? { type: 'name' } : name,
        lexer.has('bracketClose') ? { type: 'bracketClose' } : bracketClose,
        lexer.has('braceOpen') ? { type: 'braceOpen' } : braceOpen,
        lexer.has('tid') ? { type: 'tid' } : tid,
      ],
      postprocess: ([_, __, name, ___, id]) => {
        return {
          name: name.value,
          type: 'project',
          id: +id.value,
        };
      },
    },
    {
      name: 'Project',
      symbols: [
        lexer.has('pound') ? { type: 'pound' } : pound,
        lexer.has('bracketOpen') ? { type: 'bracketOpen' } : bracketOpen,
        lexer.has('name') ? { type: 'name' } : name,
        lexer.has('bracketClose') ? { type: 'bracketClose' } : bracketClose,
        lexer.has('braceOpen') ? { type: 'braceOpen' } : braceOpen,
      ],
      postprocess: ([_, __, name]) => {
        return {
          name: name.value,
          type: 'project',
          id: null,
        };
      },
    },
    {
      name: 'Project',
      symbols: [
        lexer.has('pound') ? { type: 'pound' } : pound,
        lexer.has('bracketOpen') ? { type: 'bracketOpen' } : bracketOpen,
        lexer.has('name') ? { type: 'name' } : name,
        lexer.has('bracketClose') ? { type: 'bracketClose' } : bracketClose,
      ],
      postprocess: ([_, __, name]) => {
        return {
          name: name.value,
          type: 'project',
          id: null,
        };
      },
    },
    {
      name: 'Project',
      symbols: [
        lexer.has('pound') ? { type: 'pound' } : pound,
        lexer.has('bracketOpen') ? { type: 'bracketOpen' } : bracketOpen,
        lexer.has('name') ? { type: 'name' } : name,
      ],
      postprocess: ([_, __, name]) => {
        return {
          name: name.value,
          type: 'project',
          id: null,
        };
      },
    },
    {
      name: 'Project',
      symbols: [
        lexer.has('pound') ? { type: 'pound' } : pound,
        lexer.has('bracketOpen') ? { type: 'bracketOpen' } : bracketOpen,
      ],
      postprocess: ([_, __]) => {
        return {
          name: '',
          type: 'project',
          id: null,
        };
      },
    },
    {
      name: 'Project',
      symbols: [lexer.has('pound') ? { type: 'pound' } : pound],
      postprocess: () => {
        return {
          name: '',
          type: 'project',
          id: null,
        };
      },
    },
    {
      name: 'Label',
      symbols: [
        lexer.has('at') ? { type: 'at' } : at,
        lexer.has('name') ? { type: 'name' } : name,
        lexer.has('braceOpen') ? { type: 'braceOpen' } : braceOpen,
        lexer.has('tid') ? { type: 'tid' } : tid,
        lexer.has('braceClose') ? { type: 'braceClose' } : braceClose,
      ],
      postprocess: ([_, name, __, id]) => {
        return {
          name: name.value,
          type: 'label',
          id: +id.value,
        };
      },
    },
    {
      name: 'Label',
      symbols: [
        lexer.has('at') ? { type: 'at' } : at,
        lexer.has('name') ? { type: 'name' } : name,
        lexer.has('braceOpen') ? { type: 'braceOpen' } : braceOpen,
        lexer.has('tid') ? { type: 'tid' } : tid,
      ],
      postprocess: ([_, name, __, id]) => {
        return {
          name: name.value,
          type: 'label',
          id: +id.value,
        };
      },
    },
    {
      name: 'Label',
      symbols: [
        lexer.has('at') ? { type: 'at' } : at,
        lexer.has('name') ? { type: 'name' } : name,
        lexer.has('braceOpen') ? { type: 'braceOpen' } : braceOpen,
      ],
      postprocess: ([_, name]) => {
        return {
          name: name.value,
          type: 'label',
          id: null,
        };
      },
    },
    {
      name: 'Label',
      symbols: [
        lexer.has('at') ? { type: 'at' } : at,
        lexer.has('name') ? { type: 'name' } : name,
      ],
      postprocess: ([_, name]) => {
        return {
          name: name.value,
          type: 'label',
          id: null,
        };
      },
    },
    {
      name: 'Label',
      symbols: [lexer.has('at') ? { type: 'at' } : at],
      postprocess: () => {
        return {
          name: '',
          type: 'label',
          id: null,
        };
      },
    },
    {
      name: 'Priority',
      symbols: [lexer.has('priority') ? { type: 'priority' } : priority],
      postprocess: ([priority]) => {
        return {
          priority: +priority.value.substring(1),
          type: 'priority',
        };
      },
    },
    {
      name: 'Priority',
      symbols: [
        lexer.has('doubleExclamation')
          ? { type: 'doubleExclamation' }
          : doubleExclamation,
        lexer.has('number') ? { type: 'number' } : number,
      ],
      postprocess: ([_, number]) => {
        return {
          priority: +number.value,
          type: 'priority',
        };
      },
    },
    {
      name: 'Priority',
      symbols: [
        lexer.has('doubleExclamation')
          ? { type: 'doubleExclamation' }
          : doubleExclamation,
      ],
      postprocess: () => {
        return {
          priority: undefined,
          type: 'priority',
        };
      },
    },
    {
      name: 'Section',
      symbols: [
        lexer.has('colon') ? { type: 'colon' } : colon,
        lexer.has('name') ? { type: 'name' } : name,
        lexer.has('braceOpen') ? { type: 'braceOpen' } : braceOpen,
        lexer.has('tid') ? { type: 'tid' } : tid,
        lexer.has('braceClose') ? { type: 'braceClose' } : braceClose,
      ],
      postprocess: ([_, name, __, id]) => {
        return {
          name: name.value,
          type: 'section',
          id: +id.value,
        };
      },
    },
    {
      name: 'Section',
      symbols: [
        lexer.has('colon') ? { type: 'colon' } : colon,
        lexer.has('name') ? { type: 'name' } : name,
        lexer.has('braceOpen') ? { type: 'braceOpen' } : braceOpen,
        lexer.has('tid') ? { type: 'tid' } : tid,
      ],
      postprocess: ([_, name, __, id]) => {
        return {
          name: name.value,
          type: 'section',
          id: +id.value,
        };
      },
    },
    {
      name: 'Section',
      symbols: [
        lexer.has('colon') ? { type: 'colon' } : colon,
        lexer.has('name') ? { type: 'name' } : name,
        lexer.has('braceOpen') ? { type: 'braceOpen' } : braceOpen,
      ],
      postprocess: ([_, name]) => {
        return {
          name: name.value,
          type: 'section',
          id: null,
        };
      },
    },
    {
      name: 'Section',
      symbols: [
        lexer.has('colon') ? { type: 'colon' } : colon,
        lexer.has('name') ? { type: 'name' } : name,
      ],
      postprocess: ([_, name]) => {
        return {
          name: name.value,
          type: 'section',
          id: null,
        };
      },
    },
    {
      name: 'Section',
      symbols: [
        lexer.has('colon') ? { type: 'colon' } : colon,
        lexer.has('bracketOpen') ? { type: 'bracketOpen' } : bracketOpen,
        lexer.has('name') ? { type: 'name' } : name,
        lexer.has('bracketClose') ? { type: 'bracketClose' } : bracketClose,
        lexer.has('braceOpen') ? { type: 'braceOpen' } : braceOpen,
        lexer.has('tid') ? { type: 'tid' } : tid,
        lexer.has('braceClose') ? { type: 'braceClose' } : braceClose,
      ],
      postprocess: ([_, __, name, ___, id]) => {
        return {
          name: name.value,
          type: 'section',
          id: +id.value,
        };
      },
    },
    {
      name: 'Section',
      symbols: [
        lexer.has('colon') ? { type: 'colon' } : colon,
        lexer.has('bracketOpen') ? { type: 'bracketOpen' } : bracketOpen,
        lexer.has('name') ? { type: 'name' } : name,
        lexer.has('bracketClose') ? { type: 'bracketClose' } : bracketClose,
        lexer.has('braceOpen') ? { type: 'braceOpen' } : braceOpen,
        lexer.has('tid') ? { type: 'tid' } : tid,
      ],
      postprocess: ([_, __, name, ___, id]) => {
        return {
          name: name.value,
          type: 'section',
          id: +id.value,
        };
      },
    },
    {
      name: 'Section',
      symbols: [
        lexer.has('colon') ? { type: 'colon' } : colon,
        lexer.has('bracketOpen') ? { type: 'bracketOpen' } : bracketOpen,
        lexer.has('name') ? { type: 'name' } : name,
        lexer.has('bracketClose') ? { type: 'bracketClose' } : bracketClose,
        lexer.has('braceOpen') ? { type: 'braceOpen' } : braceOpen,
      ],
      postprocess: ([_, __, name]) => {
        return {
          name: name.value,
          type: 'section',
          id: null,
        };
      },
    },
    {
      name: 'Section',
      symbols: [
        lexer.has('colon') ? { type: 'colon' } : colon,
        lexer.has('bracketOpen') ? { type: 'bracketOpen' } : bracketOpen,
        lexer.has('name') ? { type: 'name' } : name,
        lexer.has('bracketClose') ? { type: 'bracketClose' } : bracketClose,
      ],
      postprocess: ([_, __, name]) => {
        return {
          name: name.value,
          type: 'section',
          id: null,
        };
      },
    },
    {
      name: 'Section',
      symbols: [
        lexer.has('colon') ? { type: 'colon' } : colon,
        lexer.has('bracketOpen') ? { type: 'bracketOpen' } : bracketOpen,
        lexer.has('name') ? { type: 'name' } : name,
      ],
      postprocess: ([_, __, name]) => {
        return {
          name: name.value,
          type: 'section',
          id: null,
        };
      },
    },
    {
      name: 'Section',
      symbols: [
        lexer.has('colon') ? { type: 'colon' } : colon,
        lexer.has('bracketOpen') ? { type: 'bracketOpen' } : bracketOpen,
      ],
      postprocess: ([_, __]) => {
        return {
          name: '',
          type: 'section',
          id: null,
        };
      },
    },
    {
      name: 'Section',
      symbols: [lexer.has('colon') ? { type: 'colon' } : colon],
      postprocess: () => {
        return {
          name: '',
          type: 'section',
          id: null,
        };
      },
    },
    {
      name: 'Date',
      symbols: [
        lexer.has('comma') ? { type: 'comma' } : comma,
        lexer.has('date') ? { type: 'date' } : date,
      ],
      postprocess: ([_, date]) => {
        return {
          value: date.value.trim(),
          type: 'date',
        };
      },
    },
    {
      name: 'Date',
      symbols: [lexer.has('comma') ? { type: 'comma' } : comma],
      postprocess: () => {
        return {
          value: '',
          type: 'date',
        };
      },
    },
    {
      name: 'Filter',
      symbols: [
        lexer.has('filterStart') ? { type: 'filterStart' } : filterStart,
        lexer.has('filter') ? { type: 'filter' } : filter,
        lexer.has('filterEnd') ? { type: 'filterEnd' } : filterEnd,
      ],
      postprocess: ([_, filter]) => {
        return {
          value: filter.value,
          type: 'filter',
        };
      },
    },
    {
      name: 'Filter',
      symbols: [
        lexer.has('filterStart') ? { type: 'filterStart' } : filterStart,
        lexer.has('filter') ? { type: 'filter' } : filter,
      ],
      postprocess: ([_, filter]) => {
        return {
          value: filter.value,
          type: 'filter',
        };
      },
    },
    {
      name: 'Filter',
      symbols: [
        lexer.has('filterStart') ? { type: 'filterStart' } : filterStart,
        lexer.has('filterEnd') ? { type: 'filterEnd' } : filterEnd,
      ],
      postprocess: () => {
        return {
          value: '',
          type: 'filter',
        };
      },
    },
    {
      name: 'Filter',
      symbols: [
        lexer.has('filterStart') ? { type: 'filterStart' } : filterStart,
      ],
      postprocess: () => {
        return {
          value: '',
          type: 'filter',
        };
      },
    },
    { name: 'Content$ebnf$1', symbols: [] },
    {
      name: 'Content$ebnf$1',
      symbols: ['Content$ebnf$1', 'ContentPartial'],
      postprocess: d => d[0].concat([d[1]]),
    },
    {
      name: 'Content',
      symbols: ['Content$ebnf$1'],
      postprocess: ([text]) => {
        if (text[0] == null) {
          return null;
        }

        return {
          value: text.map((partial: any) => partial.value).join(''),
          type: 'content',
        };
      },
    },
    {
      name: 'ContentPartial',
      symbols: [lexer.has('content') ? { type: 'content' } : content],
      postprocess: id,
    },
  ],
  ParserStart: 'Query',
};

export default grammar;
