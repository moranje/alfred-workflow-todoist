import './helpers/nock-requests';

import { TaskAdapter } from '@/todoist';

jest.mock('@/project/files')

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

  describe('class TaskAdapter', () => {
    it('should GET tasks from todoist (mocked)', async () => {
      let task = await TaskAdapter({ type: 'task', token: '<faketoken>' }).find(1)

      expect(task.content).toBe('Get milk')
    })
  })
})
