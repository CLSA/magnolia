// extend the framework's module
define( [ cenozoApp.module( 'user' ).getFileUrl( 'module.js' ) ], function() {
  'use strict';

  var module = cenozoApp.module( 'user' );

  // add the newsletter column to the column list
  cenozo.insertPropertyAfter( module.columnList, 'site_count', 'newsletter', {
    column: 'newsletter',
    title: 'Newsletter',
    type: 'boolean'
  } );

} );
