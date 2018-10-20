import { cache } from '@/project/cache';
import todoist, { Label, Project, Task } from '@/todoist';
import { uuid } from '@/workflow';
import { filter } from 'fuzzaldrin';
import got from 'got';
import find from 'lodash.find';
import unionBy from 'lodash.unionby';
import compose from 'stampit';

const Adapter: todoist.AdapterFactory = compose({
  init(
    this: todoist.AdapterInstance,
    {
      type,
      uri = 'https://beta.todoist.com/API/v8',
      token
    }: { type: 'task' | 'project' | 'label'; uri: string; token: string }
  ) {
    this.type = type
    this.uri = uri
    this.token = token
    // @ts-ignore: incomplete declaration file
    this.got = got.extend({
      baseUrl: uri,
      json: true,
      headers: {
        Authorization: `Bearer ${token}`,
        'X-Request-Id': uuid()
        // 'Content-Type': 'application/json'
      }
    })
  },

  methods: {
    /**
     * Returns items of a type based on a query. Returns all items when qeurr
     * is falsy.
     *
     * @param {string} query
     * @param {string} [key='content']
     * @returns {Promise<any>}
     */
    async query(
      this: todoist.TaskAdapterInstance,
      query: string,
      key: string = 'content'
    ): Promise<any> {
      if (!query) return this.findAll()

      return filter(await this.findAll(), query, { key })
    },

    /**
     * POST an item of a type to Todoist
     *
     * @param {*} data
     * @returns {Promise<any>}
     */
    async create(this: todoist.AdapterInstance, data: any): Promise<any> {
      return this.got.post(`${this.type}s`, { body: data })
    },

    /**
     * POST an item of a type to Todoist replacing a known value
     *
     * @param {number} id
     * @param {*} data
     * @returns {Promise<any>}
     */
    async update(this: todoist.AdapterInstance, id: number, data: any): Promise<any> {
      return this.got.post(`${this.type}s/${id}`, { body: data })
    },

    /**
     * API call to delete a single item.
     *
     * @param {number} id
     * @returns {Promise<any>}
     */
    async remove(this: todoist.AdapterInstance, id: number): Promise<any> {
      return this.got.delete(`${this.type}s/${id}`)
    }
  }
})

export const ProjectAdapter: todoist.ProjectAdapterFactory = compose(
  Adapter,
  {
    init(this: todoist.ProjectAdapterInstance) {
      this.type = 'project'
    },

    methods: {
      /**
       * Find a project by it's id.
       *
       * @param {number} id
       * @returns A project instance
       */
      async find(this: todoist.ProjectAdapterInstance, id: number): Promise<todoist.Project> {
        // @ts-ignore: cache type definition is incorrect
        let cachedProjects: Project[] = cache.get('projects') || []
        let project = find(cachedProjects, ['id', id])

        if (project) return project

        let { body } = await this.got.get(`projects/${id}`)

        cachedProjects.push(body)
        cache.set('projects', unionBy(cachedProjects, 'id'))

        return Project(body)
      },

      /**
       * Get all projects
       *
       * @returns All projects
       */
      async findAll(this: todoist.ProjectAdapterInstance): Promise<todoist.Project[]> {
        // @ts-ignore: cache type definition is incorrect
        let cachedProjects: Project[] = cache.get('projects') || []

        if (cachedProjects.length > 0) return cachedProjects

        let { body } = await this.got.get('projects')

        let projects: todoist.Project[] = body.map((project: todoist.Project) => {
          return Project(project)
        })

        cache.set('projects', projects)

        return projects
      }
    }
  }
)

export const LabelAdapter: todoist.LabelAdapterFactory = compose(
  Adapter,
  {
    init(this: todoist.LabelAdapterInstance) {
      this.type = 'label'
    },

    methods: {
      /**
       * Find a label by it's id.
       *
       * @param {number} id
       * @returns A label instance
       */
      async find(this: todoist.LabelAdapterInstance, id: number): Promise<todoist.Label> {
        // @ts-ignore: cache type definition is incorrect
        let cachedLabels: Label[] = cache.get('labels') || []
        let label = find(cachedLabels, ['id', id])

        if (label) return label

        let { body } = await this.got.get(`labels/${id}`)

        cachedLabels.push(body)
        cache.set('labels', unionBy(cachedLabels, 'id'))

        return Label(body)
      },

      /**
       * Get all labels
       *
       * @returns All labels
       */
      async findAll(this: todoist.LabelAdapterInstance): Promise<todoist.Label[]> {
        // @ts-ignore: cache type definition is incorrect
        let cachedLabels: Label[] = cache.get('labels') || []

        if (cachedLabels.length > 0) return cachedLabels

        let { body } = await this.got.get('labels')
        let labels: todoist.Label[] = body.map((label: todoist.Label) => {
          return Label(label)
        })

        cache.set('labels', labels)

        return labels
      }
    }
  }
)

export const TaskAdapter: todoist.TaskAdapterFactory = compose(
  Adapter,
  {
    init(this: todoist.TaskAdapterInstance) {
      this.type = 'task'
    },

    methods: {
      /**
       * Find a task by it's id.
       *
       * @param {number} id
       * @returns A task instance
       */
      async find(this: todoist.TaskAdapterInstance, id: number): Promise<todoist.Task> {
        // @ts-ignore: cache type definition is incorrect
        let cachedTasks: todoist.Task[] = cache.get('tasks') || []
        let task = find(cachedTasks, ['id', id])

        if (task) return task

        let { body } = await this.got.get(`tasks/${id}`)

        cachedTasks.push(body)
        cache.set('tasks', unionBy(cachedTasks, 'id'))

        return Task(body) // tslint:disable-line
      },

      /**
       * Get all tasks
       *
       * @returns All tasks
       */
      async findAll(this: todoist.TaskAdapterInstance): Promise<todoist.Task[]> {
        // @ts-ignore: cache type definition is incorrect
        let cachedTasks: todoist.Task[] = cache.get('tasks') || []

        if (cachedTasks.length > 0) return cachedTasks

        let { body } = await this.got.get('tasks')

        // Cache label and projects
        await ProjectAdapter({ token: this.token }).findAll()
        await LabelAdapter({ token: this.token }).findAll()

        let mapped = body.map(async (task: todoist.Task) => {
          return Task(await this.getRelationships(task)) // tslint:disable-line
        })

        return Promise.all(mapped).then(([...tasks]: any) => {
          cache.set('tasks', tasks)

          return tasks
        })
      },

      /**
       * Retrieve a tasks labels an projects by id.
       *
       * @param {todoist.TaskAdapterInstance} this
       * @param {todoist.Task} task
       * @returns {Promise<todoist.Task>}
       */
      async getRelationships(
        this: todoist.TaskAdapterInstance,
        task: todoist.Task
      ): Promise<todoist.Task> {
        // Don't mutate task object
        let t = Object.assign({}, { labels: [] }, task)
        let projectAdapter = ProjectAdapter({ token: this.token })
        let labelAdapter = LabelAdapter({ token: this.token })

        t.project = await projectAdapter.find(task.project_id)

        if (t.label_ids) {
          t.label_ids.forEach(async (labelId: number) => {
            t.labels.push(await labelAdapter.find(labelId))
          })
        }

        return t
      }
    }
  }
)
