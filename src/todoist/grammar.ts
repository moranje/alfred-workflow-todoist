// Generated automatically by nearley, version 2.15.1
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
import lexer from '@/todoist/lexer'

function id(d: any[]): any {
  return d[0]
}
declare var pound: any
declare var name: any
declare var open: any
declare var close: any
declare var at: any
declare var priority: any
declare var doubleExclamation: any
declare var number: any
declare var plus: any
declare var comma: any
declare var date: any
declare var content: any
export interface Token {
  value: any
  [key: string]: any
}

export interface Lexer {
  reset: (chunk: string, info: any) => void
  next: () => Token | undefined
  save: () => any
  formatError: (token: Token) => string
  has: (tokenType: string) => boolean
}

export interface NearleyRule {
  name: string
  symbols: NearleySymbol[]
  postprocess?: (d: any[], loc?: number, reject?: {}) => any
}

export type NearleySymbol = string | { literal: any } | { test: (token: any) => boolean }

export let Lexer = lexer

export let ParserRules: NearleyRule[] = [
  { name: 'Query$ebnf$1', symbols: [] },
  { name: 'Query$ebnf$1$subexpression$1', symbols: ['Element', 'Content'] },
  {
    name: 'Query$ebnf$1',
    symbols: ['Query$ebnf$1', 'Query$ebnf$1$subexpression$1'],
    postprocess: d => d[0].concat([d[1]])
  },
  {
    name: 'Query',
    symbols: ['Content', 'Query$ebnf$1'],
    postprocess: ([first, rest]) => {
      return [first, ...[].concat(...rest)].filter(el => el)
    }
  },
  { name: 'Element', symbols: ['Project'], postprocess: id },
  { name: 'Element', symbols: ['Label'], postprocess: id },
  { name: 'Element', symbols: ['Priority'], postprocess: id },
  { name: 'Element', symbols: ['Person'], postprocess: id },
  { name: 'Element', symbols: ['Date'], postprocess: id },
  {
    name: 'Project',
    symbols: [
      lexer.has('pound') ? { type: 'pound' } : pound,
      lexer.has('name') ? { type: 'name' } : name
    ],
    postprocess: ([_, name]) => {
      return {
        name: name.value,
        type: 'project',
        toString() {
          return `${this.name}`
        }
      }
    }
  },
  {
    name: 'Project',
    symbols: [
      lexer.has('pound') ? { type: 'pound' } : pound,
      lexer.has('open') ? { type: 'open' } : open,
      lexer.has('name') ? { type: 'name' } : name,
      lexer.has('close') ? { type: 'close' } : close
    ],
    postprocess: ([_, __, name]) => {
      return {
        name: name.value,
        type: 'project',
        toString() {
          return `${this.name}`
        }
      }
    }
  },
  {
    name: 'Project',
    symbols: [
      lexer.has('pound') ? { type: 'pound' } : pound,
      lexer.has('open') ? { type: 'open' } : open,
      lexer.has('name') ? { type: 'name' } : name
    ],
    postprocess: ([_, __, name]) => {
      return {
        name: name.value,
        type: 'project',
        toString() {
          return `${this.name}`
        }
      }
    }
  },
  {
    name: 'Project',
    symbols: [
      lexer.has('pound') ? { type: 'pound' } : pound,
      lexer.has('open') ? { type: 'open' } : open
    ],
    postprocess: ([_, __]) => {
      return {
        name: '',
        type: 'project',
        toString() {
          return `${this.name}`
        }
      }
    }
  },
  {
    name: 'Project',
    symbols: [lexer.has('pound') ? { type: 'pound' } : pound],
    postprocess: ([_]) => {
      return {
        name: '',
        type: 'project',
        toString() {
          return `${this.name}`
        }
      }
    }
  },
  {
    name: 'Label',
    symbols: [lexer.has('at') ? { type: 'at' } : at, lexer.has('name') ? { type: 'name' } : name],
    postprocess: ([_, label]) => {
      return {
        name: label.value,
        type: 'label',
        toString() {
          return `${this.name}`
        }
      }
    }
  },
  {
    name: 'Label',
    symbols: [lexer.has('at') ? { type: 'at' } : at],
    postprocess: ([_]) => {
      return {
        name: '',
        type: 'label',
        toString() {
          return `${this.name}`
        }
      }
    }
  },
  {
    name: 'Priority',
    symbols: [lexer.has('priority') ? { type: 'priority' } : priority],
    postprocess: ([priority]) => {
      return {
        value: priority.value.substring(1),
        type: 'priority',
        toString() {
          return `${this.value}`
        }
      }
    }
  },
  {
    name: 'Priority',
    symbols: [
      lexer.has('doubleExclamation') ? { type: 'doubleExclamation' } : doubleExclamation,
      lexer.has('number') ? { type: 'number' } : number
    ],
    postprocess: ([_, priority]) => {
      return {
        value: priority.value,
        type: 'priority',
        toString() {
          return `${this.value}`
        }
      }
    }
  },
  {
    name: 'Priority',
    symbols: [lexer.has('doubleExclamation') ? { type: 'doubleExclamation' } : doubleExclamation],
    postprocess: ([_]) => {
      return {
        value: '4',
        type: 'priority',
        toString() {
          return `${this.value}`
        }
      }
    }
  },
  {
    name: 'Person',
    symbols: [
      lexer.has('plus') ? { type: 'plus' } : plus,
      lexer.has('name') ? { type: 'name' } : name
    ],
    postprocess: ([_, person]) => {
      return {
        name: person.value,
        type: 'person',
        toString() {
          return `${this.name}`
        }
      }
    }
  },
  {
    name: 'Person',
    symbols: [lexer.has('plus') ? { type: 'plus' } : plus],
    postprocess: ([_]) => {
      return {
        name: '',
        type: 'person',
        toString() {
          return `${this.name}`
        }
      }
    }
  },
  {
    name: 'Date',
    symbols: [
      lexer.has('comma') ? { type: 'comma' } : comma,
      lexer.has('date') ? { type: 'date' } : date
    ],
    postprocess: ([_, date]) => {
      return {
        value: date.value.trim(),
        type: 'date',
        toString() {
          return `${this.value}`
        }
      }
    }
  },
  {
    name: 'Date',
    symbols: [lexer.has('comma') ? { type: 'comma' } : comma],
    postprocess: ([_]) => {
      return {
        value: '',
        type: 'date',
        toString() {
          return `${this.value}`
        }
      }
    }
  },
  { name: 'Content$ebnf$1', symbols: [] },
  {
    name: 'Content$ebnf$1',
    symbols: ['Content$ebnf$1', 'ContentPartial'],
    postprocess: d => d[0].concat([d[1]])
  },
  {
    name: 'Content',
    symbols: ['Content$ebnf$1'],
    postprocess: ([text]) => {
      if (text[0] == null) {
        return null
      }

      return {
        type: 'content',
        value: text.map((partial: any) => partial.value).join(''),
        toString() {
          return `${this.value}`
        }
      }
    }
  },
  {
    name: 'ContentPartial',
    symbols: [lexer.has('content') ? { type: 'content' } : content],
    postprocess: id
  }
]

export let ParserStart: string = 'Query'
