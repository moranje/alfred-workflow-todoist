import { list, update } from '@/workflow/settings'

jest.mock('@/workflow/files')
jest.mock('@/workflow/notifier')
jest.mock('jsonfile', () => {
  return {
    writeFile(path: string, data: any) {
      console.log(data)
    }
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
    let items = JSON.parse(spy.mock.calls[0][0]).items

    expect(items[0].title).toBe('SETTING: token')
    expect(items[1].title).toBe('SETTING: language')
    expect(items[2].title).toBe('SETTING: max_items')
    expect(items[3].title).toBe('SETTING: cache_timeout')
    expect(items[4].title).toBe('SETTING: anonymous_statistics')
  })

  it('should be able to read settings when none exist on disk', () => {
    list()
    let items = JSON.parse(spy.mock.calls[0][0]).items

    expect(items[0].title).toBe('SETTING: token')
    expect(items[1].title).toBe('SETTING: language')
    expect(items[2].title).toBe('SETTING: max_items')
    expect(items[3].title).toBe('SETTING: cache_timeout')
    expect(items[4].title).toBe('SETTING: anonymous_statistics')
  })

  it('should be able to edit token setting', () => {
    update({ key: 'token', value: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' })
    let json = spy.mock.calls[0][0]

    expect(json.token).toBe('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
    expect(json.language).toBe('en')
    expect(json.max_items).toBe(9)
    expect(json.cache_timeout).toBe(3600)
    expect(json.anonymous_statistics).toBe(true)
  })

  it('should be able to edit language setting', () => {
    update({ key: 'language', value: 'nl' })
    let json = spy.mock.calls[0][0]

    expect(json.token).toBe('')
    expect(json.language).toBe('nl')
    expect(json.max_items).toBe(9)
    expect(json.cache_timeout).toBe(3600)
    expect(json.anonymous_statistics).toBe(true)
  })

  it('should be able to edit max_items setting', () => {
    update({ key: 'max_items', value: 3 })
    let json = spy.mock.calls[0][0]

    expect(json.token).toBe('')
    expect(json.language).toBe('en')
    expect(json.max_items).toBe(3)
    expect(json.cache_timeout).toBe(3600)
    expect(json.anonymous_statistics).toBe(true)
  })

  it('should be able to edit cache_timeout setting', () => {
    update({ key: 'cache_timeout', value: 3 })
    let json = spy.mock.calls[0][0]

    expect(json.token).toBe('')
    expect(json.language).toBe('en')
    expect(json.max_items).toBe(9)
    expect(json.cache_timeout).toBe(3)
    expect(json.anonymous_statistics).toBe(true)
  })

  it('should be able to edit anonymous_statistics setting', () => {
    update({ key: 'anonymous_statistics', value: true })
    let json = spy.mock.calls[0][0]

    expect(json.token).toBe('')
    expect(json.language).toBe('en')
    expect(json.max_items).toBe(9)
    expect(json.cache_timeout).toBe(3600)
    expect(json.anonymous_statistics).toBe(true)
  })

  it('should be able to edit settings when none exist on disk', () => {
    update({ key: 'token', value: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' })
    let json = spy.mock.calls[0][0]

    expect(json.token).toBe('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
    expect(json.language).toBe('en')
    expect(json.max_items).toBe(9)
    expect(json.cache_timeout).toBe(3600)
    expect(json.anonymous_statistics).toBe(true)
  })
})
