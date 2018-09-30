import nearley from 'nearley'

import * as grammar from './grammar'
import { Task } from './task'

interface Token {
  type: string
  value: string
  toString: () => string
}

export default function(text: string) {
  const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar))

  parser.feed(text)

  return organize(parser.results)
}

function organize([results]: Token[][]) {
  // Defaults
  let tokens: { [index: string]: any } = {
    content: '<Give a name to this task>',
    labels: [],
    due_string: '',
    priority: '1'
  }

  results.forEach((token, index) => {
    if (token.type === 'content') {
      if (token.value.trim() !== '') {
        tokens.content += token.value.trim()
        tokens.content = tokens.content.replace('<Give a name to this task>', '')
      }
    } else if (token.type === 'label') {
      tokens.labels.push(token)
    } else if (token.type === 'priority') {
      tokens.priority = '' + (5 - +token.value)
    } else if (token.type === 'date') {
      tokens.due_string = token.value
    } else {
      tokens[token.type] = token
    }

    if (index === results.length - 1) {
      tokens.last = () => token
    }
  })

  return Object.assign(tokens, {
    toJSON(this: Task) {
      return {
        content: this.content,
        priority: +(this.priority || 1),
        due_string: this.due_string
      }
    }
  })
}
