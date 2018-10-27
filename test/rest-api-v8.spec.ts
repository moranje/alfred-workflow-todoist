import { TaskAdapter } from '@/todoist';
import nock from 'nock';

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
      nock('https://beta.todoist.com/API/v8')
        .get('/tasks/1')
        .reply(200, {
          labels: [],
          id: 1,
          project_id: 1,
          content: 'Get milk',
          label_ids: [],
          priority: 1,
          project: {
            id: 1,
            name: 'Inbox'
          }
        })

      let task = await TaskAdapter({ type: 'task', token: '<faketoken>' }).find(1)

      expect(task.content).toBe('Get milk')
    })
  })
})
