define( function() {
  'use strict';

  try { var module = cenozoApp.module( 'data_option', true ); } catch( err ) { console.warn( err ); return; }
  angular.extend( module, {
    identifier: {
      parent: {
        subject: 'data_option_category',
        column: 'data_option_category.name_en'
      }
    },
    name: {
      singular: 'data-option',
      plural: 'data-options',
      possessive: 'data-option\'s'
    },
    columnList: {
      category_rank: { column: 'data_option_category.rank', title: 'Category Rank', type: 'rank' },
      category_name_en: { column: 'data_option_category.name_en', title: 'Category Name' },
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
      constant: true
    },
    rank: {
      title: 'Rank',
      type: 'rank',
      constant: true
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
    }
  } );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnDataOptionList', [
    'CnDataOptionModelFactory',
    function( CnDataOptionModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'list.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnDataOptionModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnDataOptionView', [
    'CnDataOptionModelFactory',
    function( CnDataOptionModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'view.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnDataOptionModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnDataOptionListFactory', [
    'CnBaseListFactory',
    function( CnBaseListFactory ) {
      var object = function( parentModel ) { CnBaseListFactory.construct( this, parentModel ); };
      return { instance: function( parentModel ) { return new object( parentModel ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnDataOptionViewFactory', [
    'CnBaseViewFactory',
    function( CnBaseViewFactory ) {
      var object = function( parentModel, root ) { CnBaseViewFactory.construct( this, parentModel, root ); }
      return { instance: function( parentModel, root ) { return new object( parentModel, root ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnDataOptionModelFactory', [
    'CnBaseModelFactory', 'CnDataOptionListFactory', 'CnDataOptionViewFactory',
    function( CnBaseModelFactory, CnDataOptionListFactory, CnDataOptionViewFactory ) {
      var object = function( root ) {
        var self = this;
        CnBaseModelFactory.construct( this, module );
        this.listModel = CnDataOptionListFactory.instance( this );
        this.viewModel = CnDataOptionViewFactory.instance( this, root );
      };

      return {
        root: new object( true ),
        instance: function() { return new object( false ); }
      };
    }
  ] );

} );
