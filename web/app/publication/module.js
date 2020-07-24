define( function() {
  'use strict';

  try { var module = cenozoApp.module( 'publication', true ); } catch( err ) { console.warn( err ); return; }
  angular.extend( module, {
    identifier: {
      parent: {
        subject: 'reqn',
        column: 'reqn.identifier'
      }
    },
    name: {
      singular: 'publication',
      plural: 'publications',
      possessive: 'publication\'s'
    },
    columnList: {
      identifier: { column: 'reqn.identifier', title: 'Requisition' },
      reference: { title: 'Reference' }
    },
    defaultOrder: {
      column: 'publication.id',
      reverse: true
    }
  } );

  module.addInputGroup( '', {
    filename: {
      title: 'File',
      type: 'file'
    },
    reference: {
      title: 'Reference',
      type: 'string'
    }
  } );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnPublicationAdd', [
    'CnPublicationModelFactory',
    function( CnPublicationModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'add.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnPublicationModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnPublicationList', [
    'CnPublicationModelFactory',
    function( CnPublicationModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'list.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnPublicationModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnPublicationView', [
    'CnPublicationModelFactory',
    function( CnPublicationModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'view.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnPublicationModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnPublicationAddFactory', [
    'CnBaseAddFactory',
    function( CnBaseAddFactory ) {
      var object = function( parentModel ) {
        CnBaseAddFactory.construct( this, parentModel );
        this.configureFileInput( 'filename' );
      };
      return { instance: function( parentModel ) { return new object( parentModel ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnPublicationListFactory', [
    'CnBaseListFactory',
    function( CnBaseListFactory ) {
      var object = function( parentModel ) { CnBaseListFactory.construct( this, parentModel ); };
      return { instance: function( parentModel ) { return new object( parentModel ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnPublicationViewFactory', [
    'CnBaseViewFactory', 'CnReqnHelper', 'CnHttpFactory', 'CnSession',
    function( CnBaseViewFactory, CnReqnHelper, CnHttpFactory, CnSession ) {
      var object = function( parentModel, root ) {
        CnBaseViewFactory.construct( this, parentModel, root );
        this.configureFileInput( 'filename' );
      };
      return { instance: function( parentModel, root ) { return new object( parentModel, root ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnPublicationModelFactory', [
    'CnBaseModelFactory', 'CnPublicationAddFactory', 'CnPublicationListFactory', 'CnPublicationViewFactory', 'CnSession', 'CnHttpFactory',
    function( CnBaseModelFactory, CnPublicationAddFactory, CnPublicationListFactory, CnPublicationViewFactory, CnSession, CnHttpFactory ) {
      var object = function( root ) {
        var self = this;
        CnBaseModelFactory.construct( this, module );
        this.addModel = CnPublicationAddFactory.instance( this );
        this.listModel = CnPublicationListFactory.instance( this );
        this.viewModel = CnPublicationViewFactory.instance( this, root );
      };

      return {
        root: new object( true ),
        instance: function() { return new object( false ); }
      };
    }
  ] );

} );
