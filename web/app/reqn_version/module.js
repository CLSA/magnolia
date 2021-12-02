cenozoApp.defineModule( { name: 'reqn_version',
                          dependencies: [ 'coapplicant', 'ethics_approval', 'reference' ],
                          models: ['list', 'view'],
                          create: module => {

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
    applicant_country_id: {
      type: 'lookup-typeahead',
      typeahead: { table: 'country' }
    },
    applicant_phone: { type: 'string' },
    applicant_email: { type: 'string' },
    trainee_name: { type: 'string' },
    trainee_program: { type: 'string' },
    trainee_institution: { type: 'string' },
    trainee_address: { type: 'string' },
    trainee_country_id: {
      type: 'lookup-typeahead',
      typeahead: { table: 'country' }
    },
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

    current_final_report_id: { column: 'final_report.id', type: 'string' },
    trainee_user_id: { column: 'reqn.trainee_user_id', type: 'string' },
    designate_user_id: { column: 'reqn.designate_user_id', type: 'string' },
    identifier: { column: 'reqn.identifier', type: 'string' },
    legacy: { column: 'reqn.legacy', type: 'string' },
    show_prices: { column: 'reqn.show_prices', type: 'string' },
    state: { column: 'reqn.state', type: 'string' },
    data_directory: { column: 'reqn.data_directory', type: 'string' },
    data_expiry_date: { column: 'reqn.data_expiry_date', type: 'date' },
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

          scope.model.viewModel.afterView( async () => {
            var record = scope.model.viewModel.record;

            // display final report message if appropriate
            var stage_type = record.stage_type ? record.stage_type : '';
            if( scope.model.isRole( 'applicant', 'designate' ) &&
                'Report Required' == stage_type &&
                'deferred' == scope.model.viewModel.record.state &&
                !scope.reportRequiredWarningShown ) {
              scope.reportRequiredWarningShown = true;
              await scope.model.viewModel.displayReportRequiredWarning();
            }

            // display notices to the applicant if they've never seen it
            if( scope.model.isRole( 'applicant', 'designate' ) && record.has_unread_notice )
              await scope.model.viewModel.displayNotices();
          } );

          scope.$watch( 'model.viewModel.record.start_date', date => {
            var element = cenozo.getFormElement( 'start_date' );
            if( element ) {
              // clear out errors
              if( null != date && element.$error.required ) element.$error.required = false;
              if( element.$error.custom ) element.$error.custom = false;
              cenozo.updateFormElement( element, true );
            }
          } );
          scope.$watch( 'model.viewModel.record.lay_summary', text => {
            scope.model.viewModel.charCount.lay_summary = text ? text.length : 0;
          } );
          scope.$watch( 'model.viewModel.record.background', text => {
            scope.model.viewModel.charCount.background = text ? text.length : 0;
          } );
          scope.$watch( 'model.viewModel.record.objectives', text => {
            scope.model.viewModel.charCount.objectives = text ? text.length : 0;
          } );
          scope.$watch( 'model.viewModel.record.methodology', text => {
            scope.model.viewModel.charCount.methodology = text ? text.length : 0;
          } );
          scope.$watch( 'model.viewModel.record.analysis', text => {
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
            var status = $scope.model.viewModel.record[$scope.model.isRole( 'applicant', 'designate' ) ? 'status' : 'stage_type'];
            if( 'deferred' == $scope.model.viewModel.record.state ) {
              status = $scope.model.isRole( 'applicant', 'designate' ) ? 'Action Required' : 'Deferred to Applicant';
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

          $scope.compareTo = async function( version ) {
            $scope.model.viewModel.compareRecord = version;
            $scope.liteModel.viewModel.compareRecord = version;
            $scope.model.setQueryParameter( 'c', null == version ? undefined : version.amendment_version );
            await $scope.model.reloadState( false, false, 'replace' );
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
                cenozo.forEachFormElement( 'part1bForm', element => { element.$dirty = true; } );
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
                cenozo.forEachFormElement( 'part1dForm', element => { element.$dirty = true; } );
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
              else if( $scope.model.isRole( 'applicant', 'designate' ) ) {
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
            if( response ) await $state.go( this.parentModel.isRole( 'applicant', 'designate' ) ? 'root.home' : 'reqn.list' );
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
                this.getSelectionList()
              ];
              if( this.record.has_ethics_approval_list ) promiseList.push( this.getEthicsApprovalList() );

              await Promise.all( promiseList );
              await this.getVersionList();

              // the category list will have been loaded by now, so we can load the selected tabs
              this.setFormTab( 0, this.parentModel.getQueryParameter( 't0' ), false );
              this.setFormTab( 1, this.parentModel.getQueryParameter( 't1' ), false );
              this.setFormTab( 2, this.parentModel.getQueryParameter( 't2' ), false );
            }
          },

          onPatch: async function( data ) {
            if( !this.parentModel.getEditEnabled() ) throw new Error( 'Calling onPatch() but edit is not enabled.' );

            var property = Object.keys( data )[0];

            if( null != property.match( /^amendment_justification_/ ) ) {
              // justifications have their own service
              var match = property.match( /^amendment_justification_([0-9]+)$/ );
              var amendmentTypeId = match[1];

              await CnHttpFactory.instance( {
                path: [
                  'reqn_version',
                  this.record.id,
                  'amendment_justification',
                  'amendment_type_id=' + amendmentTypeId
                ].join( '/' ),
                data: { description: data[property] }
              } ).patch();

              this.record['amendment_justification_' + amendmentTypeId] = data[property];
            } else if( null != property.match( /^data_justification_/ ) ) {
              // justifications have their own service
              var match = property.match( /^data_justification_([0-9]+)$/ );
              var optionId = match[1];

              await CnHttpFactory.instance( {
                path: [
                  'reqn_version',
                  this.record.id,
                  'data_justification',
                  'data_option_id=' + optionId
                ].join( '/' ),
                data: { description: data[property] }
              } ).patch();

              this.record['data_justification_' + optionId] = data[property];
            } else if( null != property.match( /^comment_/ ) ) {
              // comments have their own service
              var match = property.match( /^comment_([0-9]+)$/ );
              var categoryId = match[1];

              await CnHttpFactory.instance( {
                path: [
                  'reqn_version',
                  this.record.id,
                  'reqn_version_comment',
                  'data_category_id=' + categoryId
                ].join( '/' ),
                data: { description: data[property] }
              } ).patch();

              this.record['comment_' + categoryId] = data[property];
            } else if( null != property.match( /^deferral_note/ ) ) {
              // make sure to send patches to deferral notes to the parent reqn
              var parent = this.parentModel.getParentIdentifier();
              var httpObj = {
                path: parent.subject + '/' + parent.identifier,
                data: data
              };
              httpObj.onError = ( error ) => { this.onPatchError( error ); };
              try {
                await CnHttpFactory.instance( httpObj ).patch();
                this.afterPatchFunctions.forEach( fn => fn() );
              } catch( error ) {
                // handled by onError above
              }
            } else {
              var proceed = true;
              if( 'new_user_id' == property ) {
                proceed = false;
                // make sure the new user isn't a trainee
                var response = await CnHttpFactory.instance( {
                  path: 'applicant/user_id=' + data[property],
                  data: { select: { column: 'supervisor_user_id' } },
                  onError: async ( error ) => {
                    if( 404 == error.status ) {
                      await CnModalMessageFactory.instance( {
                        title: this.translate( 'misc.invalidNewApplicantTitle' ),
                        message: this.translate( 'misc.invalidNewApplicantMessage' ),
                        closeText: this.translate( 'misc.close' ),
                        error: true
                      } ).show();

                      // failed to set the new user so put it back
                      this.formattedRecord.new_user_id = this.backupRecord.formatted_new_user_id;
                    } else {
                      CnModalMessageFactory.httpError( error );
                    }
                  }
                } ).get();

                if( angular.isObject( response.data ) && null != response.data.supervisor_user_id ) {
                  await CnModalMessageFactory.instance( {
                    title: this.translate( 'misc.pleaseNote' ),
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

                if( angular.isDefined( data.applicant_country_id ) || angular.isDefined( data.trainee_country_id ) ) {
                  // we may have to set the fee waiver type to none if either the applicant or trainee is not Canadian
                  if( this.record.waiver && !this.isWaiverAllowed() ) this.record.waiver = '';
                } else if( angular.isDefined( data.comprehensive ) || angular.isDefined( data.tracking ) ) {
                  if( this.record.comprehensive && this.record.tracking ) {
                    // show the cohort warning to the applicant
                    CnModalMessageFactory.instance( {
                      title: this.translate( 'misc.pleaseNote' ),
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
          tabSectionListIsBuilt: false,
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
            // one tab for each data category will be added here
            [ 'part3', null, null ],
            [ 'agreement', null, null ]
          ],

          setFormTab: async function( index, tab, transition ) {
            if( angular.isUndefined( transition ) ) transition = true;
            if( !( 0 <= index && index <= 2 ) ) index = 0;

            // find the tab section
            var selectedTabSection = null;
            this.tabSectionList.some( tabSection => {
              if( tab == tabSection[index] ) {
                selectedTabSection = tabSection;
                return true;
              }
            } );

            // get the tab (or default if none was found)
            tab = null != selectedTabSection && null != selectedTabSection[index]
                ? selectedTabSection[index]
                : ( 0 == index ? 'instructions' : 1 == index ? 'a' : 'notes' );

            this.formTab[index] = tab;
            this.parentModel.setQueryParameter( 't'+index, tab );

            if( transition ) await this.parentModel.reloadState( false, false, 'replace' );

            // update all textarea sizes
            angular.element( 'textarea[cn-elastic]' ).trigger( 'elastic' );
          },

          nextSection: async function( reverse ) {
            if( angular.isUndefined( reverse ) ) reverse = false;

            var currentTabSectionIndex = null;
            this.tabSectionList.some( ( tabSection, index ) => {
              if( this.formTab[0] == tabSection[0] ) {
                if( ( null == tabSection[1] || this.formTab[1] == tabSection[1] ) &&
                    ( null == tabSection[2] || this.formTab[2] == tabSection[2] ) ) {
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
                await this.setFormTab( 0, tabSection[0] );
              }
            }
          },

          // NOTE: This process mirrors database\reqn_version::calculate_cost() on the server side
          calculateCost: function() {
            // only calculate the cost if we have to
            if( !this.record.show_prices ) return null;

            // determine the base cost based on country (assume the base country if none is provided)
            var baseCountryId = CnSession.application.baseCountryId;
            var applicantCountryId = null == this.record.applicant_country_id ? baseCountryId : this.record.applicant_country_id;
            var traineeCountryId = null == this.record.trainee_country_id ? baseCountryId : this.record.trainee_country_id;
            var cost = 3000;

            // cost for trainees is different to applicants
            if( this.record.trainee_user_id ) {
              if( baseCountryId != traineeCountryId || baseCountryId != applicantCountryId ) {
                // if either the trainee or applicant isn't Canadian then the base fee is 5000
                cost = 5000;
              } else if( baseCountryId == traineeCountryId && baseCountryId == applicantCountryId && this.record.waiver ) {
                // if both are canadian and there is a fee waiver means the base cost is 0
                cost = 0;
              }
            } else {
              // if the applicant is not Canadian then the base fee is 5000
              if( baseCountryId != applicantCountryId ) cost = 5000;
            }

            this.parentModel.categoryList.forEach(
              category => category.optionList.forEach( option => {
                var maxCost = 0;
                option.selectionList.filter( selection => 0 < selection.cost.value ).forEach( selection => {
                  if( angular.isArray( this.record.selectionList ) && this.record.selectionList[selection.id] ) {
                    if( selection.costCombined ) {
                      // track the most expensive selection
                      if( selection.cost.value > maxCost ) maxCost = selection.cost.value;
                    } else {
                      // add the selection's cost
                      cost += selection.cost.value;
                    }
                  }
                } );

                // when there is a combined cost then maxCost will be > 0, otherwise it is 0
                cost += maxCost;
              } )
            );

            return 'en' == this.record.lang ? '$' + cost : cost + ' $';
          },

          isWaiverAllowed: function() {
            var baseCountryId = CnSession.application.baseCountryId;
            return this.record.trainee_name &&
              ( null == this.record.applicant_country_id || baseCountryId == this.record.applicant_country_id ) &&
              ( null == this.record.trainee_country_id || baseCountryId == this.record.trainee_country_id );
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
                  amendmentJustificationList: []
                }
              },
              part1: {
                diff: false,
                a: { // applicant
                  diff: false,
                  applicant_position: false,
                  applicant_affiliation: false,
                  applicant_address: false,
                  applicant_country_id: false,
                  applicant_phone: false,
                  trainee_program: false,
                  trainee_institution: false,
                  trainee_address: false,
                  trainee_country_id: false,
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
                }
              }
            };

            // add a section for each category
            this.parentModel.categoryList.forEach( category => {
              differences.part2[category.charCode] = {
                diff: false,
                selectionList: [],
                optionJustificationList: [],
                comment: false
              }
            } );

            // add all amendment types
            this.parentModel.amendmentTypeList.en.forEach( amendmentType => {
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
                        reqnVersion1.coapplicantList.forEach( c1 => {
                          var c2 = reqnVersion2.coapplicantList.findByProperty( 'name', c1.name );
                          if( null == c2 ) {
                            // reqnVersion1 has coapplicant that compared reqnVersion2 doesn't
                            differences.diff = true;
                            differences[part].diff = true;
                            differences[part][section].diff = true;
                            differences[part][section][property].push( { name: c1.name, diff: 'added' } );
                          } else {
                            if( ['position', 'affiliation', 'email', 'role', 'access'].some( p => c1[p] != c2[p] ) ) {
                              // reqnVersion1 has coapplicant which is different than compared reqnVersion2
                              differences.diff = true;
                              differences[part].diff = true;
                              differences[part][section].diff = true;
                              differences[part][section][property].push( { name: c1.name, diff: 'changed' } );
                            }
                          }
                        } );

                        // loop through compared reqnVersion2's coapplicants to see if any were removed
                        reqnVersion2.coapplicantList.forEach( c2 => {
                          var c1 = reqnVersion1.coapplicantList.findByProperty( 'name', c2.name );
                          if( null == c1 ) {
                            // reqnVersion1 has coapplicant that compared reqnVersion2 doesn't
                            differences.diff = true;
                            differences[part].diff = true;
                            differences[part][section].diff = true;
                            differences[part][section][property].push( { name: c2.name, diff: 'removed' } );
                          }
                        } );
                      } else if( 'referenceList' == property ) {
                        // loop through reqnVersion1's references to see if any were added or changed
                        reqnVersion1.referenceList.forEach( r1 => {
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
                        reqnVersion2.referenceList.forEach( r2 => {
                          var r1 = reqnVersion1.referenceList.findByProperty( 'reference', r2.reference );
                          if( null == r1 ) {
                            // reqnVersion1 has reference that compared reqnVersion2 doesn't
                            differences.diff = true;
                            differences[part].diff = true;
                            differences[part][section].diff = true;
                            differences[part][section][property].push( { name: r2.reference, diff: 'removed' } );
                          }
                        } );
                      } else if( 'selectionList' == property ) {
                        this.parentModel.categoryList.filter( category => section == category.charCode ).forEach( category => {
                          category.optionList.forEach( option => {
                            option.selectionList.forEach( selection => {
                              if( reqnVersion1.selectionList[selection.id] != reqnVersion2.selectionList[selection.id] ) {
                                differences.diff = true;
                                differences[part].diff = true;
                                differences[part][section].diff = true;
                                differences[part][section][property].push( {
                                  id: selection.id,
                                  name: option.name.en + ' [' +
                                    CnReqnHelper.lookupData.reqn.misc.studyPhase[selection.studyPhaseCode].en + ']',
                                  diff: reqnVersion1.selectionList[selection.id] ? 'added' : 'removed'
                                } );
                              }
                            } );
                          } );
                        } );
                      } else if( 'optionJustificationList' == property ) {
                        for( var prop in reqnVersion1 ) {
                          if( null != prop.match( /^data_justification_/ ) ) {
                            if( reqnVersion1[prop] != reqnVersion2[prop] ) {
                              var match = prop.match( /^data_justification_([0-9]+)$/ );
                              var option = this.parentModel.getCategoryAndOption( match[1] ).option;
                              differences.diff = true;
                              differences[part].diff = true;
                              differences[part][section].diff = true;
                              differences[part][section][property].push( { id: option.id, diff: true } );
                            }
                          }
                        }
                      } else if( 'amendmentJustificationList' == property ) {
                        for( var prop in reqnVersion1 ) {
                          if( null != prop.match( /^amendment_justification_/ ) ) {
                            if( reqnVersion1[prop] != reqnVersion2[prop] ) {
                              var match = prop.match( /^amendment_justification_([0-9]+)$/ );
                              differences.diff = true;
                              differences[part].diff = true;
                              differences[part][section].diff = true;
                              differences[part][section][property].push( { id: match[1], diff: true } );
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
                        var category = this.parentModel.categoryList.findByProperty( 'charCode', section );
                        if( category.comment ) {
                          // a comment's property in the record is followed by the data_category_id
                          var commentProperty = 'comment_' + category.id;
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
            var parent = this.parentModel.getParentIdentifier();
            this.versionList = [];
            var response = await CnHttpFactory.instance( {
              path: parent.subject + '/' + parent.identifier + '/reqn_version'
            } ).query();

            // we're going to use .then calls below to maximize overall asynchronous processing time
            var promiseList = [];
            response.data.forEach( version => {
              promiseList = promiseList.concat( [
                this.getAmendmentTypeList( version.id, version ),

                // see if there is a difference between this list and the view's list
                this.getCoapplicantList( version.id, version ).then( () => this.setCoapplicantDiff( version ) ),
                // see if there is a difference between this list and the view's list
                this.getReferenceList( version.id, version ).then( () => this.setReferenceDiff( version ) ),
                this.getSelectionList( version.id, version )
              ] );

              // add the file sizes
              ['coapplicant_agreement', 'peer_review', 'funding', 'ethics', 'data_sharing'].forEach( file => {
                var path = 'reqn_version/' + version.id + '?file=' + file + '_filename';
                promiseList.push( CnHttpFactory.instance( { path: path } ).get().then( r => version[file + '_size'] = r.data ) );
              } );

              this.versionList.push( version );
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
              this.versionList.slice().reverse().some( version => {
                // Note that the amendments we're comparing are letters, and since . is considered less than A it works
                // whether we're comparing lettered versions or the initial "." version:
                if( this.record.amendment > version.amendment ) {
                  this.lastAmendmentVersion = version.amendment_version;
                  return true;
                }
              } );
            }

            await Promise.all( promiseList );

            // Calculate all differences for all versions (in reverse order so we can find the last agreement version)
            this.versionList.reverse();

            this.lastAgreementVersion = null;
            this.versionList.forEach( version => {
              if( null != version ) {
                version.differences = this.getDifferences( version );

                // while we're at it determine the list of coapplicant agreements
                if( null != version.coapplicant_agreement_filename )
                  this.coapplicantAgreementList.push( { version: version.amendment_version, id: version.id } );

                // ... and also determine the last agreement version and calculate its differences
                if( null == this.agreementDifferenceList && null != version.agreement_filename )
                  this.agreementDifferenceList = this.getDifferenceList( version );
              }
            } );

            // if no different list was defined then make it an empty list
            if( null == this.agreementDifferenceList ) this.agreementDifferenceList = [];

            // put the order of the version list back to normal
            this.versionList.reverse();
          },

          determineCoapplicantDiffs: function() {
            this.versionList.forEach( version => this.setCoapplicantDiff( version ) );
          },

          setCoapplicantDiff: function( version ) {
            if( null != version ) {
              // see if there is a difference between this list and the view's list
              version.coapplicantDiff =
                version.coapplicantList.length != this.record.coapplicantList.length ||
                version.coapplicantList.some(
                  c1 => !this.record.coapplicantList.some(
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
                  this.record.coapplicantList.some( coapplicant => {
                    var found = version.coapplicantList.some( oldCoapplicant => {
                      if( oldCoapplicant.name == coapplicant.name ) {
                        // check if an existing coap has been given access to the data
                        if( !oldCoapplicant.access && coapplicant.access ) this.addingCoapplicantWithData = true;
                        return true;
                      }
                    } );

                    // check if a new coap has been given access to the data
                    if( !found && coapplicant.access ) this.addingCoapplicantWithData = true;

                    return this.addingCoapplicantWithData;
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
            this.parentModel.amendmentTypeList.en.forEach( amendmentType => { object['amendmentType' + amendmentType.id] = false; } );

            // now change any which the reqn has to true
            var response = await CnHttpFactory.instance( {
              path: basePath + '/amendment_type',
              data: {
                select: { column: [ 'id' ] },
                modifier: { order: 'id', limit: 1000 }
              }
            } ).query();

            response.data.forEach( row => { object['amendmentType' + row.id] = true; } );
          },

          toggleAmendmentTypeValue: async function( amendmentTypeId ) {
            var onErrorFn = ( error ) => { this.record[property] = !this.record[property]; };
            var path = this.parentModel.getServiceResourcePath() + '/amendment_type';
            var amendmentType = this.parentModel.amendmentTypeList.en.findByProperty( 'id', amendmentTypeId );
            var justificationColumn = 'amendment_justification_' + amendmentTypeId;

            var property = 'amendmentType' + amendmentTypeId;
            if( this.record[property] ) {
              var proceed = true;

              if( amendmentTypeId == this.parentModel.newUserAmendmentTypeId ) {
                proceed = false;

                // show a warning if changing primary applicants
                var response = await CnModalConfirmFactory.instance( {
                  title: this.translate( 'misc.pleaseNote'),
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

                  // add the local copy of the justification if it doesn't already exist
                  if( amendmentType.justificationPrompt && angular.isUndefined( this.record[justificationColumn] ) ) {
                    this.record[justificationColumn] = '';
                  }
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
                delete this.record[justificationColumn];
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
            this.versionList.forEach( version => this.setReferenceDiff( version ) );
          },

          setReferenceDiff: function( version ) {
            if( null != version ) {
              // see if there is a difference between this list and the view's list
              version.referenceDiff =
                version.referenceList.length != this.record.referenceList.length ||
                version.referenceList.some(
                  c1 => !this.record.referenceList.some(
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

          getSelectionList: async function( reqnVersionId, object ) {
            var basePath = angular.isDefined( reqnVersionId )
                         ? 'reqn_version/' + reqnVersionId
                         : this.parentModel.getServiceResourcePath()

            if( angular.isUndefined( object ) ) object = this.record;

            // set all selections to false
            object.selectionList = [];
            this.parentModel.categoryList.forEach(
              category => category.optionList.forEach(
                option => option.selectionList.forEach(
                  selection => object.selectionList[selection.id] = false
                )
              )
            );

            var [selectionResponse, commentResponse,
                 optionJustificationResponse, amendmentJustificationResponse] = await Promise.all( [
              CnHttpFactory.instance( {
                path: basePath + '/data_selection',
                data: { select: { column: [ 'data_option_id', { table: 'study_phase', column: 'code', alias: 'phase' } ] } }
              } ).query(),

              CnHttpFactory.instance( {
                path: basePath + '/reqn_version_comment',
                data: { select: { column: [ 'data_category_id', 'description' ] } }
              } ).query(),

              CnHttpFactory.instance( {
                path: basePath + '/data_justification',
                data: { select: { column: [ 'data_option_id', 'description' ] } }
              } ).query(),

              CnHttpFactory.instance( {
                path: basePath + '/amendment_justification',
                data: { select: { column: [ 'amendment_type_id', 'description' ] } }
              } ).query()
            ] );

            // set all reqn-version selections
            selectionResponse.data.forEach( selection => { object.selectionList[selection.id] = true; } );

            // define all reqn-version comments
            commentResponse.data.forEach( comment => {
              var column = 'comment_' + comment.data_category_id;
              object[column] = comment.description;
              this.backupRecord[column] = object[column];
            } );

            // define all reqn-version data-option justifications
            optionJustificationResponse.data.forEach( justification => {
              var column = 'data_justification_' + justification.data_option_id;
              object[column] = justification.description;
              this.backupRecord[column] = object[column];
            } );

            // define all reqn-version amendment justifications
            amendmentJustificationResponse.data.forEach( justification => {
              var column = 'amendment_justification_' + justification.amendment_type_id;
              object[column] = justification.description;
              this.backupRecord[column] = object[column];
            } );
          },

          isOptionSelected: function( option ) {
            return angular.isArray( this.record.selectionList ) &&
                   option.selectionList.some( selection => this.record.selectionList[selection.id] );
          },

          isCategorySelected: function( category ) {
            return category.optionList.some( option => this.isOptionSelected( option ) );
          },

          toggleSelection: async function( category, option, selection ) {
            // when selecting the data-option first check to see if the category or data option have a condition
            var proceed = true;
            if( !this.record.selectionList[selection.id] ) {
              var column = 'condition_' + this.record.lang;

              // create a modal for the category condition, if required
              var categoryModal = null;
              if( null != category[column] ) {
                // only show the condition if none of the options is already selected
                if( !this.isCategorySelected( category ) ) {
                  categoryModal = CnModalConfirmFactory.instance( {
                    title: this.translate( 'misc.pleaseConfirm' ),
                    noText: this.translate( 'misc.no' ),
                    yesText: this.translate( 'misc.yes' ),
                    message: category[column]
                  } );
                }
              }

              // create a modal for the option condition, if required
              var optionModal = null != option[column]
                              ?  CnModalConfirmFactory.instance( {
                                   title: this.translate( 'misc.pleaseConfirm' ),
                                   noText: this.translate( 'misc.no' ),
                                   yesText: this.translate( 'misc.yes' ),
                                   message: option[column]
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
              var justificationColumn = 'data_justification_' + option.id;

              // toggle the option
              this.record.selectionList[selection.id] = !this.record.selectionList[selection.id];

              try {
                var data = {};
                if( this.record.selectionList[selection.id] ) data.add = selection.id;
                else data.remove = selection.id;
                await CnHttpFactory.instance( {
                  path: this.parentModel.getServiceResourcePath() + '/data_selection',
                  data: data,
                  onError: ( error ) => { this.record.selectionList[selection.id] = !this.record.selectionList[selection.id]; }
                } ).post();

                if( this.record.selectionList[selection.id] ) {
                  // add the local copy of the justification if it doesn't already exist
                  if( option.justification && angular.isUndefined( this.record[justificationColumn] ) )
                    this.record[justificationColumn] = '';
                } else {
                  // delete the local copy of the justification if there are no data options left
                  if( option.justification && angular.isDefined( this.record[justificationColumn] ) ) {
                    var stillSelected = category.optionList.some(
                      option => option.selectionList.some(
                        selection => this.record.selectionList[selection.id]
                      )
                    );

                    if( !stillSelected ) delete this.record[justificationColumn];
                  }
                }
              } catch( error ) {
                // handled by onError above
              }
            }
          },

          viewData: function() {
            if( null == this.record.data_expiry_date ) {
              CnModalMessageFactory.instance( {
                title: this.translate( 'misc.pleaseNote' ),
                message: this.translate( 'misc.dataExpired' ),
                closeText: this.translate( 'misc.close' ),
                html: true
              } ).show();
            } else {
              $window.open(
                CnSession.application.studyDataUrl + '/' + this.record.data_directory,
                'studyData' + this.record.reqn_id
              );
            }
          },

          canViewData: function() {
            // administrators and applicants can view data when in the active stage
            var stage_type = this.record.stage_type ? this.record.stage_type : '';
            return this.parentModel.isRole( 'administrator', 'applicant', 'designate' ) && 'Active' == stage_type;
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
                          version.differences[part][section][property].forEach( change => {
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
              noText: this.parentModel.isRole( 'applicant', 'designate' ) ? this.translate( 'misc.no' ) : 'No',
              yesText: this.parentModel.isRole( 'applicant', 'designate' ) ? this.translate( 'misc.yes' ) : 'Yes',
              message: this.translate( 'misc.submitWarning' )
            } ).show();

            if( response ) {
              // make sure that certain properties have been defined, one tab at a time
              var requiredTabList = {
                '1a': [
                  'applicant_position', 'applicant_affiliation', 'applicant_address',
                  'applicant_country_id', 'applicant_phone'
                ],
                '1b': [ 'coapplicant_agreement_filename' ],
                '1c': [ 'start_date', 'duration' ],
                '1d': [ 'title', 'keywords', 'lay_summary', 'background', 'objectives', 'methodology', 'analysis' ],
                '1e': [ 'peer_review', 'funding', 'funding_filename', 'funding_agency', 'grant_number' ],
                '1f': this.record.has_ethics_approval_list ? [ 'ethics' ] : [ 'ethics', 'ethics_filename' ],
                '2cohort': [ 'tracking', 'comprehensive', 'longitudinal', 'last_identifier' ]
              };

              // Now add the data option justifications
              // We have to do this dynamically because they only exist if their parent data option is selected and
              // have the "justification" property
              for( var property in this.record ) {
                if( null != property.match( /^data_justification_/ ) ) {
                  // find which tab the justification belongs to
                  var match = property.match( /^data_justification_([0-9]+)$/ );
                  var obj = this.parentModel.getCategoryAndOption( match[1] );
                  if( obj.option.justification ) {
                    var tab = '2' + obj.category.charCode;

                    // add it to the required tab list
                    if( angular.isUndefined( requiredTabList[tab] ) ) requiredTabList[tab] = [];
                    requiredTabList[tab].push( property );
                  }
                }
              }

              // Now add the amendment justifications
              // We have to do this dynamically because they only exist if their parent amendment type is selected and
              // have the "justification_prompt_*" properties
              for( var property in this.record ) {
                if( null != property.match( /^amendment_justification_/ ) ) {
                  // add it to the required tab list
                  var tab = '1a';
                  if( angular.isUndefined( requiredTabList[tab] ) ) requiredTabList[tab] = [];
                  requiredTabList[tab].push( property );
                }
              }

              var error = null;
              var errorTab = null;

              await Promise.all( this.fileList.map( file => file.updateFileSize() ) );

              for( var tab in requiredTabList ) {
                var firstProperty = null;
                requiredTabList[tab].filter( property => {
                  if( '1a' == tab ) {
                    // only check the country if show_prices is on
                    return 'applicant_country_id' != property || this.record.show_prices;
                  } else if( '1b' == tab ) {
                    // only check 1b properties if there is a new coapplication with access to data
                    return this.addingCoapplicantWithData;
                  } else if( '1e' == tab ) {
                    // only check 1e funding properties if funding=yes
                    return !['peer_review', 'funding'].includes( property ) ? 'yes' == this.record.funding : true;
                  } else if( 'ethics_filename' == property ) {
                    // only check the ethics filename if ethics=yes or exempt
                    return ['yes', 'exempt'].includes( this.record.ethics );
                  } else if( 'last_identifier' == property ) {
                    // only check the last_identifier if longitidunal=yes (it's a boolean var)
                    return this.record.longitudinal;
                  }

                  // check everything else
                  return true;
                } ).forEach( property => {
                  var missing = false;
                  if( property.match( '_filename' ) ) {
                    // check for the file size
                    var fileDetails = this.fileList.findByProperty( 'key', property );
                    missing = !angular.isObject( fileDetails ) || 0 == fileDetails.size;
                  } else {
                    // check for the property's value
                    missing = null === this.record[property] || '' === this.record[property];
                  }

                  if( missing ) {
                    var element = cenozo.getFormElement( property );
                    element.$error.required = true;
                    cenozo.updateFormElement( element, true );
                    if( null == errorTab ) errorTab = tab;
                    if( null == error ) error = {
                      title: this.translate( 'misc.missingFieldTitle' ),
                      message: this.translate( 'misc.missingFieldMessage' ),
                      error: true
                    };
                  }
                } );
              }

              if( '.' != this.record.amendment ) {
                // reset the no-amendment-types indicator
                this.noAmendmentTypes = false;

                // for amendments make sure that at least one amendment type has been selected
                if( !this.parentModel.amendmentTypeList.en.some( at => this.record['amendmentType' + at.id] ) ) {
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

                // make sure that all selected amendment types have a justification
                this.parentModel.amendmentTypeList.en
                  .filter( amendmentType => amendmentType.justificationPrompt )
                  .forEach( amendmentType => {
                    // search for checked amendments with no justification
                    var columnName = 'amendment_justification_' + amendmentType.id;
                    if( this.record['amendmentType' + amendmentType.id] &&
                        !this.record[columnName] ) {
                      var element = cenozo.getFormElement( columnName );
                      element.$error.required = true;
                      if( null == errorTab ) errorTab = 'amendment';
                      if( null == error ) error = {
                        title: this.translate( 'misc.missingFieldTitle' ),
                        message: this.translate( 'misc.missingFieldMessage' ),
                        error: true
                      };
                    }
                } );
              }

              if( null != error ) {
                // if there was an error then display it now
                if( this.parentModel.isRole( 'applicant', 'designate' ) ) error.closeText = this.translate( 'misc.close' );
                await CnModalMessageFactory.instance( error ).show();

                if( 'amendment' == errorTab ) {
                  this.setFormTab( 0, 'amendment', false );
                } else {
                  if( 1 == errorTab.substr( 0, 1 ) ) {
                    this.setFormTab( 0, 'part1', false );
                    await this.setFormTab( 1, errorTab.substr( 1 ) );
                  } else {
                    this.setFormTab( 0, 'part2', false );
                    await this.setFormTab( 2, errorTab.substr( 1 ) );
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
                            data: {
                              agreement_filename: response.file.getFilename(),
                              agreement_start_date: response.startDate,
                              agreement_end_date: response.endDate
                            }
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
                              data: {
                                agreement_filename: response.file.getFilename(),
                                agreement_start_date: response.startDate,
                                agreement_end_date: response.endDate
                              }
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
                        await CnHttpFactory.instance( {
                          path: parent.subject + '/' + parent.identifier + "?action=submit" + ( noReview ? '&review=0' : '' ),
                          onError: async ( error ) => {
                            if( 409 == error.status ) {
                              await CnModalMessageFactory.instance( {
                                title: this.translate( 'misc.invalidStartDateTitle' ),
                                message: this.translate( 'misc.invalidStartDateMessage' ),
                                closeText: this.translate( 'misc.close' ),
                                error: true
                              } ).show();

                              var element = cenozo.getFormElement( 'start_date' );
                              element.$error.custom = this.translate( 'misc.invalidStartDateTitle' );
                              cenozo.updateFormElement( element, true );
                              this.setFormTab( 0, 'part1', false );
                              await this.setFormTab( 1, 'c' );
                            } else CnModalMessageFactory.httpError( error );
                          }
                        } ).patch();

                        var code = CnSession.user.id == this.record.trainee_user_id ?
                          ( 'deferred' == this.record.state ? 'traineeResubmit' : 'traineeSubmit' ) :
                          CnSession.user.id == this.record.designate_user_id ?
                          ( 'deferred' == this.record.state ? 'designateResubmit' : 'designateSubmit' ) :
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

                        if( this.parentModel.isRole( 'applicant', 'designate' ) ) {
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

        async function init( object ) {
          await object.deferred.promise;
          await object.coapplicantModel.metadata.getPromise(); // needed to get the coapplicant's metadata
          await object.referenceModel.metadata.getPromise(); // needed to get the reference's metadata
          if( angular.isDefined( object.stageModel ) ) object.stageModel.listModel.heading = 'Stage History';
        }

        init( this );
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
          categoryList: [],

          getCategoryAndOption: function( optionId ) {
            // get the category and data option objects
            var obj = { category: null, option: null };
            this.categoryList.some( cat => {
              var option = cat.optionList.findByProperty( 'id', optionId );
              if( null != option ) {
                obj.category = cat;
                obj.option = option;
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
            if( this.isRole( 'applicant', 'designate' ) ) {
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
            var trail = [];

            if( this.isRole( 'applicant', 'designate' ) ) {
              trail = [
                { title: 'Requisition' },
                { title: this.viewModel.record.identifier }
              ];
            } else {
              var self = this;
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
            await this.$$getMetadata();

            var promiseList = [
              CnHttpFactory.instance( { path: 'reqn_version' } ).head(),
              CnHttpFactory.instance( { path: 'amendment_type', data: { modifier: { order: 'rank' } } } ).query()
            ];

            if( 'root' == this.type ) {
              promiseList = promiseList.concat( [
                CnHttpFactory.instance( {
                  path: 'data_category',
                  data: {
                    select: { column: [
                      'id',
                      'rank',
                      'comment',
                      'study_phase_list',
                      'name_en', 'name_fr',
                      'condition_en', 'condition_fr',
                      'note_en', 'note_fr'
                    ] },
                    modifier: {
                      order: 'rank', limit: 1000
                    }
                  }
                } ).query(),

                CnHttpFactory.instance( {
                  path: 'data_option',
                  data: {
                    select: { column: [
                      'id',
                      'data_category_id',
                      'justification',
                      'name_en', 'name_fr',
                      'condition_en', 'condition_fr',
                      'note_en', 'note_fr'
                    ] },
                    modifier: {
                      order: [ 'data_category.rank', 'data_option.rank' ],
                      limit: 1000
                    }
                  }
                } ).query(),

                CnHttpFactory.instance( {
                  path: 'data_selection',
                  data: {
                    select: { column: [
                      'id',
                      'data_option_id',
                      'cost',
                      'cost_combined',
                      'unavailable_en', 'unavailable_fr',
                      { table: 'study_phase', column: 'code', alias: 'study_phase_code' },
                      { table: 'data_category', column: 'id', alias: 'data_category_id' }
                    ] },
                    modifier: {
                      order: [ 'data_category.rank', 'data_option.rank', 'study_phase.rank' ],
                      limit: 1000
                    }
                  }
                } ).query(),

                CnHttpFactory.instance( {
                  path: 'data_detail',
                  data: {
                    select: { column: [
                      'id',
                      'data_selection_id',
                      'name_en', 'name_fr',
                      'note_en', 'note_fr',
                      { table: 'data_category', column: 'id', alias: 'data_category_id' },
                      { table: 'data_option', column: 'id', alias: 'data_option_id' }
                    ] },
                    modifier: {
                      order: [ 'data_option.id', 'study_phase.rank', 'data_detail.rank' ],
                      limit: 1000
                    }
                  }
                } ).query()
              ] );
            }

            var [reqnVersionResponse, amendmentTypeResponse, categoryResponse,
                 optionResponse, selectionResponse, detailResponse] = await Promise.all( promiseList );

            var columnList = angular.fromJson( reqnVersionResponse.headers( 'Columns' ) );
            for( var column in columnList ) {
              columnList[column].required = '1' == columnList[column].required;
              if( 'enum' == columnList[column].data_type ) { // parse out the enum values
                columnList[column].enumList = [];
                cenozo.parseEnumList( columnList[column] ).forEach( item => {
                  columnList[column].enumList.push( { value: item, name: item } );
                } );
              }
              if( angular.isUndefined( this.metadata.columnList[column] ) ) this.metadata.columnList[column] = {};
              angular.extend( this.metadata.columnList[column], columnList[column] );
            }

            this.amendmentTypeList = { en: [], fr: [] };
            amendmentTypeResponse.data.forEach( item => {
              if( item.new_user ) this.newUserAmendmentTypeId = item.id;

              this.amendmentTypeList.en.push( {
                id: item.id,
                newUser: item.new_user,
                name: item.reason_en,
                justificationPrompt: item.justification_prompt_en
              } );
              this.amendmentTypeList.fr.push( {
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
              // get the index that we'll be inserting categories in the tab section list
              var insertIndex = null;
              this.viewModel.tabSectionList.some( ( tabSection, index ) => {
                if( 'part2' == tabSection[0] && 'cohort' == tabSection[2] ) {
                  insertIndex = index + 1;
                  return true;
                }
              } );

              // build the categories
              this.categoryList = categoryResponse.data;
              this.categoryList.forEach( category => {
                var studyPhaseList = category.study_phase_list.split( ';' ).map( str => str.split( '`' ) );

                angular.extend( category, {
                  studyPhaseList: studyPhaseList.reduce( ( list, item ) => {
                    list.push( 1 < studyPhaseList.length ? item : [item[0]] );
                    return list;
                  }, [] ),
                  // determine the character code based on the rank
                  charCode: String.fromCharCode( 'a'.charCodeAt(0) + category.rank - 1 ),
                  name: { en: category.name_en, fr: category.name_fr },
                  note: { en: category.note_en, fr: category.note_fr },
                  optionList: []
                } );

                this.viewModel.tabSectionList.splice( insertIndex, 0, ['part2', null, category.charCode] );
                insertIndex++;

                // remove stuff we no longer need
                delete category.study_phase_list;
                delete category.name_en;
                delete category.name_fr;
                delete category.note_en;
                delete category.note_fr;
              } );

              // add options to all categories
              var category = null;
              optionResponse.data.forEach( option => {
                if( null == category || option.data_category_id != category.id )
                  category = this.categoryList.findByProperty( 'id', option.data_category_id );

                angular.extend( option, {
                  name: { en: option.name_en, fr: option.name_fr },
                  note: { en: option.note_en, fr: option.note_fr },
                  selectionList: []
                } );

                category.optionList.push( option );

                // remove stuff we no longer need
                delete option.data_category_id;
                delete option.name_en;
                delete option.name_fr;
                delete option.note_en;
                delete option.note_fr;
              } );

              // add selections to all options
              var category = null;
              var option = null;
              selectionResponse.data.forEach( selection => {
                if( null == category || selection.data_category_id != category.id )
                  category = this.categoryList.findByProperty( 'id', selection.data_category_id );
                if( null == option || selection.data_option_id != option.id )
                  option = category.optionList.findByProperty( 'id', selection.data_option_id );

                angular.extend( selection, {
                  studyPhaseCode: selection.study_phase_code,
                  unavailable: {
                    en: angular.isDefined( selection.unavailable_en ) ? selection.unavailable_en : null,
                    fr: angular.isDefined( selection.unavailable_fr ) ? selection.unavailable_fr : null
                  },
                  detailList: [],
                  cost: {
                    value: selection.cost,
                    en: 0 < selection.cost ? '$' + selection.cost : '',
                    fr: 0 < selection.cost ? selection.cost + ' $' : ''
                  },
                  costCombined: selection.cost_combined
                } );

                option.selectionList.push( selection );

                // remove stuff we no longer need
                delete selection.study_phase_code;
                delete selection.data_category_id;
                delete selection.data_option_id;
                delete option.cost_combined;
                delete selection.unavailable_en;
                delete selection.unavailable_fr;
              } );

              // add details to all selections
              var category = null;
              var option = null;
              var selection = null;
              detailResponse.data.forEach( detail => {
                if( null == category || detail.data_category_id != category.id )
                  category = this.categoryList.findByProperty( 'id', detail.data_category_id );
                if( null == option || detail.data_option_id != option.id )
                  option = category.optionList.findByProperty( 'id', detail.data_option_id );
                if( null == selection || detail.data_selection_id != selection.id )
                  var selection = option.selectionList.findByProperty( 'id', detail.data_selection_id );

                angular.extend( detail, {
                  name: { en: detail.name_en, fr: detail.name_fr },
                  note: { en: detail.note_en, fr: detail.note_fr }
                } );

                selection.detailList.push( detail );

                // remove stuff we no longer need
                delete detail.data_category_id;
                delete detail.data_option_id;
                delete detail.name_en;
                delete detail.name_fr;
                delete detail.note_en;
                delete detail.note_fr;
              } );
            }
          }
        } );

        // make the input lists from all groups more accessible
        module.inputGroupList.forEach( group => Object.assign( this.inputList, group.inputList ) );
      };

      return {
        root: new object( 'root' ),
        lite: new object( 'lite' ),
        instance: function() { return new object(); }
      };
    }
  ] );

} } );
