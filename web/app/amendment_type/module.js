define( function() {
  'use strict';

  try { var module = cenozoApp.module( 'amendment_type', true ); } catch( err ) { console.warn( err ); return; }
  angular.extend( module, {
    identifier: {},
    name: {
      singular: 'amendment type',
      plural: 'amendment types',
      possessive: 'amendment type\'s'
    },
    columnList: {
      rank: { title: 'Rank', type: 'rank' },
      new_user: { title: 'Request New User', type: 'boolean' },
      reason_en: { title: 'Reason (English)' },
      reason_fr: { title: 'Reason (French)' }
    },
    defaultOrder: {
      column: 'amendment_type.rank',
      reverse: false
    }
  } );

  module.addInputGroup( '', {
    rank: {
      title: 'Rank',
      type: 'rank'
    },
    new_user: {
      title: 'Request New User',
      type: 'boolean'
    },
    reason_en: {
      title: 'Reason (English)',
      type: 'string'
    },
    reason_fr: {
      title: 'Reason (French)',
      type: 'string'
    },
    justification_prompt_en: {
      title: 'Justification Prompt (English)',
      type: 'text'
    },
    justification_prompt_fr: {
      title: 'Justification Prompt (French)',
      type: 'text'
    }
  } );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnAmendmentTypeAdd', [
    'CnAmendmentTypeModelFactory',
    function( CnAmendmentTypeModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'add.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnAmendmentTypeModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnAmendmentTypeList', [
    'CnAmendmentTypeModelFactory',
    function( CnAmendmentTypeModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'list.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnAmendmentTypeModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnAmendmentTypeView', [
    'CnAmendmentTypeModelFactory',
    function( CnAmendmentTypeModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'view.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnAmendmentTypeModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnAmendmentTypeAddFactory', [
    'CnBaseAddFactory',
    function( CnBaseAddFactory ) {
      var object = function( parentModel ) { CnBaseAddFactory.construct( this, parentModel ); };
      return { instance: function( parentModel ) { return new object( parentModel ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnAmendmentTypeListFactory', [
    'CnBaseListFactory',
    function( CnBaseListFactory ) {
      var object = function( parentModel ) { CnBaseListFactory.construct( this, parentModel ); };
      return { instance: function( parentModel ) { return new object( parentModel ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnAmendmentTypeViewFactory', [
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
  cenozo.providers.factory( 'CnAmendmentTypeModelFactory', [
    'CnBaseModelFactory', 'CnAmendmentTypeAddFactory', 'CnAmendmentTypeListFactory', 'CnAmendmentTypeViewFactory',
    function( CnBaseModelFactory, CnAmendmentTypeAddFactory, CnAmendmentTypeListFactory, CnAmendmentTypeViewFactory ) {
      var object = function( root ) {
        var self = this;
        CnBaseModelFactory.construct( this, module );
        this.addModel = CnAmendmentTypeAddFactory.instance( this );
        this.listModel = CnAmendmentTypeListFactory.instance( this );
        this.viewModel = CnAmendmentTypeViewFactory.instance( this, root );
      };

      return {
        root: new object( true ),
        instance: function() { return new object( false ); }
      };
    }
  ] );

} );
