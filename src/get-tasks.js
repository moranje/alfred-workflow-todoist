/* global Application */

var CONFIG = {
    token: '<your api token>',
    maxItems: 10
  }, items = [];

/**
 * Call the Todoist servers
 *
 * @public
 * @author moranje
 * @date    2016-02-10
 * @param   {String|function}    params  Additional parameters on the api call.
 * @return  {Object}                     The parsed JSON response.
 */
function apiRequest( params ) {
  var app = Application.currentApplication(),
    additionalParams = typeof params === 'function' ? params() : params;

  // Use default voice and language settings
  app.includeStandardAdditions = true;

  return JSON.parse(
    app.doShellScript( `curl https://todoist.com/API/v6/sync -d token=${CONFIG.token} ${additionalParams}` )
  );
}

/**
 * Add an item to the list of options to be displayed in alfred's searchbar.
 *
 * @public
 * @author moranje
 * @date    2016-02-10
 * @param   {Object}    options  The options object of an item.
 * @return  {String}             The interpolated xml string.
 */
function addItem( options ) {
  return items.push( [
    `<item uid="${options.uid}" arg="${options.arg}" valid="${options.valid}" autocomplete="${options.autocomplete}" type="file">`,
    `<title>${options.title}</title>`,
    `<subtitle>${options.subtitle}</subtitle>`,
    `<icon>${options.icon}</icon>`,
    `</item>`
  ].join( '' ) );
}

/**
 * Build the list from the stored items, wrap and ruturn it for display in
 * Alfred.
 *
 * @public
 * @author moranje
 * @date    2016-02-10
 * @return  {String}    A populated xml string.
 */
function displayItems() {
  var xml = '<?xml version="1.0"?><items>';

  items.forEach( function( item ) {
    xml += item;
  } );

  return xml += '</items>';
}

/********
 * MAIN *
 ********/

var response = apiRequest( '-d seq_no=0 -d resource_types=\'["items"]\'' );

// Loop through all items retrieved from todoist (until the defined maximum)
// and add create xml items from them. Todoist orders tasks by relevance, it
// seems, so no additional magic for ordering or filtering the items is applied.
response.Items.forEach( function( task, index ) {
  if ( index < CONFIG.maxItems ) {
    var args = JSON.stringify( {
      token: CONFIG.token,
      id: task.id
    } ).replace( /\"/g, '&quot;' );

    addItem( {
      uid: index,
      arg: args,
      valid: 'YES',
      autocomplete: '',
      icon: 'icon.png',
      title: task.content,
      subtitle: 'Hit ENTER to mark it zero (err.. done)'
    } );
  }
} );

// List the todoist task in alfred
displayItems();
