import moo from 'moo';

/** @hidden */
const lexer = moo.states({
  main: {
    // @ts-ignore: not yet in typescript definition
    content: moo.fallback,

    pound: { match: /#/, push: 'project' },
    at: { match: /@/, push: 'label' },
    doubleExclamation: { match: /!!/, push: 'priority' },
    plus: { match: /\+/, push: 'person' },
    comma: { match: /,/, push: 'date' },
    priority: /p[1-4]/
  },

  project: {
    open: { match: /\[/, next: 'projectWithSpaces' },
    name: { match: /[a-zA-Z0-9_-]+/, pop: 1 }
  },

  projectWithSpaces: {
    close: { match: /\]/, pop: 1 },
    name: /[a-zA-Z0-9_ -]+/
  },

  label: {
    name: { match: /[a-zA-Z0-9_-]+/, pop: 1 }
  },

  priority: {
    number: { match: /[1-4]/, pop: 1 }
  },

  person: {
    name: { match: /[a-zA-Z0-9_-]+/, pop: 1 }
  },

  date: {
    date: { match: /.+/, pop: 1 }
  }
})

export default lexer
