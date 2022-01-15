import { list, save } from '@/project'

jest.mock('@/project/references')
jest.mock('@/project/files', () => ({
  __esModule: true,
  FILES: { cache: [] },
}))
jest.mock('write-json-file', () => {
  return async (path: string, data: any) => {
    console.log(data)
  }
})

let spy: any

describe('Unit: Settings', () => {
  beforeEach(() => {
    spy = jest.spyOn(console, 'log')
  })

  afterEach(() => {
    spy.mockReset()
  })

  it('should be able to read settings', () => {
    list()
    const items = JSON.parse(spy.mock.calls[0][0]).items

    expect(items[0].title).toBe('SETTING: token')
    expect(items[1].title).toBe('SETTING: language')
    expect(items[2].title).toBe('SETTING: max_items')
    expect(items[3].title).toBe('SETTING: cache_timeout')
    expect(items[4].title).toBe('SETTING: anonymous_statistics')
  })

  it('should be able to read settings when none exist on disk', () => {
    list()
    const items = JSON.parse(spy.mock.calls[0][0]).items

    expect(items[0].title).toBe('SETTING: token')
    expect(items[1].title).toBe('SETTING: language')
    expect(items[2].title).toBe('SETTING: max_items')
    expect(items[3].title).toBe('SETTING: cache_timeout')
    expect(items[4].title).toBe('SETTING: anonymous_statistics')
  })

  it('should be able to edit token setting', async () => {
    await save({ key: 'token', value: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' })
    const json = spy.mock.calls[0][0]

    expect(json.token).toBe('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
    expect(json.language).toBe('en')
    expect(json.max_items).toBe(9)
    expect(json.cache_timeout).toBe(3600)
    expect(json.anonymous_statistics).toBe(true)
  })

  it('should be able to edit language setting', async () => {
    await save({ key: 'language', value: 'nl' })
    const json = spy.mock.calls[0][0]

    expect(json.token).toBe('')
    expect(json.language).toBe('nl')
    expect(json.max_items).toBe(9)
    expect(json.cache_timeout).toBe(3600)
    expect(json.anonymous_statistics).toBe(true)
  })

  it('should be able to edit max_items setting', async () => {
    await save({ key: 'max_items', value: 3 })
    const json = spy.mock.calls[0][0]

    expect(json.token).toBe('')
    expect(json.language).toBe('en')
    expect(json.max_items).toBe(3)
    expect(json.cache_timeout).toBe(3600)
    expect(json.anonymous_statistics).toBe(true)
  })

  it('should be able to edit cache_timeout setting', async () => {
    await save({ key: 'cache_timeout', value: 3 })
    const json = spy.mock.calls[0][0]

    expect(json.token).toBe('')
    expect(json.language).toBe('en')
    expect(json.max_items).toBe(9)
    expect(json.cache_timeout).toBe(3)
    expect(json.anonymous_statistics).toBe(true)
  })

  it('should be able to edit anonymous_statistics setting', async () => {
    await save({ key: 'anonymous_statistics', value: true })
    const json = spy.mock.calls[0][0]

    expect(json.token).toBe('')
    expect(json.language).toBe('en')
    expect(json.max_items).toBe(9)
    expect(json.cache_timeout).toBe(3600)
    expect(json.anonymous_statistics).toBe(true)
  })

  it('should be able to edit settings when none exist on disk', async () => {
    await save({ key: 'token', value: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' })
    const json = spy.mock.calls[0][0]

    expect(json.token).toBe('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
    expect(json.language).toBe('en')
    expect(json.max_items).toBe(9)
    expect(json.cache_timeout).toBe(3600)
    expect(json.anonymous_statistics).toBe(true)
  })
})
