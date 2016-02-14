/* global ObjC, Library, $ */

/*********************
 * author: M. Oranje *
 * license: MIT      *
 *********************/

ObjC.import( 'stdlib' );

var workflow = Library( 'workflow' ),
  todoist = Library( 'todoist' ),
  CONFIG = workflow.getConfig( $.getenv( 'alfred_workflow_data' ) );

// Mark it ZERO! Query contains the task id.
todoist.markTaskDone( '{query}', CONFIG.token );
