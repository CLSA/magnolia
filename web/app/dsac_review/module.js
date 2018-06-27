define( function() {
  'use strict';

  try { var module = cenozoApp.module( 'dsac_review', true ); } catch( err ) { console.warn( err ); return; }
  angular.extend( module, {
    identifier: {
      parent: {
        subject: 'reqn',
        column: 'reqn.identifier'
      }
    },
    name: {
      singular: 'DSAC review',
      plural: 'DSAC reviews',
      possessive: 'DSAC review\'s'
    },
    columnList: {
      identifier: { column: 'reqn.identifier', title: 'Requisition' },
      user: { column: 'user.name', title: 'Reviewer' },
      recommendation: { title: 'Recomendation' },
      scientific_review: { title: 'Scientific Review' }
    },
    defaultOrder: {
      column: 'user.name',
      reverse: false
    }
  } );

  module.addInputGroup( '', {
    identifier: {
      column: 'reqn.identifier',
      title: 'Requisition',
      type: 'string',
      constant: true,
      exclude: 'add'
    },
    user_id: {
      column: 'reqn.user_id',
      title: 'Reviewer',
      type: 'lookup-typeahead',
      typeahead: {
        table: 'user',
        select: 'CONCAT( user.first_name, " ", user.last_name, " (", user.name, ")" )',
        where: [ 'user.first_name', 'user.last_name', 'user.name' ]
      },
      constant: 'view'
    },
    recommendation: {
      title: 'Recomendation',
      type: 'enum',
      exclude: 'add'
    },
    scientific_review: {
      title: 'Scientific Review',
      type: 'boolean',
      exclude: 'add'
    },
    note: {
      title: 'Note',
      type: 'text',
      exclude: 'add'
    }
  } );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnDsacReviewAdd', [
    'CnDsacReviewModelFactory',
    function( CnDsacReviewModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'add.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnDsacReviewModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnDsacReviewList', [
    'CnDsacReviewModelFactory',
    function( CnDsacReviewModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'list.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnDsacReviewModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnDsacReviewView', [
    'CnDsacReviewModelFactory',
    function( CnDsacReviewModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'view.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnDsacReviewModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnDsacReviewAddFactory', [
    'CnBaseAddFactory',
    function( CnBaseAddFactory ) {
      var object = function( parentModel ) { CnBaseAddFactory.construct( this, parentModel ); };
      return { instance: function( parentModel ) { return new object( parentModel ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnDsacReviewListFactory', [
    'CnBaseListFactory',
    function( CnBaseListFactory ) {
      var object = function( parentModel ) { CnBaseListFactory.construct( this, parentModel ); };
      return { instance: function( parentModel ) { return new object( parentModel ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnDsacReviewViewFactory', [
    'CnBaseViewFactory',
    function( CnBaseViewFactory ) {
      var object = function( parentModel, root ) { CnBaseViewFactory.construct( this, parentModel, root ); };
      return { instance: function( parentModel, root ) { return new object( parentModel, root ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnDsacReviewModelFactory', [
    'CnBaseModelFactory',
    'CnDsacReviewAddFactory', 'CnDsacReviewListFactory', 'CnDsacReviewViewFactory',
    function( CnBaseModelFactory,
              CnDsacReviewAddFactory, CnDsacReviewListFactory, CnDsacReviewViewFactory ) {
      var object = function( root ) {
        var self = this;
        CnBaseModelFactory.construct( this, module );
        this.addModel = CnDsacReviewAddFactory.instance( this );
        this.listModel = CnDsacReviewListFactory.instance( this );
        this.viewModel = CnDsacReviewViewFactory.instance( this, root );
      };

      return {
        root: new object( true ),
        instance: function() { return new object( false ); }
      };
    }
  ] );

} );
