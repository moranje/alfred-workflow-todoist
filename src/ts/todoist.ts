import https = require('https');
import querystring = require('querystring');
import { WorkflowItem, NodeCallback, Task, Project, Label } from './interfaces';

const settings = require(`${process.env
  .HOME}/Library/Application Support/Alfred 3/Workflow Data/com.alfred-workflow-todoist/settings.json`);
const cache = require(`${settings.cache_path}/todoist.json`);

/**
 * Build the url to the Todoist API.
 *
 * @author moranje
 * @since  2016-07-03
 * @param  {Object}   queryParams API params.
 * @return {Object}
 */
function buildUrl(queryParams: any): any {
  return {
    hostname: 'todoist.com',
    path: `/API/v7/sync?${querystring.stringify(queryParams)}`
  };
}

/**
 * Generate a UUID.
 *
 * @author moranje
 * @since  2016-07-03
 * @return {String}
 */
function uuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Create a subtitle string with the available information a task object.
 *
 * @author moranje
 * @since  2017-06-17
 * @param  {Task}         task     An item (task) object from todoist.
 * @param  {Array}        projects An array of projects from todoist.
 * @param  {Array}        labels   An array of labels from todoist.
 * @return {String}                A subtitle string.
 */
function taskString(
  task: Task,
  projects: Array<Project> = [],
  labels: Array<Label> = []
): string {
  let space = '          ';
  let string = '';
  let projectName = 'INBOX';
  let labelNames: Array<string> = [];

  labels.forEach(label => {
    task.labels.forEach((id: number) => {
      if (id === label.id) {
        labelNames.push(label.name);
      }
    });
  });

  projects.forEach(project => {
    if (project.id === task.project_id) {
      projectName = `${project.name.toUpperCase()}`;
    }
  });

  string += `${projectName}${space}`;

  if (task.date_string) {
    string += `${task.date_string}${space}`;
  }

  if (task.priority > 1) {
    string += `\u203C ${task.priority}${space}`;
  }

  if (labelNames.length > 0) {
    string += `\uFF20 ${labelNames.join(',')}${space}`;
  }

  return `${string} (\u21B5 to complete)`;
}

/**
 * Async call to the Todoist API.
 *
 * @author moranje
 * @since  2016-07-03
 * @param  {Object}   queryParams The query parameters.
 * @param  {Function} fn          The  callback
 */
export function api(queryParams: any, fn: NodeCallback): void {
  var req = https.get(buildUrl(queryParams), res => {
    var data = '';

    res.on('data', chunk => {
      data += chunk;
    });

    res.on('end', () => {
      fn(null, JSON.parse(data));
    });

    // Return response errors
    res.on('error', err => {
      fn(err);
    });
  });

  // Return request errors
  req.on('error', err => {
    fn(err);
  });
}

/**
 * Get one or more resources from the todoist API
 *
 * @author moranje
 * @since  2017-06-12
 * @param  {String}   token The Todoist API token.
 * @param  {Array}    types The resource types
 * @param  {Function} fn    The callback
 * @return {Object}         The API response
 */
export function getResources(
  token: string,
  types: Array<string>,
  fn: NodeCallback
): void {
  if (cache.seq_no_global) {
    return fn(cache);
  }

  return api(
    {
      token: token,
      seq_no: 0,
      resource_types: JSON.stringify(types)
    },
    fn
  );
}

/**
 * Mark a task 'done'.
 *
 * @author moranje
 * @since  2016-07-03
 * @param  {Number}   id      A task id.
 * @param  {String}   token   A Todoist token.
 * @param  {Function} fn      The fn callback.
 */
export function markTaskDone(
  id: number,
  token: string,
  fn: NodeCallback
): void {
  return api(
    {
      token: token,
      commands: JSON.stringify([
        {
          type: 'item_close',
          uuid: uuid(),
          args: { id: +id }
        }
      ])
    },
    fn
  );
}

/**
 * Adapter for tasks retrieved from todoists API.
 *
 * @author moranje
 * @since  2017-06-17
 * @param  {Task}         task     An item (task) object from todoist.
 * @param  {Array}        projects An array of projects from todoist.
 * @param  {Array}        labels   An array of labels from todoist.
 * @return {WorkflowItem}          An Alfred workflow item.
 */
export function taskAdapter(
  task: Task,
  projects: Array<Project>,
  labels: Array<Label>
): WorkflowItem {
  return {
    title: task.content,
    subtitle: taskString(task, projects, labels),
    arg: JSON.stringify({ id: task.id }),
    valid: true
  };
}

/**
 * Adapter for projects retrieved from todoists API.
 *
 * @author moranje
 * @since  2017-06-17
 * @param  {Project}       project A project object from todoist.
 * @return {WorkflowItem}          An Alfred workflow item.
 */
export function projectAdapter(project: Project): WorkflowItem {
  return {
    title: project.name,
    subtitle: `Add to ${project.name}`,
    arg: JSON.stringify({ id: project.id }),
    valid: false,
    autocomplete: project.name
  };
}

/**
 * Adapter for labels retrieved from todoists API.
 *
 * @author moranje
 * @since  2017-06-17
 * @param  {Label}        label A label object from todoist
 * @return {WorkflowItem}       An Alfred workflow item.
 */
export function labelAdapter(label: Label): WorkflowItem {
  return {
    title: label.name,
    subtitle: `Add ${label.name} to task`,
    arg: JSON.stringify({ id: label.id }),
    valid: false,
    autocomplete: label.name
  };
}

/**
 * Adapter for a priority item.
 *
 * @author moranje
 * @since  2017-06-17
 * @param  {Object}          object A priority object.
 * @return {WorkflowItem}           An Alfred workflow item.
 */
export function priorityAdapter(object: any): WorkflowItem {
  return {
    title: object.urgency,
    subtitle: `Set task priority to ${object.urgency}`,
    valid: false,
    autocomplete: object.urgency
  };
}
