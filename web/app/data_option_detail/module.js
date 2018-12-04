define( [ 'data_option' ].reduce( function( list, name ) {
  return list.concat( cenozoApp.module( name ).getRequiredFiles() );
}, [] ), function() {
  'use strict';

  try { var module = cenozoApp.module( 'data_option_detail', true ); } catch( err ) { console.warn( err ); return; }
  angular.extend( module, {
    identifier: {
      parent: {
        subject: 'data_option',
        column: 'data_option.rank'
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
      rank: { title: 'Rank', type: 'rank' },
      name_en: { title: 'Name' }
    },
    defaultOrder: { column: 'rank', reverse: false }
  } );

  module.addInputGroup( '', {
    category: {
      title: 'Category',
      type: 'string',
      constant: true
    },
    data_option: {
      title: 'Data Option',
      type: 'string',
      constant: true
    },
    rank: {
      title: 'Rank',
      type: 'rank'
    },
    name_en: {
      title: 'Name (English)',
      type: 'string'
    },
    name_fr: {
      title: 'Name (French)',
      type: 'string'
    },
    note_en: {
      title: 'Note (English)',
      type: 'text'
    },
    note_fr: {
      title: 'Note (French)',
      type: 'text'
    },
    data_option_category_rank: {
      column: 'data_option_category.rank',
      type: 'hidden'
    }
  } );

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
    'CnBaseModelFactory', 'CnDataOptionDetailListFactory', 'CnDataOptionDetailViewFactory',
    function( CnBaseModelFactory, CnDataOptionDetailListFactory, CnDataOptionDetailViewFactory ) {
      var object = function( root ) {
        var self = this;
        CnBaseModelFactory.construct( this, module );
        this.listModel = CnDataOptionDetailListFactory.instance( this );
        this.viewModel = CnDataOptionDetailViewFactory.instance( this, root );

        var studyDataModule = cenozoApp.module( 'data_option' );

        // override getParentIdentifier since it has a grandparent
        this.getParentIdentifier = function() {
          var parentIdentifier = this.$$getParentIdentifier();
          parentIdentifier.identifier =
            'data_option_category_rank=' + self.viewModel.record.data_option_category_rank + ';' + parentIdentifier.identifier;
          return parentIdentifier;
        };
      };

      return {
        root: new object( true ),
        instance: function() { return new object( false ); }
      };
    }
  ] );

} );
