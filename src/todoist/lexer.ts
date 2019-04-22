import moo from 'moo'
import escape from 'escape-string-regexp'

// tslint:disable: no-empty-character-class

/** @hidden */
const ALL_SCRIPTS = /(?:\p{Letter}|\p{Number})+/u
/** @hidden */
const SEPARATORS = new RegExp(`(?:${ALL_SCRIPTS.source}|_|-)+`, 'u')
/** @hidden */
const WHITESPACE = new RegExp(`(?:${ALL_SCRIPTS.source}|_| |-)+`, 'u')

/** @hidden */
const lexer = moo.states({
  main: {
    // @ts-ignore: not yet in typescript definition
    content: moo.fallback,

    pound: { match: /#/u, push: 'project' },
    at: { match: /@/u, push: 'label' },
    doubleExclamation: { match: /!!/u, push: 'priority' },
    plus: { match: /\+/u, push: 'person' },
    comma: { match: /,/u, push: 'date' },
    priority: /p[1-4]/u
  },

  project: {
    open: { match: /\[/u, next: 'projectWithSpaces' },
    name: { match: SEPARATORS, pop: 1 }
  },

  projectWithSpaces: {
    close: { match: /\]/u, pop: 1 },
    name: WHITESPACE
  },

  label: {
    name: { match: SEPARATORS, pop: 1 }
  },

  priority: {
    number: { match: /[1-4]/u, pop: 1 }
  },

  person: {
    name: { match: SEPARATORS, pop: 1 }
  },

  date: {
    date: { match: /.+/u, pop: 1 }
  }
})

export default lexer
