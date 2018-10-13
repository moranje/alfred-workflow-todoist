import { AlfredError } from '@/workflow/error'
import compose from 'stampit'

import { Item, List } from '../workflow/workflow'

// @ts-ignore: no declaration for v4 yet
export interface Project {
  [index: string]: string | number
  name: string
  id: number
}

export const Project = compose({
  init(this: Project, project: Project = { name: '', id: -1 }) {
    if (!project.name && project.name === '') {
      throw new AlfredError(`A project must have a name (${project.name}) property`)
    }

    if (!project.id || project.id === -1) {
      throw new AlfredError(`A project must have a id (${project.id}) property`)
    }

    Object.assign(this, project)
  }
})

export const ProjectList = compose(
  List,
  {
    init(this: List, { projects = [], query }: { projects: Project[]; query: string }) {
      projects.forEach((project: Project) => {
        let name = project.name.indexOf(' ') !== -1 ? `[${project.name}]` : project.name

        this.items.push(
          Item({
            title: project.name,
            subtitle: `Move task to ${project.name}`,
            autocomplete: `${query.replace(/(^.*#).*/, '$1')}${name} `,
            valid: false
          })
        )
      })
    }
  }
)
