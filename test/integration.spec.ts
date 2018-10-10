import { TodoistWorkflow } from '@/workflow/todoist-workflow'

jest.mock('@/workflow/files')
jest.mock('write-json-file', () => {
  return (path: string, data: any) => {
    console.log(data)
    return {
      then: () => ({ catch: () => ({}) })
    }
  }
})

let spy: any

describe('Integration:', () => {
  beforeEach(() => {
    spy = jest.spyOn(console, 'log')
  })

  afterEach(() => {
    spy.mockReset()
  })

  describe('Find task(s)', () => {
    it('should find tasks from cache', async () => {
      await TodoistWorkflow().read()

      let items = JSON.parse(spy.mock.calls[0][0]).items
      expect(items[0].title).toBe('COMPLETE: Get milk')
      expect(items[1].title).toBe('COMPLETE: Plan a thing')
      expect(items[2].title).toBe('COMPLETE: Buy the thing')
      expect(items[3].title).toBe('COMPLETE: Sign up for dance class')
      expect(items[4].title).toBe('COMPLETE: Project review')
    })

    it('should filter tasks based on query', async () => {
      await TodoistWorkflow().read('thing')

      let items = JSON.parse(spy.mock.calls[0][0]).items
      expect(items[0].title).toBe('COMPLETE: Plan a thing')
      expect(items[1].title).toBe('COMPLETE: Buy the thing')
      expect(items).toHaveLength(2)
    })
  })

  describe('Create task', () => {
    it('should return a parsed JSON response', () => {
      let query = 'Get milk @15min @at_home #Stuff p1, tomorrow'
      TodoistWorkflow().create(query)

      let items = JSON.parse(spy.mock.calls[0][0]).items
      expect(JSON.parse(items[0].arg)).toEqual({
        content: 'Get milk',
        due_string: 'tomorrow',
        priority: 4
      })
    })
  })

  // describe('Submit task', () => {})

  // describe('Remove task', () => {})

  describe('Find settings', () => {
    it('should list all relevent settings', () => {
      TodoistWorkflow().settings()
      let items = JSON.parse(spy.mock.calls[0][0]).items

      // Should list 5 settings even though there only 4 in the mock
      expect(items[0].title).toBe('SETTING: token')
      expect(items[1].title).toBe('SETTING: language')
      expect(items[2].title).toBe('SETTING: max_items')
      expect(items[3].title).toBe('SETTING: cache_timeout')
      expect(items[4].title).toBe('SETTING: anonymous_statistics')
    })
  })

  describe('Select setting', () => {
    it('should edit token setting', () => {
      TodoistWorkflow().editSetting('token', '0123456789abcde0123456789abcde0123456789')
      let items = JSON.parse(spy.mock.calls[0][0]).items
      let response = JSON.parse(items[0].arg)

      expect(response.value).toBe('0123456789abcde0123456789abcde0123456789')
    })

    it('should edit language setting', () => {
      TodoistWorkflow().editSetting('language', 'nl')
      let items = JSON.parse(spy.mock.calls[0][0]).items
      let response = JSON.parse(items[0].arg)

      expect(response.value).toBe('nl')
    })

    it('should edit token setting', () => {
      TodoistWorkflow().editSetting('max_items', 13)
      let items = JSON.parse(spy.mock.calls[0][0]).items
      let response = JSON.parse(items[0].arg)

      expect(response.value).toBe(13)
    })

    it('should edit cache_timeout setting', () => {
      TodoistWorkflow().editSetting('cache_timeout', 13)
      let items = JSON.parse(spy.mock.calls[0][0]).items
      let response = JSON.parse(items[0].arg)

      expect(response.value).toBe(13)
    })

    it('should edit anonymous_statistics setting', () => {
      TodoistWorkflow().editSetting('anonymous_statistics', false)
      let items = JSON.parse(spy.mock.calls[0][0]).items
      let response = JSON.parse(items[1].arg)

      expect(response.value).toBe(false)
    })
  })

  describe('Store setting', () => {
    it('should store a token setting back to disk', () => {
      TodoistWorkflow().storeSetting({
        key: 'token',
        value: '0123456789abcde0123456789abcde0123456789'
      })
      let response = spy.mock.calls[0][0]

      expect(response.token).toEqual('0123456789abcde0123456789abcde0123456789')
    })

    it('should store a langauge setting back to disk', () => {
      TodoistWorkflow().storeSetting({
        key: 'langauge',
        value: 'nl'
      })
      let response = spy.mock.calls[0][0]

      expect(response.langauge).toEqual('nl')
    })

    it('should store a max_items setting back to disk', () => {
      TodoistWorkflow().storeSetting({
        key: 'max_items',
        value: 3
      })
      let response = spy.mock.calls[0][0]

      expect(response.max_items).toEqual(3)
    })

    it('should store a cache_timeout setting back to disk', () => {
      TodoistWorkflow().storeSetting({
        key: 'cache_timeout',
        value: 13
      })
      let response = spy.mock.calls[0][0]

      expect(response.cache_timeout).toEqual(13)
    })

    it('should store a anonymous_statistics setting back to disk', () => {
      TodoistWorkflow().storeSetting({
        key: 'anonymous_statistics',
        value: false
      })
      let response = spy.mock.calls[0][0]

      expect(response.anonymous_statistics).toEqual(false)
    })
  })
})
