import lexer from '@/todoist/lexer'

describe('Unit: Lexer', () => {
  it('should tokenize every text character as a single token', () => {
    lexer.reset('Get milk')
    let tokens: any[] = Array.from(lexer)

    expect(tokens.map(token => token.type)).toEqual(['content'])
  })

  it('should tokenize project', () => {
    lexer.reset('#inbox')
    let tokens: any[] = Array.from(lexer)

    expect(tokens.map(token => token.type)).toEqual(['pound', 'name'])
  })

  it('should tokenize label', () => {
    lexer.reset('@at_home')
    let tokens: any[] = Array.from(lexer)

    expect(tokens.map(token => token.type)).toEqual(['at', 'name'])
  })

  it('should tokenize hyphenated label', () => {
    lexer.reset('@at-home')
    let tokens: any[] = Array.from(lexer)

    expect(tokens.map(token => token.type)).toEqual(['at', 'name'])
  })

  it('should tokenize priority (p1-4)', () => {
    lexer.reset('p1')
    let tokens: any[] = Array.from(lexer)

    expect(tokens.map(token => token.type)).toEqual(['priority'])
  })

  it('should tokenize priority (!!)', () => {
    lexer.reset('!!1')
    let tokens: any[] = Array.from(lexer)

    expect(tokens.map(token => token.type)).toEqual([
      'doubleExclamation',
      'number'
    ])
  })

  it('should tokenize spaces as content', () => {
    lexer.reset('!!1 ')
    let tokens: any[] = Array.from(lexer)

    expect(tokens.map(token => token.type)).toEqual([
      'doubleExclamation',
      'number',
      'content'
    ])
  })

  it('should tokenize person', () => {
    lexer.reset('+Martien')
    let tokens: any[] = Array.from(lexer)

    expect(tokens.map(token => token.type)).toEqual(['plus', 'name'])
  })

  it('should tokenize date', () => {
    lexer.reset(',maandag')
    let tokens: any[] = Array.from(lexer)

    expect(tokens.map(token => token.type)).toEqual(['comma', 'date'])
  })

  it('should tokenize complex query', () => {
    lexer.reset('Get milk #inbox @at_home p2,maandag')
    let tokens: any[] = Array.from(lexer)

    expect(tokens.map(token => token.type)).toEqual([
      'content',
      'pound',
      'name',
      'content',
      'at',
      'name',
      'content',
      'priority',
      'comma',
      'date'
    ])
  })
})
