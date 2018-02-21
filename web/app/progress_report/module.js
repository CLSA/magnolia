define( function() {
  'use strict';

  try { var module = cenozoApp.module( 'progress_report', true ); } catch( err ) { console.warn( err ); return; }
  angular.extend( module, {
    identifier: {
      parent: {
        subject: 'requisition',
        column: 'requisition.identifier'
      }
    },
    name: {
      singular: 'progress report',
      plural: 'progress reports',
      possessive: 'progress report\'s',
      pluralPossessive: 'progress reports\'',
      friendlyColumn: 'type'
    },
    columnList: {
      type: { title: 'Type' },
      date: { title: 'Date', type: 'date' }
    },
    defaultOrder: {
      column: 'progress_report.date',
      reverse: true
    }
  } );

  module.addInputGroup( '', {
    language: { column: 'language.code', type: 'string' },
    type: { type: 'string' },
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

          $scope.t = function( value ) {
            return cenozoApp.translate(
              'final' == $scope.model.viewModel.record.type ? finalLookupData : annualLookupData,
              value,
              $scope.model.viewModel.record.language
            );
          };

          var annualLookupData = {
            heading: {
              en: 'Approved User Research Progress Report - Annual Report',
              fr: 'Rapport d’avancement de la recherche pour les utilisateurs autorisés - Rapport annuel'
            },
            instructions: {
              tab: { en: 'Instructions', fr: 'Consignes' },
              title: {
                en: 'Completing the CLSA Approved User Annual Report',
                fr: 'Remplir le rapport annuel pour les utilisateurs autorisés de l’ÉLCV'
              },
              text1: {
                en: 'The Annual Report must be submitted for projects with a 2-year term, at the project midway point, within 30 days of the 1 year anniversary of the Effective Date of the CLSA Access Agreement.',
                fr: 'Assurez-vous de bien remplir toutes les sections du rapport annuel. Au besoin, veuillez ajouter des pages en vous assurant d’indiquer clairement à quelle section elles sont annexées.'
              },
              text2: {
                en: 'Please ensure that you have completed <strong>all sections of the Annual Report</strong>. Please attach additional pages if necessary, clearly noting which section your are expanding upon.',
                fr: 'Assurez-vous de bien remplir <strong>toutes les sections du rapport annuel</strong>. Au besoin, veuillez ajouter des pages en vous assurant d’indiquer clairement à quelle section elles sont annexées.'
              },
              text3: {
                en: 'Consult us for any questions regarding the annual report at <a href="mailto:access@clsa-elcv.ca">access@clsa-elcv.ca</a>.',
                fr: 'Veuillez adresser toute question relative au rapport annuel à <a href="mailto:access@clsa-elcv.ca">access@clsa-elcv.ca</a>.'
              }
            },
            a1: {
              tab: {
                en: 'Annual Report',
                fr: 'Rapport annuel',
              }
            }
          };

          var finalLookupData = {
            heading: {
              en: 'CLSA Approved User Research Progress Report - Final Report',
              fr: 'Rapport d’avancement de la recherche pour les utilisateurs autorisés de l’ÉLCV - Rapport final'
            },
            instructions: {
              title: {
              en: 'Completing the CLSA Approved User Final Report',
              fr: 'Remplir le rapport final pour les utilisateurs autorisés de l’ÉLCV'
              },
              text1: {
                en: 'The Final Report must be submitted at the end of the project, 1 year after the Effective Date of the CLSA Access Agreement for projects with a 1-year term and 2 years after the Effective Date of the CLSA Access Agreement for projects with a 2-year term. The Final Report must be submitted within 60 days after the end date of the CLSA Access Agreement.',
                fr: 'Le rapport final doit être envoyé à la fin du projet, un an après la date d’entrée en vigueur de l’Entente d’accès de l’ÉLCV pour les projets d’une durée d’un ans ou deux ans après la date d’entrée en vigueur de l’Entente d’accès de l’ÉLCV pour les projets d’une durée de deux ans. Le rapport final doit être soumis dans les 60 jours suivant la fin de l’Entente d’accès de l’ÉLCV.'
              },
              text2: {
                en: 'Please ensure that you have completed <strong>all of the sections of the Final Report</strong>. Please attach additional pages if necessary, clearly noting which section your are expanding upon.',
                fr: 'Assurez-vous de bien remplir <strong>toutes les sections du rapport</strong>. Au besoin, veuillez ajouter des pages en vous assurant d’indiquer clairement à quelle section elles sont annexées.'
              },
              text3: {
                en: 'Consult us for any questions regarding the final report at <a href="mailto:access@clsa-elcv.ca">access@clsa-elcv.ca</a>.',
                fr: 'Veuillez adresser toute question relative au rapport final à <a href="mailto:access@clsa-elcv.ca">access@clsa-elcv.ca</a>.'
              }
            }
          };
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
          // immediately get a new requisition and view it (no add state required)
          return CnHttpFactory.instance( {
            path: 'progress_report',
            data: { requisition_id: $state.params.identifier } // when adding the current id is always a req'n
          } ).post().then( function ( response ) { 
            // immediately view the new requisition
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
