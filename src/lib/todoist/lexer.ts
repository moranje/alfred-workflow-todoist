import moo from 'moo';

import settingsStore from '@/lib/stores/settings-store';

const FILTER_WRAPPER = settingsStore().get('filter_wrapper', '"');
const NAME = /[^\s<][^\n<]*/;
const NAME_BRACKETS = /[^\s<][^\n\]]*/;

export default moo.states({
  main: {
    content: moo.fallback,

    pound: { match: /#/, push: 'project' },
    at: { match: /@/, push: 'label' },
    doubleExclamation: { match: /!!/, push: 'priority' },
    colon: { match: /::/, push: 'section' },
    comma: { match: /,/, push: 'date' },
    filterStart: { match: new RegExp(`${FILTER_WRAPPER}`), push: 'filter' },
    priority: /p[1-4]/,
  },

  project: {
    bracketOpen: { match: /\[/, next: 'insideBrackets' },
    braceOpen: { match: /</, next: 'tid' },
    name: NAME,
  },

  label: {
    braceOpen: { match: /</, next: 'tid' },
    name: NAME,
  },

  priority: {
    number: { match: /[1-4]/, pop: 1 },
  },

  section: {
    bracketOpen: { match: /\[/, next: 'insideBrackets' },
    braceOpen: { match: /</, next: 'tid' },
    name: NAME,
  },

  date: {
    date: { match: /.+$/, pop: 1 },
  },

  filter: {
    filterEnd: { match: new RegExp(`${FILTER_WRAPPER}`), pop: 1 },
    filter: new RegExp(`[^${FILTER_WRAPPER}\n]+`),
  },

  insideBrackets: {
    bracketClose: { match: /]/, next: 'closed' },
    name: NAME_BRACKETS,
  },

  closed: {
    braceOpen: { match: /</, next: 'tid' },
  },

  tid: {
    braceClose: { match: />/, pop: 1 },
    tid: /\d+/,
  },
});
