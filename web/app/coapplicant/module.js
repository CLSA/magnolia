cenozoApp.defineModule( 'coapplicant', null, ( module ) => {

  angular.extend( module, {
    identifier: {
      parent: {
        subject: 'reqn_version',
        column: 'id'
      }
    },
    name: {
      singular: 'co-applicant',
      plural: 'co-applicants',
      possessive: 'co-applicant\'s'
    }
  } );

  module.addInputGroup( '', {
    name: { title: 'Name', type: 'string' },
    position: { title: 'Position', type: 'string' },
    affiliation: { title: 'Affiliation', type: 'string' },
    email: { title: 'E-mail', type: 'string', format: 'email' },
    role: { title: 'Role', type: 'string' },
    access: { title: 'Access', type: 'boolean', type: 'boolean' }
  } );

  /* ######################################################################################################## */
  cenozo.defineModuleModel( module, [ 'add' ] );

} );
