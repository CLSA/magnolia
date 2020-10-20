define( [ 'data_option' ].reduce( function( list, name ) {
  return list.concat( cenozoApp.module( name ).getRequiredFiles() );
}, [] ), function() {
  'use strict';

  try { var module = cenozoApp.module( 'data_option_detail', true ); } catch( err ) { console.warn( err ); return; }
  angular.extend( module, {
    identifier: {
      parent: {
        subject: 'data_option',
        column: 'data_option.id'
      }
    },
    name: {
      singular: 'data-option detail',
      plural: 'data-option details',
      possessive: 'data-option detail\'s'
    },
    columnList: {
      parent_rank: { column: 'data_option.rank', title: 'Data Option Rank', type: 'rank' },
      parent_name_en: { column: 'data_option.name_en', title: 'Data Option Name' },
      study_phase: { column: 'study_phase.name', title: 'Study Phase' },
      rank: { title: 'Rank', type: 'rank' },
      name_en: { title: 'Name' },
      note_en: { title: 'Note', type: 'text', limit: 20 }
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
    data_option_id: {
      title: 'Data Option',
      type: 'enum',
      isConstant: 'view'
    },
    study_phase_id: {
      title: 'Study Phase',
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
  cenozo.providers.directive( 'cnDataOptionDetailAdd', [
    'CnDataOptionDetailModelFactory',
    function( CnDataOptionDetailModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'add.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnDataOptionDetailModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnDataOptionDetailList', [
    'CnDataOptionDetailModelFactory',
    function( CnDataOptionDetailModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'list.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnDataOptionDetailModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnDataOptionDetailView', [
    'CnDataOptionDetailModelFactory',
    function( CnDataOptionDetailModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'view.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnDataOptionDetailModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnDataOptionDetailAddFactory', [
    'CnBaseAddFactory',
    function( CnBaseAddFactory ) {
      var object = function( parentModel ) { CnBaseAddFactory.construct( this, parentModel ); };
      return { instance: function( parentModel ) { return new object( parentModel ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnDataOptionDetailListFactory', [
    'CnBaseListFactory',
    function( CnBaseListFactory ) {
      var object = function( parentModel ) { CnBaseListFactory.construct( this, parentModel ); };
      return { instance: function( parentModel ) { return new object( parentModel ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnDataOptionDetailViewFactory', [
    'CnBaseViewFactory',
    function( CnBaseViewFactory ) {
      var object = function( parentModel, root ) { CnBaseViewFactory.construct( this, parentModel, root ); }
      return { instance: function( parentModel, root ) { return new object( parentModel, root ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnDataOptionDetailModelFactory', [
    'CnBaseModelFactory', 'CnDataOptionDetailAddFactory', 'CnDataOptionDetailListFactory', 'CnDataOptionDetailViewFactory',
    'CnHttpFactory', '$q',
    function( CnBaseModelFactory, CnDataOptionDetailAddFactory, CnDataOptionDetailListFactory, CnDataOptionDetailViewFactory,
              CnHttpFactory, $q ) {
      var object = function( root ) {
        var self = this;
        CnBaseModelFactory.construct( this, module );
        this.addModel = CnDataOptionDetailAddFactory.instance( this );
        this.listModel = CnDataOptionDetailListFactory.instance( this );
        this.viewModel = CnDataOptionDetailViewFactory.instance( this, root );

        var studyDataModule = cenozoApp.module( 'data_option' );

        // extend getMetadata
        this.getMetadata = function() {
          return this.$$getMetadata().then( function() {
            return $q.all( [

              CnHttpFactory.instance( {
                path: 'data_option',
                data: {
                  select: { column: [ 'id', 'name_en' ] },
                  modifier: { order: 'data_option.rank' }
                }
              } ).query().then( function success( response ) {
                self.metadata.columnList.data_option_id.enumList = [];
                response.data.forEach( function( item ) {
                  self.metadata.columnList.data_option_id.enumList.push( {
                    value: item.id, name: item.name_en
                  } );
                } );
              } ),

              CnHttpFactory.instance( {
                path: 'study_phase',
                data: {
                  select: { column: [ 'id', 'name' ] },
                  modifier: {
                    where: { column: 'study.name', operator: '=', value: 'CLSA' },
                    order: 'name'
                  }
                }
              } ).query().then( function success( response ) {
                self.metadata.columnList.study_phase_id.enumList = [];
                response.data.forEach( function( item ) {
                  self.metadata.columnList.study_phase_id.enumList.push( {
                    value: item.id, name: item.name
                  } );
                } );
              } )

            ] );
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
