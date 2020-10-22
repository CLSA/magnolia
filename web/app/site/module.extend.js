// extend the framework's module
define( [ cenozoApp.module( 'site' ).getFileUrl( 'module.js' ) ], function() {
  'use strict';

  var module = cenozoApp.module( 'site' );

  // we don't need the participant_count column
  delete module.columnList.participant_count;

} );
