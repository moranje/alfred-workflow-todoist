import https = require('https');
import querystring = require('querystring');

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
 * @param  {Object}      apiResponse A task object.
 * @return {String}                  A subtitle string.
 */
function taskString(apiResponse: any): string {
  let string = '';
  let space = '          ';

  if (apiResponse.due_date_utc) {
    string += `Date: ${space}`;
  } else if (apiResponse.due_date_utc) {
    string += `Time: ${space}`;
  }

  return string;
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
          args: { id }
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
 * @param  {Object}       apiResponse An item (task) object from todoist. 
 * @return {WorkflowItem}             An Alfred workflow item.
 */
export function taskAdapter(apiResponse: any): WorkflowItem {
  return {
    title: apiResponse.content,
    subtitle: taskString(apiResponse),
    arg: apiResponse.id
  };
}

/**
 * Adapter for projects retrieved from todoists API.
 *
 * @author moranje
 * @since  2017-06-17
 * @param  {Object}        apiResponse A project object from todoist.
 * @return {WorkflowItem}              An Alfred workflow item.
 */
export function projectAdapter(apiResponse: any): WorkflowItem {
  return {
    title: apiResponse.name,
    subtitle: `Add to ${apiResponse.name}`,
    arg: apiResponse.id,
    valid: false,
    autocomplete: apiResponse.name
  };
}

/**
 * Adapter for labels retrieved from todoists API.
 *
 * @author moranje
 * @since  2017-06-17
 * @param  {Object}        apiResponse A label object from todoist
 * @return {WorkflowItem}              An Alfred workflow item.
 */
export function labelAdapter(apiResponse: any): WorkflowItem {
  return {
    title: apiResponse.name,
    subtitle: `Add ${apiResponse.name} to task`,
    arg: apiResponse.id,
    valid: false,
    autocomplete: apiResponse.name
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
