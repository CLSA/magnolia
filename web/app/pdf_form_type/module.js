cenozoApp.defineModule( 'pdf_form_type', null, ( module ) => {

  angular.extend( module, {
    identifier: { column: 'name' },
    name: {
      singular: 'PDF form template',
      plural: 'PDF form templates',
      possessive: 'PDF form template\'s'
    },
    columnList: {
      name: {
        title: 'Name'
      },
      active_pdf_form_version: {
        column: 'active_pdf_form.version',
        title: 'Version',
        type: 'date'
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
