import { filter } from 'fuzzaldrin'
import got from 'got'
import compose from 'stampit'

import { Label } from './label'
import { Project } from './project'
import { Task } from './task'

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

/**
 * Generate a UUID.
 *
 * @author moranje
 * @since  2016-07-03
 * @return {String}
 */
export function uuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0

    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
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
    async query(this: Adapter, query: string, key: string): Promise<any> {
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

const ProjectAdapter = compose(
  Adapter,
  {
    props: {
      type: 'project'
    },

    methods: {
      async find(this: Adapter, id: number) {
        let { body } = await this.got.get(`projects/${id}`)

        return Project(body)
      },

      async findAll(this: Adapter) {
        let { body } = await this.got.get(`projects`)

        return body.map((project: Project) => {
          return Project(project)
        })
      }
    }
  }
)

const LabelAdapter = compose(
  Adapter,
  {
    props: {
      type: 'label'
    },

    methods: {
      async find(this: Adapter, id: number) {
        let { body } = await this.got.get(`labels/${id}`)

        return Label(body)
      },

      async findAll(this: Adapter) {
        let { body } = await this.got.get(`labels`)

        return body.map((label: Label) => {
          return Label(label)
        })
      }
    }
  }
)

export const TaskAdapter = compose(
  Adapter,
  {
    props: {
      type: 'task'
    },

    init(this: Adapter) {
      this.type = 'task'
    },

    methods: {
      async find(this: TaskAdapter, id: number): Promise<Task> {
        let { body } = await this.got.get(`tasks/${id}`)

        return Task(await this.getRelationships(body)) // tslint:disable-line
      },

      async findAll(this: TaskAdapter) {
        let { body } = await this.got.get(`tasks`)
        let mapped = body.map(async (task: Task) => {
          return Task(await this.getRelationships(task)) // tslint:disable-line
        })

        return Promise.all(mapped)
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
