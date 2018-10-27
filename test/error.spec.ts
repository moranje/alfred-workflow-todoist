import { AlfredError, handleError } from '@/project';

jest.mock('write-json-file', () => {
  return async (path: string, data: any) => {
    console.log(data)
  }
})

let spy: any

describe('Unit:', () => {
  beforeEach(() => {
    spy = jest.spyOn(console, 'log')
  })

  afterEach(() => {
    spy.mockReset()
  })

  describe('class AlfredError', () => {
    it('should add several env variables on creation', () => {
      let error = new AlfredError('Something is amiss')

      expect(error.ALFRED_VERSION).toBeDefined()
      expect(error.QUERY).toBeDefined()
      expect(error.OSX_VERSION).toBeDefined()
      expect(error.NODE_VERSION).toBeDefined()
      expect(error.WORKFLOW_VERSION).toBeDefined()
      expect(error instanceof Error).toBe(true)
    })

    it('should allow setting a name and a stack', () => {
      let error = new AlfredError(
        'Something is amiss',
        'Eerie error',
        'stack: line 1 not sure what to say'
      )

      expect(error.name).toBe('Eerie error')
      expect(error.stack).toBe('stack: line 1 not sure what to say')
    })
  })

  describe('function handleError()', () => {
    it('should do something', () => {
      handleError(new Error('Something is amiss'))

      let output = spy.mock.calls[0][0]
      expect(output).toMatch('Something is amiss')
    })
  })
})
