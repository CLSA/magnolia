define( function() {
  'use strict';

  try { var module = cenozoApp.module( 'review', true ); } catch( err ) { console.warn( err ); return; }
  angular.extend( module, {
    identifier: {
      parent: {
        subject: 'reqn',
        column: 'reqn.identifier'
      }
    },
    name: {
      singular: 'review',
      plural: 'reviews',
      possessive: 'review\'s'
    },
    columnList: {
      identifier: { column: 'reqn.identifier', title: 'Requisition' },
      review_type: { column: 'review_type.name', title: 'Type' },
      user_full_name: { title: 'Reviewer' },
      recommendation: { title: 'Recommendation' }
    },
    defaultOrder: {
      column: 'id',
      reverse: false
    }
  } );

  module.addInputGroup( '', {
    reqn_id: {
      column: 'reqn.identifier',
      title: 'Requisition',
      type: 'lookup-typeahead',
      typeahead: {
        table: 'reqn',
        select: 'reqn.identifier',
        where: 'reqn.identifier'
      },
      constant: 'view'
    },
    user_id: {
      column: 'reqn.user_id',
      title: 'Reviewer',
      type: 'lookup-typeahead',
      typeahead: {
        table: 'user',
        select: 'CONCAT( user.first_name, " ", user.last_name, " (", user.name, ")" )',
        where: [ 'user.first_name', 'user.last_name', 'user.name' ]
      }
    },
    recommendation: {
      title: 'Recommendation',
      type: 'enum',
      exclude: 'add'
    },
    note: {
      title: 'Note',
      type: 'text',
      exclude: 'add'
    }
  } );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnReviewAdd', [
    'CnReviewModelFactory',
    function( CnReviewModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'add.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnReviewModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnReviewList', [
    'CnReviewModelFactory',
    function( CnReviewModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'list.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnReviewModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnReviewView', [
    'CnReviewModelFactory',
    function( CnReviewModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'view.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnReviewModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnReviewAddFactory', [
    'CnBaseAddFactory',
    function( CnBaseAddFactory ) {
      var object = function( parentModel ) { CnBaseAddFactory.construct( this, parentModel ); };
      return { instance: function( parentModel ) { return new object( parentModel ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnReviewListFactory', [
    'CnBaseListFactory',
    function( CnBaseListFactory ) {
      var object = function( parentModel ) { CnBaseListFactory.construct( this, parentModel ); };
      return { instance: function( parentModel ) { return new object( parentModel ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnReviewViewFactory', [
    'CnBaseViewFactory',
    function( CnBaseViewFactory ) {
      var object = function( parentModel, root ) { CnBaseViewFactory.construct( this, parentModel, root ); };
      return { instance: function( parentModel, root ) { return new object( parentModel, root ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnReviewModelFactory', [
    'CnBaseModelFactory',
    'CnReviewAddFactory', 'CnReviewListFactory', 'CnReviewViewFactory',
    function( CnBaseModelFactory,
              CnReviewAddFactory, CnReviewListFactory, CnReviewViewFactory ) {
      var object = function( root ) {
        var self = this;
        CnBaseModelFactory.construct( this, module );
        this.addModel = CnReviewAddFactory.instance( this );
        this.listModel = CnReviewListFactory.instance( this );
        this.viewModel = CnReviewViewFactory.instance( this, root );
      };

      return {
        root: new object( true ),
        instance: function() { return new object( false ); }
      };
    }
  ] );

} );
