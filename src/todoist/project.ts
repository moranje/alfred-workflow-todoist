import compose from 'stampit'

import { List } from '../workflow/workflow'

// @ts-ignore: no declaration for v4 yet
export interface Project {
  [index: string]: string | number
  name: string
  id: number
}

export const Project = compose({
  init(this: Project, project: Project = { name: '', id: -1 }) {
    if (!project.name && project.name === '') {
      throw new Error(`A project must have a name (${project.name}) property`)
    }

    if (!project.id || project.id === -1) {
      throw new Error(`A project must have a id (${project.id}) property`)
    }

    Object.assign(this, project)
  }
})

export const ProjectList = compose(
  List,
  {}
)
