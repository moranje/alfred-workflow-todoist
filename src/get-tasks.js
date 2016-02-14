/* global ObjC, Library, $ */

/*********************
 * author: M. Oranje *
 * license: MIT      *
 *********************/

ObjC.import( 'stdlib' );

// First run check, I move some files into place here.
var app = Application.currentApplication();
app.includeStandardAdditions = true;
app.doShellScript( './library-check.sh' );

var workflow = Library( 'workflow' ),
  todoist = Library( 'todoist' ),
  CONFIG = workflow.getConfig( $.getenv( 'alfred_workflow_data' ) ),
  response = todoist.getTasks( CONFIG.token );

// Loop through all items retrieved from todoist (until the defined maximum)
// and add create xml items from them. Todoist orders tasks by relevance, it
// seems, so no additional magic for ordering or filtering the items is applied.
response.Items.forEach( function( task, index ) {
  if ( index < CONFIG.maxItems ) {
    workflow.addItem( {
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

// List the todoist task in alfred
workflow.displayItems();
