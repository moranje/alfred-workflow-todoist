/* global Library */

/*********************
 * author: M. Oranje *
 * license: MIT      *
 *********************/

var workflow = Library( 'workflow' ),
  helper = Library( 'workflow-helper' );

/**
 * Call the Todoist servers
 *
 * @public
 * @author moranje
 * @date    2016-02-10
 * @param   {String}    params  Additional parameters on the api call.
 * @param   {String}    token   The Todoist api token.
 * @return  {Object}            The parsed JSON response.
 */
function api( params, token ) {
  return JSON.parse(
    helper.shell( `curl https://todoist.com/API/v6/sync -d token=${token} ${params}` )
  );
}

/**
 * Get a users tasks.
 *
 * @public
 * @author moranje
 * @date    2016-02-13
 * @param   {String}    token  The Todoist api token.
 * @return  {Object}           A Todoist response object.
 */
function getTasks( token ) {
  return api( '-d seq_no=0 -d resource_types=\'["items"]\'', token );
}

/**
 * Mark a single task done.
 *
 * @public
 * @author moranje
 * @date    2016-02-13
 * @param   {number}    id     A task id.
 * @param   {String}    token  A Todoist api token.
 * @return  {Object}           A todoist response object.
 */
function markTaskDone( id, token ) {
  var uuid = helper.uuid();

  api( `-d commands='[{"type": "item_complete", "uuid": "${uuid}", "args": {"ids": [${id}]}}]'`, token );
}
