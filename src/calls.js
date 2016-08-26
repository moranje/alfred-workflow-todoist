var fs = require( 'fs' );
var todoist = require( './todoist' );
var fuzzy = require( './fuzzysearch' );

var DATA_PATH = process.env.HOME + '/Library/Application Support/Alfred 3/Workflow Data/com.alfred-workflow-todoist';
var CACHE_PATH = process.env.HOME + '/Library/Caches/com.runningwithcrayons.Alfred-3/Workflow Data/com.alfred-workflow-todoist';

var settings = require( DATA_PATH + '/settings.json' );
var cache = require( CACHE_PATH + '/todoist.json' );

/**
 * A simple 'echo' function.
 *
 * @author moranje <martieno@gmail.com>
 * @since  2016-07-03
 * @param  {*}   response Any response text.
 * @return {String}
 */
function echo( response ) {
  console.log( JSON.stringify( response ) );
}

/**
 * Generic error handler
 *
 * @author moranje <martieno@gmail.com>
 * @since  2016-08-25
 * @param  {Error}   err An error object
 * @return {String}
 */
function error( err ) {
  // The 'Error' suffix signals something has failed to the notification
  // handler
  return console.log( 'Error', err );
}

/**
 * Create Alfred list style JSON output for tasks.
 *
 * @author moranje <martieno@gmail.com>
 * @since  2016-07-03
 * @return {Object}
 */
function optionList( list ) {
  var options = {
    items: []
  };

  list.forEach( function( item, index ) {
    options.items.push( {
      uid: index,
      arg: item.id,
      valid: 'YES',
      autocomplete: '',
      icon: 'icon.png',
      title: item.content,
      subtitle: 'Hit ENTER to mark it zero (err.. done)'
    } );
  } );

  return options;
}

/**
 * Refreshes the Todoist data cache.
 *
 * @author moranje <martieno@gmail.com>
 * @since  2016-08-24
 * @return {String}
 */
 function refreshCache() {
  todoist.getAll( settings.token, function( data ) {
    fs.writeFile( CACHE_PATH + '/todoist.json', JSON.stringify( data ), function( err ) {
        if ( err )  return console.log( err );
    } );
  }, error ); 
}

/**
 * Get a capped list of tasks from Todoist.
 *
 * @author moranje <martieno@gmail.com>
 * @since  2016-07-03
 * @return {Object}
 */
function getTasksCapped() {
  var list = [];

  todoist.getTasks( settings.token, function( data ) {
    data.items.forEach( function( task, index ) {
      if ( index < settings.max_items ) {
        list.push( task );
      }
    } );

    return echo( optionList( list ) );
  } );
}

/**
 * Search (fuzzy) the todoist tasks
 *
 * @author moranje <martieno@gmail.com>
 * @since  2016-08-24
 * @param  {String}   query The search query string.
 * @return {Object}
 */
function searchTasks( query ) {
  var list = [];

  todoist.getTasks( settings.token, function( data ) {
    data.items.forEach( function( task, index ) {
      if ( fuzzy( query, task.content.toLowerCase() ) ) {
        list.push( task );
      }
    } );

    return echo( optionList( list ) );
  } );
}

/**
 * Get a list of projects from Todoist.
 *
 * @author moranje <martieno@gmail.com>
 * @param {String} name The project's name.
 * @since  2016-07-04
 * @return {Object}
 */
function getProjects( name ) {
  todoist.getProjects( settings.token, function( data ) {
    var projects = {};

    data.projects.forEach( function( project, index ) {
      projects[ project.name.toLowerCase() ] = project.id;
    } );

    if ( name ) {
      return echo( projects[ name ] );
    }

    return echo( projects );
  }, error );
}

/**
 * Get a list of labels from Todoist.
 *
 * @author moranje <martieno@gmail.com>
 * @param {String} string The label names string.
 * @since  2016-07-04
 * @return {Object}
 */
function getLabels( string ) {
  todoist.getLabels( settings.token, function( data ) {
    var names = string.split( ',' );
    var labels = [];

    data.labels.forEach( function( label, index ) {
      names.forEach( function ( name ) {
        if ( string && name === label.name ) {
          labels.push( label.id );
        }
      });
    } );

    return echo( labels );
  }, error );
}

/**
 * Mark a todo item 'done'.
 *
 * @author moranje <martieno@gmail.com>
 * @param {String|Number} id The task's id.
 * @since  2016-07-03
 * @return {String}
 */
function markDone( id ) {
  todoist.markTaskDone( id, settings.token, function( res ) {
    // Notification message.
    echo( 'Done, done and done!' );
  }, error );
}

module.exports = {
  refreshCache: refreshCache,
  getTasksCapped: getTasksCapped,
  searchTasks: searchTasks,
  getProjects: getProjects,
  getLabels: getLabels,
  markDone: markDone
}