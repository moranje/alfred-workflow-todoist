import { AlfredError, Errors } from '../error';
import { getApi, requestError } from '../todoist';
import { TodoistTask } from '../todoist/local-rest-adapter';
import { notification } from '../workflow';

/**
 * Complete a task on Todoist. Closes the task instead of deleting it.
 *
 * @param task The `Task` object.
 */
export async function remove(task: TodoistTask): Promise<void> {
  const isSucces = await getApi()
    .v1.task.close(task.id)
    .catch(error => {
      throw requestError(error);
    });

  if (isSucces === false) {
    throw new AlfredError(
      Errors.InvalidAPIResponse,
      "It looks task couldn't be closed."
    );
  }

  notification({
    subtitle: '✓ Happy days!',
    message: `Finished: ${task.content}`,
  });
}
