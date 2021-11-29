cenozoApp.defineModule( { name: 'data_release', models: ['add', 'list', 'view'], create: module => {

  angular.extend( module, {
    identifier: {
      parent: {
        subject: 'reqn',
        column: 'reqn.identifier'
      }
    },
    name: {
      singular: 'data version',
      plural: 'data versions',
      possessive: 'data version\'s'
    },
    columnList: {
      identifier: { title: 'Identifier', column: 'reqn.identifier' },
      data_version: { title: 'Version', column: 'data_version.name' },
      category: { title: 'Category' },
      date: { title: 'Date', type: 'date' }
    },
    defaultOrder: {
      column: 'data_release.date',
      reverse: true
    }
  } );

  module.addInputGroup( '', {
    identifier: {
      title: 'Identifier',
      column: 'reqn.identifier',
      type: 'lookup-typeahead',
      typeahead: {
        table: 'reqn',
        select: 'reqn.identifier',
        where: 'reqn.identifier'
      }
    },
    data_version_id: {
      title: 'Version',
      type: 'enum'
    },
    category: {
      title: 'Category',
      type: 'enum'
    },
    date: {
      title: 'Date',
      type: 'date'
    }
  } );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnDataReleaseModelFactory', [
    'CnBaseModelFactory', 'CnDataReleaseAddFactory', 'CnDataReleaseListFactory', 'CnDataReleaseViewFactory',
    'CnHttpFactory',
    function( CnBaseModelFactory, CnDataReleaseAddFactory, CnDataReleaseListFactory, CnDataReleaseViewFactory,
              CnHttpFactory ) {
      var object = function( root ) {
        CnBaseModelFactory.construct( this, module );
        this.addModel = CnDataReleaseAddFactory.instance( this );
        this.listModel = CnDataReleaseListFactory.instance( this );
        this.viewModel = CnDataReleaseViewFactory.instance( this, root );

        // allow adding and deleting even if parent is read-only
        this.getAddEnabled = function() { return angular.isDefined( this.module.actions.add ); };
        this.getDeleteEnabled = function() { return angular.isDefined( this.module.actions.delete ); };

        this.getMetadata = async function() {
          await this.$$getMetadata();

          var response = await CnHttpFactory.instance( {
            path: 'data_version',
            data: {
              select: { column: [ 'id', 'name' ] },
              modifier: { order: 'name', limit: 1000 }
            }
          } ).query();

          this.metadata.columnList.data_version_id.enumList = response.data.reduce( ( list, item ) => {
            list.push( { value: item.id, name: item.name } );
            return list;
          }, [] );
        };
      };

      return {
        root: new object( true ),
        instance: function() { return new object( false ); }
      };
    }
  ] );

} } );
