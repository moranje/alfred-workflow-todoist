import * as grammar from '@/todoist/grammar';
import nearley from 'nearley';

/**
 * Parse a string.
 *
 * @param {string} text
 * @returns The parsed blocks of the string
 */
export function parser(text: string): todoist.Parsed {
  const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar))

  parser.feed(text)

  return organize(parser.results)
}

/**
 * @hidden
 */
function organize([results]: todoist.Token[][]): todoist.Parsed {
  // Defaults
  let tokens: todoist.Parsed = {
    content: '<Give a name to this task>',
    labels: [],
    priority: '1',
    last(key?: 'type' | 'value') {
      if (key && results[results.length - 1] && results[results.length - 1][key]) {
        return results[results.length - 1][key]
      }

      return results[results.length - 1] || []
    },
    toJSON(this: todoist.Task) {
      return {
        content: this.content,
        priority: +(this.priority || 1),
        due_string: this.due_string || void 0,
        project: this.project ? `${this.project}` : void 0,
        project_id: this.project_id,
        labels:
          this.labels && this.labels.length > 0 ? this.labels.map(label => `${label}`) : void 0,
        label_ids: this.label_ids && this.label_ids.length > 0 ? this.label_ids : void 0
      }
    }
  }

  results.forEach(token => {
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
  })

  return tokens
}
