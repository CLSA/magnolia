cenozoApp.defineModule( { name: 'data_version', models: ['add', 'list', 'view'], create: module => {

  angular.extend( module, {
    identifier: {},
    name: {
      singular: 'data version',
      plural: 'data versions',
      possessive: 'data version\'s'
    },
    columnList: {
      name: { title: 'Name' },
      reqn_count: { title: 'Requisitions' }
    },
    defaultOrder: {
      column: 'data_version.name',
      reverse: false
    }
  } );

  module.addInputGroup( '', {
    name: {
      title: 'Name',
      type: 'string'
    }
  } );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnDataVersionViewFactory', [
    'CnBaseViewFactory', '$state',
    function( CnBaseViewFactory, $state ) {
      var object = function( parentModel, root ) {
        CnBaseViewFactory.construct( this, parentModel, root );

        var self = this;
        async function init() {
          // Have the data release model point to the requisition instead
          await self.deferred.promise;

          if( angular.isDefined( self.dataReleaseModel ) ) {
            self.dataReleaseModel.listModel.heading = 'Requisition List';
            self.dataReleaseModel.listModel.parentModel.transitionToViewState = async function( record ) {
              await $state.go( 'reqn.view', { identifier: 'identifier=' + record.identifier } );
            };
          }
        }

        init();
      }
      return { instance: function( parentModel, root ) { return new object( parentModel, root ); } };
    }
  ] );

} } );
