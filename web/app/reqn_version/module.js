define( [ 'coapplicant', 'ethics_approval', 'reference' ].reduce( function( list, name ) {
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
    reqn_type: { column: 'reqn_type.name', type: 'string' },
    amendment_version: { type: 'string' },
    amendment: { type: 'string' },
    is_current_version: { type: 'boolean' },
    applicant_name: { type: 'string' },
    applicant_position: { type: 'string' },
    applicant_affiliation: { type: 'string' },
    applicant_address: { type: 'string' },
    applicant_phone: { type: 'string' },
    applicant_email: { type: 'string' },
    trainee_name: { type: 'string' },
    trainee_program: { type: 'string' },
    trainee_institution: { type: 'string' },
    trainee_address: { type: 'string' },
    trainee_phone: { type: 'string' },
    trainee_email: { type: 'string' },
    start_date: { type: 'date' },
    duration: { type: 'enum' },
    title: { type: 'string' },
    keywords: { type: 'string' },
    lay_summary: { type: 'text' },
    background: { type: 'text' },
    objectives: { type: 'text' },
    methodology: { type: 'text' },
    analysis: { type: 'text' },
    peer_review: { type: 'boolean' },
    funding: { type: 'enum' },
    funding_agency: { type: 'string' },
    grant_number: { type: 'string' },
    ethics: { type: 'enum' },
    ethics_date: { type: 'date' },
    waiver: { type: 'enum' },
    comprehensive: { type: 'boolean' },
    tracking: { type: 'boolean' },
    longitudinal: { type: 'boolean' },
    last_identifier: { type: 'string' },
    agreement_start_date: { type: 'date' },
    agreement_end_date: { type: 'date' },
    amendment_justification: { type: 'text' },

    current_final_report_id: { column: 'final_report.id', type: 'string' },
    trainee_user_id: { column: 'reqn.trainee_user_id', type: 'string' },
    identifier: { column: 'reqn.identifier', type: 'string' },
    legacy: { column: 'reqn.legacy', type: 'string' },
    state: { column: 'reqn.state', type: 'string' },
    data_directory: { column: 'reqn.data_directory', type: 'string' },
    status: { column: 'stage_type.status', type: 'string' },
    has_unread_notice: { type: 'boolean' },
    has_ethics_approval_list: { type: 'boolean' },
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
    deferral_note_2e: { column: 'reqn.deferral_note_2e', type: 'text' },
    deferral_note_2f: { column: 'reqn.deferral_note_2f', type: 'text' },
    deferral_note_2g: { column: 'reqn.deferral_note_2g', type: 'text' },

    coapplicant_agreement_filename: { type: 'string' },
    peer_review_filename: { type: 'string' },
    funding_filename: { type: 'string' },
    ethics_filename: { type: 'string' },
    new_user_id: {
      type: 'lookup-typeahead',
      typeahead: {
        table: 'user',
        select: 'CONCAT( user.first_name, " ", user.last_name )',
        where: [ 'user.first_name', 'user.last_name', 'user.name' ]
      }
    }
  } );

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
    'CnReqnVersionModelFactory', 'cnRecordViewDirective', 'CnEthicsApprovalModalAddFactory',
    'CnHttpFactory', 'CnSession',
    function( CnReqnVersionModelFactory, cnRecordViewDirective, CnEthicsApprovalModalAddFactory,
              CnHttpFactory, CnSession ) {
      // used to piggy-back on the basic view controller's functionality
      var cnRecordView = cnRecordViewDirective[0];

      return {
        templateUrl: module.getFileUrl( 'view.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        link: async function( scope, element, attrs ) {
          cnRecordView.link( scope, element, attrs );

          angular.extend( scope, {
            isAddingCoapplicant: false,
            isDeletingCoapplicant: [],
            isAddingReference: false,
            isDeletingReference: [],
            isDeletingEthicsApproval: [],
            reportRequiredWarningShown: false,
            isDescriptionConstant: function() { return '.' != scope.model.viewModel.record.amendment; }
          } );

          scope.liteModel.viewModel.onView();

          scope.$on( 'file removed', function( event, key ) {
            scope.liteModel.viewModel.record.funding_filename = null;
            scope.liteModel.viewModel.fileList.findByProperty( 'key', key ).size = '';
          } );

          scope.model.viewModel.afterView( async function() {
            var record = scope.model.viewModel.record;

            // display final report message if appropriate
            var stage_type = record.stage_type ? record.stage_type : '';
            if( scope.model.isRole( 'applicant' ) &&
                'Report Required' == stage_type &&
                'deferred' == scope.model.viewModel.record.state &&
                !scope.reportRequiredWarningShown ) {
              scope.reportRequiredWarningShown = true;
              await scope.model.viewModel.displayReportRequiredWarning();
            }

            // display notices to the applicant if they've never seen it
            if( scope.model.isRole( 'applicant' ) && record.has_unread_notice ) await scope.model.viewModel.displayNotices();
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

          // fill in the start date delay
          await CnSession.promise;
          scope.startDateDelay = CnSession.application.startDateDelay;
          scope.maxReferencesPerReqn = CnSession.application.maxReferencesPerReqn;
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
            var status = $scope.model.viewModel.record[$scope.model.isRole( 'applicant' ) ? 'status' : 'stage_type'];
            if( 'deferred' == $scope.model.viewModel.record.state ) {
              status = $scope.model.isRole( 'applicant' ) ? 'Action Required' : 'Deferred to Applicant';
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

          $scope.addCoapplicant = async function() {
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
                try {
                  $scope.isAddingCoapplicant = true;
                  await coapplicantAddModel.onAdd( $scope.coapplicantRecord );

                  // reset the form
                  form.$setPristine();
                  await coapplicantAddModel.onNew( $scope.coapplicantRecord );
                  await $scope.model.viewModel.getCoapplicantList();
                  await $scope.model.viewModel.determineCoapplicantDiffs();
                } finally {
                  $scope.isAddingCoapplicant = false;
                }
              }
            }
          };

          $scope.removeCoapplicant = async function( id ) {
            if( $scope.model.viewModel.coapplicantModel.getDeleteEnabled() ) {
              if( !$scope.isDeletingCoapplicant.includes( id ) ) $scope.isDeletingCoapplicant.push( id );
              var index = $scope.isDeletingCoapplicant.indexOf( id );
              await $scope.model.viewModel.removeCoapplicant( id );
              if( 0 <= index ) $scope.isDeletingCoapplicant.splice( index, 1 );
            }
          };

          // reference resources
          var referenceAddModel = $scope.model.viewModel.referenceModel.addModel;
          $scope.referenceRecord = {};
          referenceAddModel.onNew( $scope.referenceRecord );

          $scope.addReference = async function() {
            if( $scope.model.viewModel.referenceModel.getAddEnabled() ) {
              var form = cenozo.getScopeByQuerySelector( '#part1dForm' ).part1dForm;
              if( !form.$valid ) {
                // dirty all inputs so we can find the problem
                cenozo.forEachFormElement( 'part1dForm', function( element ) { element.$dirty = true; } );
              } else {
                try {
                  $scope.isAddingReference = true;
                  await referenceAddModel.onAdd( $scope.referenceRecord );

                  // reset the form
                  form.$setPristine();
                  await referenceAddModel.onNew( $scope.referenceRecord );
                  await $scope.model.viewModel.getReferenceList();
                  await $scope.model.viewModel.determineReferenceDiffs();
                } finally {
                  $scope.isAddingReference = false;
                }
              }
            }
          };

          $scope.removeReference = async function( id ) {
            if( $scope.model.viewModel.referenceModel.getDeleteEnabled() ) {
              if( !$scope.isDeletingReference.includes( id ) ) $scope.isDeletingReference.push( id );
              var index = $scope.isDeletingReference.indexOf( id );
              await $scope.model.viewModel.removeReference( id );
              if( 0 <= index ) $scope.isDeletingReference.splice( index, 1 );
            }
          };

          $scope.setReferenceRank = function( id, rank ) {
            $scope.model.viewModel.setReferenceRank( id, rank );
          };

          $scope.addEthicsApproval = async function() {
            var response = await CnEthicsApprovalModalAddFactory.instance( {
              language: $scope.model.viewModel.record.lang
            } ).show();

            if( response ) {
              var file = response.file;
              var date = response.date;
              var response = await CnHttpFactory.instance( {
                path: 'ethics_approval',
                data: {
                  reqn_id: $scope.model.viewModel.record.reqn_id,
                  filename: file.getFilename(),
                  date: date
                }
              } ).post();

              await file.upload( [ 'reqn', $scope.model.viewModel.record.reqn_id, 'ethics_approval', response.data ].join( '/' ) );
              await $scope.model.viewModel.getEthicsApprovalList();
            }
          };

          $scope.isRemoveEthicsApprovalAllowed = function( id ) {
            if( $scope.model.viewModel.ethicsApprovalModel.getDeleteEnabled() ) {
              if( $scope.model.isRole( 'administrator' ) ) return true;
              else if( $scope.model.isRole( 'applicant' ) ) {
                var ethicsApproval = $scope.model.viewModel.record.ethicsApprovalList.findByProperty( 'id', id );
                return null != ethicsApproval && ethicsApproval.one_day_old;
              }
            }
            return false;
          };

          $scope.removeEthicsApproval = async function( id ) {
            if( $scope.model.viewModel.ethicsApprovalModel.getDeleteEnabled() ) {
              if( !$scope.isDeletingEthicsApproval.includes( id ) ) $scope.isDeletingEthicsApproval.push( id );
              var index = $scope.isDeletingEthicsApproval.indexOf( id );
              await $scope.model.viewModel.removeEthicsApproval( id );
              if( 0 <= index ) $scope.isDeletingEthicsApproval.splice( index, 1 );
            }
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
    'CnReqnHelper', 'CnModalNoticeListFactory', 'CnModalUploadAgreementFactory',
    'CnCoapplicantModelFactory', 'CnReferenceModelFactory', 'CnEthicsApprovalModelFactory', 'CnBaseViewFactory',
    'CnSession', 'CnHttpFactory', 'CnModalMessageFactory', 'CnModalConfirmFactory', 'CnModalSubmitLegacyFactory',
    '$state', '$window', '$rootScope',
    function( CnReqnHelper, CnModalNoticeListFactory, CnModalUploadAgreementFactory,
              CnCoapplicantModelFactory, CnReferenceModelFactory, CnEthicsApprovalModelFactory, CnBaseViewFactory,
              CnSession, CnHttpFactory, CnModalMessageFactory, CnModalConfirmFactory, CnModalSubmitLegacyFactory,
              $state, $window, $rootScope ) {
      var object = function( parentModel, root ) {
        CnBaseViewFactory.construct( this, parentModel, root );

        angular.extend( this, {
          compareRecord: null,
          versionList: [],
          lastAgreementVersion: null,
          coapplicantAgreementList: [],
          agreementDifferenceList: null,
          lastAmendmentVersion: null, // used to determine the addingCoapplicantWithData variable
          addingCoapplicantWithData: false, // used when an amendment is adding a new coap
          show: function( subject ) {
            var stage_type = this.record.stage_type ? this.record.stage_type : '';
            return CnReqnHelper.showAction( subject, this.record ) && (
              // the submit button should be hidden once a report is required
              'submit' != subject || 'Report Required' != stage_type
            );
          },
          showAgreement: function() {
            // only show the agreement tab to administrators
            return this.parentModel.isRole( 'administrator' ) && (
              // and when there is an agreement
              this.record.has_agreement_filename || (
                // or when we're looking at the current version and we're in the active phase or Complete stage
                this.record.is_current_version && (
                  'active' == this.record.phase || 'Complete' == this.record.stage_type
                )
              )
            );
          },
          abandon: async function() {
            var response = await CnReqnHelper.abandon(
              'identifier=' + this.record.identifier,
              '.' != this.record.amendment,
              this.record.lang
            )
            if( response ) await $state.go( this.parentModel.isRole( 'applicant' ) ? 'root.home' : 'reqn.list' );
          },
          delete: async function() { await CnReqnHelper.delete( 'identifier=' + this.record.identifier, this.record.lang ); },
          translate: function( value ) {
            return this.record.lang ? CnReqnHelper.translate( 'reqn', value, this.record.lang ) : '';
          },
          viewReport: async function() {
            await $state.go( 'final_report.view', { identifier: this.record.current_final_report_id } );
          },
          downloadApplication: async function() { await CnReqnHelper.download( 'application', this.record.getIdentifier() ); },
          downloadChecklist: async function() { await CnReqnHelper.download( 'checklist', this.record.getIdentifier() ); },
          downloadApplicationAndChecklist: async function() {
            await CnReqnHelper.download( 'application_and_checklist', this.record.getIdentifier() );
          },
          downloadDataSharing: async function() {
            await CnReqnHelper.download( 'data_sharing_filename', this.record.getIdentifier() );
          },
          downloadCoapplicantAgreement: async function( reqnVersionId) {
            await CnReqnHelper.download( 'coapplicant_agreement_filename', reqnVersionId );
          },
          downloadCoapplicantAgreementTemplate: async function() {
            await CnReqnHelper.download( 'coapplicant_agreement_template', this.record.getIdentifier() );
          },

          onView: async function( force ) {
            // reset tab values
            this.setFormTab( 0, this.parentModel.getQueryParameter( 't0' ), false );
            this.setFormTab( 1, this.parentModel.getQueryParameter( 't1' ), false );
            this.setFormTab( 2, this.parentModel.getQueryParameter( 't2' ), false );

            // reset compare version and differences
            this.compareRecord = null;
            this.coapplicantAgreementList = [];
            this.agreementDifferenceList = null;

            await this.$$onView( force );

            // define the earliest date that the reqn may start (based on the deadline, or today if there is no deadline)
            // note that consortium reqns have no restriction on their start date
            if( !this.record.legacy && 'Consortium' != this.record.reqn_type ) {
              this.minStartDate = this.record.deadline
                                ? moment( this.record.deadline ).add( CnSession.application.startDateDelay, 'months' )
                                : moment();
            }

            if( 'lite' != this.parentModel.type ) {
              cenozoApp.setLang( this.record.lang );

              var promiseList = [
                this.getAmendmentTypeList(),
                this.getCoapplicantList(),
                this.getReferenceList(),
                this.getDataOptionValueList()
              ];
              if( this.record.has_ethics_approval_list ) promiseList.push( this.getEthicsApprovalList() );

              await Promise.all( promiseList );
              await this.getVersionList();
            }
          },

          onPatch: async function( data ) {
            if( !this.parentModel.getEditEnabled() ) throw new Error( 'Calling onPatch() but edit is not enabled.' );

            var property = Object.keys( data )[0];

            if( null != property.match( /^justification_/ ) ) {
              // justifications have their own service
              var match = property.match( /^justification_([0-9]+)$/ );
              var dataOptionId = match[1];

              await CnHttpFactory.instance( {
                path: [
                  'reqn_version',
                  this.record.id,
                  'reqn_version_justification',
                  'data_option_id=' + dataOptionId
                ].join( '/' ),
                data: { description: data[property] }
              } ).patch();

              this.record['justification_' + dataOptionId] = data[property];
            } else if( null != property.match( /^comment_/ ) ) {
              // comments have their own service
              var match = property.match( /^comment_([0-9]+)$/ );
              var dataOptionCategoryId = match[1];

              await CnHttpFactory.instance( {
                path: [
                  'reqn_version',
                  this.record.id,
                  'reqn_version_comment',
                  'data_option_category_id=' + dataOptionCategoryId
                ].join( '/' ),
                data: { description: data[property] }
              } ).patch();

              this.record['comment_' + dataOptionCategoryId] = data[property];
            } else if( null != property.match( /^deferral_note/ ) ) {
              // make sure to send patches to deferral notes to the parent reqn
              var parent = this.parentModel.getParentIdentifier();
              var httpObj = {
                path: parent.subject + '/' + parent.identifier,
                data: data
              };
              var self = this;
              httpObj.onError = function( error ) { self.onPatchError( error ); };
              try {
                await CnHttpFactory.instance( httpObj ).patch();
                this.afterPatchFunctions.forEach( function( fn ) { fn(); } );
              } catch( error ) {
                // handled by onError above
              }
            } else {
              var proceed = true;
              if( 'new_user_id' == property ) {
                proceed = false;
                // make sure the new user isn't a trainee
                var self = this;
                var response = await CnHttpFactory.instance( {
                  path: 'applicant/user_id=' + data[property],
                  data: { select: { column: 'supervisor_user_id' } },
                  onError: async function( error ) {
                    if( 404 == error.status ) {
                      await CnModalMessageFactory.instance( {
                        title: self.translate( 'misc.invalidNewApplicantTitle' ),
                        message: self.translate( 'misc.invalidNewApplicantMessage' ),
                        closeText: self.translate( 'misc.close' ),
                        error: true
                      } ).show();

                      // failed to set the new user so put it back
                      self.formattedRecord.new_user_id = self.backupRecord.formatted_new_user_id;
                    } else {
                      CnModalMessageFactory.httpError( error );
                    }
                  }
                } ).get();

                if( angular.isObject( response.data ) && null != response.data.supervisor_user_id ) {
                  await CnModalMessageFactory.instance( {
                    title: this.translate( 'amendment.newUserIsTraineeNoticeTitle' ),
                    message: this.translate( 'amendment.newUserIsTraineeNotice' ),
                    closeText: this.translate( 'misc.close' ),
                    error: true
                  } ).show();

                  // failed to set the new user so put it back
                  this.formattedRecord.new_user_id = this.backupRecord.formatted_new_user_id;
                  proceed = true;
                }
              }

              // only proceed if the above check isn't true (prevent trainees to be the new primary applicant)
              if( proceed ) {
                await this.$$onPatch( data );

                if( angular.isDefined( data.comprehensive ) || angular.isDefined( data.tracking ) ) {
                  if( this.record.comprehensive && this.record.tracking ) {
                    // show the cohort warning to the applicant
                    CnModalMessageFactory.instance( {
                      title: this.translate( 'part2.cohort.bothCohortNoticeTitle' ),
                      message: this.translate( 'part2.cohort.bothCohortNotice' ),
                      closeText: this.translate( 'misc.close' ),
                    } ).show();
                  }
                } else if( angular.isDefined( data.peer_review ) ) {
                  // use the root scope to get the view directive to remove the lite model's file
                  $rootScope.$broadcast( 'file removed', 'peer_review_filename' );
                } else if( angular.isDefined( data.funding ) ) {
                  if( 'yes' != data.funding ) {
                    if( 'requested' != data.funding ) {
                      this.record.funding_agency = null;
                      this.record.grant_number = null;
                    }
                    // use the root scope to get the view directive to remove the lite model's file
                    $rootScope.$broadcast( 'file removed', 'funding_filename' );
                  }
                }
              }
            }
          },

          onPatchError: function( response ) {
            if( 306 == response.status && null != response.data.match( /^"You cannot change the primary applicant/ ) ) {
              // failed to set the new user so put it back
              this.formattedRecord.new_user_id = this.backupRecord.formatted_new_user_id;
            }

            return this.$$onPatchError( response );
          },

          coapplicantModel: CnCoapplicantModelFactory.instance(),
          referenceModel: CnReferenceModelFactory.instance(),
          ethicsApprovalModel: CnEthicsApprovalModelFactory.instance(),
          // only allow editing the description elements when not in an amendment
          charCount: { lay_summary: 0, background: 0, objectives: 0, methodology: 0, analysis: 0 },
          minStartDate: null,
          noAmendmentTypes: false,

          amendmentTypeWithJustificationSelected: function() {
            var self = this;
            return angular.isDefined( this.parentModel.amendmentTypeList ) ?
              this.parentModel.amendmentTypeList.en.some( function( amendmentType ) {
                return null != amendmentType.justificationPrompt && self.record['amendmentType' + amendmentType.id];
              } ) :
              false;
          },

          // setup language and tab state parameters
          toggleLanguage: async function() {
            var parent = this.parentModel.getParentIdentifier();
            this.record.lang = 'en' == this.record.lang ? 'fr' : 'en';
            cenozoApp.setLang( this.record.lang );
            await CnHttpFactory.instance( {
              path: parent.subject + '/' + parent.identifier,
              data: { language: this.record.lang }
            } ).patch();
          },

          // the sequencial list of all tabs where every item has an array of the three indexed tab values
          formTab: [],
          tabSectionList: [
            [ 'instructions', null, null ],
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
            [ 'part2', null, 'f' ],
            [ 'part2', null, 'g' ],
            [ 'part3', null, null ],
            [ 'agreement', null, null ]
          ],

          setFormTab: function( index, tab, transition ) {
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

            this.formTab[index] = tab;
            this.parentModel.setQueryParameter( 't'+index, tab );

            if( transition ) this.parentModel.reloadState( false, false, 'replace' );

            // update all textarea sizes
            angular.element( 'textarea[cn-elastic]' ).trigger( 'elastic' );
          },

          nextSection: function( reverse ) {
            if( angular.isUndefined( reverse ) ) reverse = false;

            var currentTabSectionIndex = null;
            var self = this;
            this.tabSectionList.some( function( tabSection, index ) {
              if( self.formTab[0] == tabSection[0] ) {
                if( ( null == tabSection[1] || self.formTab[1] == tabSection[1] ) &&
                    ( null == tabSection[2] || self.formTab[2] == tabSection[2] ) ) {
                  currentTabSectionIndex = index;
                  return true;
                }
              }
            } );

            if( null != currentTabSectionIndex ) {
              var tabSection = this.tabSectionList[currentTabSectionIndex + (reverse?-1:1)];

              // always skip the agreement section
              if( 'agreement' == tabSection[0] )
                tabSection = this.tabSectionList[currentTabSectionIndex + (reverse?-2:2)];

              if( angular.isDefined( tabSection ) ) {
                if( null != tabSection[2] ) this.setFormTab( 2, tabSection[2], false );
                if( null != tabSection[1] ) this.setFormTab( 1, tabSection[1], false );
                this.setFormTab( 0, tabSection[0] );
              }
            }
          },

          getDifferences: function( reqnVersion2 ) {
            var reqnVersion1 = this.record;
            var differences = {
              diff: false,
              amendment: {
                diff: false,
                a: { // the only unnamed amendment category
                  diff: false,
                  new_user_id: false,
                  amendment_justification: false
                }
              },
              part1: {
                diff: false,
                a: { // applicant
                  diff: false,
                  applicant_position: false,
                  applicant_affiliation: false,
                  applicant_address: false,
                  applicant_phone: false,
                  trainee_program: false,
                  trainee_institution: false,
                  trainee_address: false,
                  trainee_phone: false,
                  waiver: false
                },
                b: { // project team
                  diff: false,
                  coapplicantList: [],
                  coapplicant_agreement_filename: false
                },
                c: { // timeline
                  diff: false,
                  start_date: false,
                  duration: false
                },
                d: { // description
                  diff: false,
                  title: false,
                  keywords: false,
                  lay_summary: false,
                  background: false,
                  objectives: false,
                  methodology: false,
                  analysis: false,
                  referenceList: []
                },
                e: { // scientific review
                  diff: false,
                  peer_review: false,
                  peer_review_filename: false,
                  funding: false,
                  funding_filename: false,
                  funding_agency: false,
                  grant_number: false
                },
                f: { // ethics
                  diff: false,
                  ethics: false,
                  ethics_date: false,
                  ethics_filename: false
                }
              },
              part2: {
                diff: false,
                cohort: {
                  diff: false,
                  comprehensive: false,
                  tracking: false
                },
                a: { // questionnaires
                  diff: false,
                  baselineDataOptionList: [],
                  followUp1DataOptionList: [],
                  dataOptionJustificationList: [],
                  comment: false
                },
                b: { // physical assessments
                  diff: false,
                  baselineDataOptionList: [],
                  followUp1DataOptionList: [],
                  dataOptionJustificationList: [],
                  comment: false
                },
                c: { // biomarkers
                  diff: false,
                  baselineDataOptionList: [],
                  followUp1DataOptionList: [],
                  dataOptionJustificationList: [],
                  comment: false
                },
                d: { // linked data
                  diff: false,
                  data_sharing_filename: false,
                  baselineDataOptionList: [],
                  followUp1DataOptionList: [],
                  dataOptionJustificationList: [],
                  comment: false
                },
                e: { // additional data
                  diff: false,
                  baselineDataOptionList: [],
                  followUp1DataOptionList: [],
                  dataOptionJustificationList: [],
                  comment: false
                },
                f: { // geographic indicators
                  diff: false,
                  baselineDataOptionList: [],
                  followUp1DataOptionList: [],
                  dataOptionJustificationList: [],
                  comment: false
                },
                g: { // covid-19
                  diff: false,
                  baselineDataOptionList: [],
                  followUp1DataOptionList: [],
                  dataOptionJustificationList: [],
                  comment: false
                }
              }
            };

            // add all amendment types
            this.parentModel.amendmentTypeList.en.forEach( function( amendmentType ) {
              differences.amendment.a['amendmentType'+amendmentType.id] = false;
            } );

            if( null != reqnVersion2 ) {
              for( var part in differences ) {
                if( !differences.hasOwnProperty( part ) ) continue;
                if( 'diff' == part ) continue; // used to track overall diff

                for( var section in differences[part] ) {
                  if( !differences[part].hasOwnProperty( section ) ) continue;
                  if( 'diff' == section ) continue; // used to track overall diff

                  for( var property in differences[part][section] ) {
                    if( !differences[part][section].hasOwnProperty( property ) ) continue;
                    if( angular.isArray( differences[part][section][property] ) ) {
                      // an array means we have a list go check through
                      if( 'coapplicantList' == property ) {
                        // loop through reqnVersion1's coapplicants to see if any were added or changed
                        reqnVersion1.coapplicantList.forEach( function( c1 ) {
                          var c2 = reqnVersion2.coapplicantList.findByProperty( 'name', c1.name );
                          if( null == c2 ) {
                            // reqnVersion1 has coapplicant that compared reqnVersion2 doesn't
                            differences.diff = true;
                            differences[part].diff = true;
                            differences[part][section].diff = true;
                            differences[part][section][property].push( { name: c1.name, diff: 'added' } );
                          } else {
                            if( ['position', 'affiliation', 'email', 'role', 'access'].some( function( p ) {
                              return c1[p] != c2[p];
                            } ) ) {
                              // reqnVersion1 has coapplicant which is different than compared reqnVersion2
                              differences.diff = true;
                              differences[part].diff = true;
                              differences[part][section].diff = true;
                              differences[part][section][property].push( { name: c1.name, diff: 'changed' } );
                            }
                          }
                        } );

                        // loop through compared reqnVersion2's coapplicants to see if any were removed
                        reqnVersion2.coapplicantList.forEach( function( c2 ) {
                          var c1 = reqnVersion1.coapplicantList.findByProperty( 'name', c2.name );
                          if( null == c2 ) {
                            // reqnVersion1 has coapplicant that compared reqnVersion2 doesn't
                            differences.diff = true;
                            differences[part].diff = true;
                            differences[part][section].diff = true;
                            differences[part][section][property].push( { name: c2.name, diff: 'removed' } );
                          }
                        } );
                      } else if( 'referenceList' == property ) {
                        // loop through reqnVersion1's references to see if any were added or changed
                        reqnVersion1.referenceList.forEach( function( r1 ) {
                          var r2 = reqnVersion2.referenceList.findByProperty( 'reference', r1.reference );
                          if( null == r2 ) {
                            // reqnVersion1 has reference that compared reqnVersion2 doesn't
                            differences.diff = true;
                            differences[part].diff = true;
                            differences[part][section].diff = true;
                            differences[part][section][property].push( { name: r1.reference, diff: 'added' } );
                          }
                        } );

                        // loop through compared reqnVersion2's references to see if any were removed
                        reqnVersion2.referenceList.forEach( function( r2 ) {
                          var r1 = reqnVersion1.referenceList.findByProperty( 'reference', r2.reference );
                          if( null == r1 ) {
                            // reqnVersion1 has reference that compared reqnVersion2 doesn't
                            differences.diff = true;
                            differences[part].diff = true;
                            differences[part][section].diff = true;
                            differences[part][section][property].push( { name: r2.reference, diff: 'removed' } );
                          }
                        } );
                      } else if( 'baselineDataOptionList' == property ) {
                        this.parentModel.dataOptionCategoryList.forEach( function( dataOptionCategory ) {
                          // section a checks rank 1, section b checks rank 2, etc
                          if( dataOptionCategory.rank == section.charCodeAt() - 'a'.charCodeAt() + 1 ) {
                            dataOptionCategory.optionList.forEach( function( dataOption ) {
                              if( dataOption.bl ) {
                                if( reqnVersion1.dataOptionValueList.bl[dataOption.id] !=
                                    reqnVersion2.dataOptionValueList.bl[dataOption.id] ) {
                                  differences.diff = true;
                                  differences[part].diff = true;
                                  differences[part][section].diff = true;
                                  differences[part][section][property].push( {
                                    id: dataOption.id,
                                    name: dataOption.name.en,
                                    diff: reqnVersion1.dataOptionValueList.bl[dataOption.id] ? 'added' : 'removed'
                                  } );
                                }
                              }
                            } );
                          }
                        } );
                      } else if( 'followUp1DataOptionList' == property ) {
                        this.parentModel.dataOptionCategoryList.forEach( function( dataOptionCategory ) {
                          // section a checks rank 1, section b checks rank 2, etc
                          if( dataOptionCategory.rank == section.charCodeAt() - 'a'.charCodeAt() + 1 ) {
                            dataOptionCategory.optionList.forEach( function( dataOption ) {
                              if( dataOption.f1 ) {
                                if( reqnVersion1.dataOptionValueList.f1[dataOption.id] !=
                                    reqnVersion2.dataOptionValueList.f1[dataOption.id] ) {
                                  differences.diff = true;
                                  differences[part].diff = true;
                                  differences[part][section].diff = true;
                                  differences[part][section][property].push( {
                                    id: dataOption.id,
                                    name: dataOption.name.en,
                                    diff: reqnVersion1.dataOptionValueList.f1[dataOption.id] ? 'added' : 'removed'
                                  } );
                                }
                              }
                            } );
                          }
                        } );
                      } else if( 'dataOptionJustificationList' == property ) {
                        for( var prop in reqnVersion1 ) {
                          if( null != prop.match( /^justification_/ ) ) {
                            if( reqnVersion1[prop] != reqnVersion2[prop] ) {
                              var match = prop.match( /^justification_([0-9]+)$/ );
                              var dataOption = this.parentModel.getCategoryAndDataOption( match[1] ).dataOption;
                              differences.diff = true;
                              differences[part].diff = true;
                              differences[part][section].diff = true;
                              differences[part][section][property].push( {
                                id: dataOption.id,
                                name: dataOption.name.en,
                                diff: reqnVersion1.dataOptionValueList.f1[dataOption.id] ? 'added' : 'removed'
                              } );
                            }
                          }
                        }
                      }
                    } else if( null != property.match( /_filename$/ ) ) {
                      // if both file names are empty or null then assume there is no difference
                      var recordName = angular.isUndefined( reqnVersion1[property] ) ? null : reqnVersion1[property];
                      var compareName = angular.isUndefined( reqnVersion2[property] ) ? null : reqnVersion2[property];

                      if( !( recordName == null && compareName == null ) ) {
                        // file size are compared instead of filename
                        var fileDetails = this.parentModel.viewModel.fileList.findByProperty( 'key', property );
                        var sizeProperty = property.replace( '_filename', '_size' );
                        var recordSize = angular.isObject( fileDetails ) && fileDetails.size ? fileDetails.size : null;
                        var compareSize = reqnVersion2[sizeProperty] ? reqnVersion2[sizeProperty] : null;
                        if( ( null != recordSize || null != compareSize ) && recordSize != compareSize ) {
                          differences.diff = true;
                          differences[part].diff = true;
                          differences[part][section].diff = true;
                          differences[part][section][property] = true;
                        }
                      }
                    } else if( 'comment' == property ) {
                      // only check comments if they are activated for this category
                      if( 'comment' == property ) {
                        var dataOptionCategory = this.parentModel.dataOptionCategoryList.findByProperty( 'charCode', section );
                        if( dataOptionCategory.comment ) {
                          // a comment's property in the record is followed by the data_category_id
                          var commentProperty = 'comment_' + dataOptionCategory.id;
                          var value1 = '' === reqnVersion1[commentProperty] ? null : reqnVersion1[commentProperty];
                          var value2 = '' === reqnVersion2[commentProperty] ? null : reqnVersion2[commentProperty];
                          if( value1 != value2 ) {
                            differences.diff = true;
                            differences[part].diff = true;
                            differences[part][section].diff = true;
                            differences[part][section][property] = true;
                          }
                        }
                      }
                    } else {
                      // not an array means we have a property to directly check
                      // note: we need to convert empty strings to null to make sure they compare correctly
                      var value1 = '' === reqnVersion1[property] ? null : reqnVersion1[property];
                      var value2 = '' === reqnVersion2[property] ? null : reqnVersion2[property];
                      if( value1 != value2 ) {
                        differences.diff = true;
                        differences[part].diff = true;
                        differences[part][section].diff = true;
                        differences[part][section][property] = true;
                      }
                    }
                  }
                }
              }
            }

            return differences;
          },

          getVersionList: async function() {
            var self = this;
            var parent = this.parentModel.getParentIdentifier();
            this.versionList = [];
            var response = await CnHttpFactory.instance( {
              path: parent.subject + '/' + parent.identifier + '/reqn_version'
            } ).query();

            // we're going to use .then calls below to maximize overall asynchronous processing time
            var promiseList = [];
            response.data.forEach( function( version ) {
              promiseList = promiseList.concat( [
                self.getAmendmentTypeList( version.id, version ),

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
                  path: 'reqn_version/' + version.id + '?file=coapplicant_agreement_filename'
                } ).get().then( function( response ) {
                  version.coapplicant_agreement_size = response.data;
                } ),

                CnHttpFactory.instance( {
                  path: 'reqn_version/' + version.id + '?file=peer_review_filename'
                } ).get().then( function( response ) {
                  version.peer_review_size = response.data;
                } ),

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

            var compareVersion = this.parentModel.getQueryParameter( 'c' );
            if( angular.isDefined( compareVersion ) )
              this.compareRecord = this.versionList.findByProperty( 'amendment_version', compareVersion );

            if( 1 < this.versionList.length ) {
              // add a null object to the version list so we can turn off comparisons
              this.versionList.unshift( null );
            }

            this.lastAmendmentVersion = null;
            if( '.' != this.record.amendment ) {
              this.versionList.slice().reverse().some( function( version ) {
                // Note that the amendments we're comparing are letters, and since . is considered less than A it works
                // whether we're comparing lettered versions or the initial "." version:
                if( self.record.amendment > version.amendment ) {
                  self.lastAmendmentVersion = version.amendment_version;
                  return true;
                }
              } );
            }

            await Promise.all( promiseList );

            // Calculate all differences for all versions (in reverse order so we can find the last agreement version)
            this.versionList.reverse();

            this.lastAgreementVersion = null;
            this.versionList.forEach( function( version ) {
              if( null != version ) {
                version.differences = self.getDifferences( version );

                // while we're at it determine the list of coapplicant agreements
                if( null != version.coapplicant_agreement_filename )
                  self.coapplicantAgreementList.push( { version: version.amendment_version, id: version.id } );

                // ... and also determine the last agreement version and calculate its differences
                if( null == self.agreementDifferenceList && null != version.agreement_filename )
                  self.agreementDifferenceList = self.getDifferenceList( version );
              }
            } );

            // if no different list was defined then make it an empty list
            if( null == this.agreementDifferenceList ) this.agreementDifferenceList = [];

            // put the order of the version list back to normal
            this.versionList.reverse();
          },

          determineCoapplicantDiffs: function() {
            var self = this;
            this.versionList.forEach( version => self.setCoapplicantDiff( version ) );
          },

          setCoapplicantDiff: function( version ) {
            var self = this;
            if( null != version ) {
              // see if there is a difference between this list and the view's list
              version.coapplicantDiff =
                version.coapplicantList.length != this.record.coapplicantList.length ||
                version.coapplicantList.some(
                  c1 => !self.record.coapplicantList.some(
                    c2 => ![ 'name', 'position', 'affiliation', 'email', 'role', 'access' ].some(
                      prop => c1[prop] != c2[prop]
                    )
                  )
                );

              // When an amendment is made which adds coapplicants with access to data we need to get a signed agreement
              // form from the user.  In order to do this we need a variable that tracks when this is the case:
              if( '.' != this.record.amendment && this.lastAmendmentVersion == version.amendment_version ) {
                this.addingCoapplicantWithData = false;
                if( version.coapplicantDiff ) {
                  // There is a difference between this and the previous amendment version, so now determine if there is now
                  // a coapplicant with access to the data which didn't exist in the previous version
                  this.record.coapplicantList.some( function( coapplicant ) {
                    var found = version.coapplicantList.some( function( oldCoapplicant ) {
                      if( oldCoapplicant.name == coapplicant.name ) {
                        // check if an existing coap has been given access to the data
                        if( !oldCoapplicant.access && coapplicant.access ) self.addingCoapplicantWithData = true;
                        return true;
                      }
                    } );

                    // check if a new coap has been given access to the data
                    if( !found && coapplicant.access ) self.addingCoapplicantWithData = true;

                    return self.addingCoapplicantWithData;
                  } );
                }
              }
            }
          },

          getAmendmentTypeList: async function( reqnVersionId, object ) {
            var basePath = angular.isDefined( reqnVersionId )
                         ? 'reqn_version/' + reqnVersionId
                         : this.parentModel.getServiceResourcePath()

            if( angular.isUndefined( object ) ) object = this.record;

            // start by setting all amendment types to false
            this.parentModel.amendmentTypeList.en.forEach( function( amendmentType ) {
              var property = 'amendmentType' + amendmentType.id;
              object[property] = false;
            } );

            // now change any which the reqn has to true
            var response = await CnHttpFactory.instance( {
              path: basePath + '/amendment_type',
              data: {
                select: { column: [ 'id' ] },
                modifier: { order: 'id', limit: 1000 }
              }
            } ).query();

            response.data.forEach( function( row ) {
              var property = 'amendmentType' + row.id;
              object[property] = true;
            } );
          },

          toggleAmendmentTypeValue: async function( amendmentTypeId ) {
            var self = this;
            var onErrorFn = function( error ) { self.record[property] = !self.record[property]; };
            var path = this.parentModel.getServiceResourcePath() + '/amendment_type';

            var property = 'amendmentType' + amendmentTypeId;
            if( this.record[property] ) {
            var self = this;
              var proceed = true;
              if( amendmentTypeId == this.parentModel.newUserAmendmentTypeId ) {
                proceed = false;

                // show a warning if changing primary applicants
                var response = await CnModalConfirmFactory.instance( {
                  title: this.translate( 'amendment.newUserNoticeTitle'),
                  noText: this.translate( 'misc.no' ),
                  yesText: this.translate( 'misc.yes' ),
                  message: this.translate( 'amendment.newUserNotice' )
                } ).show();
                proceed = response;
              }

              // add the amendment type
              if( proceed ) {
                try {
                  await CnHttpFactory.instance( { path: path, data: amendmentTypeId, onError: onErrorFn } ).post();
                } catch( error ) {
                  // handled by onError above
                }
              } else {
                // we're not making the change so un-select the option
                this.record[property] = !this.record[property];
              }
            } else {
              // delete the amendment type
              try {
                await CnHttpFactory.instance( { path: path + '/' + amendmentTypeId, onError: onErrorFn } ).delete();
              } catch( error ) {
                // handled by onError above
              }
            }
          },

          getCoapplicantList: async function( reqnVersionId, object ) {
            var basePath = angular.isDefined( reqnVersionId )
                         ? 'reqn_version/' + reqnVersionId
                         : this.parentModel.getServiceResourcePath()

            if( angular.isUndefined( object ) ) object = this.record;

            var response = await CnHttpFactory.instance( {
              path: basePath + '/coapplicant',
              data: {
                select: { column: [ 'id', 'name', 'position', 'affiliation', 'email', 'role', 'access' ] },
                modifier: { order: 'id', limit: 1000 }
              }
            } ).query();

            object.coapplicantList = response.data;
          },

          removeCoapplicant: async function( id ) {
            await CnHttpFactory.instance( {
              path: this.parentModel.getServiceResourcePath() + '/coapplicant/' + id
            } ).delete();
            await this.getCoapplicantList();
            this.determineCoapplicantDiffs();
          },

          determineReferenceDiffs: function() {
            var self = this;
            this.versionList.forEach( version => self.setReferenceDiff( version ) );
          },

          setReferenceDiff: function( version ) {
            if( null != version ) {
              // see if there is a difference between this list and the view's list
              var self = this;
              version.referenceDiff =
                version.referenceList.length != this.record.referenceList.length ||
                version.referenceList.some(
                  c1 => !self.record.referenceList.some(
                    c2 => ![ 'rank', 'reference' ].some(
                      prop => c1[prop] != c2[prop]
                    )
                  )
                );
            }
          },

          getReferenceList: async function( reqnVersionId, object ) {
            var basePath = angular.isDefined( reqnVersionId )
                         ? 'reqn_version/' + reqnVersionId
                         : this.parentModel.getServiceResourcePath();
            if( angular.isUndefined( object ) ) object = this.record;

            var response = await CnHttpFactory.instance( {
              path: basePath + '/reference',
              data: {
                select: { column: [ 'id', 'rank', 'reference' ] },
                modifier: { order: 'rank', limit: 1000 }
              }
            } ).query();

            object.referenceList = response.data;
          },

          setReferenceRank: async function( id, rank ) {
            await CnHttpFactory.instance( {
              path: this.parentModel.getServiceResourcePath() + '/reference/' + id,
              data: { rank: rank }
            } ).patch();

            await this.getReferenceList();
            this.determineReferenceDiffs();
          },

          removeReference: async function( id ) {
            await CnHttpFactory.instance( { path: this.parentModel.getServiceResourcePath() + '/reference/' + id } ).delete();

            await this.getReferenceList();
            this.determineReferenceDiffs();
          },

          getEthicsApprovalList: async function() {
            var response = await CnHttpFactory.instance( {
              path: [ 'reqn', this.record.reqn_id, 'ethics_approval' ].join( '/' ),
              data: {
                select: { column: [ 'id', 'filename', 'date', 'one_day_old' ] },
                modifier: { order: { date: true }, limit: 1000 }
              }
            } ).query();

            this.record.ethicsApprovalList = response.data;
          },

          removeEthicsApproval: async function( id ) {
            await CnHttpFactory.instance( { path: 'ethics_approval/' + id } ).delete();
            await this.getEthicsApprovalList();
          },

          downloadEthicsApproval: async function( id ) {
            await CnHttpFactory.instance( {
              path: 'ethics_approval/' + id + '?file=filename',
              format: 'unknown'
            } ).file();
          },

          getDataOptionValueList: async function( reqnVersionId, object ) {
            var basePath = angular.isDefined( reqnVersionId )
                         ? 'reqn_version/' + reqnVersionId
                         : this.parentModel.getServiceResourcePath()

            if( angular.isUndefined( object ) ) object = this.record;

            object.dataOptionValueList = { bl: [], f1: [] };
            var response = await CnHttpFactory.instance( {
              path: 'data_option',
              data: { select: { column: [ { column: 'MAX(data_option.id)', alias: 'maxId', table_prefix: false } ] } }
            } ).get();

            for( var i = 0; i <= response.data[0].maxId; i++ ) {
              object.dataOptionValueList.bl[i] = false;
              object.dataOptionValueList.f1[i] = false;
            }

            // we're going to use .then calls below to maximize overall asynchronous processing time
            var self = this;
            await Promise.all( [
              CnHttpFactory.instance( {
                path: basePath + '/reqn_version_data_option',
                data: { select: { column: [ 'data_option_id', { table: 'study_phase', column: 'code', alias: 'phase' } ] } }
              } ).query().then( function( response ) {
                response.data.forEach( function( dataOption ) {
                  if( angular.isDefined( object.dataOptionValueList[dataOption.phase] ) )
                    object.dataOptionValueList[dataOption.phase][dataOption.data_option_id] = true;
                } );
              } ),

              CnHttpFactory.instance( {
                path: basePath + '/reqn_version_comment',
                data: { select: { column: [ 'data_option_category_id', 'description' ] } }
              } ).query().then( function( response ) {
                response.data.forEach( function( comment ) {
                  var column = 'comment_' + comment.data_option_category_id;
                  object[column] = comment.description;
                  self.backupRecord[column] = object[column];
                } );
              } ),

              CnHttpFactory.instance( {
                path: basePath + '/reqn_version_justification',
                data: { select: { column: [ 'data_option_id', 'description' ] } }
              } ).query().then( function( response ) {
                response.data.forEach( function( justification ) {
                  var column = 'justification_' + justification.data_option_id;
                  object[column] = justification.description;
                  self.backupRecord[column] = object[column];
                } );
              } )
            ] );
          },

          toggleDataOptionValue: async function( studyPhaseCode, dataOptionId ) {
            // get the category and data option objects
            var obj = this.parentModel.getCategoryAndDataOption( dataOptionId );
            var category = obj.category;
            var dataOption = obj.dataOption;

            // when selecting the data-option first check to see if the category or data option have a condition
            var proceed = true;
            if( !this.record.dataOptionValueList[studyPhaseCode][dataOptionId] ) {
              var column = 'condition_' + this.record.lang;

              // create a modal for the category condition, if required
              var categoryModal = null;
              if( null != category[column] ) {
                // see if this is the first option in this category being selected
                var catAlreadySelected = false;
                var categoryOptionIdList = category.optionList.map( o => o.id );

                // see if any of the category's options are already selected
                var alreadySelected = false;
                for( var code in this.record.dataOptionValueList ) {
                  var self = this;
                  if( categoryOptionIdList.some( id => self.record.dataOptionValueList[code][id] ) ) {
                    alreadySelected = true;
                    break;
                  }
                }

                // only show the condition if none of the options is already selected
                if( !alreadySelected ) {
                  categoryModal = CnModalConfirmFactory.instance( {
                    title: this.translate( 'misc.pleaseConfirm' ),
                    noText: this.translate( 'misc.no' ),
                    yesText: this.translate( 'misc.yes' ),
                    message: category[column]
                  } );
                }
              }

              // create a modal for the option condition, if required
              var optionModal = null != dataOption[column]
                              ?  CnModalConfirmFactory.instance( {
                                   title: this.translate( 'misc.pleaseConfirm' ),
                                   noText: this.translate( 'misc.no' ),
                                   yesText: this.translate( 'misc.yes' ),
                                   message: dataOption[column]
                                 } )
                              : null;

              // now show whichever condition modals are required, category first, then option
              if( null != categoryModal || null != optionModal ) {
                proceed = false;
                if( null != categoryModal && null != optionModal ) {
                  if( await categoryModal.show() ) proceed = await optionModal.show();
                } else if( null != categoryModal ) {
                  proceed = await categoryModal.show();
                } else {
                  proceed = await optionModal.show();
                }
              }
            }

            // don't proceed if the confirm factory says no
            if( proceed ) {
              var justificationColumn = 'justification_' + dataOptionId;

              // toggle the option
              this.record.dataOptionValueList[studyPhaseCode][dataOptionId] =
                !this.record.dataOptionValueList[studyPhaseCode][dataOptionId];

              try {
                var self = this;
                if( this.record.dataOptionValueList[studyPhaseCode][dataOptionId] ) {
                  // add the data-option
                  await CnHttpFactory.instance( {
                    path: this.parentModel.getServiceResourcePath() + '/reqn_version_data_option',
                    data: { data_option_id: dataOptionId, study_phase_code: studyPhaseCode },
                    onError: function( error ) {
                      self.record.dataOptionValueList[studyPhaseCode][dataOptionId] =
                        !self.record.dataOptionValueList[studyPhaseCode][dataOptionId];
                    }
                  } ).post();

                  // add the local copy of the justification if it doesn't already exist
                  if( dataOption.justification && angular.isUndefined( this.record[justificationColumn] ) )
                    this.record[justificationColumn] = '';
                } else {
                  // delete the data-option
                  await CnHttpFactory.instance( {
                    path: this.parentModel.getServiceResourcePath() +
                      '/reqn_version_data_option/data_option_id=' + dataOptionId + ';study_phase_code=' + studyPhaseCode,
                    onError: function( error ) {
                      self.record.dataOptionValueList[studyPhaseCode][dataOptionId] =
                        !self.record.dataOptionValueList[studyPhaseCode][dataOptionId];
                    }
                  } ).delete();

                  // delete the local copy of the justification if there are no data options left
                  if( dataOption.justification && angular.isDefined( this.record[justificationColumn] ) ) {
                    var found = false;
                    for( var code in this.record.dataOptionValueList ) {
                      if( this.record.dataOptionValueList[code][dataOptionId] ) {
                        found = true;
                        break;
                      }
                    }

                    if( !found ) delete this.record[justificationColumn];
                  }
                }
              } catch( error ) {
                // handled by onError above
              }
            }
          },

          viewData: function() {
            $window.open( CnSession.application.studyDataUrl + '/' + this.record.data_directory, 'studyData' + this.record.reqn_id );
          },

          canViewData: function() {
            // administrators and applicants can view data when in the active stage
            var stage_type = this.record.stage_type ? this.record.stage_type : '';
            return this.parentModel.isRole( 'administrator', 'applicant' ) && 'Active' == stage_type;
          },

          getDifferenceList: function( version ) {
            var differenceList = [];
            var mainInputGroup = this.parentModel.module.inputGroupList.findByProperty( 'title', '' );

            if( version.differences.diff ) {
              for( var part in version.differences ) {
                if( !version.differences.hasOwnProperty( part ) || 'diff' == part ) { // used to track overall diff
                  // do nothing
                } else if( 'amendment' == part ) {
                  if( version.differences[part].diff && version.differences[part].a.new_user_id ) {
                    differenceList.push( {
                      name: 'New Primary Applicant',
                      old: null,
                      new: this.formattedRecord.new_user_id
                    } );
                  }
                } else if( version.differences[part].diff ) {
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
                                new: null == this.record[property] ? '(empty)' : '"' + this.record[property] + '"'
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

          submit: async function( data ) {
            var response = await CnModalConfirmFactory.instance( {
              title: this.translate( 'misc.pleaseConfirm' ),
              noText: this.parentModel.isRole( 'applicant' ) ? this.translate( 'misc.no' ) : 'No',
              yesText: this.parentModel.isRole( 'applicant' ) ? this.translate( 'misc.yes' ) : 'Yes',
              message: this.translate( 'misc.submitWarning' )
            } ).show();

            if( response ) {
              // make sure that certain properties have been defined, one tab at a time
              var requiredTabList = {
                '1a': [ 'applicant_position', 'applicant_affiliation', 'applicant_address', 'applicant_phone' ],
                '1b': [ 'coapplicant_agreement_filename' ],
                '1c': [ 'start_date', 'duration' ],
                '1d': [ 'title', 'keywords', 'lay_summary', 'background', 'objectives', 'methodology', 'analysis' ],
                '1e': [ 'peer_review', 'funding', 'funding_filename', 'funding_agency', 'grant_number' ],
                '1f': this.record.has_ethics_approval_list ? [ 'ethics' ] : [ 'ethics', 'ethics_filename' ],
                '2cohort': [ 'tracking', 'comprehensive', 'longitudinal', 'last_identifier' ]
              };

              // Now add the data option justifications
              // We have to do this dynamically because they only exist if their parent data option is selected and
              // have the "jurisdiction" property
              for( var property in this.record ) {
                if( null != property.match( /^justification_/ ) ) {
                  // find which tab the justification belongs to
                  var match = property.match( /^justification_([0-9]+)$/ );
                  var obj = this.parentModel.getCategoryAndDataOption( match[1] );
                  if( obj.dataOption.justification ) {
                    var tab = '2' + obj.category.charCode;

                    // add it to the required tab list
                    if( angular.isUndefined( requiredTabList[tab] ) ) requiredTabList[tab] = [];
                    requiredTabList[tab].push( property );
                  }
                }
              }


              var self = this;
              var error = null;
              var errorTab = null;

              await Promise.all( this.fileList.map( file => file.updateFileSize() ) );
              
              for( var tab in requiredTabList ) {
                var firstProperty = null;
                requiredTabList[tab].filter( function( property ) {
                  if( '1b' == tab ) {
                    // only check 1b properties if there is a new coapplication with access to data
                    return self.addingCoapplicantWithData;
                  } else if( '1e' == tab ) {
                    // only check 1e funding properties if funding=yes
                    return !['peer_review', 'funding'].includes( property ) ? 'yes' == self.record.funding : true;
                  } else if( 'ethics_filename' == property ) {
                    // only check the ethics filename if ethics=yes or exempt
                    return ['yes', 'exempt'].includes( self.record.ethics );
                  } else if( 'last_identifier' == property ) {
                    // only check the last_identifier if longitidunal=yes (it's a boolean var)
                    return self.record.longitudinal;
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
                    missing = null === self.record[property] || '' === self.record[property];
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

              if( '.' != this.record.amendment ) {
                // reset the no-amendment-types indicator
                this.noAmendmentTypes = false;

                // for amendments make sure that at least one amendment type has been selected
                if( !this.parentModel.amendmentTypeList.en.some( function( amendmentType ) {
                  var property = 'amendmentType' + amendmentType.id;
                  return self.record[property];
                } ) ) {
                  this.noAmendmentTypes = true;
                  if( null == errorTab ) errorTab = 'amendment';
                  if( null == error ) error = {
                    title: this.translate( 'misc.missingFieldTitle' ),
                    message: this.translate( 'misc.missingFieldMessage' ),
                    error: true
                  };
                }

                // make sure the new user field is filled out when changing the primary applicant
                if( this.record['amendmentType' + this.parentModel.newUserAmendmentTypeId] && null == this.record.new_user_id ) {
                  var element = cenozo.getFormElement( 'new_user_id' );
                  element.$error.required = true;
                  cenozo.updateFormElement( element, true );
                  if( null == errorTab ) errorTab = 'amendment';
                  if( null == error ) error = {
                    title: this.translate( 'misc.missingFieldTitle' ),
                    message: this.translate( 'misc.missingFieldMessage' ),
                    error: true
                  };
                }

                // make sure the justification is filled out if necessary
                if( this.amendmentTypeWithJustificationSelected() && null == this.record.amendment_justification ) {
                  var element = cenozo.getFormElement( 'amendment_justification' );
                  element.$error.required = true;
                  cenozo.updateFormElement( element, true );
                  if( null == errorTab ) errorTab = 'amendment';
                  if( null == error ) error = {
                    title: this.translate( 'misc.missingFieldTitle' ),
                    message: this.translate( 'misc.missingFieldMessage' ),
                    error: true
                  };
                }
              }

              if( null != error ) {
                // if there was an error then display it now
                if( this.parentModel.isRole( 'applicant' ) ) error.closeText = this.translate( 'misc.close' );
                await CnModalMessageFactory.instance( error ).show();

                if( 'amendment' == errorTab ) {
                  this.setFormTab( 0, 'amendment', false );
                } else {
                  if( 1 == errorTab.substr( 0, 1 ) ) {
                    this.setFormTab( 0, 'part1', false );
                    this.setFormTab( 1, errorTab.substr( 1 ) );
                  } else {
                    this.setFormTab( 0, 'part2', false );
                    this.setFormTab( 2, errorTab.substr( 1 ) );
                  }
                }
              } else {
                // now check to make sure this version is different from the last (the first is always different)
                var response = await CnHttpFactory.instance( {
                  path: this.parentModel.getServiceResourcePath(),
                  data: { select: { column: 'has_changed' } }
                } ).get();

                var proceed = response.data.has_changed
                            ? true // changes have been made, so submit now
                            : // no changes made so warn the user before proceeding
                              await CnModalConfirmFactory.instance( {
                                title: this.translate( 'misc.pleaseConfirm' ),
                                noText: this.translate( 'misc.no' ),
                                yesText: this.translate( 'misc.yes' ),
                                message: this.translate( 'misc.noChangesMessage' )
                              } ).show();
                if( proceed ) {
                  var parent = this.parentModel.getParentIdentifier();

                  if( this.record.legacy && '.' == this.record.amendment ) {
                    // when submitting a new legacy reqn ask which stage to move to
                    var stageType = await CnModalSubmitLegacyFactory.instance().show();

                    if( null != stageType ) {
                      var proceed = true;

                      // when moving to the active or completed stage an agreement file must be provided
                      if( 'Active' == stageType || 'Complete' == stageType ) {
                        var response = await CnModalUploadAgreementFactory.instance().show();
                        if( response ) {
                          // submit the agreement file
                          var filePath = this.parentModel.getServiceResourcePath();
                          await CnHttpFactory.instance( {
                            path: filePath,
                            data: { agreement_filename: response.file.getFilename() }
                          } ).patch();
                          await response.file.upload( filePath );
                        } else {
                          proceed = false; // don't proceed if the upload is cancelled
                        }
                      }

                      if( proceed ) {
                        // finally, we can move to the next requested stage
                        await CnHttpFactory.instance( {
                          path: parent.subject + '/' + parent.identifier + '?action=next_stage&stage_type=' + stageType
                        } ).patch();

                        await this.onView();
                        await CnModalMessageFactory.instance( {
                          title: 'Requisition moved to "' + stageType + '" stage',
                          message: 'The legacy requisition has been moved to the "' + stageType + '" stage and is now visible ' +
                                   'to the applicant.',
                          closeText: 'Close'
                        } ).show();
                      }
                    }
                  } else {
                    // from here we're either a legacy reqn doing an amendment or we're not a legacy reqn
                    var proceed = true;
                    var noReview = false;

                    // if an admin or typist is submitting the amendment then ask if we want to skip the review process
                    if( this.record.legacy && this.parentModel.isRole( 'administrator', 'typist' ) ) {
                      var response = await CnModalConfirmFactory.instance( {
                        title: 'Submit legacy amendment',
                        message:
                          'Do you wish to submit the amendment for review or should the review system be skipped? ' +
                          'If you skip the review the requisition will immediately return to the active stage.',
                        yesText: 'Review',
                        noText: 'Skip Review'
                      } ).show();

                      // determine whether we're skipping a legacy amendment's review
                      if( !response && '.' != this.record.amendment ) {
                        noReview = true;

                        // if we're skipping the review then give the option to upload an agreement
                        var response = await CnModalConfirmFactory.instance( {
                          message: 'Do you wish to upload an agreement associated with this legacy amendment?'
                        } ).show();

                        if( response ) {
                          var response = await CnModalUploadAgreementFactory.instance().show();
                          if( response ) {
                            // submit the agreement file
                            var filePath = this.parentModel.getServiceResourcePath();
                            await CnHttpFactory.instance( {
                              path: filePath,
                              data: { agreement_filename: response.file.getFilename() }
                            } ).patch();

                            // only proceed if the upload succeeds
                            await response.file.upload( filePath );
                          } else {
                            proceed = false; // don't proceed if the upload is cancelled
                          }
                        }
                      }
                    }

                    // Only proceed when:
                    // 1) doing a review, or
                    // 2) not doing a review and ( an agreement isn't included or uploading an agreement succeeds )
                    // Do not proceed when uploading an agreement is cancelled
                    if( proceed ) {
                      try {
                        var self = this;
                        await CnHttpFactory.instance( {
                          path: parent.subject + '/' + parent.identifier + "?action=submit" + ( noReview ? '&review=0' : '' ),
                          onError: async function( error ) {
                            if( 409 == error.status ) {
                              await CnModalMessageFactory.instance( {
                                title: self.translate( 'misc.invalidStartDateTitle' ),
                                message: self.translate( 'misc.invalidStartDateMessage' ),
                                closeText: self.translate( 'misc.close' ),
                                error: true
                              } ).show();

                              var element = cenozo.getFormElement( 'start_date' );
                              element.$error.custom = self.translate( 'misc.invalidStartDateTitle' );
                              cenozo.updateFormElement( element, true );
                              self.setFormTab( 0, 'part1', false );
                              self.setFormTab( 1, 'c' );
                            } else CnModalMessageFactory.httpError( error );
                          }
                        } ).patch();

                        var code = CnSession.user.id == this.record.trainee_user_id ?
                          ( 'deferred' == this.record.state ? 'traineeResubmit' : 'traineeSubmit' ) :
                          ( 'deferred' == this.record.state ? 'resubmit' : 'submit' );
                        
                        await CnModalMessageFactory.instance( {
                          title: noReview
                            ? 'Amendment Complete'
                            : this.translate( 'misc.' + code + 'Title' ),
                          message: noReview
                            ? 'The amendment is now complete and the requisition has been returned to the Active stage.'
                            : this.translate( 'misc.' + code + 'Message' ),
                          closeText: this.translate( 'misc.close' )
                        } ).show();

                        if( this.parentModel.isRole( 'applicant' ) ) {
                          await $state.go( 'root.home' );
                        } else {
                          await this.onView( true ); // refresh
                        }
                      } catch( error ) {
                        // handled by onError above
                      }
                    }
                  }
                }
              }
            }
          },

          amend: async function() {
            var response = await CnModalConfirmFactory.instance( {
              title: this.translate( 'misc.pleaseConfirm' ),
              noText: this.translate( 'misc.no' ),
              yesText: this.translate( 'misc.yes' ),
              message: this.translate( 'misc.amendWarning' )
            } ).show();

            if( response ) {
              var parent = this.parentModel.getParentIdentifier();
              await CnHttpFactory.instance( {
                path: parent.subject + '/' + parent.identifier + "?action=amend",
              } ).patch();

              // get the new version and transition to viewing it
              var response = await CnHttpFactory.instance( {
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
              } ).get();

              await this.parentModel.transitionToViewState( {
                getIdentifier: function() { return response.data.reqn_version_id; }
              } );
            }
          },

          viewReqn: async function() {
            await this.parentModel.transitionToParentViewState( 'reqn', 'identifier=' + this.record.identifier );
          },

          displayReportRequiredWarning: async function() {
            var response = await CnModalConfirmFactory.instance( {
              title: this.translate( 'misc.pleaseConfirm' ),
              noText: this.translate( 'misc.no' ),
              yesText: this.translate( 'misc.yes' ),
              message: this.translate( 'misc.reportRequiredWarning' )
            } ).show();

            if( response ) await this.viewReport()
          },

          displayNotices: async function() {
            var response = await CnHttpFactory.instance( {
              path: '/reqn/identifier=' + this.record.identifier + '/notice',
              data: { modifier: { order: { datetime: true } } }
            } ).query();

            await CnModalNoticeListFactory.instance( {
              title: 'Notice List',
              closeText: this.translate( 'misc.close' ),
              noticeList: response.data
            } ).show();
          }
        } );

        this.configureFileInput( 'coapplicant_agreement_filename' );
        this.configureFileInput( 'peer_review_filename' );
        this.configureFileInput( 'funding_filename' );
        this.configureFileInput( 'ethics_filename' );
        this.configureFileInput( 'data_sharing_filename' );
        this.configureFileInput( 'agreement_filename' );
        this.coapplicantModel.metadata.getPromise(); // needed to get the coapplicant's metadata
        this.referenceModel.metadata.getPromise(); // needed to get the reference's metadata

        var self = this;
        async function init() {
          await self.deferred.promise;
          if( angular.isDefined( self.stageModel ) ) self.stageModel.listModel.heading = 'Stage History';
        }

        init();
      };
      return { instance: function( parentModel, root ) { return new object( parentModel, root ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnReqnVersionModelFactory', [
    'CnReqnHelper', 'CnBaseModelFactory', 'CnReqnVersionListFactory', 'CnReqnVersionViewFactory',
    'CnSession', 'CnHttpFactory', '$state',
    function( CnReqnHelper, CnBaseModelFactory, CnReqnVersionListFactory, CnReqnVersionViewFactory,
              CnSession, CnHttpFactory, $state ) {
      var object = function( type ) {
        CnBaseModelFactory.construct( this, module );
        this.type = type;
        if( 'lite' != this.type ) this.listModel = CnReqnVersionListFactory.instance( this );

        var misc = CnReqnHelper.lookupData.reqn.misc;
        angular.extend( this, {
          viewModel: CnReqnVersionViewFactory.instance( this, 'root' == this.type ),

          // we'll need to track which amendment type changes the reqn's owner
          newUserAmendmentTypeId: null,
          inputList: {},
          dataOptionCategoryList: [],

          getCategoryAndDataOption: function( dataOptionId ) {
            // get the category and data option objects
            var obj = { category: null, dataOption: null };
            this.dataOptionCategoryList.some( function( cat ) {
              var dataOption = cat.optionList.findByProperty( 'id', dataOptionId );
              if( null != dataOption ) {
                obj.category = cat;
                obj.dataOption = dataOption;
                return true;
              }
              return false;
            } );

            return obj;
          },

          // override the service collection
          getServiceData: function( type, columnRestrictLists ) {
            // Only include the coapplicant_agreement, peer_review, funding, ethics, data_sharing and agreement filenames in the
            // view type in the lite instance
            return 'lite' == this.type ? {
              select: {
                column: [
                  'is_current_version',
                  'coapplicant_agreement_filename',
                  'peer_review_filename',
                  'funding_filename',
                  'ethics_filename',
                  'data_sharing_filename',
                  'agreement_filename',
                  { table: 'reqn', column: 'state' },
                  { table: 'stage_type', column: 'phase' },
                  { table: 'stage_type', column: 'name', alias: 'stage_type' }
                ]
              }
            } : this.$$getServiceData( type, columnRestrictLists );
          },

          getEditEnabled: function() {
            var is_current_version = this.viewModel.record.is_current_version ? this.viewModel.record.is_current_version : '';
            var phase = this.viewModel.record.phase ? this.viewModel.record.phase : '';
            var state = this.viewModel.record.state ? this.viewModel.record.state : '';
            var stage_type = this.viewModel.record.stage_type ? this.viewModel.record.stage_type : '';

            var check = false;
            if( this.isRole( 'applicant' ) ) {
              check = 'new' == phase || (
                'deferred' == state && ( 'review' == phase || ( 'lite' == this.type && 'Agreement' == stage_type ) )
              );
            } else if( this.isRole( 'administrator', 'typist' ) ) {
              check = 'new' == phase || (
                'abandoned' != state && ( 'review' == phase || 'Agreement' == stage_type || 'Data Release' == stage_type )
              );
            }

            return this.$$getEditEnabled() && is_current_version && check;
          },

          getDeleteEnabled: function() {
            return this.$$getDeleteEnabled() &&
                   angular.isDefined( this.viewModel.record ) &&
                   'new' == this.viewModel.record.phase;
          },

          setupBreadcrumbTrail: function() {
            var self = this;
            var trail = [];

            if( this.isRole( 'applicant' ) ) {
              trail = [
                { title: 'Requisition' },
                { title: this.viewModel.record.identifier }
              ];
            } else {
              trail = [ {
                title: 'Requisitions',
                go: async function() { await $state.go( 'reqn.list' ); }
              }, {
                title: this.viewModel.record.identifier,
                go: async function() {
                  await $state.go( 'reqn.view', { identifier: 'identifier=' + self.viewModel.record.identifier } );
                }
              }, {
                title: 'version ' + this.viewModel.record.amendment_version
              } ];
            }

            CnSession.setBreadcrumbTrail( trail );
          },

          getMetadata: async function() {
            var self = this;
            await this.$$getMetadata();

            var response = await CnHttpFactory.instance( {
              path: 'reqn_version'
            } ).head();

            var columnList = angular.fromJson( response.headers( 'Columns' ) );
            for( var column in columnList ) {
              columnList[column].required = '1' == columnList[column].required;
              if( 'enum' == columnList[column].data_type ) { // parse out the enum values
                columnList[column].enumList = [];
                cenozo.parseEnumList( columnList[column] ).forEach( function( item ) {
                  columnList[column].enumList.push( { value: item, name: item } );
                } );
              }
              if( angular.isUndefined( this.metadata.columnList[column] ) ) this.metadata.columnList[column] = {};
              angular.extend( this.metadata.columnList[column], columnList[column] );
            }

            var response = await CnHttpFactory.instance( {
              path: 'amendment_type',
              data: { modifier: { order: 'rank' } }
            } ).query();

            this.amendmentTypeList = { en: [], fr: [] };
            response.data.forEach( function( item ) {
              if( item.new_user ) self.newUserAmendmentTypeId = item.id;

              self.amendmentTypeList.en.push( {
                id: item.id,
                newUser: item.new_user,
                name: item.reason_en,
                justificationPrompt: item.justification_prompt_en
              } );
              self.amendmentTypeList.fr.push( {
                id: item.id,
                newUser: item.new_user,
                name: item.reason_fr,
                justificationPrompt: item.justification_prompt_fr
              } );
            } );

            // only do the following for the root instance
            if( 'root' == this.type ) {
              // create coapplicant access enum
              this.metadata.accessEnumList = {
                en: [ { value: true, name: misc.yes.en }, { value: false, name: misc.no.en } ],
                fr: [ { value: true, name: misc.yes.fr }, { value: false, name: misc.no.fr } ]
              };

              // create generic yes/no enum
              this.metadata.yesNoEnumList = {
                en: [ { value: '', name: misc.choose.en }, { value: true, name: misc.yes.en }, { value: false, name: misc.no.en } ],
                fr: [ { value: '', name: misc.choose.fr }, { value: true, name: misc.yes.fr }, { value: false, name: misc.no.fr } ]
              };

              // create duration enums
              this.metadata.columnList.duration.standardEnumList = {
                en: [
                  { value: '', name: misc.choose.en },
                  { value: '2 years', name: misc.duration2Years.en },
                  { value: '3 years', name: misc.duration3Years.en }
                ],
                fr: [
                  { value: '', name: misc.choose.fr },
                  { value: '2 years', name: misc.duration2Years.fr },
                  { value: '3 years', name: misc.duration3Years.fr }
                ]
              };

              this.metadata.columnList.duration.amendment2EnumList = {
                en: [
                  { value: '2 years', name: misc.duration2Years.en },
                  { value: '2 years + 1 additional year', name: misc.duration2p1Years.en },
                  { value: '2 years + 2 additional years', name: misc.duration2p2Years.en },
                  { value: '2 years + 3 additional years', name: misc.duration2p3Years.en }
                ],
                fr: [
                  { value: '2 years', name: misc.duration2Years.fr },
                  { value: '2 years + 1 additional year', name: misc.duration2p1Years.fr },
                  { value: '2 years + 2 additional years', name: misc.duration2p2Years.fr },
                  { value: '2 years + 3 additional years', name: misc.duration2p3Years.fr }
                ]
              };

              this.metadata.columnList.duration.amendment3EnumList = {
                en: [
                  { value: '3 years', name: misc.duration3Years.en },
                  { value: '3 years + 1 additional year', name: misc.duration3p1Years.en },
                  { value: '3 years + 2 additional years', name: misc.duration3p2Years.en },
                  { value: '3 years + 3 additional years', name: misc.duration3p3Years.en }
                ],
                fr: [
                  { value: '3 years', name: misc.duration3Years.fr },
                  { value: '3 years + 1 additional year', name: misc.duration3p1Years.fr },
                  { value: '3 years + 2 additional years', name: misc.duration3p2Years.fr },
                  { value: '3 years + 3 additional years', name: misc.duration3p3Years.fr }
                ]
              };

              // translate funding enum
              this.metadata.columnList.funding.enumList = {
                en: this.metadata.columnList.funding.enumList,
                fr: angular.copy( this.metadata.columnList.funding.enumList )
              };
              this.metadata.columnList.funding.enumList.fr[0].name = misc.yes.fr.toLowerCase();
              this.metadata.columnList.funding.enumList.fr[1].name = misc.no.fr.toLowerCase();
              this.metadata.columnList.funding.enumList.fr[2].name = misc.requested.fr.toLowerCase();

              this.metadata.columnList.funding.enumList.en.unshift( { value: '', name: misc.choose.en } );
              this.metadata.columnList.funding.enumList.fr.unshift( { value: '', name: misc.choose.fr } );

              // translate ethics enum
              this.metadata.columnList.ethics.enumList = {
                en: this.metadata.columnList.ethics.enumList,
                fr: angular.copy( this.metadata.columnList.ethics.enumList )
              };
              this.metadata.columnList.ethics.enumList.fr[0].name = misc.yes.fr.toLowerCase();
              this.metadata.columnList.ethics.enumList.fr[1].name = misc.no.fr.toLowerCase();
              this.metadata.columnList.ethics.enumList.fr[2].name = misc.exempt.fr.toLowerCase();

              this.metadata.columnList.ethics.enumList.en.unshift( { value: '', name: misc.choose.en } );
              this.metadata.columnList.ethics.enumList.fr.unshift( { value: '', name: misc.choose.fr } );

              // translate waiver enum
              this.metadata.columnList.waiver.enumList.unshift( { value: '', name: misc.none.en } );
              this.metadata.columnList.waiver.enumList = {
                en: this.metadata.columnList.waiver.enumList,
                fr: angular.copy( this.metadata.columnList.waiver.enumList )
              };
              this.metadata.columnList.waiver.enumList.en[1].name = misc.traineeFeeWaiver.en;
              this.metadata.columnList.waiver.enumList.en[2].name = misc.postdocFeeWaiver.en;
              this.metadata.columnList.waiver.enumList.fr[0].name = misc.none.fr;
              this.metadata.columnList.waiver.enumList.fr[1].name = misc.traineeFeeWaiver.fr;
              this.metadata.columnList.waiver.enumList.fr[2].name = misc.postdocFeeWaiver.fr;
            }

            // only do the following for the root instance
            if( 'root' == this.type ) {
              var response = await CnHttpFactory.instance( {
                path: 'data_option_category',
                data: {
                  select: { column: [
                    'id',
                    'rank',
                    'comment',
                    'name_en', 'name_fr',
                    'condition_en', 'condition_fr',
                    'note_en', 'note_fr'
                  ] },
                  modifier: { order: 'rank', limit: 1000 }
                }
              } ).query();

              this.dataOptionCategoryList = response.data;
              this.dataOptionCategoryList.forEach( function( dataOptionCategory ) {
                // determine the character code based on the rank
                dataOptionCategory.charCode = String.fromCharCode( 'a'.charCodeAt(0) + dataOptionCategory.rank - 1 );
                dataOptionCategory.name = { en: dataOptionCategory.name_en, fr: dataOptionCategory.name_fr };
                delete dataOptionCategory.name_en;
                delete dataOptionCategory.name_fr;
                dataOptionCategory.note = { en: dataOptionCategory.note_en, fr: dataOptionCategory.note_fr };
                delete dataOptionCategory.note_en;
                delete dataOptionCategory.note_fr;
                dataOptionCategory.optionList = [];
              } );

              var response = await CnHttpFactory.instance( {
                path: 'data_option',
                data: {
                  select: { column: [
                    'id',
                    'data_option_category_id',
                    'justification',
                    'name_en', 'name_fr',
                    'condition_en', 'condition_fr',
                    'note_en', 'note_fr',
                    'bl',
                    'f1'
                  ] },
                  modifier: {
                    order: [ 'data_option_category_id', 'data_option.rank' ],
                    limit: 1000
                  }
                }
              } ).query();

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

              var response = await CnHttpFactory.instance( {
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
                  modifier: {
                    order: [ 'data_option_id', 'study_phase_id', 'data_option_detail.rank' ],
                    limit: 1000
                  }
                }
              } ).query();

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
            }
          }
        } );

        // make the input lists from all groups more accessible
        var self = this;
        module.inputGroupList.forEach( group => Object.assign( self.inputList, group.inputList ) );
      };

      return {
        root: new object( 'root' ),
        lite: new object( 'lite' ),
        instance: function() { return new object(); }
      };
    }
  ] );

} );
