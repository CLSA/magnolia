define( function() {
  'use strict';

  try { var module = cenozoApp.module( 'stage', true ); } catch( err ) { console.warn( err ); return; }
  angular.extend( module, {
    identifier: {}, // standard
    name: {
      singular: 'stage',
      plural: 'stages',
      possessive: 'stage\'s'
    },
    columnList: {
      identifier: {
        column: 'requisition.identifier',
        title: 'Requisition'
      },
      stage_type: {
        column: 'stage_type.name',
        title: 'Stage Type'
      },
      user: {
        column: 'user.name',
        title: 'User'
      },
      datetime: {
        title: 'Date & Time',
        type: 'datetime'
      },
      unprepared: {
        title: 'Administrator Required',
        type: 'boolean'
      },

    },
    defaultOrder: {
      column: 'datetime',
      reverse: false
    }
  } );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnStageList', [
    'CnStageModelFactory',
    function( CnStageModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'list.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnStageModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnStageListFactory', [
    'CnBaseListFactory',
    function( CnBaseListFactory ) {
      var object = function( parentModel ) { CnBaseListFactory.construct( this, parentModel ); };
      return { instance: function( parentModel ) { return new object( parentModel ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnStageModelFactory', [
    'CnBaseModelFactory', 'CnStageListFactory', '$state',
    function( CnBaseModelFactory, CnStageListFactory, $state ) {
      var object = function( root ) {
        CnBaseModelFactory.construct( this, module );
        this.listModel = CnStageListFactory.instance( this );

        // Only allow viewing a stage when in the stage_type.view state (which will go to the requisition)
        this.getViewEnabled = function() {
          return 'stage_type' == this.getSubjectFromState() && 'view' == this.getActionFromState();
        };

        // When in the stage.list state transition to the requisition when clicking the stage record
        this.transitionToViewState = function( record ) { 
          $state.go( 'requisition.view', { identifier: 'identifier=' + record.identifier } );
        };
      };

      return {
        root: new object( true ),
        instance: function() { return new object( false ); }
      };
    }
  ] );

} );
