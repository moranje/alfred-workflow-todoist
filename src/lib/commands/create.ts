import { TodoistTaskOptions } from 'todoist-rest-api';

import { AlfredError, Errors } from '../error';
import { getApi, requestError } from '../todoist';
import { notification } from '../workflow';

/**
 * Create a task in Todoist.
 *
 * @param taskOptions The task options.
 */
export async function create(taskOptions: TodoistTaskOptions): Promise<void> {
  const task = await getApi()
    .v1.task.create(taskOptions)
    .catch(error => {
      throw requestError(error);
    });

  if (task.id == null) {
    throw new AlfredError(
      Errors.InvalidAPIResponse,
      "It looks task couldn't be created."
    );
  }

  notification({
    subtitle: '✓ Happy days!',
    message: `Created: ${task.content}`,
    url: task.url,
  });
}
