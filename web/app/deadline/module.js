define( function() {
  'use strict';

  try { var module = cenozoApp.module( 'deadline', true ); } catch( err ) { console.warn( err ); return; }
  angular.extend( module, {
    identifier: { column: 'name' },
    name: {
      singular: 'deadline',
      plural: 'deadlines',
      possessive: 'deadline\'s'
    },
    columnList: {
      name: {
        title: 'Name'
      },
      date: {
        title: 'Date',
        type: 'date'
      },
      reqn_count: {
        title: 'Requisitions'
      }
    },
    defaultOrder: {
      column: 'date',
      reverse: true
    }
  } );

  module.addInputGroup( '', {
    name: {
      title: 'Name',
      type: 'string'
    },
    date: {
      title: 'Date',
      type: 'date'
    }
  } );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnDeadlineAdd', [
    'CnDeadlineModelFactory',
    function( CnDeadlineModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'add.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnDeadlineModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnDeadlineList', [
    'CnDeadlineModelFactory',
    function( CnDeadlineModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'list.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnDeadlineModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnDeadlineView', [
    'CnDeadlineModelFactory',
    function( CnDeadlineModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'view.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnDeadlineModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnDeadlineAddFactory', [
    'CnBaseAddFactory',
    function( CnBaseAddFactory ) {
      var object = function( parentModel ) { CnBaseAddFactory.construct( this, parentModel ); };
      return { instance: function( parentModel ) { return new object( parentModel ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnDeadlineListFactory', [
    'CnBaseListFactory',
    function( CnBaseListFactory ) {
      var object = function( parentModel ) { CnBaseListFactory.construct( this, parentModel ); };
      return { instance: function( parentModel ) { return new object( parentModel ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnDeadlineViewFactory', [
    'CnBaseViewFactory',
    function( CnBaseViewFactory ) {
      var object = function( parentModel, root ) { CnBaseViewFactory.construct( this, parentModel, root ); }
      return { instance: function( parentModel, root ) { return new object( parentModel, root ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnDeadlineModelFactory', [
    'CnBaseModelFactory', 'CnDeadlineAddFactory', 'CnDeadlineListFactory', 'CnDeadlineViewFactory',
    function( CnBaseModelFactory, CnDeadlineAddFactory, CnDeadlineListFactory, CnDeadlineViewFactory ) {
      var object = function( root ) {
        var self = this;
        CnBaseModelFactory.construct( this, module );
        this.addModel = CnDeadlineAddFactory.instance( this );
        this.listModel = CnDeadlineListFactory.instance( this );
        this.viewModel = CnDeadlineViewFactory.instance( this, root );
      };

      return {
        root: new object( true ),
        instance: function() { return new object( false ); }
      };
    }
  ] );

} );
