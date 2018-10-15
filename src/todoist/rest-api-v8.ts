import { Label } from '@/todoist/label';
import { Project } from '@/todoist/project';
import { Task } from '@/todoist/task';
import { cache } from '@/workflow/cache';
import { uuid } from '@/workflow/workflow';
import { filter } from 'fuzzaldrin';
import got from 'got';
import find from 'lodash.find';
import unionBy from 'lodash.unionby';
import compose from 'stampit';

interface Adapter {
  type: string
  got: any
  uri: string
  token: string
  findAll: () => Promise<any>
}

export interface TaskAdapter extends Adapter {
  getRelationships: (task: Task) => Task
}

const Adapter = compose({
  init(
    this: Adapter,
    {
      type,
      uri = 'https://beta.todoist.com/API/v8',
      token
    }: { type: string; uri: string; token: string }
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
    async query(this: Adapter, query: string, key: string = 'content'): Promise<any> {
      if (!query) return this.findAll()

      return filter(await this.findAll(), query, { key })
    },

    /**
     * POST an item of a type to Todoist
     *
     * @author moranje
     * @param {*} data
     * @returns {Promise<any>}
     * @memberof Adapter
     */
    async create(this: Adapter, data: any): Promise<any> {
      return this.got.post(`${this.type}s`, { body: data })
    },

    /**
     * POST an item of a type to Todoist replacing a known value
     *
     * @author moranje
     * @param {number} id
     * @param {*} data
     * @returns {Promise<any>}
     * @memberof Adapter
     */
    async update(this: Adapter, id: number, data: any): Promise<any> {
      return this.got.post(`${this.type}s/${id}`, { body: data })
    },

    /**
     * API call to delete a single item.
     *
     * @author moranje
     * @param {Adapter} this
     * @param {number} id
     * @returns {Promise<any>}
     */
    async remove(this: Adapter, id: number): Promise<any> {
      return this.got.delete(`${this.type}s/${id}`)
    }
  }
})

export const ProjectAdapter = compose(
  Adapter,
  {
    init(this: Adapter) {
      this.type = 'project'
    },

    methods: {
      async find(this: Adapter, id: number) {
        // @ts-ignore: cache type definition is incorrect
        let cachedProjects: Project[] = cache.get('projects') || []
        let project = find(cachedProjects, ['id', id])

        if (project) return project

        let { body } = await this.got.get(`projects/${id}`)

        cachedProjects.push(body)
        cache.set('projects', unionBy(cachedProjects, 'id'))

        return Project(body)
      },

      async findAll(this: Adapter) {
        // @ts-ignore: cache type definition is incorrect
        let cachedProjects: Project[] = cache.get('projects') || []

        if (cachedProjects.length > 0) return cachedProjects

        let { body } = await this.got.get('projects')

        let projects: Project[] = body.map((project: Project) => {
          return Project(project)
        })

        cache.set('projects', projects)

        return projects
      }
    }
  }
)

export const LabelAdapter = compose(
  Adapter,
  {
    init(this: Adapter) {
      this.type = 'label'
    },

    methods: {
      async find(this: Adapter, id: number) {
        // @ts-ignore: cache type definition is incorrect
        let cachedLabels: Label[] = cache.get('labels') || []
        let label = find(cachedLabels, ['id', id])

        if (label) return label

        let { body } = await this.got.get(`labels/${id}`)

        cachedLabels.push(body)
        cache.set('labels', unionBy(cachedLabels, 'id'))

        return Label(body)
      },

      async findAll(this: Adapter) {
        // @ts-ignore: cache type definition is incorrect
        let cachedLabels: Label[] = cache.get('labels') || []

        if (cachedLabels.length > 0) return cachedLabels

        let { body } = await this.got.get('labels')
        let labels: Label[] = body.map((label: Label) => {
          return Label(label)
        })

        cache.set('labels', labels)

        return labels
      }
    }
  }
)

export const TaskAdapter = compose(
  Adapter,
  {
    init(this: Adapter) {
      this.type = 'task'
    },

    methods: {
      async find(this: TaskAdapter, id: number): Promise<Task> {
        // @ts-ignore: cache type definition is incorrect
        let cachedTasks: Task[] = cache.get('tasks') || []
        let task = find(cachedTasks, ['id', id])

        if (task) return task

        let { body } = await this.got.get(`tasks/${id}`)

        cachedTasks.push(body)
        cache.set('tasks', unionBy(cachedTasks, 'id'))

        return Task(body) // tslint:disable-line
      },

      async findAll(this: TaskAdapter) {
        // @ts-ignore: cache type definition is incorrect
        let cachedTasks: Task[] = cache.get('tasks') || []

        if (cachedTasks.length > 0) return cachedTasks

        let { body } = await this.got.get('tasks')

        // Cache label and projects
        await ProjectAdapter({ token: this.token }).findAll()
        await LabelAdapter({ token: this.token }).findAll()

        let mapped = body.map(async (task: Task) => {
          return Task(await this.getRelationships(task)) // tslint:disable-line
        })

        return Promise.all(mapped).then(([...tasks]: any) => {
          cache.set('tasks', tasks)

          return tasks
        })
      },

      async getRelationships(this: TaskAdapter, task: Task): Promise<Task> {
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
