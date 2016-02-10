/* global Application */

var CONFIG = JSON.parse( '{query}'.replace( /&quot;/g, '\"' ) ),
  app = Application.currentApplication(),
  uuid;

// Use default voice and language settings
app.includeStandardAdditions = true;

// Generate uuid for the api call
uuid = app.doShellScript( 'echo $(uuidgen)' );

/**
 * Call the Todoist servers
 *
 * @public
 * @author moranje
 * @date    2016-02-10
 * @param   {String}    params  Additional parameters on the api call.
 * @return  {Object}            The parsed JSON response.
 */
function apiRequest( params ) {
  return JSON.parse(
    app.doShellScript( `curl https://todoist.com/API/v6/sync -d token=${CONFIG.token} ${params}` )
  );
}

/********
 * MAIN *
 ********/

apiRequest( `-d commands='[{"type": "item_complete", "uuid": "${uuid}", "args": {"ids": [${CONFIG.id}]}}]'` );
