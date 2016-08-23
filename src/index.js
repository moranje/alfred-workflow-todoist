// author: M. Oranje
// licence: MIT

var call = process.argv[ 2 ];
var settingsPath = process.argv[ 3 ];
var arg = process.argv[ 4 ];
var todoist = require( './todoist' );
var settings = require( settingsPath );
var calls = {

  /**
   * Get a list of tasks from Todoist.
   *
   * @author moranje <martieno@gmail.com>
   * @since  2016-07-03
   * @return {Object}
   */
  getTasks: function() {
    var list = {
      items: []
    };

    todoist.getTasks( settings.token, function( res ) {
      var tasks = JSON.parse( res );

      tasks.items.forEach( function( task, index ) {

        // Limit the amount of items shown
        if ( index < settings.max_items ) {
          list.items.push( {
            uid: index,
            arg: task.id,
            valid: 'YES',
            autocomplete: '',
            icon: 'icon.png',
            title: task.content,
            subtitle: 'Hit ENTER to mark it zero (err.. done)'
          } );
        }
      } );

      return echo( list );
    }, function( err ) {
      // The 'Error' suffix signals something has failed to the notification
      // handler
      console.log( 'Error', err );
    } );
  },

  /**
   * Get a list of projects from Todoist.
   *
   * @author moranje <martieno@gmail.com>
   * @param {String} name The project's name.
   * @since  2016-07-04
   * @return {Object}
   */
  getProjects: function( name ) {
    todoist.getProjects( settings.token, function( res ) {
      var response = JSON.parse( res );
      var projects = {};

      response.projects.forEach( function( project, index ) {
        projects[ project.name.toLowerCase() ] = project.id;
      } );

      if ( name ) {
        return echo( projects[ name ] );
      }

      return echo( projects );
    }, function( err ) {
      // The 'Error' suffix signals something has failed to the notification
      // handler
      console.log( 'Error', err );
    } );
  },

  /**
   * Get a list of labels from Todoist.
   *
   * @author moranje <martieno@gmail.com>
   * @param {String} string The label names string.
   * @since  2016-07-04
   * @return {Object}
   */
  getLabels: function( string ) {
    todoist.getLabels( settings.token, function( res ) {
      var response = JSON.parse( res );
      var names = string.split( ',' );
      var labels = [];

      response.labels.forEach( function( label, index ) {
        names.forEach( function ( name ) {
          if ( string && name === label.name ) {
            labels.push( label.id );
          }
        });
      } );

      return echo( labels );
    }, function( err ) {
      // The 'Error' suffix signals something has failed to the notification
      // handler
      console.log( 'Error', err );
    } );
  },

  /**
   * Mark a todo item 'done'.
   *
   * @author moranje <martieno@gmail.com>
   * @param {String|Number} id The task's id.
   * @since  2016-07-03
   * @return {String}
   */
  markDone: function( id ) {
    todoist.markTaskDone( id, settings.token, function( res ) {
      // Notification message.
      echo( 'Done, done and done!' );
    }, function( err ) {
      // The 'Error' suffix signals something has failed to the notification
      // handler
      console.log( 'Error', err );
    } );
  }
}

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
 * This returns the call to the Todoist API
 */
calls[ call ]( arg );
