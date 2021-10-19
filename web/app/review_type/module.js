cenozoApp.defineModule( 'review_type', null, ( module ) => {

  angular.extend( module, {
    identifier: { column: 'name' },
    name: {
      singular: 'review type',
      plural: 'review types',
      possessive: 'review type\'s'
    },
    columnList: {
      name: {
        title: 'Name'
      },
      review_count: {
        title: 'Reviews',
        type: 'number'
      },
      role_list: {
        title: 'Roles'
      }
    },
    defaultOrder: {
      column: 'name',
      reverse: false
    }
  } );

  module.addInputGroup( '', {
    name: {
      title: 'Name',
      type: 'string',
      isConstant: true
    }
  } );

  /* ######################################################################################################## */
  cenozo.defineModuleModel( module, [ 'list', 'view' ] );

} );
