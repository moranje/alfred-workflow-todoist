import todoist from 'todoist-rest-api';
import { config } from '@/lib/utils';

// Retrieve any resource ids from cache

export async function create(query: string) {
  const api = todoist(config.get('token') as string);
  const task = Object.assign({}, JSON.parse(query), {
    due_lang: config.get('token') as string,
  });
  const response = await api.v1.task.create(task);

  if (!response.id) {
    throw new Error("The task couldn't be created for some reason");
  }

  return null;
}
