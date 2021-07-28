define( function() {
  'use strict';

  try { var module = cenozoApp.module( 'data_version', true ); } catch( err ) { console.warn( err ); return; }
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
  cenozo.providers.directive( 'cnDataVersionAdd', [
    'CnDataVersionModelFactory',
    function( CnDataVersionModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'add.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnDataVersionModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnDataVersionList', [
    'CnDataVersionModelFactory',
    function( CnDataVersionModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'list.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnDataVersionModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnDataVersionView', [
    'CnDataVersionModelFactory',
    function( CnDataVersionModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'view.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnDataVersionModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnDataVersionAddFactory', [
    'CnBaseAddFactory',
    function( CnBaseAddFactory ) {
      var object = function( parentModel ) { CnBaseAddFactory.construct( this, parentModel ); };
      return { instance: function( parentModel ) { return new object( parentModel ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnDataVersionListFactory', [
    'CnBaseListFactory',
    function( CnBaseListFactory ) {
      var object = function( parentModel ) { CnBaseListFactory.construct( this, parentModel ); };
      return { instance: function( parentModel ) { return new object( parentModel ); } };
    }
  ] );

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

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnDataVersionModelFactory', [
    'CnBaseModelFactory', 'CnDataVersionAddFactory', 'CnDataVersionListFactory', 'CnDataVersionViewFactory',
    function( CnBaseModelFactory, CnDataVersionAddFactory, CnDataVersionListFactory, CnDataVersionViewFactory ) {
      var object = function( root ) {
        CnBaseModelFactory.construct( this, module );
        this.addModel = CnDataVersionAddFactory.instance( this );
        this.listModel = CnDataVersionListFactory.instance( this );
        this.viewModel = CnDataVersionViewFactory.instance( this, root );
      };

      return {
        root: new object( true ),
        instance: function() { return new object( false ); }
      };
    }
  ] );

} );
