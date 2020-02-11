import { AlfredError, Errors } from '../error';
import { getApi, requestError } from '../todoist';
import { ResourceName } from '../todoist/local-rest-adapter';
import { notification } from '../workflow';

/**
 * Refresh cache of  `task`s, `project`s, `label`s, `section`s or `comment`s.
 *
 * @param type Todoist resource type eg `task`, `project`, `label`, `section` or
 * `comment`.
 */
export async function refreshCache(type: ResourceName): Promise<void> {
  let adapter;

  if (type === 'task') {
    adapter = getApi().v1.task;
  } else if (type === 'project') {
    adapter = getApi().v1.project;
  } else if (type === 'label') {
    adapter = getApi().v1.label;
  } else if (type === 'section') {
    adapter = getApi().v1.section;
  } else if (type === 'comment') {
    adapter = getApi().v1.comment;
  } else {
    throw new AlfredError(
      Errors.InvalidArgument,
      `Expected cache refresh to have type of 'task', 'project', 'label', 'section' or 'comment', was ${type}`
    );
  }

  const resources = await adapter
    .findAll({ skipCache: true })
    // FIXME: unsure how to please the typescript compiler here
    // @ts-ignore
    .catch((error: Error) => {
      throw requestError(error);
    });

  if (!Array.isArray(resources)) {
    throw new AlfredError(
      Errors.InvalidAPIResponse,
      'It looks like the cache refresh failed'
    );
  }

  notification({
    subtitle: '✓ Happy days!',
    message: `${type.charAt(0).toUpperCase() + type.slice(1)} cache refreshed`,
  });
}
