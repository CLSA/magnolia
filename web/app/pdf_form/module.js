cenozoApp.defineModule( 'pdf_form', null, ( module ) => {

  angular.extend( module, {
    identifier: {
      parent: {
        subject: 'pdf_form_type',
        column: 'pdf_form_type.name'
      }
    },
    name: {
      singular: 'version',
      plural: 'versions',
      possessive: 'version\'s',
      friendlyColumn: 'version'
    },
    columnList: {
      version: {
        title: 'Version',
        type: 'date'
      },
      active: {
        title: 'Active',
        type: 'boolean',
        help: 'Is this the actively used version of the form?'
      }
    },
    defaultOrder: {
      column: 'version',
      reverse: true
    }
  } );

  module.addInputGroup( '', {
    version: {
      title: 'Version',
      type: 'date'
    },
    active: {
      title: 'Active',
      type: 'boolean',
      help: 'Determines whether this is the actively used version of the form (only one version may be active)'
    },
    filename: {
      title: 'File',
      type: 'file'
    }
  } );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnPdfFormAddFactory', [
    'CnBaseAddFactory',
    function( CnBaseAddFactory ) {
      var object = function( parentModel ) {
        CnBaseAddFactory.construct( this, parentModel );
        this.configureFileInput( 'filename', 'pdf' );
      };
      return { instance: function( parentModel ) { return new object( parentModel ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnPdfFormViewFactory', [
    'CnBaseViewFactory', 'CnHttpFactory',
    function( CnBaseViewFactory, CnHttpFactory ) {
      var object = function( parentModel, root ) {
        CnBaseViewFactory.construct( this, parentModel, root );
        this.configureFileInput( 'filename', 'pdf' );

        var self = this;
        this.afterView( function() {
          if( angular.isUndefined( self.downloadFile ) ) {
            self.downloadFile = async function() {
              await CnHttpFactory.instance( {
                path: self.parentModel.getServiceResourcePath(),
                format: 'pdf'
              } ).file();
            };
          }
        } );
      }
      return { instance: function( parentModel, root ) { return new object( parentModel, root ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.defineModuleModel( module, [ 'add', 'list', 'view' ] );

} );
