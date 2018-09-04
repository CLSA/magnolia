define( function() {
  'use strict';

  try { var module = cenozoApp.module( 'progress_report', true ); } catch( err ) { console.warn( err ); return; }
  angular.extend( module, {
    identifier: {
      parent: {
        subject: 'reqn',
        column: 'reqn.identifier'
      }
    },
    name: {
      singular: 'progress report',
      plural: 'progress reports',
      possessive: 'progress report\'s'
    },
    columnList: {
      identifier: { column: 'reqn.identifier', title: 'Requisition' },
      date: { title: 'Date', type: 'date' }
    },
    defaultOrder: {
      column: 'progress_report.date',
      reverse: true
    }
  } );

  module.addInputGroup( '', {
    language: { column: 'language.code', type: 'string' },
    thesis_title: { type: 'string' },
    thesis_status: { type: 'string' },
    activities: { type: 'text' },
    findings: { type: 'text' },
    outcomes: { type: 'text' },
    date: { type: 'date' }
  } );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnProgressReportList', [
    'CnProgressReportModelFactory',
    function( CnProgressReportModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'list.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnProgressReportModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnProgressReportView', [
    'CnProgressReportModelFactory', 'cnRecordViewDirective',
    function( CnProgressReportModelFactory, cnRecordViewDirective ) {
      // used to piggy-back on the basic view controller's functionality (but not used in the DOM)
      var cnRecordView = cnRecordViewDirective[0];
      return {
        templateUrl: module.getFileUrl( 'view.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        link: function( scope, element, attrs ) {
          cnRecordView.link( scope, element, attrs );
        },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnProgressReportModelFactory.root;
          cnRecordView.controller[1]( $scope );
          $scope.t = function( value ) { return cenozoApp.translate( 'progressReport', value, $scope.model.viewModel.record.language ); };
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnProgressReportListFactory', [
    'CnBaseListFactory',
    function( CnBaseListFactory ) {
      var object = function( parentModel ) { CnBaseListFactory.construct( this, parentModel ); };
      return { instance: function( parentModel ) { return new object( parentModel ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnProgressReportViewFactory', [
    'CnBaseViewFactory', 'CnHttpFactory',
    function( CnBaseViewFactory, CnHttpFactory ) {
      var object = function( parentModel, root ) {
        var self = this;
        CnBaseViewFactory.construct( this, parentModel, root );

        // setup language and tab state parameters
        this.toggleLanguage = function() {
          var parent = this.parentModel.getParentIdentifier();
          this.record.language = 'en' == this.record.language ? 'fr' : 'en';
          return CnHttpFactory.instance( {
            path: parent.subject + '/' + parent.identifier,
            data: { language: this.record.language }
          } ).patch();
        };

        this.setTab = function( tab, transition ) {
          if( angular.isUndefined( transition ) ) transition = true;
          if( 0 > ['instructions','a1'].indexOf( tab ) ) tab = 'instructions';
          this.tab = tab;
          this.parentModel.setQueryParameter( 't', tab );
          if( transition ) this.parentModel.reloadState( false, false, 'replace' );
        };

        this.tab = '';
        this.setTab( this.parentModel.getQueryParameter( 't' ), false );
      };
      return { instance: function( parentModel, root ) { return new object( parentModel, root ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnProgressReportModelFactory', [
    'CnBaseModelFactory', 'CnProgressReportListFactory', 'CnProgressReportViewFactory',
    'CnHttpFactory', '$state',
    function( CnBaseModelFactory, CnProgressReportListFactory, CnProgressReportViewFactory,
              CnHttpFactory, $state ) {
      var object = function( root ) {
        var self = this;
        CnBaseModelFactory.construct( this, module );
        this.listModel = CnProgressReportListFactory.instance( this );
        this.viewModel = CnProgressReportViewFactory.instance( this, root );

        // override transitionToAddState
        this.transitionToAddState = function() {
          // immediately get a new reqn and view it (no add state required)
          return CnHttpFactory.instance( {
            path: 'progress_report',
            data: { reqn_id: $state.params.identifier } // when adding the current id is always a req'n
          } ).post().then( function ( response ) {
            // immediately view the new reqn
            return self.transitionToViewState( { getIdentifier: function() { return response.data; } } );
          } )
        };
      };

      return {
        root: new object( true ),
        instance: function() { return new object( false ); }
      };
    }
  ] );

} );
