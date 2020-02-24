import { AlfredError } from '@/project'
import { Item, List } from '@/workflow'
import compose from 'stampit'

/** @hidden */
export const Project: todoist.ProjectFactory = compose({
  init(this: todoist.ProjectInstance, project: todoist.Project = { name: '', id: -1 }) {
    if (!project.name && project.name === '') {
      throw new AlfredError(`A project must have a name (${project.name}) property`)
    }

    if (!project.id || project.id === -1) {
      throw new AlfredError(`A project must have a id (${project.id}) property`)
    }

    Object.assign(this, project)
  }
})

/** @hidden */
export const ProjectList: todoist.ProjectListFactory = compose(List, {
  init(
    this: todoist.ProjectListInstance,
    { projects = [], query }: { projects: todoist.Project[]; query: string }
  ) {
    projects.forEach((project: todoist.Project) => {
      const name = project.name.indexOf(' ') !== -1 ? `[${project.name}]` : project.name

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
})
