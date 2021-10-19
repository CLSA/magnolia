cenozoApp.defineModule( 'supplemental_file', null, ( module ) => {

  angular.extend( module, {
    identifier: {},
    name: {
      singular: 'supplemental file',
      plural: 'supplemental files',
      possessive: 'supplemental file\'s'
    },
    columnList: { name_en: { title: 'Name' } },
    defaultOrder: { column: 'name_en', reverse: false }
  } );

  module.addInputGroup( '', {
    name_en: {
      title: 'Name (English)',
      type: 'string',
      help: 'The name of the file (in English) as it will appear along with study data.'
    },
    name_fr: {
      title: 'Name (French)',
      type: 'string',
      help: 'The name of the file (in French) as it will appear along with study data.'
    },
    filename_en: {
      title: 'File (English)',
      type: 'file',
      isExcluded: 'add'
    },
    filename_fr: {
      title: 'File (French)',
      type: 'file',
      isExcluded: 'add'
    }
  } );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnSupplementalFileViewFactory', [
    'CnBaseViewFactory',
    function( CnBaseViewFactory ) {
      var object = function( parentModel, root ) {
        CnBaseViewFactory.construct( this, parentModel, root );
        this.configureFileInput( 'filename_en' );
        this.configureFileInput( 'filename_fr' );
      }
      return { instance: function( parentModel, root ) { return new object( parentModel, root ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.defineModuleModel( module, [ 'add', 'list', 'view' ] );

} );
