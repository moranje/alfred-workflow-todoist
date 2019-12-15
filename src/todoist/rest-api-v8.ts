import { cache } from '@/project';
import { Label, Project, Task } from '@/todoist';
import { uuid } from '@/workflow';
import FuzzySearch from 'fuzzy-search';
import got, { Got } from 'got';
import find from 'lodash.find';
import unionBy from 'lodash.unionby';
import { TODOIST_API_URI } from '@/project/references';
import { TaskRequest, TodoistTask } from './task';

type itemType = 'task' | 'project' | 'label';
type ApiItemOptions = TaskRequest | Project | Label;

interface Adapter<Type> {
  /**
   * The resource type.
   */
  type: itemType;

  /**
   * The todoist api url
   */
  uri: string;

  /**
   * The API token.
   */
  token: string;

  /**
   * A pre-configured got Type
   */
  client: Got;
}

function peekAll(type: string) {
  return cache.get(type);
}

function peek(type: string, id: number) {
  const all = peekAll(type);
  return find(all, ['id', id]);
}

abstract class Adapter<Type> {
  constructor(type: itemType, token: string, uri: string = TODOIST_API_URI) {
    this.type = type;
    this.uri = uri;
    this.token = token;
    this.client = got.extend({
      prefixUrl: uri,
      responseType: 'json',
      headers: {
        Authorization: `Bearer ${token}`,
        'X-Request-Id': uuid(),
      },
    });

    if (!this.token) {
      throw new Error(
        'Missing Todoist API token. Add a token using the `todo:setting token <token>` command.'
      );
    }
  }

  find(id: number): Promise<Type> {
    return peek(this.type, id);
  }

  findAll(): Promise<Type[]> {
    return peek(this.type, id);
  }

  async query(query: string, key = 'content'): Promise<Type[]> {
    if (!query) {
      return this.findAll();
    }

    const searcher = new FuzzySearch(await this.findAll(), [key], {
      caseSensitive: false,
    });

    return searcher.search(query);
  }

  /**
   * POST an item of a type to Todoist
   */
  async create(data: ApiItemOptions): Promise<object> {
    return this.client.post(`${this.type}s`, { json: data });
  }

  /**
   * POST an item of a type to Todoist replacing a known value
   */
  async update(id: number, data: ApiItemOptions): Promise<object> {
    return this.client.post(`${this.type}s/${id}`, { json: data });
  }

  /**

   */
  async remove(id: number): Promise<object> {
    return this.client.delete(`${this.type}s/${id}`);
  }
}

export class ProjectAdapter extends Adapter<Project> {
  constructor(token: string) {
    super('project', token);
  }

  async find(id: number): Promise<Project> {
    const cachedProjects = (cache.get('projects') as Project[]) || [];
    const project = find(cachedProjects, ['id', id]);

    if (project) {
      return project;
    }

    const { body } = await this.client.get(`projects/${id}`);

    cachedProjects.push(body);
    cache.set('projects', unionBy(cachedProjects, 'id'));

    return new Project(body);
  }

  /**
   * Get all projects
   */
  async findAll(): Promise<Project[]> {
    const cachedProjects = (cache.get('projects') as Project[]) || [];

    if (cachedProjects.length > 0) {
      return cachedProjects;
    }

    const { body } = await this.client.get('projects');

    const projects: Project[] = body.map((project: Project) => {
      return new Project(project.name, project.id);
    });

    cache.set('projects', projects);

    return projects;
  }
}

export class LabelAdapter extends Adapter<Label> {
  constructor(token: string) {
    super('label', token);
  }

  async find(id: number): Promise<Label> {
    const cachedLabels = (cache.get('labels') as Label[]) || [];
    const label = find(cachedLabels, ['id', id]);

    if (label) {
      return label;
    }

    const { body } = await this.client.get(`labels/${id}`);

    cachedLabels.push(body);
    cache.set('labels', unionBy(cachedLabels, 'id'));

    return new Label(body);
  }

  /**
   * Get all labels
   */
  async findAll(): Promise<Label[]> {
    const cachedLabels = (cache.get('labels') as Label[]) || [];

    if (cachedLabels.length > 0) {
      return cachedLabels;
    }

    const { body } = await this.client.get('labels');

    const labels: Label[] = body.map((label: Label) => {
      return new Label(label.name, label.id);
    });

    cache.set('labels', labels);

    return labels;
  }
}

export class TaskAdapter extends Adapter<Task> {
  constructor(token: string) {
    super('task', token);
  }

  async find(id: number): Promise<TodoistTask> {
    const cachedTasks = (cache.get('tasks') as TodoistTask[]) || [];
    const task = find(cachedTasks, ['id', id]);

    if (task) {
      return task;
    }

    const { body }: { body: TodoistTask } = await this.client.get(
      `tasks/${id}`
    );

    cachedTasks.push(body);
    cache.set('tasks', unionBy(cachedTasks, 'id'));

    return new Task(body);
  }

  /**
   * Get all tasks
   */
  async findAll(): Promise<TodoistTask[]> {
    const cachedTasks = (cache.get('tasks') as TodoistTask[]) || [];

    if (cachedTasks.length > 0) {
      return cachedTasks;
    }

    const { body } = await this.client.get('tasks');

    // Cache label and projects
    await new ProjectAdapter(this.token).findAll();
    await new LabelAdapter(this.token).findAll();

    const mapped: TodoistTask[] = body.map(async (task: TodoistTask) => {
      return new Task(await this.getRelationships(task));
    });

    return Promise.all(mapped).then(([...tasks]) => {
      cache.set('tasks', tasks);

      return tasks;
    });
  }

  /**
   * Closes a task and returns an empty body with a HTTP status code 204.
   */
  async close(id: number): Promise<boolean> {
    const response = await this.client.post(`${this.type}s/${id}/close`);

    if (response.statusCode === 204) return true;

    // Closing failed, this should not happen since an error ought to have been
    // thrown insted
    return false;
  }

  /**
   * Retrieve a tasks labels an projects by id.
   */
  async getRelationships(task: TodoistTask): Promise<TodoistTask> {
    // Don't mutate task Type
    const taskCopy: TodoistTask = Object.assign({}, { labels: [] }, task);
    const projectAdapter = new ProjectAdapter(this.token);
    const labelAdapter = new LabelAdapter(this.token);

    taskCopy.project = await projectAdapter.find(task.project_id);

    if (taskCopy?.label_ids) {
      taskCopy.label_ids.forEach(async (labelId: number) => {
        taskCopy.labels!.push(await labelAdapter.find(labelId));
      });
    }

    return taskCopy;
  }
}
