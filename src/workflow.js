/* global Library */

/*********************
 * author: M. Oranje *
 * license: MIT      *
 *********************/

var helper = Library( 'workflow-helper' ),
  items = [];

/**
 * Return parse configuration file.
 *
 * @public
 * @author moranje
 * @date    2016-02-13
 * @param   {String}  folder  The workflow folder path.
 * @return  {Object}          The parsed config JSON.
 */
function getConfig( folder ) {
  return JSON.parse( helper.shell( `cat "${folder}/.workflowrc"` ) );
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
