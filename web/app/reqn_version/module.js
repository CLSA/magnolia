define( [ 'coapplicant', 'reference' ].reduce( function( list, name ) {
  return list.concat( cenozoApp.module( name ).getRequiredFiles() );
}, [] ), function() {
  'use strict';

  try { var module = cenozoApp.module( 'reqn_version', true ); } catch( err ) { console.warn( err ); return; }

  var coapplicantModule = cenozoApp.module( 'coapplicant' );
  var referenceModule = cenozoApp.module( 'reference' );

  angular.extend( module, {
    identifier: {
      parent: {
        subject: 'reqn',
        column: 'reqn.identifier'
      }
    },
    name: {
      singular: 'version',
      plural: 'versions',
      possessive: 'version\'s'
    },
    columnList: {
      amendment_version: {
        title: 'Version',
        type: 'string'
      },
      datetime: {
        title: 'Date & Time',
        type: 'datetime'
      },
      has_agreement_filename: {
        title: 'Has Agreement',
        type: 'boolean'
      }
    },
    defaultOrder: {
      column: 'amendment_version',
      reverse: true
    }
  } );

  module.addInputGroup( '', {
    reqn_id: { column: 'reqn.id', type: 'string' },
    amendment_version: { type: 'string' },
    amendment: { type: 'string' },
    is_current_version: { type: 'boolean' },
    applicant_name: { type: 'string' },
    applicant_position: { type: 'string' },
    applicant_affiliation: { type: 'string' },
    applicant_address: { type: 'string' },
    applicant_phone: { type: 'string' },
    applicant_email: { type: 'string' },
    graduate_name: { type: 'string' },
    graduate_program: { type: 'string' },
    graduate_institution: { type: 'string' },
    graduate_address: { type: 'string' },
    graduate_phone: { type: 'string' },
    graduate_email: { type: 'string' },
    start_date: { type: 'date' },
    duration: { type: 'enum' },
    title: { type: 'string' },
    keywords: { type: 'string' },
    lay_summary: { type: 'text' },
    background: { type: 'text' },
    objectives: { type: 'text' },
    methodology: { type: 'text' },
    analysis: { type: 'text' },
    funding: { type: 'enum' },
    funding_agency: { type: 'string' },
    grant_number: { type: 'string' },
    ethics: { type: 'boolean' },
    ethics_date: { type: 'date' },
    waiver: { type: 'enum' },
    comprehensive: { type: 'boolean' },
    tracking: { type: 'boolean' },
    longitudinal: { type: 'boolean' },
    last_identifier: { type: 'string' },
    reason_for_amendment: { type: 'text' },
    part2_a_comment: { type: 'text' },
    part2_b_comment: { type: 'text' },
    part2_c_comment: { type: 'text' },
    part2_d_comment: { type: 'text' },
    part2_e_comment: { type: 'text' },

    identifier: { column: 'reqn.identifier', type: 'string' },
    state: { column: 'reqn.state', type: 'string' },
    decision_notice: { column: 'reqn.decision_notice', type: 'string' },
    data_directory: { column: 'reqn.data_directory', type: 'string' },
    status: { column: 'stage_type.status', type: 'string' },
    stage_type: { column: 'stage_type.name', type: 'string' },
    phase: { column: 'stage_type.phase', type: 'string' },
    lang: { column: 'language.code', type: 'string' },
    deadline: { column: 'deadline.date', type: 'date' },
    deferral_note_amendment: { column: 'reqn.deferral_note_amendment', type: 'text' },
    deferral_note_1a: { column: 'reqn.deferral_note_1a', type: 'text' },
    deferral_note_1b: { column: 'reqn.deferral_note_1b', type: 'text' },
    deferral_note_1c: { column: 'reqn.deferral_note_1c', type: 'text' },
    deferral_note_1d: { column: 'reqn.deferral_note_1d', type: 'text' },
    deferral_note_1e: { column: 'reqn.deferral_note_1e', type: 'text' },
    deferral_note_1f: { column: 'reqn.deferral_note_1f', type: 'text' },
    deferral_note_2a: { column: 'reqn.deferral_note_2a', type: 'text' },
    deferral_note_2b: { column: 'reqn.deferral_note_2b', type: 'text' },
    deferral_note_2c: { column: 'reqn.deferral_note_2c', type: 'text' },
    deferral_note_2d: { column: 'reqn.deferral_note_2d', type: 'text' },
    deferral_note_2e: { column: 'reqn.deferral_note_2e', type: 'text' }
  } );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnReqnViewInput',
    function() {
      return {
        templateUrl: module.getFileUrl( 'reqn-view-input.tpl.html' ),
        restrict: 'E',
        scope: {
          model: '=',
          difference: '=',
          input: '=',
          noCols: '='
        },
        controller: [ '$scope', function( $scope ) {
          $scope.directive = 'cnReqnViewInput';
        } ]
      };
    }
  );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnReqnVersionList', [
    'CnReqnVersionModelFactory',
    function( CnReqnVersionModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'list.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnReqnVersionModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnReqnVersionView', [
    'CnReqnVersionModelFactory', 'cnRecordViewDirective', 'CnSession', '$q',
    function( CnReqnVersionModelFactory, cnRecordViewDirective, CnSession, $q ) {
      // used to piggy-back on the basic view controller's functionality
      var cnRecordView = cnRecordViewDirective[0];

      return {
        templateUrl: module.getFileUrl( 'view.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        link: function( scope, element, attrs ) {
          cnRecordView.link( scope, element, attrs );
          scope.isAddingCoapplicant = false;
          scope.isDeletingCoapplicant = [];
          scope.isAddingReference = false;
          scope.isDeletingReference = [];

          scope.liteModel.viewModel.onView();

          scope.model.viewModel.afterView( function() {
            var record = scope.model.viewModel.record;

            // display the decision notice to the applicant under specific circumstances
            if( 'applicant' == CnSession.role.name &&
                record.decision_notice &&
                [ 'Suggested Revisions', 'Agreement', 'Not Approved' ].includes( record.stage_type ) ) {
              scope.model.viewModel.displayDecisionNotice();
            }
          } );

          // fill in the start date delay
          CnSession.promise.then( function() {
            scope.startDateDelay = CnSession.application.startDateDelay;
            scope.maxReferencesPerReqn = CnSession.application.maxReferencesPerReqn;
          } );

          scope.$watch( 'model.viewModel.record.start_date', function( date ) {
            var element = cenozo.getFormElement( 'start_date' );
            if( element ) {
              // clear out errors
              if( null != date && element.$error.required ) element.$error.required = false;
              if( element.$error.custom ) element.$error.custom = false;
              cenozo.updateFormElement( element, true );
            }
          } );
          scope.$watch( 'model.viewModel.record.lay_summary', function( text ) {
            scope.model.viewModel.charCount.lay_summary = text ? text.length : 0;
          } );
          scope.$watch( 'model.viewModel.record.background', function( text ) {
            scope.model.viewModel.charCount.background = text ? text.length : 0;
          } );
          scope.$watch( 'model.viewModel.record.objectives', function( text ) {
            scope.model.viewModel.charCount.objectives = text ? text.length : 0;
          } );
          scope.$watch( 'model.viewModel.record.methodology', function( text ) {
            scope.model.viewModel.charCount.methodology = text ? text.length : 0;
          } );
          scope.$watch( 'model.viewModel.record.analysis', function( text ) {
            scope.model.viewModel.charCount.analysis = text ? text.length : 0;
          } );
        },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnReqnVersionModelFactory.root;
          if( angular.isUndefined( $scope.liteModel ) ) $scope.liteModel = CnReqnVersionModelFactory.lite;
          cnRecordView.controller[1]( $scope );

          // coapplicant resources
          var coapplicantAddModel = $scope.model.viewModel.coapplicantModel.addModel;
          $scope.coapplicantRecord = {};
          coapplicantAddModel.onNew( $scope.coapplicantRecord );

          $scope.getHeading = function() {
            var status = $scope.model.viewModel.record[$scope.model.isApplicant() ? 'status' : 'stage_type'];
            if( 'deferred' == $scope.model.viewModel.record.state ) {
              status = $scope.model.isApplicant() ? 'Action Required' : 'Deferred to Applicant';
            } else if( $scope.model.viewModel.record.state ) {
              status = $scope.model.viewModel.record.state.ucWords();
            }

            return [
              $scope.t( 'heading' ),
              '-',
              $scope.model.viewModel.record.identifier,
              'version',
              $scope.model.viewModel.record.amendment_version,
              '(' + status + ')'
            ].join( ' ' );
          };

          $scope.compareTo = function( version ) {
            $scope.model.viewModel.compareRecord = version;
            $scope.liteModel.viewModel.compareRecord = version;
            $scope.model.setQueryParameter( 'c', null == version ? undefined : version.amendment_version );
            $scope.model.reloadState( false, false, 'replace' );
          };

          $scope.addCoapplicant = function() {
            if( $scope.model.viewModel.coapplicantModel.getAddEnabled() ) {
              var form = cenozo.getScopeByQuerySelector( '#part1bForm' ).part1bForm;

              // we need to check each add-input for errors
              var valid = true;
              for( var property in $scope.model.viewModel.coapplicantModel.module.inputGroupList[0].inputList ) {
                // get the property's form element and remove any conflict errors, then see if it's invalid
                var currentElement = cenozo.getFormElement( property );
                currentElement.$error.conflict = false;
                cenozo.updateFormElement( currentElement );
                if( currentElement.$invalid ) {
                  valid = false;
                  break;
                }
              }
              if( !valid ) {
                // dirty all inputs so we can find the problem
                cenozo.forEachFormElement( 'part1bForm', function( element ) { element.$dirty = true; } );
              } else {
                $scope.isAddingCoapplicant = true;
                coapplicantAddModel.onAdd( $scope.coapplicantRecord ).then( function( response ) {
                  form.$setPristine();
                  return $q.all( [
                    coapplicantAddModel.onNew( $scope.coapplicantRecord ),
                    $scope.model.viewModel.getCoapplicantList().then( function() {
                      $scope.model.viewModel.determineCoapplicantDiffs();
                    } )
                  ] );
                } ).finally( function() { $scope.isAddingCoapplicant = false; } );
              }
            }
          };

          $scope.removeCoapplicant = function( id ) {
            if( $scope.model.viewModel.coapplicantModel.getDeleteEnabled() ) {
              if( !$scope.isDeletingCoapplicant.includes( id ) ) $scope.isDeletingCoapplicant.push( id );
              var index = $scope.isDeletingCoapplicant.indexOf( id );
              $scope.model.viewModel.removeCoapplicant( id ).finally( function() {
                if( 0 <= index ) $scope.isDeletingCoapplicant.splice( index, 1 );
              } );
            }
          };

          // reference resources
          var referenceAddModel = $scope.model.viewModel.referenceModel.addModel;
          $scope.referenceRecord = {};
          referenceAddModel.onNew( $scope.referenceRecord );

          $scope.addReference = function() {
            if( $scope.model.viewModel.referenceModel.getAddEnabled() ) {
              var form = cenozo.getScopeByQuerySelector( '#part1dForm' ).part1dForm;
              if( !form.$valid ) {
                // dirty all inputs so we can find the problem
                cenozo.forEachFormElement( 'part1dForm', function( element ) { element.$dirty = true; } );
              } else {
                $scope.isAddingReference = true;
                referenceAddModel.onAdd( $scope.referenceRecord ).then( function( response ) {
                  form.$setPristine();
                  return $q.all( [
                    referenceAddModel.onNew( $scope.referenceRecord ),
                    $scope.model.viewModel.getReferenceList().then( function() {
                      $scope.model.viewModel.determineReferenceDiffs();
                    } )
                  ] );
                } ).finally( function() { $scope.isAddingReference = false; } );
              }
            }
          };

          $scope.removeReference = function( id ) {
            if( $scope.model.viewModel.referenceModel.getDeleteEnabled() ) {
              if( !$scope.isDeletingReference.includes( id ) ) $scope.isDeletingReference.push( id );
              var index = $scope.isDeletingReference.indexOf( id );
              $scope.model.viewModel.removeReference( id ).finally( function() {
                if( 0 <= index ) $scope.isDeletingReference.splice( index, 1 );
              } );
            }
          };

          $scope.setReferenceRank = function( id, rank ) {
            $scope.model.viewModel.setReferenceRank( id, rank );
          };

          $scope.check = function( property ) {
            // The cn-reqn-form directive makes use of cn-add-input directives.  These directives need their
            // parent to have a check() function which checks to see whether the input is valid or not.  Since
            // that function is usually in the cn-record-add directive we have to implement on here instead.
            var element = cenozo.getFormElement( property );
            if( element ) {
              // Both the coapplicant and reference cn-add-input directives share this method, so differentiate
              // by checking to see which module has the property
              if( null != coapplicantModule.getInput( property ) ) {
                element.$error.format = !$scope.model.viewModel.coapplicantModel.testFormat(
                  property, $scope.coapplicantRecord[property]
                );
              } else if( null != referenceModule.getInput( property ) ) {
                element.$error.format = !$scope.model.viewModel.referenceModel.testFormat(
                  property, $scope.referenceRecord[property]
                );
              }
              cenozo.updateFormElement( element, true );
            }
          };

          $scope.t = function( value ) { return $scope.model.viewModel.translate( value ); };
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnReqnVersionListFactory', [
    'CnBaseListFactory',
    function( CnBaseListFactory ) {
      var object = function( parentModel ) { CnBaseListFactory.construct( this, parentModel ); };
      return { instance: function( parentModel ) { return new object( parentModel ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnReqnVersionViewFactory', [
    'CnReqnHelper', 'CnReqnVersionHelper', 'CnCoapplicantModelFactory', 'CnReferenceModelFactory', 'CnBaseViewFactory',
    'CnSession', 'CnHttpFactory', 'CnModalMessageFactory', 'CnModalConfirmFactory', '$state', '$q', '$window',
    function( CnReqnHelper, CnReqnVersionHelper, CnCoapplicantModelFactory, CnReferenceModelFactory, CnBaseViewFactory,
              CnSession, CnHttpFactory, CnModalMessageFactory, CnModalConfirmFactory, $state, $q, $window ) {
      var object = function( parentModel, root ) {
        var self = this;
        CnBaseViewFactory.construct( this, parentModel, root );

        this.deferred.promise.then( function() {
          if( angular.isDefined( self.stageModel ) ) self.stageModel.listModel.heading = 'Stage History';
        } );

        this.configureFileInput( 'funding_filename' );
        this.configureFileInput( 'ethics_filename' );
        this.configureFileInput( 'data_sharing_filename' );
        this.configureFileInput( 'agreement_filename' );

        angular.extend( this, {
          compareRecord: null,
          versionList: [],
          lastAgreementVersion: null,
          agreementDifferenceList: null,
          show: function( subject ) { return CnReqnHelper.showAction( subject, this.record ); },
          showAgreement: function() {
            // only show the agreement tab to administrators and when we've passed the review stage
            return 'administrator' == CnSession.role.name && ['active','complete'].includes( self.record.phase );
          },
          abandon: function() {
            return CnReqnHelper.abandon(
              'identifier=' + this.record.identifier,
              '.' != this.record.amendment,
              this.record.lang
            ).then( function( response ) {
              if( response ) $state.go( 'applicant' == CnSession.role.name ? 'root.home' : 'reqn.list' );
            } );
          },
          delete: function() { return CnReqnHelper.delete( 'identifier=' + this.record.identifier, this.record.lang ); },
          translate: function( value ) { return CnReqnHelper.translate( 'reqn', value, this.record.lang ); },
          viewReport: function() { return CnReqnHelper.viewReport( this.record.identifier ); },
          downloadApplication: function() { return CnReqnHelper.download( 'application', this.record.getIdentifier() ); },
          downloadChecklist: function() { return CnReqnHelper.download( 'checklist', this.record.getIdentifier() ); },

          onView: function( force ) {
            // reset tab values
            this.setTab( 0, this.parentModel.getQueryParameter( 't0' ), false );
            this.setTab( 1, this.parentModel.getQueryParameter( 't1' ), false );
            this.setTab( 2, this.parentModel.getQueryParameter( 't2' ), false );

            // reset compare version and differences
            this.compareRecord = null;
            this.agreementDifferenceList = null;

            return this.$$onView( force ).then( function() {
              // define the earliest date that the reqn may start (based on the deadline, or today if there is no deadline)
              self.minStartDate = self.record.deadline
                                ? moment( self.record.deadline ).add( CnSession.application.startDateDelay, 'months' )
                                : moment();

              if( 'lite' != self.parentModel.type ) {
                return $q.all( [
                  self.getCoapplicantList(),
                  self.getReferenceList(),
                  self.getDataOptionValueList()
                ] ).then( function() { return self.getVersionList(); } );
              }
            } );
          },

          onPatch: function( data ) {
            // make sure to send patches to deferral notes to the parent reqn
            var property = Object.keys( data )[0];
            if( null == property.match( /^deferral_note/ ) ) {
              return this.$$onPatch( data );
            } else {
              if( !this.parentModel.getEditEnabled() ) throw new Error( 'Calling onPatch() but edit is not enabled.' );

              var parent = this.parentModel.getParentIdentifier();
              var httpObj = {
                path: parent.subject + '/' + parent.identifier,
                data: data
              };
              httpObj.onError = function( response ) { self.onPatchError( response ); }
              return CnHttpFactory.instance( httpObj ).patch().then( function() {
                self.afterPatchFunctions.forEach( function( fn ) { fn(); } );
              } );
            }
          },

          coapplicantModel: CnCoapplicantModelFactory.instance(),
          referenceModel: CnReferenceModelFactory.instance(),
          charCount: { lay_summary: 0, background: 0, objectives: 0, methodology: 0, analysis: 0 },
          minStartDate: null,

          // setup language and tab state parameters
          toggleLanguage: function() {
            var parent = this.parentModel.getParentIdentifier();
            this.record.lang = 'en' == this.record.lang ? 'fr' : 'en';
            return CnHttpFactory.instance( {
              path: parent.subject + '/' + parent.identifier,
              data: { language: this.record.lang }
            } ).patch();
          },

          // the sequencial list of all tabs where every item has an array of the three indexed tab values
          tab: [],
          tabSectionList: [
            [ 'instructions', null, null ],
            [ 'amendment', null, null ],
            [ 'part1', 'a', null ],
            [ 'part1', 'b', null ],
            [ 'part1', 'c', null ],
            [ 'part1', 'd', null ],
            [ 'part1', 'e', null ],
            [ 'part1', 'f', null ],
            [ 'part2', null, 'notes' ],
            [ 'part2', null, 'cohort' ],
            [ 'part2', null, 'a' ],
            [ 'part2', null, 'b' ],
            [ 'part2', null, 'c' ],
            [ 'part2', null, 'd' ],
            [ 'part2', null, 'e' ],
            [ 'part3', null, null ],
            [ 'agreement', null, null ]
          ],

          setTab: function( index, tab, transition ) {
            if( angular.isUndefined( transition ) ) transition = true;
            if( !( 0 <= index && index <= 2 ) ) index = 0;

            // find the tab section
            var selectedTabSection = null;
            this.tabSectionList.some( function( tabSection ) {
              if( tab == tabSection[index] ) {
                selectedTabSection = tabSection;
                return true;
              }
            } );

            // get the tab (or default of none was found)
            tab = null != selectedTabSection && null != selectedTabSection[index]
                ? selectedTabSection[index]
                : ( 0 == index ? 'instructions' : 1 == index ? 'a' : 'notes' );

            self.tab[index] = tab;
            self.parentModel.setQueryParameter( 't'+index, tab );

            if( transition ) this.parentModel.reloadState( false, false, 'replace' );

            // update all textarea sizes
            angular.element( 'textarea[cn-elastic]' ).trigger( 'elastic' );
          },

          nextSection: function( reverse ) {
            if( angular.isUndefined( reverse ) ) reverse = false;

            var currentTabSectionIndex = null;
            this.tabSectionList.some( function( tabSection, index ) {
              if( self.tab[0] == tabSection[0] ) {
                if( ( null == tabSection[1] || self.tab[1] == tabSection[1] ) &&
                    ( null == tabSection[2] || self.tab[2] == tabSection[2] ) ) {
                  currentTabSectionIndex = index;
                  return true;
                }
              }
            } );

            if( null != currentTabSectionIndex ) {
              var tabSection = this.tabSectionList[currentTabSectionIndex + (reverse?-1:1)];

              // skip the amendment section if this isn't an amendment
              if( 'amendment' == tabSection[0] && '.' == this.record.amendment )
                tabSection = this.tabSectionList[currentTabSectionIndex + (reverse?-2:2)];

              // always skip the agreement section
              if( 'agreement' == tabSection[0] )
                tabSection = this.tabSectionList[currentTabSectionIndex + (reverse?-2:2)];

              if( angular.isDefined( tabSection ) ) {
                if( null != tabSection[2] ) this.setTab( 2, tabSection[2], false );
                if( null != tabSection[1] ) this.setTab( 1, tabSection[1], false );
                this.setTab( 0, tabSection[0] );
              }
            }
          },

          getVersionList: function() {
            var parent = self.parentModel.getParentIdentifier();
            this.versionList = [];
            return CnHttpFactory.instance( {
              path: parent.subject + '/' + parent.identifier + '/reqn_version'
            } ).query().then( function( response ) {
              var promiseList = [];

              response.data.forEach( function( version ) {
                promiseList = promiseList.concat( [
                  self.getCoapplicantList( version.id, version ).then( function() {
                    // see if there is a difference between this list and the view's list
                    self.setCoapplicantDiff( version );
                  } ),

                  self.getReferenceList( version.id, version ).then( function() {
                    // see if there is a difference between this list and the view's list
                    self.setReferenceDiff( version );
                  } ),

                  self.getDataOptionValueList( version.id, version ),

                  // add the file sizes
                  CnHttpFactory.instance( {
                    path: 'reqn_version/' + version.id + '?file=funding_filename'
                  } ).get().then( function( response ) {
                    version.funding_size = response.data;
                  } ),

                  CnHttpFactory.instance( {
                    path: 'reqn_version/' + version.id + '?file=ethics_filename'
                  } ).get().then( function( response ) {
                    version.ethics_size = response.data;
                  } ),

                  CnHttpFactory.instance( {
                    path: 'reqn_version/' + version.id + '?file=data_sharing_filename'
                  } ).get().then( function( response ) {
                    version.data_sharing_size = response.data;
                  } )
                ] );

                self.versionList.push( version );
              } );

              var amendmentVersion = self.parentModel.getQueryParameter( 'c' );
              if( angular.isDefined( amendmentVersion ) )
                self.compareRecord = self.versionList.findByProperty( 'amendment_version', amendmentVersion );

              if( 1 < self.versionList.length ) {
                // add a null object to the version list so we can turn off comparisons
                self.versionList.unshift( null );
              }

              return $q.all( promiseList ).then( function() {
                // Calculate all differences for all versions (in reverse order so we can find the last agreement version)
                self.versionList.reverse();

                self.lastAgreementVersion = null;
                self.versionList.forEach( function( version ) {
                  if( null != version ) {
                    version.differences = CnReqnVersionHelper.getDifferences( self.record, version, self.parentModel );

                    // while we're at it determine the last agreement version and calculate its differences
                    if( null == self.agreementDifferenceList && null != version.agreement_filename ) {
                      self.agreementDifferenceList = self.getDifferenceList( version );
                    }
                  } else {
                    self.agreementDifferenceList = [];
                  }
                } );

                // put the order of the version list back to normal
                self.versionList.reverse();
              } );
            } );
          },

          determineCoapplicantDiffs: function() {
            this.versionList.forEach( version => self.setCoapplicantDiff( version ) );
          },

          setCoapplicantDiff: function( version ) {
            if( null != version ) {
              // see if there is a difference between this list and the view's list
              version.coapplicantDiff =
                version.coapplicantList.length != self.record.coapplicantList.length ||
                version.coapplicantList.some(
                  c1 => !self.record.coapplicantList.some(
                    c2 => ![ 'name', 'position', 'affiliation', 'email', 'role', 'access' ].some(
                      prop => c1[prop] != c2[prop]
                    )
                  )
                );
            }
          },

          getCoapplicantList: function( reqnVersionId, object ) {
            var basePath = angular.isDefined( reqnVersionId )
                         ? 'reqn_version/' + reqnVersionId
                         : this.parentModel.getServiceResourcePath()

            if( angular.isUndefined( object ) ) object = self.record;

            return CnHttpFactory.instance( {
              path: basePath + '/coapplicant',
              data: {
                select: { column: [ 'id', 'name', 'position', 'affiliation', 'email', 'role', 'access' ] },
                modifier: { order: 'id', limit: 1000000 }
              }
            } ).query().then( function( response ) {
              object.coapplicantList = response.data;
            } );
          },

          removeCoapplicant: function( id ) {
            return CnHttpFactory.instance( {
              path: this.parentModel.getServiceResourcePath() + '/coapplicant/' + id
            } ).delete().then( function() {
              return self.getCoapplicantList().then( function() { self.determineCoapplicantDiffs(); } );
            } );
          },

          determineReferenceDiffs: function() {
            this.versionList.forEach( version => self.setReferenceDiff( version ) );
          },

          setReferenceDiff: function( version ) {
            if( null != version ) {
              // see if there is a difference between this list and the view's list
              version.referenceDiff =
                version.referenceList.length != self.record.referenceList.length ||
                version.referenceList.some(
                  c1 => !self.record.referenceList.some(
                    c2 => ![ 'rank', 'reference' ].some(
                      prop => c1[prop] != c2[prop]
                    )
                  )
                );
            }
          },

          getReferenceList: function( reqnVersionId, object ) {
            var basePath = angular.isDefined( reqnVersionId )
                         ? 'reqn_version/' + reqnVersionId
                         : this.parentModel.getServiceResourcePath()
            if( angular.isUndefined( object ) ) object = self.record;

            return CnHttpFactory.instance( {
              path: basePath + '/reference',
              data: {
                select: { column: [ 'id', 'rank', 'reference' ] },
                modifier: { order: 'rank', limit: 1000000 }
              }
            } ).query().then( function( response ) {
              object.referenceList = response.data;
            } );
          },

          setReferenceRank: function( id, rank ) {
            return CnHttpFactory.instance( {
              path: this.parentModel.getServiceResourcePath() + '/reference/' + id,
              data: { rank: rank }
            } ).patch().then( function() {
              return self.getReferenceList().then( function() { self.determineReferenceDiffs(); } );
            } );
          },

          removeReference: function( id ) {
            return CnHttpFactory.instance( {
              path: this.parentModel.getServiceResourcePath() + '/reference/' + id
            } ).delete().then( function() {
              return self.getReferenceList().then( function() { self.determineReferenceDiffs(); } );
            } );
          },

          getDataOptionValueList: function( reqnVersionId, object ) {
            var basePath = angular.isDefined( reqnVersionId )
                         ? 'reqn_version/' + reqnVersionId
                         : this.parentModel.getServiceResourcePath()

            if( angular.isUndefined( object ) ) object = self.record;

            object.dataOptionValueList = { bl: [], f1: [] };
            return CnHttpFactory.instance( {
              path: 'data_option',
              data: { select: { column: [ { column: 'MAX(data_option.id)', alias: 'maxId', table_prefix: false } ] } }
            } ).get().then( function( response ) {
              for( var i = 0; i <= response.data[0].maxId; i++ ) {
                object.dataOptionValueList.bl[i] = false;
                object.dataOptionValueList.f1[i] = false;
              }
            } ).then( function() {
              return CnHttpFactory.instance( {
                path: basePath + '/reqn_version_data_option',
                data: { select: { column: [ 'data_option_id', { table: 'study_phase', column: 'code', alias: 'phase' } ] } }
              } ).query().then( function( response ) {
                response.data.forEach( function( dataOption ) {
                  if( angular.isDefined( object.dataOptionValueList[dataOption.phase] ) )
                    object.dataOptionValueList[dataOption.phase][dataOption.data_option_id] = true;
                } );
              } );
            } );
          },

          toggleDataOptionValue: function( studyPhaseCode, dataOptionId ) {
            // toggle the option
            this.record.dataOptionValueList[studyPhaseCode][dataOptionId] =
              !this.record.dataOptionValueList[studyPhaseCode][dataOptionId];

            if( this.record.dataOptionValueList[studyPhaseCode][dataOptionId] ) {
              // add the data-option
              return CnHttpFactory.instance( {
                path: this.parentModel.getServiceResourcePath() + '/reqn_version_data_option',
                data: { data_option_id: dataOptionId, study_phase_code: studyPhaseCode },
                onError: function( response ) {
                  self.record.dataOptionValueList[studyPhaseCode][dataOptionId] =
                    !self.record.dataOptionValueList[studyPhaseCode][dataOptionId];
                }
              } ).post();
            } else {
              // delete the data-option
              return CnHttpFactory.instance( {
                path: this.parentModel.getServiceResourcePath() +
                  '/reqn_version_data_option/data_option_id=' + dataOptionId + ';study_phase_code=' + studyPhaseCode,
                onError: function( response ) {
                  self.record.dataOptionValueList[studyPhaseCode][dataOptionId] =
                    !self.record.dataOptionValueList[studyPhaseCode][dataOptionId];
                }
              } ).delete();
            }
          },

          viewData: function() {
            $window.open( CnSession.application.studyDataUrl + '/' + self.record.data_directory, 'studyData' + self.record.reqn_id );
          },

          canViewData: function() {
            // administrators and applicants can view data when in the active stage
            var stage_type = this.record.stage_type ? this.record.stage_type : '';
            return ['administrator','applicant'].includes( CnSession.role.name ) && 'Active' == stage_type;
          },

          getDifferenceList: function( version ) {
            var differenceList = [];
            var mainInputGroup = self.parentModel.module.inputGroupList.findByProperty( 'title', '' );

            if( version.differences.diff ) {
              for( var part in version.differences ) {
                if( !version.differences.hasOwnProperty( part ) ) continue;
                if( 'diff' == section ) continue; // used to track overall diff

                if( version.differences[part].diff ) {
                  for( var section in version.differences[part] ) {
                    if( !version.differences[part].hasOwnProperty( section ) ) continue;
                    if( 'diff' == section ) continue; // used to track overall diff

                    if( version.differences[part][section].diff ) {
                      for( var property in version.differences[part][section] ) {
                        if( !version.differences[part][section].hasOwnProperty( property ) ) continue;
                        if( 'diff' == property ) continue; // used to track overall diff

                        if( angular.isArray( version.differences[part][section][property] ) ) {
                          version.differences[part][section][property].forEach( function( change ) {
                            differenceList.push( {
                              type: property.replace( 'List', '' )
                                            .camelToSnake()
                                            .replace( /_/g, ' ' )
                                            .replace( /[0-9]+/g, ' $&' )
                                            .ucWords(),
                              name: change.name,
                              diff: change.diff
                            } );
                          } );
                        } else {
                          if( version.differences[part][section][property] ) {
                            differenceList.push(
                              angular.isDefined( mainInputGroup.inputList[property] ) &&
                              'text' == mainInputGroup.inputList[property].type ? {
                                name: property.replace( /_/g, ' ' ).ucWords(),
                                diff: 'changed'
                              } : {
                                name: property.replace( /_/g, ' ' ).ucWords(),
                                old: null == version[property] ? '(empty)' : '"' + version[property] + '"',
                                new: null == self.record[property] ? '(empty)' : '"' + self.record[property] + '"'
                              }
                            );
                          }
                        }
                      }
                    }
                  }
                }
              }
            }

            return differenceList;
          },

          submit: function() {
            // used below
            function submitReqn() {
              var parent = self.parentModel.getParentIdentifier();
              return CnHttpFactory.instance( {
                path: parent.subject + '/' + parent.identifier + "?action=submit",
                onError: function( response ) {
                  if( 409 == response.status ) {
                    CnModalMessageFactory.instance( {
                      title: self.translate( 'misc.invalidStartDateTitle' ),
                      message: self.translate( 'misc.invalidStartDateMessage' ),
                      closeText: 'applicant' == CnSession.role.name ? self.translate( 'misc.close' ) : 'Close',
                      error: true
                    } ).show().then( function() {
                      var element = cenozo.getFormElement( 'start_date' );
                      element.$error.custom = self.translate( 'misc.invalidStartDateTitle' );
                      cenozo.updateFormElement( element, true );
                      self.setTab( 0, 'part1', false );
                      self.setTab( 1, 'c' );
                    } );
                  } else CnModalMessageFactory.httpError( response );
                }
              } ).patch().then( function() {
                var code = CnSession.user.graduate ?
                  ( 'deferred' == record.state ? 'graduateResubmit' : 'graduateSubmit' ) :
                  ( 'deferred' == record.state ? 'resubmit' : 'submit' );
                return CnModalMessageFactory.instance( {
                  title: self.translate( 'misc.' + code + 'Title' ),
                  message: self.translate( 'misc.' + code + 'Message' ),
                  closeText: 'applicant' == CnSession.role.name ? self.translate( 'misc.close' ) : 'Close'
                } ).show().then( function() {
                  return self.parentModel.isApplicant() ?
                    $state.go( 'root.home' ) :
                    self.onView( true ); // refresh
                } );
              } );
            }

            var record = this.record;
            return CnModalConfirmFactory.instance( {
              title: this.translate( 'misc.pleaseConfirm' ),
              noText: 'applicant' == CnSession.role.name ? this.translate( 'misc.no' ) : 'No',
              yesText: 'applicant' == CnSession.role.name ? this.translate( 'misc.yes' ) : 'Yes',
              message: this.translate( 'misc.submitWarning' )
            } ).show().then( function( response ) {
              if( response ) {
                // make sure that certain properties have been defined, one tab at a time
                var requiredTabList = {
                  amendment: [ 'reason_for_amendment' ],
                  a: [ 'applicant_position', 'applicant_affiliation', 'applicant_address', 'applicant_phone' ],
                  c: [ 'start_date', 'duration' ],
                  d: [ 'title', 'keywords', 'lay_summary', 'background', 'objectives', 'methodology', 'analysis' ],
                  e: [ 'funding', 'funding_filename', 'funding_agency', 'grant_number' ],
                  f: [ 'ethics', 'ethics_filename' ],
                  cohort: [ 'tracking', 'comprehensive', 'longitudinal', 'last_identifier' ]
                };

                $q.all( self.fileList.map( file => file.updateFileSize() ) ).then( function() {
                  var error = null;
                  var errorTab = null;
                  for( var tab in requiredTabList ) {
                    var firstProperty = null;
                    requiredTabList[tab].filter( function( property ) {
                      if( 'amendment' == tab ) {
                        // only check the reason for amendment while doing an amendment
                        return '.' != record.amendment;
                      } else if( 'e' == tab ) {
                        // only check e properties if funding=yes
                        return 'funding' != property ? 'yes' == record.funding : true;
                      } else if( 'ethics_filename' == property ) {
                        // only check the ethics filename if ethics=yes (it's a boolean var)
                        return record.ethics;
                      } else if( 'last_identifier' == property ) {
                        // only check the last_identifier if longitidunal=yes (it's a boolean var) 
                        return record.longitudinal;
                      }

                      // check everything else
                      return true;
                    } ).forEach( function( property ) {
                      var missing = false;
                      if( property.match( '_filename' ) ) {
                        // check for the file size
                        var fileDetails = self.fileList.findByProperty( 'key', property );
                        missing = !angular.isObject( fileDetails ) || 0 == fileDetails.size;
                      } else {
                        // check for the property's value
                        missing = null === record[property] || '' === record[property];
                      }

                      if( missing ) {
                        var element = cenozo.getFormElement( property );
                        element.$error.required = true;
                        cenozo.updateFormElement( element, true );
                        if( null == errorTab ) errorTab = tab;
                        if( null == error ) error = {
                          title: self.translate( 'misc.missingFieldTitle' ),
                          message: self.translate( 'misc.missingFieldMessage' ),
                          error: true
                        };
                      }
                    } );
                  }

                  if( null != error ) {
                    var element = cenozo.getFormElement( 'lay_summary' );

                    // if there was an error then display it now
                    if( 'applicant' == CnSession.role.name ) error.closeText = self.translate( 'misc.close' );
                    CnModalMessageFactory.instance( error ).show().then( function() {
                      if( 'amendment' == errorTab ) {
                        self.setTab( 0, 'amendment', false );
                      } else if( 'cohort' == errorTab ) {
                        self.setTab( 0, 'part2', false );
                        self.setTab( 2, errorTab );
                      } else {
                        self.setTab( 0, 'part1', false );
                        self.setTab( 1, errorTab );
                      }
                    } );
                  } else {
                    // now check to make sure this version is different from the last (the first is always different)
                    return CnHttpFactory.instance( {
                      path: self.parentModel.getServiceResourcePath(),
                      data: { select: { column: 'has_changed' } }
                    } ).get().then( function( response ) {
                      return response.data.has_changed ?
                        // changes have been made, so submit now
                        submitReqn() :
                        // no changes made so warn the user before proceeding
                        CnModalConfirmFactory.instance( {
                          title: self.translate( 'misc.pleaseConfirm' ),
                          noText: 'applicant' == CnSession.role.name ? self.translate( 'misc.no' ) : 'No',
                          yesText: 'applicant' == CnSession.role.name ? self.translate( 'misc.yes' ) : 'Yes',
                          message: self.translate( 'misc.noChangesMessage' )
                        } ).show().then( function( response ) {
                          if( response ) return submitReqn();
                        } );
                    } );

                  }
                } );
              }
            } );
          },

          amend: function() {
            return CnModalConfirmFactory.instance( {
              title: self.translate( 'misc.pleaseConfirm' ),
              noText: 'applicant' == CnSession.role.name ? self.translate( 'misc.no' ) : 'No',
              yesText: 'applicant' == CnSession.role.name ? self.translate( 'misc.yes' ) : 'Yes',
              message: self.translate( 'misc.amendWarning' )
            } ).show().then( function( response ) {
              if( response ) {
                var parent = self.parentModel.getParentIdentifier();
                return CnHttpFactory.instance( {
                  path: parent.subject + '/' + parent.identifier + "?action=amend",
                } ).patch().then( function() {
                  // get the new version and transition to viewing it
                  return CnHttpFactory.instance( {
                    path: parent.subject + '/' + parent.identifier,
                    data: {
                      select: {
                        column: {
                          table: 'reqn_version',
                          column: 'id',
                          alias: 'reqn_version_id'
                        }
                      }
                    }
                  } ).get().then( function( response ) {
                    return self.parentModel.transitionToViewState( {
                      getIdentifier: function() { return response.data.reqn_version_id; }
                    } );
                  } );
                } );
              }
            } );
          },

          viewReqn: function() {
            var parent = this.parentModel.getParentIdentifier();
            return this.parentModel.transitionToParentViewState( parent.subject, parent.identifier );
          },

          displayDecisionNotice: function() {
            CnModalMessageFactory.instance( {
              title: 'Notice of decision for ' + self.record.identifier,
              message: self.record.decision_notice,
              print: true
            } ).show();
          }

        } );
        this.coapplicantModel.metadata.getPromise(); // needed to get the coapplicant's metadata
        this.referenceModel.metadata.getPromise(); // needed to get the reference's metadata
      };
      return { instance: function( parentModel, root ) { return new object( parentModel, root ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnReqnVersionModelFactory', [
    'CnReqnHelper', 'CnBaseModelFactory', 'CnReqnVersionListFactory', 'CnReqnVersionViewFactory',
    'CnSession', 'CnHttpFactory', '$state', '$q',
    function( CnReqnHelper, CnBaseModelFactory, CnReqnVersionListFactory, CnReqnVersionViewFactory,
              CnSession, CnHttpFactory, $state, $q ) {
      var object = function( type ) {
        var self = this;

        CnBaseModelFactory.construct( this, module );
        this.type = type;
        if( 'lite' != this.type ) this.listModel = CnReqnVersionListFactory.instance( this );
        this.viewModel = CnReqnVersionViewFactory.instance( this, 'root' == this.type );

        // override the service collection
        this.getServiceData = function( type, columnRestrictLists ) {
          // only include the funding, ethics, data_sharing and agreement filenames in the view type in the lite instance
          return 'lite' == this.type ? {
            select: {
              column: [ 'is_current_version', 'funding_filename', 'ethics_filename', 'data_sharing_filename', 'agreement_filename',
                { table: 'reqn', column: 'state' },
                { table: 'stage_type', column: 'phase' },
                { table: 'stage_type', column: 'name', alias: 'stage_type' }
              ]
            }
          } : this.$$getServiceData( type, columnRestrictLists );
        };

        // make the input lists from all groups more accessible
        this.inputList = {};
        module.inputGroupList.forEach( group => Object.assign( self.inputList, group.inputList ) );

        this.isApplicant = function() { return 'applicant' == CnSession.role.name; }
        this.isAdministrator = function() { return 'administrator' == CnSession.role.name; }

        this.getEditEnabled = function() {
          var is_current_version = this.viewModel.record.is_current_version ? this.viewModel.record.is_current_version : '';
          var phase = this.viewModel.record.phase ? this.viewModel.record.phase : '';
          var state = this.viewModel.record.state ? this.viewModel.record.state : '';
          var stage_type = this.viewModel.record.stage_type ? this.viewModel.record.stage_type : '';

          var check = false;
          if( 'applicant' == CnSession.role.name ) {
            check = 'new' == phase || (
              'deferred' == state && ( 'review' == phase || ( 'lite' == this.type && 'Agreement' == stage_type ) )
            );
          } else if( 'administrator' == CnSession.role.name ) {
            check = 'new' == phase || (
              'abandoned' != state && ( 'review' == phase || 'Agreement' == stage_type || 'Data Release' == stage_type )
            );
          }

          return this.$$getEditEnabled() && is_current_version && check;
        };

        this.getDeleteEnabled = function() {
          return this.$$getDeleteEnabled() &&
                 angular.isDefined( this.viewModel.record ) &&
                 'new' == this.viewModel.record.phase;
        };

        this.setupBreadcrumbTrail = function() {
          var trail = [];

          if( this.isApplicant() ) {
            trail = [
              { title: 'Requisition' },
              { title: this.viewModel.record.identifier }
            ];
          } else {
            trail = [ {
              title: 'Requisitions',
              go: function() { return $state.go( 'reqn.list' ); }
            }, {
              title: this.viewModel.record.identifier,
              go: function() { return $state.go( 'reqn.view', { identifier: 'identifier=' + self.viewModel.record.identifier } ); }
            }, {
              title: 'version ' + this.viewModel.record.amendment_version
            } ];
          }

          CnSession.setBreadcrumbTrail( trail );
        };

        var misc = CnReqnHelper.lookupData.reqn.misc;
        this.dataOptionCategoryList = [];

        this.getMetadata = function() {
          return $q.all( [
            $q.all( [
              self.$$getMetadata(),
              CnHttpFactory.instance( {
                path: 'reqn_version'
              } ).head().then( function( response ) {
                var columnList = angular.fromJson( response.headers( 'Columns' ) );
                for( var column in columnList ) {
                  columnList[column].required = '1' == columnList[column].required;
                  if( 'enum' == columnList[column].data_type ) { // parse out the enum values
                    columnList[column].enumList = [];
                    cenozo.parseEnumList( columnList[column] ).forEach( function( item ) {
                      columnList[column].enumList.push( { value: item, name: item } );
                    } );
                  }
                  if( angular.isUndefined( self.metadata.columnList[column] ) )
                    self.metadata.columnList[column] = {};
                  angular.extend( self.metadata.columnList[column], columnList[column] );
                }
              } )
            ] ).then( function() {
              // only do the following for the root instance
              if( 'root' == self.type ) {
                // create coapplicant access enum
                self.metadata.accessEnumList = {
                  en: [ { value: true, name: misc.yes.en }, { value: false, name: misc.no.en } ],
                  fr: [ { value: true, name: misc.yes.fr }, { value: false, name: misc.no.fr } ]
                };

                // create generic yes/no enum
                self.metadata.yesNoEnumList = {
                  en: [ { value: '', name: misc.choose.en }, { value: true, name: misc.yes.en }, { value: false, name: misc.no.en } ],
                  fr: [ { value: '', name: misc.choose.fr }, { value: true, name: misc.yes.fr }, { value: false, name: misc.no.fr } ]
                };

                // translate duration
                self.metadata.columnList.duration.enumList.unshift( { value: '', name: misc.choose.en } );
                self.metadata.columnList.duration.enumList = {
                  en: self.metadata.columnList.duration.enumList,
                  fr: angular.copy( self.metadata.columnList.duration.enumList )
                };
                self.metadata.columnList.duration.enumList.fr[0].name = misc.duration2Years.fr;
                self.metadata.columnList.duration.enumList.fr[1].name = misc.duration3Years.fr;

                // translate funding enum
                self.metadata.columnList.funding.enumList = {
                  en: self.metadata.columnList.funding.enumList,
                  fr: angular.copy( self.metadata.columnList.funding.enumList )
                };
                self.metadata.columnList.funding.enumList.fr[0].name = misc.yes.fr.toLowerCase();
                self.metadata.columnList.funding.enumList.fr[1].name = misc.no.fr.toLowerCase();
                self.metadata.columnList.funding.enumList.fr[2].name = misc.requested.fr.toLowerCase();

                self.metadata.columnList.funding.enumList.en.unshift( { value: '', name: misc.choose.en } );
                self.metadata.columnList.funding.enumList.fr.unshift( { value: '', name: misc.choose.fr } );

                // translate waiver enum
                self.metadata.columnList.waiver.enumList.unshift( { value: '', name: misc.none.en } );
                self.metadata.columnList.waiver.enumList = {
                  en: self.metadata.columnList.waiver.enumList,
                  fr: angular.copy( self.metadata.columnList.waiver.enumList )
                };
                self.metadata.columnList.waiver.enumList.en[1].name = misc.graduateFeeWaiver.en;
                self.metadata.columnList.waiver.enumList.en[2].name = misc.postdocFeeWaiver.en;
                self.metadata.columnList.waiver.enumList.fr[0].name = misc.none.fr;
                self.metadata.columnList.waiver.enumList.fr[1].name = misc.graduateFeeWaiver.fr;
                self.metadata.columnList.waiver.enumList.fr[2].name = misc.postdocFeeWaiver.fr;
              }
            } ),

            // only do the following for the root instance
            'root' != self.type ? $q.all() : $q.all( [
              CnHttpFactory.instance( {
                path: 'data_option_category',
                data: {
                  select: { column: [ 'id', 'rank', 'name_en', 'name_fr', 'note_en', 'note_fr' ] },
                  modifier: { order: 'rank', limit: 1000000 }
                }
              } ).query().then( function( response ) {
                var letter = 'a';
                self.dataOptionCategoryList = response.data;
                self.dataOptionCategoryList.forEach( function( dataOptionCategory ) {
                  dataOptionCategory.name = { en: dataOptionCategory.name_en, fr: dataOptionCategory.name_fr };
                  delete dataOptionCategory.name_en;
                  delete dataOptionCategory.name_fr;
                  dataOptionCategory.note = { en: dataOptionCategory.note_en, fr: dataOptionCategory.note_fr };
                  delete dataOptionCategory.note_en;
                  delete dataOptionCategory.note_fr;
                  dataOptionCategory.optionList = [];

                  CnReqnHelper.lookupData.reqn.part2[letter].tab = dataOptionCategory.name;
                  letter = String.fromCharCode( letter.charCodeAt(0) + 1 );
                } );

                return CnHttpFactory.instance( {
                  path: 'data_option',
                  data: {
                    select: { column: [ 'id', 'data_option_category_id', 'name_en', 'name_fr', 'note_en', 'note_fr', 'bl', 'f1' ] },
                    modifier: { order: [ 'data_option_category_id', 'data_option.rank' ], limit: 1000000 }
                  }
                } ).query().then( function( response ) {
                  var category = null;
                  response.data.forEach( function( option ) {
                    if( null == category || option.data_option_category_id != category.id )
                      category = self.dataOptionCategoryList.findByProperty( 'id', option.data_option_category_id );

                    option.name = { en: option.name_en, fr: option.name_fr };
                    delete option.name_en;
                    delete option.name_fr;
                    option.note = { en: option.note_en, fr: option.note_fr };
                    delete option.note_en;
                    delete option.note_fr;
                    option.detailCategoryList = [];
                    category.optionList.push( option );
                  } );

                  return CnHttpFactory.instance( {
                    path: 'data_option_detail',
                    data: {
                      select: { column: [ 'id', 'data_option_id', 'name_en', 'name_fr', 'note_en', 'note_fr', 'study_phase_id', {
                        table: 'study_phase',
                        column: 'name',
                        alias: 'study_phase'
                      }, {
                        table: 'data_option',
                        column: 'data_option_category_id'
                      } ] },
                      modifier: { order: [ 'data_option_id', 'study_phase_id', 'data_option_detail.rank' ], limit: 1000000 }
                    }
                  } ).query().then( function( response ) {
                    var category = null;
                    var option = null;
                    response.data.forEach( function( detail ) {
                      var detailList = {};
                      if( null == category || detail.data_option_category_id != category.id )
                        category = self.dataOptionCategoryList.findByProperty( 'id', detail.data_option_category_id );
                      if( null == option || detail.data_option_id != option.id )
                        option = category.optionList.findByProperty( 'id', detail.data_option_id );

                      detail.name = { en: detail.name_en, fr: detail.name_fr };
                      delete detail.name_en;
                      delete detail.name_fr;
                      detail.note = { en: detail.note_en, fr: detail.note_fr };
                      delete detail.note_en;
                      delete detail.note_fr;
                      var studyPhaseId = detail.study_phase_id;
                      var studyPhase = detail.study_phase;
                      delete detail.study_phase;
                      delete detail.study_phase_id;

                      var studyPhaseFr = misc.baseline.fr;
                      var match = studyPhase.match( /Follow-up ([0-9]+)/ );
                      if( null != match ) {
                        var lookup = 'followup' + match[1];
                        studyPhaseFr = misc[lookup].fr;
                      }

                      var detailCategory = option.detailCategoryList.findByProperty( 'study_phase_id', studyPhaseId );
                      if( detailCategory ) detailCategory.detailList.push( detail );
                      else option.detailCategoryList.push( {
                        study_phase_id: studyPhaseId,
                        name: { en: studyPhase, fr: studyPhaseFr },
                        detailList: [ detail ]
                      } );
                    } );
                  } );
                } );
              } )

            ] )

          ] );
        };

      };

      return {
        root: new object( 'root' ),
        lite: new object( 'lite' ),
        instance: function() { return new object(); }
      };
    }
  ] );

} );
