import { AlfredError } from '@/project';
import { Item, List } from '@/workflow';

export class Project {
  name: string;
  id: number;

  constructor(name = '', id = -1) {
    if (!name && name === '') {
      throw new AlfredError(`A project must have a name (${name}) property`);
    }

    if (!id || id === -1) {
      throw new AlfredError(`A project must have a id (${id}) property`);
    }

    this.name = name;
    this.id = id;
  }
}

export class ProjectList extends List {
  constructor(projects: Project[] = [], query = '') {
    super(
      projects.map(project => {
        const name = project.name.includes(' ')
          ? `[${project.name}]`
          : project.name;

        return new Item({
          title: project.name,
          subtitle: `Move task to ${project.name}`,
          autocomplete: `${query.replace(/(^.*#).*/, '$1')}${name} `,
          valid: false,
        });
      })
    );
  }
}
