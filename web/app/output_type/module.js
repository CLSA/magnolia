define( function() {
  'use strict';

  try { var module = cenozoApp.module( 'output_type', true ); } catch( err ) { console.warn( err ); return; }
  angular.extend( module, {
    identifier: { column: 'name_en' },
    name: {
      singular: 'output type',
      plural: 'output types',
      possessive: 'output type\'s'
    },
    columnList: {
      name_en: {
        title: 'Name (English)'
      },
      name_fr: {
        title: 'Name (French)'
      },
      output_count: {
        title: 'Outputs',
        type: 'number'
      }
    },
    defaultOrder: {
      column: 'name_en',
      reverse: false
    }
  } );

  module.addInputGroup( '', {
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
  cenozo.providers.directive( 'cnOutputTypeAdd', [
    'CnOutputTypeModelFactory',
    function( CnOutputTypeModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'add.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnOutputTypeModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnOutputTypeList', [
    'CnOutputTypeModelFactory',
    function( CnOutputTypeModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'list.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnOutputTypeModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnOutputTypeView', [
    'CnOutputTypeModelFactory',
    function( CnOutputTypeModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'view.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnOutputTypeModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnOutputTypeAddFactory', [
    'CnBaseAddFactory',
    function( CnBaseAddFactory ) {
      var object = function( parentModel ) { CnBaseAddFactory.construct( this, parentModel ); };
      return { instance: function( parentModel ) { return new object( parentModel ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnOutputTypeListFactory', [
    'CnBaseListFactory',
    function( CnBaseListFactory ) {
      var object = function( parentModel ) { CnBaseListFactory.construct( this, parentModel ); };
      return { instance: function( parentModel ) { return new object( parentModel ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnOutputTypeViewFactory', [
    'CnBaseViewFactory', 'CnReqnHelper',
    function( CnBaseViewFactory, CnReqnHelper ) {
      var object = function( parentModel, root ) {
        CnBaseViewFactory.construct( this, parentModel, root );

        angular.extend( this, {
          onView: async function( force ) {
            this.updateOutputListLanguage();
            await this.$$onView( force );
          },

          updateOutputListLanguage: function() {
            var columnList = cenozoApp.module( 'output' ).columnList;
            columnList.output_type_en.isIncluded = function( $state, model ) { return true; };
            columnList.output_type_fr.isIncluded = function( $state, model ) { return false; };
            columnList.output_type_en.title = CnReqnHelper.translate( 'output', 'output_type', 'en' );
            columnList.output_type_fr.title = CnReqnHelper.translate( 'output', 'output_type', 'fr' );
            columnList.detail.title = CnReqnHelper.translate( 'output', 'detail', 'en' );
            columnList.output_source_count.title = CnReqnHelper.translate( 'output', 'output_source_count', 'en' );
          }
        } );
      }
      return { instance: function( parentModel, root ) { return new object( parentModel, root ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnOutputTypeModelFactory', [
    'CnBaseModelFactory', 'CnOutputTypeAddFactory', 'CnOutputTypeListFactory', 'CnOutputTypeViewFactory',
    function( CnBaseModelFactory, CnOutputTypeAddFactory, CnOutputTypeListFactory, CnOutputTypeViewFactory ) {
      var object = function( root ) {
        CnBaseModelFactory.construct( this, module );
        this.addModel = CnOutputTypeAddFactory.instance( this );
        this.listModel = CnOutputTypeListFactory.instance( this );
        this.viewModel = CnOutputTypeViewFactory.instance( this, root );
      };

      return {
        root: new object( true ),
        instance: function() { return new object( false ); }
      };
    }
  ] );

} );
