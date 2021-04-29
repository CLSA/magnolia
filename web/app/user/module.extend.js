// extend the framework's module
define( [ cenozoApp.module( 'user' ).getFileUrl( 'module.js' ) ], function() {
  'use strict';

  var module = cenozoApp.module( 'user' );

  // we don't need the site column since this is a one-site application
  delete module.columnList.sites;

  // add the newsletter column to the column list
  cenozo.insertPropertyAfter( module.columnList, 'role_list', 'newsletter', {
    column: 'newsletter',
    title: 'Newsletter',
    type: 'boolean'
  } );

  // add the supervisor input
  module.addInput( '', 'supervisor_user_id', {
    title: 'Supervisor',
    type: 'string',
    type: 'lookup-typeahead',
    typeahead: {
      table: 'user',
      select: 'CONCAT( user.first_name, " ", user.last_name, " (", user.name, ")" )',
      where: [ 'user.first_name', 'user.last_name', 'user.name' ]
    },
    isExcluded: 'add',
    help: 'If set then all new requisitions created by this user will define the supervisor as the primary applicant ' +
          'and this user as the trainee.'
  } );

  // extend the model factory
  cenozo.providers.decorator( 'CnUserModelFactory', [
    '$delegate', 'CnHttpFactory',
    function( $delegate, CnHttpFactory ) {
      var instance = $delegate.instance;
      function extendObject( object ) {
        var getMetadata = object.getMetadata;
        angular.extend( object, {
          // extend getMetadata
          getMetadata: async function() {
            await getMetadata();
            var response = await CnHttpFactory.instance( { path: 'applicant' } ).head();
            var columnMetadata = angular.fromJson( response.headers( 'Columns' ) ).supervisor_user_id;
            columnMetadata.required = '1' == columnMetadata.required;
            object.metadata.columnList.supervisor_user_id = columnMetadata;
          }
        } );
      }

      extendObject( $delegate.root );

      $delegate.instance = function() {
        var object = instance();
        extendObject( object );
        return object;
      };

      return $delegate;
    }
  ] );

} );
