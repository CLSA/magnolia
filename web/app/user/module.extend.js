// extend the framework's module
define( [ cenozoApp.module( 'user' ).getFileUrl( 'module.js' ) ], function() {
  'use strict';

  var module = cenozoApp.module( 'user' );

  // we don't need the site column since this is a one-site application
  delete module.columnList.sites;

  // add the newsletter column to the column list
  cenozo.insertPropertyAfter( module.columnList, 'roles', 'newsletter', {
    column: 'newsletter',
    title: 'Newsletter',
    type: 'boolean'
  } );

  // add the supervisor input
  module.addInput( '', 'supervisor', {
    title: 'Supervisor',
    type: 'string',
    constant: true
  } );

  cenozo.providers.decorator( 'CnUserViewFactory', [
    '$delegate', '$state',
    function( $delegate, $state ) {
      var instance = $delegate.instance;
      $delegate.instance = function( parentModel, root ) {
        var object = instance( parentModel, root );
        object.deferred.promise.then( function() {
          object.graduateModel.getAddEnabled = function() {
            return object.graduateModel.$$getAddEnabled() && '(none)' == object.record.supervisor;
          };
        } );
        return object;
      };
      return $delegate;
    }
  ] );

} );
