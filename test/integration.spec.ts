import './helpers/nock-requests'
import { cache, Command, FILES } from '@/project'

jest.mock('@/project/references')
jest.mock('@/project/files')


jest.mock('write-json-file', () => {
  return async (path: string, data: any) => {
    console.log(data)
  }
})

let spy: any

describe('Integration:', () => {
  beforeEach(() => {
    spy = jest.spyOn(console, 'log')
    cache.load(FILES.cache)
  })

  afterEach(() => {
    spy.mockReset()
    cache.reset()
  })

  describe('Find task(s)', () => {
    it('should find tasks from cache', async () => {
      expect.assertions(5)
      await Command().read()

      let items = JSON.parse(spy.mock.calls[0][0]).items
      expect(items[0].title).toBe('COMPLETE: Get milk')
      expect(items[1].title).toBe('COMPLETE: Plan a thing')
      expect(items[2].title).toBe('COMPLETE: Buy the thing')
      expect(items[3].title).toBe('COMPLETE: Sign up for dance class')
      expect(items[4].title).toBe('COMPLETE: Project review')
    })

    it('should return all tasks from API with empty query (mocked)', async () => {
      expect.assertions(5)
      await Command().read()

      let items = JSON.parse(spy.mock.calls[0][0]).items
      expect(items[0].title).toBe('COMPLETE: Get milk')
      expect(items[1].title).toBe('COMPLETE: Plan a thing')
      expect(items[2].title).toBe('COMPLETE: Buy the thing')
      expect(items[3].title).toBe('COMPLETE: Sign up for dance class')
      expect(items[4].title).toBe('COMPLETE: Project review')
    })

    it('should return matched tasks when queried (mocked)', async () => {
      expect.assertions(3)
      await Command().read('thing')

      let items = JSON.parse(spy.mock.calls[0][0]).items
      expect(items[0].title).toBe('COMPLETE: Plan a thing')
      expect(items[1].title).toBe('COMPLETE: Buy the thing')
      expect(items).toHaveLength(2)
    })

    it('should show a nothing found item if a query has no matches', async () => {
      expect.assertions(1)
      await Command().read('xxxxx')

      let items = JSON.parse(spy.mock.calls[0][0]).items
      expect(items[0].title).toBe("SORRY: There's just nothing here...")
    })
  })

  describe('Create task', () => {
    it('should return a parsed JSON response', async () => {
      expect.assertions(1)
      let query = 'Get milk @15min @at_home #Work p1, tomorrow'
      await Command().create(query)

      let items = JSON.parse(spy.mock.calls[0][0]).items
      expect(JSON.parse(items[0].arg)).toEqual({
        content: 'Get milk',
        due_string: 'tomorrow',
        labels: ['15min', 'at_home'],
        priority: 4,
        project: 'Work'
      })
    })

    it('should recommend projects', async () => {
      expect.assertions(5)
      let query = 'Get milk #'
      await Command().create(query)

      let items = JSON.parse(spy.mock.calls[0][0]).items
      expect(items[0].title).toBe('Inbox')
      expect(items[1].title).toBe('Next Actions')
      expect(items[2].title).toBe('Waiting')
      expect(items[3].title).toBe('Someday/Maybe')
      expect(items[4].title).toBe('Work')
    })

    it('should recommend labels', async () => {
      expect.assertions(5)
      let query = 'Get milk @'
      await Command().create(query)

      let items = JSON.parse(spy.mock.calls[0][0]).items
      expect(items[0].title).toBe('15min')
      expect(items[1].title).toBe('30min')
      expect(items[2].title).toBe('1hour')
      expect(items[3].title).toBe('2hours')
      expect(items[4].title).toBe('at_work')
    })

    it('should recommend priorities', async () => {
      expect.assertions(4)
      let query = 'Get milk !!'
      await Command().create(query)

      let items = JSON.parse(spy.mock.calls[0][0]).items
      expect(items[0].title).toBe('1')
      expect(items[1].title).toBe('2')
      expect(items[2].title).toBe('3')
      expect(items[3].title).toBe('4')
    })

    it('should insert a placeholder when trying to create a task with no input', async () => {
      expect.assertions(1)
      await Command().create('')

      let items = JSON.parse(spy.mock.calls[0][0]).items
      expect(items[0].title).toBe('CREATE: <Give a name to this task>')
    })
  })

  describe('Submit task', () => {
    it('should submit a created task to todoist', async () => {
      expect.assertions(1)

      await Command().submit({ content: 'New task' })

      let output = spy.mock.calls[0][0]
      expect(output).toMatch(/Task added/)
    })
  })

  describe('Remove task', () => {
    it('should remove a task from todoist', async () => {
      expect.assertions(1)

      await Command().remove({ id: 1, content: 'Completed task' })

      let output = spy.mock.calls[0][0]
      expect(output).toMatch(/Task completed/)
    })
  })

  describe('Find settings', () => {
    it('should list all relevent settings', () => {
      Command().listSettings()
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
      Command().verifySetting('token', '0123456789abcde0123456789abcde0123456789')
      let items = JSON.parse(spy.mock.calls[0][0]).items
      let response = JSON.parse(items[0].arg)

      expect(response.value).toBe('0123456789abcde0123456789abcde0123456789')
    })

    it('should edit language setting', () => {
      Command().verifySetting('language', 'nl')
      let items = JSON.parse(spy.mock.calls[0][0]).items
      let response = JSON.parse(items[0].arg)

      expect(response.value).toBe('nl')
    })

    it('should edit token setting', () => {
      Command().verifySetting('max_items', 13)
      let items = JSON.parse(spy.mock.calls[0][0]).items
      let response = JSON.parse(items[0].arg)

      expect(response.value).toBe(13)
    })

    it('should edit cache_timeout setting', () => {
      Command().verifySetting('cache_timeout', 13)
      let items = JSON.parse(spy.mock.calls[0][0]).items
      let response = JSON.parse(items[0].arg)

      expect(response.value).toBe(13)
    })

    it('should edit anonymous_statistics setting', () => {
      Command().verifySetting('anonymous_statistics', false)
      let items = JSON.parse(spy.mock.calls[0][0]).items
      let response = JSON.parse(items[1].arg)

      expect(response.value).toBe(false)
    })
  })

  describe('Store setting', () => {
    it('should store a token setting back to disk', () => {
      Command().saveSetting({
        key: 'token',
        value: '0123456789abcde0123456789abcde0123456789'
      })
      let response = spy.mock.calls[0][0]

      expect(response.token).toEqual('0123456789abcde0123456789abcde0123456789')
    })

    it('should store a language setting back to disk', () => {
      Command().saveSetting({
        key: 'language',
        value: 'nl'
      })
      let response = spy.mock.calls[0][0]

      expect(response.language).toEqual('nl')
    })

    it('should store a max_items setting back to disk', () => {
      Command().saveSetting({
        key: 'max_items',
        value: 3
      })
      let response = spy.mock.calls[0][0]

      expect(response.max_items).toEqual(3)
    })

    it('should store a cache_timeout setting back to disk', () => {
      Command().saveSetting({
        key: 'cache_timeout',
        value: 13
      })
      let response = spy.mock.calls[0][0]

      expect(response.cache_timeout).toEqual(13)
    })

    it('should store a anonymous_statistics setting back to disk', () => {
      Command().saveSetting({
        key: 'anonymous_statistics',
        value: false
      })
      let response = spy.mock.calls[0][0]

      expect(response.anonymous_statistics).toEqual(false)
    })
  })
})
