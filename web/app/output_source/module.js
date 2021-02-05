define( function() {
  'use strict';

  try { var module = cenozoApp.module( 'output_source', true ); } catch( err ) { console.warn( err ); return; }
  angular.extend( module, {
    identifier: {
      parent: {
        subject: 'output',
        column: 'output.id',
        friendly: 'detail'
      }
    },
    name: {
      singular: 'output source',
      plural: 'output sources',
      possessive: 'output source\'s'
    },
    columnList: {
      filename: { title: 'File' },
      url: { title: 'URL' }
    },
    defaultOrder: {
      column: 'output_source.id',
      reverse: false
    }
  } );

  module.addInputGroup( '', {
    filename: {
      title: 'Attachment',
      type: 'file',
      help: 'May be left empty'
    },
    url: {
      title: 'Web Link (URL)',
      type: 'string',
      help: 'May be left empty'
    },
    detail: {
      column: 'output.detail',
      isExcluded: true
    }
  } );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnOutputSourceAdd', [
    'CnOutputSourceModelFactory', 'CnModalMessageFactory',
    function( CnOutputSourceModelFactory, CnModalMessageFactory ) {
      return {
        templateUrl: module.getFileUrl( 'add.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnOutputSourceModelFactory.root;

          // get the child cn-record-add's scope
          $scope.$on( 'cnRecordAdd ready', function( event, data ) {
            var cnRecordAddScope = data;

            // don't allow a record with no file or url
            var saveFn = cnRecordAddScope.save;
            cnRecordAddScope.save = function() {
              if( !$scope.model.addModel.hasFile( 'filename' ) && angular.isUndefined( cnRecordAddScope.record.url ) ) {
                CnModalMessageFactory.instance( {
                  title: 'Please Note',
                  message: 'You must provide either a file or web link (URL)',
                  error: true
                } ).show();
              } else saveFn();
            };
          } );
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnOutputSourceList', [
    'CnOutputSourceModelFactory',
    function( CnOutputSourceModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'list.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnOutputSourceModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnOutputSourceView', [
    'CnOutputSourceModelFactory', 'CnModalMessageFactory',
    function( CnOutputSourceModelFactory, CnModalMessageFactory ) {
      return {
        templateUrl: module.getFileUrl( 'view.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnOutputSourceModelFactory.root;

          // get the child cn-record-add's scope
          $scope.$on( 'cnRecordView ready', function( event, data ) {
            var cnRecordViewScope = data;

            // don't allow a record with no file or url
            var patchFn = cnRecordViewScope.patch;
            cnRecordViewScope.patch = function() {
              if( !$scope.model.viewModel.record.filename && !$scope.model.viewModel.record.url ) {
                CnModalMessageFactory.instance( {
                  title: 'Please Note',
                  message: 'You must provide either a file or web link (URL)',
                  error: true
                } ).show();

                // undo the change
                if( $scope.model.viewModel.record.filename != $scope.model.viewModel.backupRecord.filename ) {
                  $scope.model.viewModel.record.filename = $scope.model.viewModel.backupRecord.filename;
                  $scope.model.viewModel.formattedRecord.filename =$scope.model.viewModel.backupRecord.formatted_filename;
                }
                if( $scope.model.viewModel.record.url != $scope.model.viewModel.backupRecord.url )
                  $scope.model.viewModel.record.url = $scope.model.viewModel.backupRecord.url;
              } else patchFn();
            };
          } );
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnOutputSourceAddFactory', [
    'CnBaseAddFactory',
    function( CnBaseAddFactory ) {
      var object = function( parentModel ) {
        CnBaseAddFactory.construct( this, parentModel );
        this.configureFileInput( 'filename' );
      };
      return { instance: function( parentModel ) { return new object( parentModel ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnOutputSourceListFactory', [
    'CnBaseListFactory',
    function( CnBaseListFactory ) {
      var object = function( parentModel ) { CnBaseListFactory.construct( this, parentModel ); };
      return { instance: function( parentModel ) { return new object( parentModel ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnOutputSourceViewFactory', [
    'CnBaseViewFactory',
    function( CnBaseViewFactory ) {
      var object = function( parentModel, root ) {
        CnBaseViewFactory.construct( this, parentModel, root );
        this.configureFileInput( 'filename' );
      }
      return { instance: function( parentModel, root ) { return new object( parentModel, root ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnOutputSourceModelFactory', [
    'CnBaseModelFactory', 'CnOutputSourceAddFactory', 'CnOutputSourceListFactory', 'CnOutputSourceViewFactory',
    'CnSession', '$state',
    function( CnBaseModelFactory, CnOutputSourceAddFactory, CnOutputSourceListFactory, CnOutputSourceViewFactory,
              CnSession, $state ) {
      var object = function( root ) {
        var self = this;
        CnBaseModelFactory.construct( this, module );
        this.addModel = CnOutputSourceAddFactory.instance( this );
        this.listModel = CnOutputSourceListFactory.instance( this );
        this.viewModel = CnOutputSourceViewFactory.instance( this, root );

        angular.extend( this, {
          setupBreadcrumbTrail: function() {
            // change the breadcrumb trail based on the origin parameter
            self.$$setupBreadcrumbTrail();
            var origin = self.getQueryParameter( 'origin', true );
            if( 'final_report' == origin ) {
              var parent = self.getParentIdentifier();
              var index = CnSession.breadcrumbTrail.findIndexByProperty( 'title', 'Output' );
              CnSession.breadcrumbTrail[index+1].go = function() {
                $state.go( 'output.view', { identifier: parent.identifier, origin: origin } );
              };
              delete CnSession.breadcrumbTrail[index].go;
            }
          },

          transitionToAddState: function() {
            var origin = self.getQueryParameter( 'origin', true );
            if( 'final_report' == origin ) {
              $state.go(
                '^.add_' + self.module.subject.snake,
                { parentIdentifier: $state.params.identifier, origin: origin }
              );
            } else self.$$transitionToAddState();
          },

          transitionToViewState: function( record ) {
            var origin = self.getQueryParameter( 'origin', true );
            if( 'final_report' == origin ) {
              $state.go(
                'output_source.view',
                { identifier: record.getIdentifier(), parentIdentifier: $state.params.identifier, origin: origin }
              );
            } else self.$$transitionToViewState( record );
          },

          transitionToLastState: function() {
            // include the origin in the parent output's state
            var stateParams = { identifier: self.getParentIdentifier().identifier };
            var origin = self.getQueryParameter( 'origin', true );
            if( angular.isDefined( origin ) ) stateParams.origin = origin;
            return $state.go( 'output.view', stateParams );
          },

          transitionToParentViewState: function( subject, identifier ) {
            // include the origin in the parent output's state
            var stateParams = { identifier: identifier };
            var origin = self.getQueryParameter( 'origin', true );
            if( angular.isDefined( origin ) ) stateParams.origin = origin;
            return $state.go( subject + '.view', stateParams );
          }
        } );
      };

      return {
        root: new object( true ),
        instance: function() { return new object( false ); }
      };
    }
  ] );

} );
