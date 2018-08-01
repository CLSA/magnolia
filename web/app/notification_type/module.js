define( function() {
  'use strict';

  try { var module = cenozoApp.module( 'notification_type', true ); } catch( err ) { console.warn( err ); return; }
  angular.extend( module, {
    identifier: { column: 'name' },
    name: {
      singular: 'notification type',
      plural: 'notification types',
      possessive: 'notification type\'s'
    },
    columnList: {
      name: {
        title: 'Name'
      },
      notification_count: {
        title: 'Notifications',
        type: 'number'
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
      type: 'string',
      constant: true
    },
    message_en: {
      title: 'Message (English)',
      type: 'text',
      help: 'The message sent by email to English applicants when this notification is triggered.'
    },
    message_fr: {
      title: 'Message (French)',
      type: 'text',
      help: 'The message sent by email to French applicants when this notification is triggered.'
    }
  } );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnNotificationTypeList', [
    'CnNotificationTypeModelFactory',
    function( CnNotificationTypeModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'list.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnNotificationTypeModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnNotificationTypeView', [
    'CnNotificationTypeModelFactory',
    function( CnNotificationTypeModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'view.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnNotificationTypeModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnNotificationTypeListFactory', [
    'CnBaseListFactory',
    function( CnBaseListFactory ) {
      var object = function( parentModel ) { CnBaseListFactory.construct( this, parentModel ); };
      return { instance: function( parentModel ) { return new object( parentModel ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnNotificationTypeViewFactory', [
    'CnBaseViewFactory',
    function( CnBaseViewFactory ) {
      var object = function( parentModel, root ) {
        var self = this;
        CnBaseViewFactory.construct( this, parentModel, root );

        this.deferred.promise.then( function() {
          if( angular.isDefined( self.stageTypeModel ) ) self.stageTypeModel.listModel.heading = 'Notified Stage Type List';
        } );
      }
      return { instance: function( parentModel, root ) { return new object( parentModel, root ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnNotificationTypeModelFactory', [
    'CnBaseModelFactory', 'CnNotificationTypeListFactory', 'CnNotificationTypeViewFactory',
    function( CnBaseModelFactory, CnNotificationTypeListFactory, CnNotificationTypeViewFactory ) {
      var object = function( root ) {
        var self = this;
        CnBaseModelFactory.construct( this, module );
        this.listModel = CnNotificationTypeListFactory.instance( this );
        this.viewModel = CnNotificationTypeViewFactory.instance( this, root );
      };

      return {
        root: new object( true ),
        instance: function() { return new object( false ); }
      };
    }
  ] );

} );
