define( function() {
  'use strict';

  try { var module = cenozoApp.module( 'reqn_type', true ); } catch( err ) { console.warn( err ); return; }
  angular.extend( module, {
    identifier: { column: 'name' },
    name: {
      singular: 'requisition type',
      plural: 'requisition types',
      possessive: 'requisition type\'s'
    },
    columnList: {
      name: {
        title: 'Name'
      },
      available: {
        title: 'Available',
        type: 'boolean'
      },
      reqn_count: {
        title: 'Requisitions',
        type: 'number'
      },
      stage_type_list: {
        title: 'Stage Types'
      }
    },
    defaultOrder: {
      column: 'name',
      reverse: false
    }
  } );

  module.addInputGroup( '', {
    name: {
      title: 'Name',
      type: 'string'
    },
    available: {
      title: 'Available',
      type: 'boolean',
      help: 'Determines whether this type is available to applicants when creating new requisitions.'
    }
  } );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnReqnTypeList', [
    'CnReqnTypeModelFactory',
    function( CnReqnTypeModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'list.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnReqnTypeModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnReqnTypeView', [
    'CnReqnTypeModelFactory',
    function( CnReqnTypeModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'view.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnReqnTypeModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnReqnTypeListFactory', [
    'CnBaseListFactory',
    function( CnBaseListFactory ) {
      var object = function( parentModel ) { CnBaseListFactory.construct( this, parentModel ); };
      return { instance: function( parentModel ) { return new object( parentModel ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnReqnTypeViewFactory', [
    'CnBaseViewFactory',
    function( CnBaseViewFactory ) {
      var object = function( parentModel, root ) {
        var self = this;
        CnBaseViewFactory.construct( this, parentModel, root );
      }
      return { instance: function( parentModel, root ) { return new object( parentModel, root ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnReqnTypeModelFactory', [
    'CnBaseModelFactory', 'CnReqnTypeListFactory', 'CnReqnTypeViewFactory',
    function( CnBaseModelFactory, CnReqnTypeListFactory, CnReqnTypeViewFactory ) {
      var object = function( root ) {
        var self = this;
        CnBaseModelFactory.construct( this, module );
        this.listModel = CnReqnTypeListFactory.instance( this );
        this.viewModel = CnReqnTypeViewFactory.instance( this, root );
      };

      return {
        root: new object( true ),
        instance: function() { return new object( false ); }
      };
    }
  ] );

} );
