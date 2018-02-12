define( function() {
  'use strict';

  try { var module = cenozoApp.module( 'coapplicant', true ); } catch( err ) { console.warn( err ); return; }
  angular.extend( module, {
    identifier: {},
    name: {
      singular: 'co-applicant',
      plural: 'co-applicants',
      possessive: 'co-applicant\'s',
      pluralPossessive: 'co-applicants\''
    },
    columnList: {
      name: { title: 'Name' },
      position: { title: 'Position' },
      affliation: { title: 'Affiliation' },
      email: { title: 'E-mail' },
      role: { title: 'Role' },
      access: { title: 'Access', type: 'boolean' }
    },
    defaultOrder: {
      column: 'coapplicant.id',
      reverse: false
    }
  } );

  module.addInputGroup( '', {
    name: { title: 'Name', type: 'string' },
    position: { title: 'Position', type: 'string' },
    affliation: { title: 'Affiliation', type: 'string' },
    email: { title: 'E-mail', type: 'string' },
    role: { title: 'Role', type: 'string' },
    access: { title: 'Access', type: 'boolean', type: 'boolean' }
  } );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnCoapplicantAdd', [
    'CnCoapplicantModelFactory',
    function( CnCoapplicantModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'add.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnCoapplicantModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnCoapplicantList', [
    'CnCoapplicantModelFactory',
    function( CnCoapplicantModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'list.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnCoapplicantModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnCoapplicantView', [
    'CnCoapplicantModelFactory',
    function( CnCoapplicantModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'view.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnCoapplicantModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnCoapplicantAddFactory', [
    'CnBaseAddFactory',
    function( CnBaseAddFactory ) {
      var object = function( parentModel ) { CnBaseAddFactory.construct( this, parentModel ); };
      return { instance: function( parentModel ) { return new object( parentModel ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnCoapplicantListFactory', [
    'CnBaseListFactory',
    function( CnBaseListFactory ) {
      var object = function( parentModel ) { CnBaseListFactory.construct( this, parentModel ); };
      return { instance: function( parentModel ) { return new object( parentModel ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnCoapplicantViewFactory', [
    'CnBaseViewFactory',
    function( CnBaseViewFactory ) {
      var object = function( parentModel, root ) { CnBaseViewFactory.construct( this, parentModel, root ); };
      return { instance: function( parentModel, root ) { return new object( parentModel, root ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnCoapplicantModelFactory', [
    'CnBaseModelFactory',
    'CnCoapplicantAddFactory', 'CnCoapplicantListFactory', 'CnCoapplicantViewFactory',
    function( CnBaseModelFactory,
              CnCoapplicantAddFactory, CnCoapplicantListFactory, CnCoapplicantViewFactory ) {
      var object = function( root ) {
        var self = this;
        CnBaseModelFactory.construct( this, module );
        this.addModel = CnCoapplicantAddFactory.instance( this );
        this.listModel = CnCoapplicantListFactory.instance( this );
        this.viewModel = CnCoapplicantViewFactory.instance( this, root );
      };

      return {
        root: new object( true ),
        instance: function() { return new object( false ); }
      };
    }
  ] );

} );
