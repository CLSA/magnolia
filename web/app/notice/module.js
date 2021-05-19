define( function() {
  'use strict';

  try { var module = cenozoApp.module( 'notice', true ); } catch( err ) { console.warn( err ); return; }
  angular.extend( module, {
    identifier: {
      parent: {
        subject: 'reqn',
        column: 'reqn.identifier'
      }
    },
    name: {
      singular: 'notice',
      plural: 'notices',
      possessive: 'notice\'s'
    },
    columnList: {
      identifier: { column: 'reqn.identifier', title: 'Requisition' },
      datetime: { title: 'Date & Time', type: 'datetime' },
      title: { title: 'Title' },
      viewed_by_user: { title: 'Primary Viewed', type: 'boolean' },
      viewed_by_trainee_user: { title: 'Trainee Viewed', type: 'boolean' },
      viewed_by_designate_user: { title: 'Designate Viewed', type: 'boolean' }
    },
    defaultOrder: {
      column: 'datetime',
      reverse: true
    }
  } );

  module.addInputGroup( '', {
    datetime: {
      title: 'Date & Time',
      type: 'datetime',
      isExcluded: 'add'
    },
    title: {
      title: 'Title',
      type: 'string'
    },
    viewed_by_user: {
      title: 'Viewed by Primary Applicant',
      type: 'boolean',
      isExcluded: 'add'
    },
    viewed_by_trainee_user: {
      title: 'Viewed by Trainee',
      type: 'boolean',
      isExcluded: function( $state, model ) {
        return 'add' == model.getActionFromState() ? true : null == model.viewModel.record.trainee_user_id;
      }
    },
    viewed_by_designate_user: {
      title: 'Viewed by Designate',
      type: 'boolean',
      isExcluded: function( $state, model ) {
        return 'add' == model.getActionFromState() ? true : null == model.viewModel.record.designate_user_id;
      }
    },
    description: {
      title: 'Description',
      type: 'text'
    },
    user_id: { column: 'reqn.user_id', type: 'hidden' },
    trainee_user_id: { column: 'reqn.trainee_user_id', type: 'hidden' },
    designate_user_id: { column: 'reqn.designate_user_id', type: 'hidden' }
  } );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnNoticeAdd', [
    'CnNoticeModelFactory',
    function( CnNoticeModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'add.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnNoticeModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnNoticeList', [
    'CnNoticeModelFactory',
    function( CnNoticeModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'list.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnNoticeModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnNoticeView', [
    'CnNoticeModelFactory',
    function( CnNoticeModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'view.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnNoticeModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnNoticeAddFactory', [
    'CnBaseAddFactory',
    function( CnBaseAddFactory ) {
      var object = function( parentModel ) { CnBaseAddFactory.construct( this, parentModel ); };
      return { instance: function( parentModel ) { return new object( parentModel ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnNoticeListFactory', [
    'CnBaseListFactory',
    function( CnBaseListFactory ) {
      var object = function( parentModel ) { CnBaseListFactory.construct( this, parentModel ); };
      return { instance: function( parentModel ) { return new object( parentModel ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnNoticeViewFactory', [
    'CnBaseViewFactory', 'CnHttpFactory',
    function( CnBaseViewFactory, CnHttpFactory ) {
      var object = function( parentModel, root ) {
        CnBaseViewFactory.construct( this, parentModel, root );

        this.onPatch = async function( data ) {
          if( angular.isDefined( data.viewed_by_user ) ||
              angular.isDefined( data.viewed_by_trainee_user ) ||
              angular.isDefined( data.viewed_by_designate_user ) ) {
            // handle the viewed-by data since it isn't a direct property of the notice record
            var add = null;
            var userId = null;

            if( angular.isDefined( data.viewed_by_user ) ) {
              add = data.viewed_by_user;
              userId = self.record.user_id;
            } else if( angular.isDefined( data.viewed_by_trainee_user ) ) {
              add = data.viewed_by_trainee_user;
              userId = self.record.trainee_user_id;
            } else {
              add = data.viewed_by_designate_user;
              userId = self.record.designate_user_id;
            }

            if( add ) {
              await CnHttpFactory.instance( { path: this.parentModel.getServiceResourcePath() + '/user', data: userId } ).post();
            } else {
              await CnHttpFactory.instance( { path: this.parentModel.getServiceResourcePath() + '/user/' + userId } ).delete();
            }
          } else {
            await this.$$onPatch( data );
          }

          this.afterPatchFunctions.forEach( function( fn ) { fn(); } );
        };
      };
      return { instance: function( parentModel, root ) { return new object( parentModel, root ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnNoticeModelFactory', [
    'CnBaseModelFactory', 'CnNoticeAddFactory', 'CnNoticeListFactory', 'CnNoticeViewFactory',
    function( CnBaseModelFactory, CnNoticeAddFactory, CnNoticeListFactory, CnNoticeViewFactory ) {
      var object = function( root ) {
        CnBaseModelFactory.construct( this, module );
        this.addModel = CnNoticeAddFactory.instance( this );
        this.listModel = CnNoticeListFactory.instance( this );
        this.viewModel = CnNoticeViewFactory.instance( this, root );

        // extend getMetadata
        this.getMetadata = async function() {
          await this.$$getMetadata();

          // fake the viewed-by columns
          angular.extend( this.metadata.columnList, {
            viewed_by_user: { data_type: 'tinyint', required: true },
            viewed_by_trainee_user: { data_type: 'tinyint', required: true },
            viewed_by_designate_user: { data_type: 'tinyint', required: true }
          } );
        };
      };

      return {
        root: new object( true ),
        instance: function() { return new object( false ); }
      };
    }
  ] );

} );
