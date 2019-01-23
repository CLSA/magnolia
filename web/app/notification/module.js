define( function() {
  'use strict';

  try { var module = cenozoApp.module( 'notification', true ); } catch( err ) { console.warn( err ); return; }
  angular.extend( module, {
    identifier: {
      parent: {
        subject: 'reqn',
        column: 'identifier'
      }
    },
    name: {
      singular: 'notification',
      plural: 'notifications',
      possessive: 'notification\'s'
    },
    columnList: {
      reqn: {
        column: 'reqn.identifier',
        title: 'Requisition'
      },
      emails: {
        title: 'Email'
      },
      type: {
        column: 'notification_type.name',
        title: 'Type',
      },
      datetime: {
        title: 'Date & Time',
        type: 'datetime'
      },
      sent: {
        title: 'Sent',
        type: 'boolean'
      }
    },
    defaultOrder: {
      column: 'datetime',
      reverse: true
    }
  } );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnNotificationList', [
    'CnNotificationModelFactory',
    function( CnNotificationModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'list.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnNotificationModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnNotificationListFactory', [
    'CnBaseListFactory',
    function( CnBaseListFactory ) {
      var object = function( parentModel ) { CnBaseListFactory.construct( this, parentModel ); };
      return { instance: function( parentModel ) { return new object( parentModel ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnNotificationModelFactory', [
    'CnBaseModelFactory', 'CnNotificationListFactory',
    function( CnBaseModelFactory, CnNotificationListFactory ) {
      var object = function( root ) {
        var self = this;
        CnBaseModelFactory.construct( this, module );
        this.listModel = CnNotificationListFactory.instance( this );
      };

      return {
        root: new object( true ),
        instance: function() { return new object( false ); }
      };
    }
  ] );

} );
