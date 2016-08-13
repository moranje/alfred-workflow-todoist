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
   * @since  2016-07-04
   * @return {Object}
   */
  getProjects: function() {
    var list = {
      items: []
    };

    todoist.getProjects( settings.token, function( res ) {
      var response = JSON.parse( res );
      var projects = {};

      response.projects.forEach( function( project, index ) {
        projects[ project.name.toLowerCase() ] = project.id;
      } );

      settings.projects = projects;

      return echo( 'Projects updated' );
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
   * @since  2016-07-03
   * @return {String}
   */
  markDone: function() {
    todoist.markTaskDone( arg, settings.token, function( res ) {
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
calls[ call ]();