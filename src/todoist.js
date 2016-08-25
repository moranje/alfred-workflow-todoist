// author: M. Oranje
// licence: MIT

var CACHE_PATH = '/Users/martien/Library/Caches/com.runningwithcrayons.Alfred-3/Workflow Data/com.alfred-workflow-todoist';

var https = require( 'https' );
var querystring = require( 'querystring' );
var cache = require( CACHE_PATH + '/todoist.json' );

/**
 * Build the url to the Todoist API.
 *
 * @author moranje <martieno@gmail.com>
 * @since  2016-07-03
 * @param  {Object}   queryParams API params.
 * @return {Object}
 */
function buildUrl( queryParams ) {
  return {
    hostname: 'todoist.com',
    path: '/API/v7/sync?' + querystring.stringify( queryParams )
  };
}

/**
 * Generate a UUID.
 *
 * @author moranje <martieno@gmail.com>
 * @since  2016-07-03
 * @return {String}
 */
function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace( /[xy]/g, function( c ) {
    var r = Math.random() * 16|0, v = c == 'x' ? r : ( r&0x3|0x8 );
    return v.toString( 16 );
  } );
}

/**
 * Async call to the Todoist API.
 *
 * @author moranje <martieno@gmail.com>
 * @since  2016-07-03
 * @param  {Object}   queryParams The query parameters.
 * @param  {Function} success     The success callback
 * @param  {Function} error       The error callback.
 * @return {[type]}
 */
function api( queryParams, success, error ) {
  var req = https.get( buildUrl( queryParams ), function( res ) {
    var data = '';

    res.on('data', function( chunk ) {
      data += chunk;
    } );

    res.on( 'end', function() {
      success( JSON.parse( data ) );
    } );

    // Return response errors
    res.on( 'error', function( err ) {
      error( err );
    } )
  } );

  // Return request errors
  req.on( 'error', function( err ) {
    error( err );
  } )
}

/**
 * Get all relevant data from Todoist.
 *
 * @author moranje <martieno@gmail.com>
 * @since  2016-08-24
 * @param  {String}   token   A Todoist token.
 * @param  {Function} success The success callback.
 * @param  {Function} error   The error callback.
 * @return {String}
 */
function getAll( token, success, error ) {
  return api( {
    token: token,
    seq_no: 0,
    resource_types: '["projects","items","labels"]'
  }, success, error );
}

/**
 * Get a list of todos.
 *
 * @author moranje <martieno@gmail.com>
 * @since  2016-07-03
 * @param  {String}   token   A Todoist token.
 * @param  {Function} success The success callback.
 * @param  {Function} error   The error callback.
 * @return {String}
 */
function getTasks( token, success, error ) {
  if ( cache.seq_no_global ) {
    return success( cache );
  }

  return api( {
    token: token,
    seq_no: 0,
    resource_types: '["items"]'
  }, success, error );
}

/**
 * Get a list of projects.
 *
 * @author moranje <martieno@gmail.com>
 * @since  2016-07-04
 * @param  {String}   token   A Todoist token.
 * @param  {Function} success The success callback.
 * @param  {Function} error   The error callback.
 * @return {String}
 */
function getProjects( token, success, error ) {
  if ( cache.seq_no_global ) {
    return success( cache );
  }

  return api( {
    token: token,
    seq_no: 0,
    resource_types: '["projects"]'
  }, success, error );
}

/**
 * Get a list of labels.
 *
 * @author moranje <martieno@gmail.com>
 * @since  2016-08-23
 * @param  {String}   token   A Todoist token.
 * @param  {Function} success The success callback.
 * @param  {Function} error   The error callback.
 * @return {String}
 */
function getLabels( token, success, error ) {
  if ( cache.seq_no_global ) {
    return success( cache );
  }

  return api( {
    token: token,
    seq_no: 0,
    resource_types: '["labels"]'
  }, success, error );
}

/**
 * Mark a task 'done'.
 *
 * @author moranje <martieno@gmail.com>
 * @since  2016-07-03
 * @param  {String}   id      A task id.
 * @param  {String}   token   A Todoist token.
 * @param  {Function} success The success callback.
 * @param  {Function} error   The error callback.
 * @return {String}
 */
function markTaskDone( id, token, success, error ) {
  return api( {
    token: token,
    commands: JSON.stringify( [ {
      type: 'item_complete',
      uuid: uuid(),
      args: {
        ids: '[' + id + ']'
      }
    } ] )
  }, success, error );
}

module.exports = {
  getAll: getAll,
  getTasks: getTasks,
  getProjects: getProjects,
  getLabels: getLabels,
  markTaskDone: markTaskDone
};