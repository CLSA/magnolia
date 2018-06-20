define( function() {
  'use strict';

  try { var module = cenozoApp.module( 'pdf_form', true ); } catch( err ) { console.warn( err ); return; }
  angular.extend( module, {
    identifier: {
      parent: {
        subject: 'pdf_form_type',
        column: 'pdf_form_type.name'
      }
    },
    name: {
      singular: 'PDF form',
      plural: 'PDF forms',
      possessive: 'PDF form\'s',
      friendlyColumn: 'version'
    },
    columnList: {
      version: {
        title: 'Version',
        type: 'date'
      },
      active: {
        title: 'Active',
        type: 'boolean',
        help: 'Is this the actively used version of the form?'
      }
    },
    defaultOrder: {
      column: 'version',
      reverse: true
    }
  } );

  module.addInputGroup( '', {
    version: {
      title: 'Version',
      type: 'date'
    },
    active: {
      title: 'Active',
      type: 'boolean',
      help: 'Determines whether this is the actively used version of the form (only one version may be active)'
    }
  } );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnPdfFormAdd', [
    'CnPdfFormModelFactory',
    function( CnPdfFormModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'add.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnPdfFormModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnPdfFormList', [
    'CnPdfFormModelFactory',
    function( CnPdfFormModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'list.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnPdfFormModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnPdfFormView', [
    'CnPdfFormModelFactory',
    function( CnPdfFormModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'view.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnPdfFormModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnPdfFormAddFactory', [
    'CnBaseAddFactory',
    function( CnBaseAddFactory ) {
      var object = function( parentModel ) { CnBaseAddFactory.construct( this, parentModel ); };
      return { instance: function( parentModel ) { return new object( parentModel ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnPdfFormListFactory', [
    'CnBaseListFactory',
    function( CnBaseListFactory ) {
      var object = function( parentModel ) { CnBaseListFactory.construct( this, parentModel ); };
      return { instance: function( parentModel ) { return new object( parentModel ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnPdfFormViewFactory', [
    'CnBaseViewFactory',
    function( CnBaseViewFactory ) {
      var object = function( parentModel, root ) { CnBaseViewFactory.construct( this, parentModel, root ); }
      return { instance: function( parentModel, root ) { return new object( parentModel, root ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnPdfFormModelFactory', [
    'CnBaseModelFactory', 'CnPdfFormAddFactory', 'CnPdfFormListFactory', 'CnPdfFormViewFactory', '$state',
    function( CnBaseModelFactory, CnPdfFormAddFactory, CnPdfFormListFactory, CnPdfFormViewFactory, $state ) {
      var object = function( root ) {
        CnBaseModelFactory.construct( this, module );
        this.addModel = CnPdfFormAddFactory.instance( this );
        this.listModel = CnPdfFormListFactory.instance( this );
        this.viewModel = CnPdfFormViewFactory.instance( this );
      };

      return {
        root: new object( true ),
        instance: function() { return new object( false ); }
      };
    }
  ] );

} );
