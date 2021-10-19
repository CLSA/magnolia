cenozoApp.defineModule( 'reference', null, ( module ) => {

  angular.extend( module, {
    identifier: {
      parent: {
        subject: 'reqn_version',
        column: 'id'
      }
    },
    name: {
      singular: 'reference',
      plural: 'references',
      possessive: 'reference\'s'
    }
  } );

  /* ######################################################################################################## */
  cenozo.defineModuleModel( module, [ 'add' ] );

} );
