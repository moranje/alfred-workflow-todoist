import nock from 'nock';

const FIXTURES = {
  tasks: [
    {
      labels: [
        {
          id: 1,
          name: '15min',
          order: 1
        },
        {
          id: 7,
          name: 'on_road',
          order: 7
        }
      ],
      id: 1,
      project_id: 1,
      content: 'Get milk',
      completed: false,
      label_ids: [1, 7],
      order: 1,
      indent: 1,
      priority: 1,
      comment_count: 0,
      url: 'https://todoist.com/showTask?id=1',
      project: { id: 1, name: 'Inbox', order: 0, indent: 1, comment_count: 0 }
    },
    {
      labels: [
        {
          id: 1,
          name: '15min',
          order: 1
        },
        {
          id: 6,
          name: 'at_home',
          order: 6
        }
      ],
      id: 2,
      project_id: 2,
      content: 'Plan a thing',
      completed: false,
      label_ids: [1, 6],
      order: 2,
      indent: 1,
      priority: 1,
      comment_count: 1,
      url: 'https://todoist.com/showTask?id=2',
      project: { id: 2, name: 'Next Actions', order: 0, indent: 1, comment_count: 0 }
    },
    {
      labels: [
        {
          id: 2,
          name: '30min',
          order: 2
        },
        {
          id: 8,
          name: 'at_store',
          order: 8
        },
        {
          id: 10,
          name: 'next_actions',
          order: 10
        }
      ],
      id: 3,
      project_id: 3,
      content: 'Buy the thing',
      completed: false,
      label_ids: [2, 8, 10],
      order: 3,
      indent: 1,
      priority: 1,
      comment_count: 0,
      url: 'https://todoist.com/showTask?id=3',
      project: { id: 3, name: 'Waiting', order: 0, indent: 1, comment_count: 0 }
    },
    {
      labels: [
        {
          id: 3,
          name: '1hour',
          order: 3
        },
        {
          id: 6,
          name: 'at_home',
          order: 6
        },
        {
          id: 9,
          name: 'waiting_for',
          order: 9
        }
      ],
      id: 4,
      project_id: 4,
      content: 'Sign up for dance class',
      completed: false,
      label_ids: [3, 6, 9],
      order: 4,
      indent: 1,
      priority: 1,
      comment_count: 0,
      due: { recurring: false, string: '10 okt.', date: '2018-10-10' },
      url: 'https://todoist.com/showTask?id=4',
      project: { id: 4, name: 'Someday/Maybe', order: 0, indent: 1, comment_count: 0 }
    },
    {
      labels: [
        {
          id: 2,
          name: '30min',
          order: 2
        },
        {
          id: 5,
          name: 'at_work',
          order: 5
        },
        {
          id: 10,
          name: 'next_actions',
          order: 10
        }
      ],
      id: 5,
      project_id: 5,
      content: 'Project review',
      completed: false,
      label_ids: [2, 5, 10],
      order: 5,
      indent: 1,
      priority: 1,
      comment_count: 0,
      due: { recurring: false, string: '9 okt.', date: '2018-10-09' },
      url: 'https://todoist.com/showTask?id=5',
      project: { id: 5, name: 'Work', order: 0, indent: 1, comment_count: 0 }
    }
  ],
  projects: [
    { id: 1, name: 'Inbox', order: 0, indent: 1, comment_count: 0 },
    { id: 2, name: 'Next Actions', order: 1, indent: 1, comment_count: 0 },
    { id: 3, name: 'Waiting', order: 2, indent: 1, comment_count: 0 },
    { id: 4, name: 'Someday/Maybe', order: 3, indent: 1, comment_count: 0 },
    { id: 5, name: 'Work', order: 4, indent: 1, comment_count: 0 }
  ],
  labels: [
    { id: 1, name: '15min', order: 1 },
    { id: 2, name: '30min', order: 2 },
    { id: 3, name: '1hour', order: 3 },
    { id: 4, name: '2hours', order: 4 },
    { id: 5, name: 'at_work', order: 5 },
    { id: 6, name: 'at_home', order: 6 },
    { id: 7, name: 'on_road', order: 7 },
    { id: 8, name: 'at_store', order: 8 },
    { id: 9, name: 'waiting_for', order: 9 },
    { id: 10, name: 'next_actions', order: 10 }
  ]
}

// TASKS
nock('https://beta.todoist.com/API/v8')
  .get('/tasks')
  .reply(200, FIXTURES.tasks)
  .get('/tasks/1')
  .reply(200, FIXTURES.tasks[0])
  .get('/tasks/2')
  .reply(200, FIXTURES.tasks[1])
  .get('/tasks/3')
  .reply(200, FIXTURES.tasks[2])
  .get('/tasks/4')
  .reply(200, FIXTURES.tasks[3])
  .get('/tasks/5')
  .reply(200, FIXTURES.tasks[4])
  .post('/tasks')
  .reply(200, { id: 5, content: 'New task' })
  .post('/tasks/1/close')
  .reply(204, {})
  .post('/tasks/2/close')
  .reply(204, {})
  .post('/tasks/3/close')
  .reply(204, {})
  .post('/tasks/4/close')
  .reply(204, {})
  .post('/tasks/5/close')
  .reply(204, {})
  .persist()

// PROJECTS
nock('https://beta.todoist.com/API/v8')
  .get('/projects')
  .reply(200, FIXTURES.projects)
  .get('/projects/1')
  .reply(200, FIXTURES.projects[0])
  .get('/projects/2')
  .reply(200, FIXTURES.projects[1])
  .get('/projects/3')
  .reply(200, FIXTURES.projects[2])
  .get('/projects/4')
  .reply(200, FIXTURES.projects[3])
  .get('/projects/5')
  .reply(200, FIXTURES.projects[4])
  .post('/projects')
  .reply(200, {})
  .delete('/projects/1')
  .reply(200, {})
  .delete('/projects/2')
  .reply(200, {})
  .delete('/projects/3')
  .reply(200, {})
  .delete('/projects/4')
  .reply(200, {})
  .delete('/projects/5')
  .reply(200, {})
  .persist()

// LABELS
nock('https://beta.todoist.com/API/v8')
  .get('/labels')
  .reply(200, FIXTURES.labels)
  .get('/labels/1')
  .reply(200, FIXTURES.labels[0])
  .get('/labels/2')
  .reply(200, FIXTURES.labels[1])
  .get('/labels/3')
  .reply(200, FIXTURES.labels[2])
  .get('/labels/4')
  .reply(200, FIXTURES.labels[3])
  .get('/labels/5')
  .reply(200, FIXTURES.labels[4])
  .get('/labels/6')
  .reply(200, FIXTURES.labels[5])
  .get('/labels/7')
  .reply(200, FIXTURES.labels[6])
  .get('/labels/8')
  .reply(200, FIXTURES.labels[7])
  .get('/labels/9')
  .reply(200, FIXTURES.labels[8])
  .get('/labels/10')
  .reply(200, FIXTURES.labels[9])
  .post('/projects')
  .reply(200, {})
  .delete('/labels/1')
  .reply(200, {})
  .delete('/labels/2')
  .reply(200, {})
  .delete('/labels/3')
  .reply(200, {})
  .delete('/labels/4')
  .reply(200, {})
  .delete('/labels/5')
  .reply(200, {})
  .delete('/labels/6')
  .reply(200, {})
  .delete('/labels/7')
  .reply(200, {})
  .delete('/labels/8')
  .reply(200, {})
  .delete('/labels/9')
  .reply(200, {})
  .delete('/labels/10')
  .reply(200, {})
  .persist()
