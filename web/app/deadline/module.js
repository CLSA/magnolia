cenozoApp.defineModule( 'deadline', null, ( module ) => {

  angular.extend( module, {
    identifier: { column: 'name' },
    name: {
      singular: 'deadline',
      plural: 'deadlines',
      possessive: 'deadline\'s'
    },
    columnList: {
      name: {
        title: 'Name'
      },
      date: {
        title: 'Date',
        type: 'date'
      },
      reqn_count: {
        title: 'Requisitions'
      }
    },
    defaultOrder: {
      column: 'date',
      reverse: true
    }
  } );

  module.addInputGroup( '', {
    name: {
      title: 'Name',
      type: 'string'
    },
    date: {
      title: 'Date',
      type: 'date'
    }
  } );

  /* ######################################################################################################## */
  cenozo.defineModuleModel( module, [ 'add', 'list', 'view' ] );

} );
