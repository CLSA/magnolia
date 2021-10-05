define( [ 'data_selection' ].reduce( function( list, name ) {
  return list.concat( cenozoApp.module( name ).getRequiredFiles() );
}, [] ), function() {
  'use strict';

  try { var module = cenozoApp.module( 'data_selection_detail', true ); } catch( err ) { console.warn( err ); return; }
  angular.extend( module, {
    identifier: {
      parent: {
        subject: 'data_selection',
        column: 'data_selection.id'
      }
    },
    name: {
      singular: 'data-selection detail',
      plural: 'data-selection details',
      possessive: 'data-selection detail\'s'
    },
    columnList: {
      rank: { title: 'Rank', type: 'rank' },
      name_en: { title: 'Name' },
      note_en: { title: 'Note', type: 'text', limit: 200 }
    },
    defaultOrder: { column: 'rank', reverse: false }
  } );

  module.addInputGroup( '', {
    data_option_category_name_en: {
      column: 'data_option_category.name_en',
      title: 'Category',
      type: 'string',
      isExcluded: 'add',
      isConstant: true
    },
    data_selection_id: {
      title: 'Data Selection',
      type: 'enum',
      isConstant: 'view'
    },
    rank: { title: 'Rank', type: 'rank' },
    name_en: { title: 'Name (English)', type: 'string' },
    name_fr: { title: 'Name (French)', type: 'string' },
    note_en: { title: 'Note (English)', type: 'text' },
    note_fr: { title: 'Note (French)', type: 'text' },
    data_option_category_rank: { column: 'data_option_category.rank', type: 'hidden' }
  } );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnDataSelectionDetailAdd', [
    'CnDataSelectionDetailModelFactory',
    function( CnDataSelectionDetailModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'add.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnDataSelectionDetailModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnDataSelectionDetailList', [
    'CnDataSelectionDetailModelFactory',
    function( CnDataSelectionDetailModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'list.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnDataSelectionDetailModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnDataSelectionDetailView', [
    'CnDataSelectionDetailModelFactory',
    function( CnDataSelectionDetailModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'view.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnDataSelectionDetailModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnDataSelectionDetailAddFactory', [
    'CnBaseAddFactory',
    function( CnBaseAddFactory ) {
      var object = function( parentModel ) { CnBaseAddFactory.construct( this, parentModel ); };
      return { instance: function( parentModel ) { return new object( parentModel ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnDataSelectionDetailListFactory', [
    'CnBaseListFactory',
    function( CnBaseListFactory ) {
      var object = function( parentModel ) { CnBaseListFactory.construct( this, parentModel ); };
      return { instance: function( parentModel ) { return new object( parentModel ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnDataSelectionDetailViewFactory', [
    'CnBaseViewFactory',
    function( CnBaseViewFactory ) {
      var object = function( parentModel, root ) { CnBaseViewFactory.construct( this, parentModel, root ); }
      return { instance: function( parentModel, root ) { return new object( parentModel, root ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnDataSelectionDetailModelFactory', [
    'CnBaseModelFactory', 'CnDataSelectionDetailAddFactory', 'CnDataSelectionDetailListFactory', 'CnDataSelectionDetailViewFactory',
    'CnHttpFactory',
    function( CnBaseModelFactory, CnDataSelectionDetailAddFactory, CnDataSelectionDetailListFactory, CnDataSelectionDetailViewFactory,
              CnHttpFactory ) {
      var object = function( root ) {
        CnBaseModelFactory.construct( this, module );
        this.addModel = CnDataSelectionDetailAddFactory.instance( this );
        this.listModel = CnDataSelectionDetailListFactory.instance( this );
        this.viewModel = CnDataSelectionDetailViewFactory.instance( this, root );

        // extend getMetadata
        this.getMetadata = async function() {
          var self = this;
          await this.$$getMetadata();

          var dataSelectionResponse = await CnHttpFactory.instance( {
            path: 'data_selection',
            data: {
              select: { column: [ 'id', { table: 'data_option', column: 'name_en' }, { table: 'study_phase', column: 'code' } ] },
              modifier: { order: 'data_option.rank', limit: 1000 }
            }
          } ).query();

          this.metadata.columnList.data_selection_id.enumList = [];
          dataSelectionResponse.data.forEach( function( item ) {
            self.metadata.columnList.data_selection_id.enumList.push( {
              value: item.id, name: item.name_en + ' (' + item.code + ')'
            } );
          } );
        };
      };

      return {
        root: new object( true ),
        instance: function() { return new object( false ); }
      };
    }
  ] );

} );
