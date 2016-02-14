/* global Application */

/*********************
 * author: M. Oranje *
 * license: MIT      *
 *********************/

var app = Application.currentApplication();

// Use default voice and language settings
app.includeStandardAdditions = true;

/**
 * Helper function that excecutes a shell command.
 *
 * @public
 * @author moranje
 * @date    2016-02-13
 * @param   {String}    command  Any shell command.
 * @return  {String}             The shell output.
 */
function shell( command ) {
  return app.doShellScript( command );
}

/**
 * Create a UUID.
 *
 * @public
 * @author moranje
 * @date    2016-02-14
 * @return  {String}    A new UUID.
 */
function uuid() {
  return shell( 'echo $(uuidgen)' );
}
