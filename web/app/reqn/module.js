define( [ 'coapplicant', 'reference' ].reduce( function( list, name ) {
  return list.concat( cenozoApp.module( name ).getRequiredFiles() );
}, [] ), function() {
  'use strict';

  try { var module = cenozoApp.module( 'reqn', true ); } catch( err ) { console.warn( err ); return; }

  var coapplicantModule = cenozoApp.module( 'coapplicant' );
  var referenceModule = cenozoApp.module( 'reference' );

  angular.extend( module, {
    identifier: { column: 'identifier' },
    name: {
      singular: 'requisition',
      plural: 'requisitions',
      possessive: 'requisition\'s'
    },
    columnList: {
      identifier: {
        title: 'Identifier'
      },
      user_full_name: {
        title: 'Owner',
      },
      applicant_name: {
        column: 'reqn_version.applicant_name',
        title: 'Applicant',
      },
      deadline: {
        column: 'deadline.name',
        title: 'Deadline'
      },
      status: {
        column: 'stage_type.status',
        title: 'Status',
        isIncluded: function( $state, model ) { return model.isApplicant(); }
      },
      state: {
        title: 'On Hold',
        type: 'string',
        isIncluded: function( $state, model ) { return !model.isApplicant(); },
        help: 'The reason the requisition is on hold (empty if the requisition hasn\'t been held up)'
      },
      stage_type: {
        column: 'stage_type.name',
        title: 'Stage',
        type: 'string',
        isIncluded: function( $state, model ) { return !model.isApplicant(); }
      }
    },
    defaultOrder: {
      column: 'identifier',
      reverse: false
    }
  } );

  module.addInputGroup( '', {
    identifier: {
      title: 'Identifier',
      type: 'string'
    },
    language_id: {
      title: 'Language',
      type: 'enum',
      exclude: true // modified in the model
    },
    stage_type: {
      title: 'Current Stage',
      column: 'stage_type.name',
      type: 'string',
      constant: true,
      exclude: true // modified in the model
    },
    state: {
      title: 'State',
      type: 'enum',
      constant: true,
      exclude: true // modified in the model
    },
    data_available: {
      title: 'Study Data Available',
      type: 'string',
      constant: true,
      exclude: true // modified in the model
    },
    title: {
      column: 'reqn_version.title',
      title: 'Title',
      type: 'string',
      constant: true,
      exclude: true // modified in the model
    },
    applicant_name: {
      column: 'reqn_version.applicant_name',
      title: 'Applicant',
      type: 'string',
      constant: true,
      exclude: true // modified in the model
    },
    lay_summary: {
      column: 'reqn_version.lay_summary',
      title: 'Lay Summary',
      type: 'text',
      constant: true,
      exclude: true // modified in the model
    },
    agreement_filename: {
      column: 'reqn_version.agreement_filename',
      title: 'Agreement File',
      type: 'file',
      exclude: true // modified in the model
    },
    instruction_filename: {
      column: 'reqn_version.instruction_filename',
      title: 'Instruction File',
      type: 'file',
      exclude: true // modified in the model
    },

    // the following are for the form and will not appear in the view
    reqn_version_id: { column: 'reqn_version.id', type: 'string', exclude: true },
    data_directory: { type: 'string', exclude: true },
    phase: { column: 'stage_type.phase', type: 'string', exclude: true },
    status: { column: 'stage_type.status', type: 'string', exclude: true },
    decision: { column: 'stage_type.decision', type: 'boolean', exclude: true },
    language: { type: 'string', column: 'language.code', exclude: true },
    deadline: { type: 'date', column: 'deadline.date', exclude: true },
    applicant_position: { column: 'reqn_version.applicant_position', type: 'string', exclude: true },
    applicant_affiliation: { column: 'reqn_version.applicant_affiliation', type: 'string', exclude: true },
    applicant_address: { column: 'reqn_version.applicant_address', type: 'string', exclude: true },
    applicant_phone: { column: 'reqn_version.applicant_phone', type: 'string', exclude: true },
    applicant_email: { column: 'reqn_version.applicant_email', type: 'string', format: 'email', exclude: true },
    graduate_name: { column: 'reqn_version.graduate_name', type: 'string', exclude: true },
    graduate_program: { column: 'reqn_version.graduate_program', type: 'string', exclude: true },
    graduate_institution: { column: 'reqn_version.graduate_institution', type: 'string', exclude: true },
    graduate_address: { column: 'reqn_version.graduate_address', type: 'string', exclude: true },
    graduate_phone: { column: 'reqn_version.graduate_phone', type: 'string', exclude: true },
    graduate_email: { column: 'reqn_version.graduate_email', type: 'string', format: 'email', exclude: true },
    start_date: { column: 'reqn_version.start_date', type: 'date', exclude: true },
    duration: { column: 'reqn_version.duration', type: 'string', exclude: true },
    keywords: { column: 'reqn_version.keywords', type: 'string', exclude: true },
    background: { column: 'reqn_version.background', type: 'text', exclude: true },
    objectives: { column: 'reqn_version.objectives', type: 'text', exclude: true },
    methodology: { column: 'reqn_version.methodology', type: 'text', exclude: true },
    analysis: { column: 'reqn_version.analysis', type: 'text', exclude: true },
    funding: { column: 'reqn_version.funding', type: 'enum', exclude: true },
    funding_agency: { column: 'reqn_version.funding_agency', type: 'string', exclude: true },
    grant_number: { column: 'reqn_version.grant_number', type: 'string', exclude: true },
    ethics: { column: 'reqn_version.ethics', type: 'boolean', exclude: true },
    ethics_date: { column: 'reqn_version.ethics_date', type: 'date', exclude: true },
    waiver: { column: 'reqn_version.waiver', type: 'enum', exclude: true },
    tracking: { column: 'reqn_version.tracking', type: 'boolean', exclude: true },
    comprehensive: { column: 'reqn_version.comprehensive', type: 'boolean', exclude: true },
    part2_a_comment: { column: 'reqn_version.part2_a_comment', type: 'text', exclude: true },
    part2_b_comment: { column: 'reqn_version.part2_b_comment', type: 'text', exclude: true },
    part2_c_comment: { column: 'reqn_version.part2_c_comment', type: 'text', exclude: true },
    part2_d_comment: { column: 'reqn_version.part2_d_comment', type: 'text', exclude: true },
    part2_e_comment: { column: 'reqn_version.part2_e_comment', type: 'text', exclude: true },
    part2_f_comment: { column: 'reqn_version.part2_f_comment', type: 'text', exclude: true }
  } );

  module.addInputGroup( 'Decision and Deferral Notes', {
    decision_notice: {
      title: 'Notice of Decision',
      type: 'text'
    },
    deferral_note_part1_a1: {
      title: 'Part1: A1',
      type: 'text'
    },
    deferral_note_part1_a2: {
      title: 'Part1: A2',
      type: 'text'
    },
    deferral_note_part1_a3: {
      title: 'Part1: A3',
      type: 'text'
    },
    deferral_note_part1_a4: {
      title: 'Part1: A4',
      type: 'text'
    },
    deferral_note_part1_a5: {
      title: 'Part1: A5',
      type: 'text'
    },
    deferral_note_part1_a6: {
      title: 'Part1: A6',
      type: 'text'
    },
    deferral_note_part2_a: {
      title: 'Part2: Questionnaires',
      type: 'text'
    },
    deferral_note_part2_b: {
      title: 'Part2: Physical Assessment',
      type: 'text'
    },
    deferral_note_part2_c: {
      title: 'Part2: Biomarkers',
      type: 'text'
    },
    deferral_note_part2_d: {
      title: 'Part2: Genomics',
      type: 'text'
    },
    deferral_note_part2_e: {
      title: 'Part2: Linked Data',
      type: 'text'
    },
    deferral_note_part2_f: {
      title: 'Part2: Additional Data',
      type: 'text'
    }
  } );

  module.addExtraOperation( 'view', {
    title: 'View Form',
    operation: function( $state, model ) {
      $state.go( 'reqn.form', { identifier: model.viewModel.record.getIdentifier() } );
    }
  } );

  module.addExtraOperation( 'view', {
    title: 'Reset Study Data',
    isIncluded: function( $state, model ) { return model.viewModel.canResetData(); },
    operation: function( $state, model ) { model.viewModel.resetData(); }
  } );

  module.addExtraOperation( 'view', {
    title: 'Defer to Applicant',
    classes: 'btn-warning',
    isIncluded: function( $state, model ) { return model.viewModel.show( 'defer' ); },
    isDisabled: function( $state, model ) { return !model.viewModel.enabled( 'defer' ); },
    operation: function( $state, model ) { model.viewModel.defer(); }
  } );

  module.addExtraOperation( 'view', {
    title: 'Abandon',
    classes: 'btn-warning',
    isIncluded: function( $state, model ) { return model.viewModel.show( 'abandon' ); },
    isDisabled: function( $state, model ) { return !model.viewModel.enabled( 'abandon' ); },
    operation: function( $state, model ) { model.viewModel.abandon(); }
  } );

  module.addExtraOperation( 'view', {
    title: 'Re-activate',
    classes: 'btn-warning',
    isIncluded: function( $state, model ) { return model.viewModel.show( 'reactivate' ); },
    isDisabled: function( $state, model ) { return !model.viewModel.enabled( 'reactivate' ); },
    operation: function( $state, model ) { model.viewModel.reactivate(); }
  } );

  module.addExtraOperation( 'view', {
    title: 'Proceed',
    classes: 'btn-success',
    isIncluded: function( $state, model ) { return model.viewModel.show( 'proceed' ); },
    isDisabled: function( $state, model ) { return !model.viewModel.enabled( 'proceed' ); },
    operation: function( $state, model ) { model.viewModel.proceed(); }
  } );

  module.addExtraOperation( 'view', {
    title: 'Reject',
    classes: 'btn-danger',
    isIncluded: function( $state, model ) { return model.viewModel.show( 'reject' ); },
    isDisabled: function( $state, model ) { return !model.viewModel.enabled( 'reject' ); },
    operation: function( $state, model ) { model.viewModel.reject(); }
  } );

  module.addExtraOperationGroup( 'view', {
    title: 'Download',
    operations: [ {
      title: 'Application',
      operation: function( $state, model ) { model.viewModel.downloadReqn(); }
    }, {
      title: 'Data Checklist',
      operation: function( $state, model ) { model.viewModel.downloadDataChecklist(); }
    }, {
      title: 'Reviews',
      operation: function( $state, model ) { model.viewModel.downloadReviews(); }
    }, {
      title: 'Final Report',
      operation: function( $state, model ) { model.viewModel.downloadFinalReport(); },
      isIncluded: function( $state, model ) { return 0 <= ['Report Required', 'Complete'].indexOf( model.viewModel.record.stage_type ); }
    }, {
      title: 'Study Data',
      operation: function( $state, model ) { model.viewModel.viewData(); },
      isIncluded: function( $state, model ) { return model.viewModel.canViewData(); }
    } ]
  } );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnReqnDeferralNote',
    function() {
      return {
        templateUrl: module.getFileUrl( 'deferral-note.tpl.html' ),
        restrict: 'E',
        scope: { note: '@' },
        controller: [ '$scope', function( $scope ) {
          $scope.directive = 'cnReqnDeferralNote';
        } ]
      };
    }
  );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnReqnForm', [
    'CnReqnModelFactory', 'cnRecordViewDirective', 'CnSession', '$transitions', '$q',
    function( CnReqnModelFactory, cnRecordViewDirective, CnSession, $transitions, $q ) {
      // used to piggy-back on the basic view controller's functionality
      var cnRecordView = cnRecordViewDirective[0];

      return {
        templateUrl: module.getFileUrl( 'form.tpl.html' ),
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
            // setup the breadcrumbtrail
            CnSession.setBreadcrumbTrail(
              [ {
                title: scope.model.module.name.plural.ucWords(),
                go: function() { scope.model.transitionToListState(); }
              }, {
                title: scope.model.viewModel.record.identifier,
                go: function() { scope.model.transitionToViewState( scope.model.viewModel.record ); }
              } ]
            );

            // display the decision notice (the function will determine whether this should be done or not)
            scope.model.viewModel.displayDecisionNotice();
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
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnReqnModelFactory.root;
          if( angular.isUndefined( $scope.liteModel ) ) $scope.liteModel = CnReqnModelFactory.lite;
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

            return $scope.t( 'heading' ) + ' - ' + $scope.model.viewModel.record.identifier + ' (' + status + ')';
          };

          $scope.addCoapplicant = function() {
            if( $scope.model.viewModel.coapplicantModel.getAddEnabled() ) {
              var form = cenozo.getScopeByQuerySelector( '#part1a2Form' ).part1a2Form;

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
                cenozo.forEachFormElement( 'part1a2Form', function( element ) { element.$dirty = true; } );
              } else {
                $scope.isAddingCoapplicant = true;
                coapplicantAddModel.onAdd( $scope.coapplicantRecord ).then( function( response ) {
                  form.$setPristine();
                  return $q.all( [
                    coapplicantAddModel.onNew( $scope.coapplicantRecord ),
                    $scope.model.viewModel.getCoapplicantList()
                  ] );
                } ).finally( function() { $scope.isAddingCoapplicant = false; } );
              }
            }
          };

          $scope.removeCoapplicant = function( id ) {
            if( $scope.model.viewModel.coapplicantModel.getDeleteEnabled() ) {
              if( 0 > $scope.isDeletingCoapplicant.indexOf( id ) ) $scope.isDeletingCoapplicant.push( id );
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
              var form = cenozo.getScopeByQuerySelector( '#part1a4Form' ).part1a4Form;
              if( !form.$valid ) {
                // dirty all inputs so we can find the problem
                cenozo.forEachFormElement( 'part1a4Form', function( element ) { element.$dirty = true; } );
              } else {
                $scope.isAddingReference = true;
                referenceAddModel.onAdd( $scope.referenceRecord ).then( function( response ) {
                  form.$setPristine();
                  return $q.all( [
                    referenceAddModel.onNew( $scope.referenceRecord ),
                    $scope.model.viewModel.getReferenceList()
                  ] );
                } ).finally( function() { $scope.isAddingReference = false; } );
              }
            }
          };

          $scope.removeReference = function( id ) {
            if( $scope.model.viewModel.referenceModel.getDeleteEnabled() ) {
              if( 0 > $scope.isDeletingReference.indexOf( id ) ) $scope.isDeletingReference.push( id );
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
  cenozo.providers.directive( 'cnReqnView', [
    'CnReqnModelFactory',
    function( CnReqnModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'view.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnReqnModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnReqnList', [
    'CnReqnModelFactory',
    function( CnReqnModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'list.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnReqnModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnReqnListFactory', [
    'CnBaseListFactory',
    function( CnBaseListFactory ) {
      var object = function( parentModel ) { CnBaseListFactory.construct( this, parentModel ); };
      return { instance: function( parentModel ) { return new object( parentModel ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnReqnViewFactory', [
    'CnCoapplicantModelFactory', 'CnReferenceModelFactory', 'CnBaseViewFactory',
    'CnSession', 'CnHttpFactory', 'CnModalMessageFactory', 'CnModalConfirmFactory', 'CnModalTextFactory', '$q', '$state', '$window',
    function( CnCoapplicantModelFactory, CnReferenceModelFactory, CnBaseViewFactory,
              CnSession, CnHttpFactory, CnModalMessageFactory, CnModalConfirmFactory, CnModalTextFactory, $q, $state, $window ) {
      var object = function( parentModel, root ) {
        var self = this;
        CnBaseViewFactory.construct( this, parentModel, root );

        this.deferred.promise.then( function() {
          if( angular.isDefined( self.stageModel ) ) self.stageModel.listModel.heading = 'Stage History';
        } );

        this.configureFileInput( 'funding_filename' );
        this.configureFileInput( 'ethics_filename' );
        this.configureFileInput( 'agreement_filename' );
        this.configureFileInput( 'instruction_filename' );

        angular.extend( this, {
          resetData: function() {
            CnHttpFactory.instance( {
              path: self.parentModel.getServiceResourcePath() + '?action=reset_data'
            } ).patch().then( function() {
              self.onView();
              CnModalMessageFactory.instance( {
                title: 'Study Data Reset',
                message: 'This ' + self.parentModel.module.name.possessive +
                  ' study data has been made available and will automatically expire in ' +
                  CnSession.application.studyDataExpiry + ' days.'
              } ).show();
            } );
          },
          canResetData: function() {
            // administrators and applicants can view data when in the active stage
            var stage_type = this.record.stage_type ? this.record.stage_type : '';
            return 'administrator' == CnSession.role.name && 'Active' == stage_type;
          },
          viewData: function() {
            $window.open( CnSession.application.studyDataUrl + '/' + self.record.data_directory, 'studyData' + self.record.id );
          },
          canViewData: function() {
            // administrators and applicants can view data when in the active stage
            var stage_type = this.record.stage_type ? this.record.stage_type : '';
            return 0 <= ['administrator','applicant'].indexOf( CnSession.role.name ) && 'Active' == stage_type;
          },
          onView: function( force ) {
            // we need to do some extra work when looking at the reqn form
            if( 'reqn' == this.parentModel.getSubjectFromState() && 'form' == this.parentModel.getActionFromState() ) {
              // reset tab values
              this.setTab( 0, this.parentModel.getQueryParameter( 't0' ), false );
              this.setTab( 1, this.parentModel.getQueryParameter( 't1' ), false );
              this.setTab( 2, this.parentModel.getQueryParameter( 't2' ), false );

              return this.$$onView( force ).then( function() {
                // define the earliest date that the reqn may start
                self.minStartDate = moment( self.record.deadline ).add( CnSession.application.startDateDelay, 'months' );

                if( 'lite' != self.parentModel.type ) {
                  return $q.all( [
                    self.getCoapplicantList(),
                    self.getReferenceList(),
                    self.getDataOptionValueList()
                  ] );
                }
              } );
            }

            // if we are a reviewer assigned to this reqn and haven't completed our review then show a reminder
            if( 'reviewer' == CnSession.role.name ) {
              CnHttpFactory.instance( {
                path: this.parentModel.getServiceResourcePath() + '/review',
                data: { modifier: { where: { column: 'recommendation_type_id', operator: '=', value: null } } }
              } ).count().then( function( response ) {
                if( 0 < parseInt( response.headers( 'Total' ) ) ) {
                  CnModalMessageFactory.instance( {
                    title: 'Outstanding Review',
                    message: 'Please note: this ' + self.parentModel.module.name.singular +
                      ' has an outstanding review which you must complete before it can proceed with the review process.'
                  } ).show();
                }
              } );
            }

            return this.$$onView( force ).then( function() {
              var mainInputGroup = self.parentModel.module.inputGroupList.findByProperty( 'title', '' );

              // show the agreement and instruction files if we're past the review stage
              mainInputGroup.inputList.agreement_filename.exclude = 0 > ['active','complete'].indexOf( self.record.phase );
              mainInputGroup.inputList.instruction_filename.exclude = 0 > ['active','complete'].indexOf( self.record.phase );

              // show the study data available if we're in the active phase
              mainInputGroup.inputList.data_available.exclude = 'active' != self.record.phase;
            } );
          },

          onPatch: function( data ) {
            return self.$$onPatch( data ).then( function() {
              // reload the view if we're changing the decision notice (the proceed button's enable state is affected by it)
              if( angular.isDefined( data.decision_notice ) ) return self.onView();
            } );
          },

          deferralNotesExist: function() {
            return this.record.deferral_note_part1_a1 || this.record.deferral_note_part1_a2 ||
                   this.record.deferral_note_part1_a3 || this.record.deferral_note_part1_a4 ||
                   this.record.deferral_note_part1_a5 || this.record.deferral_note_part1_a6 ||
                   this.record.deferral_note_part2_a || this.record.deferral_note_part2_b ||
                   this.record.deferral_note_part2_c || this.record.deferral_note_part2_d ||
                   this.record.deferral_note_part2_e || this.record.deferral_note_part2_f;
          },

          show: function( subject ) {
            var role = CnSession.role.name;
            var phase = this.record.phase ? this.record.phase : '';
            var state = this.record.state ? this.record.state : '';
            var stage_type = this.record.stage_type ? this.record.stage_type : '';

            if( 'submit' == subject ) {
              return ( 'applicant' == role || 'administrator' == role ) && ( 'new' == phase || 'deferred' == state );
            } else if( 'view' == subject ) {
              return 'applicant' != role;
            } else if( 'abandon' == subject ) {
              return 0 <= ['administrator','applicant'].indexOf( role ) && 'deferred' == state && 'review' == phase;
            } else if( 'delete' == subject ) {
              return 'new' == phase;
            } else if( 'defer' == subject ) {
              return 'administrator' == role &&
                0 > ['abandoned','deferred'].indexOf( state ) &&
                0 <= ['review','active'].indexOf( phase );
            } else if( 'reactivate' == subject ) {
              return 'administrator' == role && 'abandoned' == state;
            } else if( 'report' == subject ) {
              return 0 <= ['Report Required','Complete'].indexOf( stage_type );
            } else if( 'proceed' == subject ) {
              return 0 > ['Complete','Not Approved'].indexOf( stage_type ) && (
                ( 'administrator' == role && 'new' != phase ) ||
                ( 'chair' == role && 0 <= stage_type.indexOf( 'DSAC' ) ) ||
                ( 'smt' == role && 0 <= stage_type.indexOf( 'SMT' ) )
              );
            } else if( 'reject' == subject ) {
              return 'DSAC Selection' == stage_type && 0 <= ['administrator','chair'].indexOf( role );
            } else return false;
          },

          enabled: function( subject ) {
            var state = this.record.state ? this.record.state : '';

            if( 0 <= ['abandon','defer','reactivate'].indexOf( subject ) ) {
              return true;
            } else if( 0 <= ['proceed','reject'].indexOf( subject ) ) {
              return !state && null != this.record.next_stage_type;
            } else return false;
          },

          proceed: function() {
            var message = 'Are you sure you wish to move this ' + this.parentModel.module.name.singular + ' to the "' +
              this.record.next_stage_type + '" stage?';
            if( 'administrator' == CnSession.role.name && this.deferralNotesExist() ) {
              message += '\n\nWARNING: there are deferral notes present, you may wish to remove them before proceeding.';
            }
            return CnModalConfirmFactory.instance( {
              message: message
            } ).show().then( function( response ) {
              if( response ) {
                return CnHttpFactory.instance( {
                  path: self.parentModel.getServiceResourcePath() + "?action=next_stage",
                } ).patch().then( function() {
                  self.onView();
                  if( angular.isDefined( self.reviewModel ) ) self.reviewModel.listModel.onList( true );
                  if( angular.isDefined( self.stageModel ) ) self.stageModel.listModel.onList( true );
                  if( angular.isDefined( self.notificationModel ) ) self.notificationModel.listModel.onList( true );
                } );
              }
            } );
          },

          reject: function() {
            var message = 'Are you sure you wish to reject the ' + this.parentModel.module.name.singular + '?';
            return CnModalConfirmFactory.instance( {
              message: message
            } ).show().then( function( response ) {
              if( response ) {
                return CnHttpFactory.instance( {
                  path: self.parentModel.getServiceResourcePath() + "?action=reject",
                } ).patch().then( function() {
                  self.onView();
                  if( angular.isDefined( self.reviewModel ) ) self.reviewModel.listModel.onList( true );
                  if( angular.isDefined( self.stageModel ) ) self.stageModel.listModel.onList( true );
                  if( angular.isDefined( self.notificationModel ) ) self.notificationModel.listModel.onList( true );
                } );
              }
            } );
          },

          defer: function() {
            var message = 'Are you sure you wish to defer to the applicant?  ' +
              'A notification will be sent indicating that an action is required by the applicant.'
            if( !this.deferralNotesExist() ) {
              message += '\n\nWARNING: there are currently no deferral notes to instruct the applicant why ' +
                         'their attention is required.';
            }
            return CnModalConfirmFactory.instance( {
              message: message
            } ).show().then( function( response ) {
              if( response ) {
                return CnHttpFactory.instance( {
                  path: self.parentModel.getServiceResourcePath() + "?action=defer"
                } ).patch().then( function() {
                  self.record.state = 'deferred';
                  if( angular.isDefined( self.notificationModel ) ) self.notificationModel.listModel.onList( true );
                } );
              }
            } );
          },

          reactivate: function() {
            return CnModalConfirmFactory.instance( {
              message: 'Are you sure you wish to re-activate the ' + this.parentModel.module.name.singular + '?' +
                '\n\nThe applicant will be notified that it has been re-activated and they will be able to re-submit for review.'
            } ).show().then( function( response ) {
              if( response ) {
                return CnHttpFactory.instance( {
                  path: self.parentModel.getServiceResourcePath() + "?action=reactivate"
                } ).patch().then( function() {
                  self.record.state = 'deferred';
                  if( angular.isDefined( self.notificationModel ) ) self.notificationModel.listModel.onList( true );
                } );
              }
            } );
          },

          abandon: function() {
            var message = 'applicant' == CnSession.role.name
                        ? this.translate( 'misc.abandonWarning' )
                        : 'Are you sure you wish to abandon the ' + this.parentModel.module.name.singular + '?'
                          '\n\nThe applicant will no longer have access to the ' + this.parentModel.module.name.singular +
                          ' and the review process will be discontinued. It is possible to re-activate the ' +
                          this.parentModel.module.name.singular + ' at a later time.';
            return CnModalConfirmFactory.instance( {
              title: 'applicant' == CnSession.role.name ? this.translate( 'misc.pleaseConfirm' ) : 'Please Confirm',
              noText: 'applicant' == CnSession.role.name ? this.translate( 'misc.no' ) : 'No',
              yesText: 'applicant' == CnSession.role.name ? this.translate( 'misc.yes' ) : 'Yes',
              message: message
            } ).show().then( function( response ) {
              if( response ) {
                return CnHttpFactory.instance( {
                  path: self.parentModel.getServiceResourcePath() + "?action=abandon"
                } ).patch().then( function() {
                  if( 'applicant' == CnSession.role.name ) {
                    self.transitionOnViewParent();
                  } else {
                    self.record.state = 'abandoned';
                    if( angular.isDefined( self.notificationModel ) ) self.notificationModel.listModel.onList( true );
                  }
                } );
              }
            } );
          },

          delete: function() {
            return CnModalConfirmFactory.instance( {
              title: 'applicant' == CnSession.role.name ? this.translate( 'misc.pleaseConfirm' ) : 'Please Confirm',
              noText: 'applicant' == CnSession.role.name ? this.translate( 'misc.no' ) : 'No',
              yesText: 'applicant' == CnSession.role.name ? this.translate( 'misc.yes' ) : 'Yes',
              message: this.translate( 'misc.deleteWarning' )
            } ).show().then( function( response ) {
              if( response ) {
                return CnHttpFactory.instance( { path: self.parentModel.getServiceResourcePath() } ).delete().then( function() {
                  self.transitionOnViewParent();
                } );
              }
            } );
          },

          coapplicantModel: CnCoapplicantModelFactory.instance(),
          coapplicantList: [],
          referenceModel: CnReferenceModelFactory.instance(),
          referenceList: [],
          dataOptionValueList: {},
          charCount: { lay_summary: 0, background: 0, objectives: 0, methodology: 0, analysis: 0 },
          minStartDate: null,

          translate: function( value ) {
            return cenozoApp.translate( 'reqn', value, this.record.language );
          },

          // setup language and tab state parameters
          toggleLanguage: function() {
            this.record.language = 'en' == this.record.language ? 'fr' : 'en';
            return CnHttpFactory.instance( {
              path: this.parentModel.getServiceResourcePath(),
              data: { language: this.record.language }
            } ).patch();
          },

          // the sequencial list of all tabs where every item has an array of the three indexed tab values
          tab: [],
          tabSectionList: [
            [ 'instructions', null, null ],
            [ 'part1', 'a1', null ],
            [ 'part1', 'a2', null ],
            [ 'part1', 'a3', null ],
            [ 'part1', 'a4', null ],
            [ 'part1', 'a5', null ],
            [ 'part1', 'a6', null ],
            [ 'part2', null, 'notes' ],
            [ 'part2', null, 'cohort' ],
            [ 'part2', null, 'a' ],
            [ 'part2', null, 'b' ],
            [ 'part2', null, 'c' ],
            [ 'part2', null, 'd' ],
            [ 'part2', null, 'e' ],
            [ 'part2', null, 'f' ],
            [ 'part3', null, null ]
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
                : ( 0 == index ? 'instructions' : 1 == index ? 'a1' : 'notes' );

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
              if( angular.isDefined( tabSection ) ) {
                if( null != tabSection[2] ) this.setTab( 2, tabSection[2], false );
                if( null != tabSection[1] ) this.setTab( 1, tabSection[1], false );
                this.setTab( 0, tabSection[0] );
              }
            }
          },

          getCoapplicantList: function() {
            return CnHttpFactory.instance( {
              path: 'reqn_version/' + this.record.reqn_version_id + '/coapplicant',
              data: {
                select: { column: [ 'id', 'name', 'position', 'affiliation', 'email', 'role', 'access' ] },
                modifier: { order: 'id', limit: 1000000 }
              }
            } ).query().then( function( response ) {
              self.coapplicantList = response.data;
            } );
          },

          removeCoapplicant: function( id ) {
            return CnHttpFactory.instance( {
              path: 'reqn_version/' + this.record.reqn_version_id + '/coapplicant/' + id
            } ).delete().then( function() {
              return self.getCoapplicantList();
            } );
          },

          getReferenceList: function() {
            return CnHttpFactory.instance( {
              path: 'reqn_version/' + this.record.reqn_version_id + '/reference',
              data: {
                select: { column: [ 'id', 'rank', 'reference' ] },
                modifier: { order: 'rank', limit: 1000000 }
              }
            } ).query().then( function( response ) {
              self.referenceList = response.data;
            } );
          },

          setReferenceRank: function( id, rank ) {
            return CnHttpFactory.instance( {
              path: 'reqn_version/' + this.record.reqn_version_id + '/reference/' + id,
              data: { rank: rank }
            } ).patch().then( function() {
              return self.getReferenceList();
            } );
          },

          removeReference: function( id ) {
            return CnHttpFactory.instance( {
              path: 'reqn_version/' + this.record.reqn_version_id + '/reference/' + id
            } ).delete().then( function() {
              return self.getReferenceList();
            } );
          },

          getDataOptionValueList: function() {
            self.dataOptionValueList = { bl: [], f1: [] };
            return CnHttpFactory.instance( {
              path: 'data_option',
              data: { select: { column: [ { column: 'MAX(data_option.id)', alias: 'maxId', table_prefix: false } ] } }
            } ).get().then( function( response ) {
              for( var i = 0; i <= response.data[0].maxId; i++ ) {
                self.dataOptionValueList.bl[i] = false;
                self.dataOptionValueList.f1[i] = false;
              }
            } ).then( function() {
              return CnHttpFactory.instance( {
                path: 'reqn_version/' + self.record.reqn_version_id + '/reqn_version_data_option',
                data: { select: { column: [ 'data_option_id', { table: 'study_phase', column: 'code', alias: 'phase' } ] } }
              } ).query().then( function( response ) {
                response.data.forEach( function( dataOption ) {
                  if( angular.isDefined( self.dataOptionValueList[dataOption.phase] ) )
                    self.dataOptionValueList[dataOption.phase][dataOption.data_option_id] = true;
                } );
              } );
            } );
          },

          toggleDataOptionValue: function( studyPhaseCode, dataOptionId ) {
            // toggle the option
            this.dataOptionValueList[studyPhaseCode][dataOptionId] = !this.dataOptionValueList[studyPhaseCode][dataOptionId];

            if( this.dataOptionValueList[studyPhaseCode][dataOptionId] ) {
              // add the data-option
              return CnHttpFactory.instance( {
                path: 'reqn_version/' + this.record.reqn_version_id + '/reqn_version_data_option',
                data: { data_option_id: dataOptionId, study_phase_code: studyPhaseCode },
                onError: function( response ) {
                  self.dataOptionValueList[studyPhaseCode][dataOptionId] = !self.dataOptionValueList[studyPhaseCode][dataOptionId];
                }
              } ).post();
            } else {
              // delete the data-option
              return CnHttpFactory.instance( {
                path: 'reqn_version/' + this.record.reqn_version_id +
                  '/reqn_version_data_option/data_option_id=' + dataOptionId + ';study_phase_code=' + studyPhaseCode,
                onError: function( response ) {
                  self.dataOptionValueList[studyPhaseCode][dataOptionId] = !self.dataOptionValueList[studyPhaseCode][dataOptionId];
                }
              } ).delete();
            }
          },

          submit: function() {
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
                  a1: [ 'applicant_name', 'applicant_position', 'applicant_affiliation',
                        'applicant_address', 'applicant_phone', 'applicant_email' ],
                  a3: [ 'start_date', 'duration' ],
                  a4: [ 'title', 'keywords', 'lay_summary', 'background', 'objectives', 'methodology', 'analysis' ],
                  a5: [ 'funding' ],
                  a6: [ 'ethics' ],
                  cohort: [ 'tracking', 'comprehensive' ]
                };

                var error = null;
                var errorTab = null;
                for( var tab in requiredTabList ) {
                  var firstProperty = null;
                  requiredTabList[tab].forEach( function( property ) {
                    if( null === record[property] || '' === record[property] ) {
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

                // now check for limited inputs if there are no empty errors
                if( null == error ) {
                  if( null != record.lay_summary && 1000 < record.lay_summary.length ) {
                    var element = cenozo.getFormElement( 'lay_summary' );
                    element.$error.custom = self.translate( 'misc.tooManyCharactersTitle' );
                    cenozo.updateFormElement( element, true );
                    if( null == errorTab ) errorTab = 'a4';
                    if( null == error ) error = {
                      title: self.translate( 'misc.tooManyCharactersTitle' ),
                      message: self.translate( 'misc.tooManyCharactersMessage' ),
                      error: true
                    };
                  }
                }

                if( null != error ) {
                  var element = cenozo.getFormElement( 'lay_summary' );

                  // if there was an error then display it now
                  if( 'applicant' == CnSession.role.name ) error.closeText = self.translate( 'misc.close' );
                  CnModalMessageFactory.instance( error ).show().then( function() {
                    if( 'cohort' == errorTab ) {
                      self.setTab( 0, 'part2', false );
                      self.setTab( 2, errorTab );
                    } else {
                      self.setTab( 0, 'part1', false );
                      self.setTab( 1, errorTab );
                    }
                  } );
                } else {
                  return CnHttpFactory.instance( {
                    path: self.parentModel.getServiceResourcePath() + "?action=submit",
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
                          self.setTab( 1, 'a3' );
                        } );
                      } else CnModalMessageFactory.httpError( response );
                    }
                  } ).patch().then( function() {

                    return CnModalMessageFactory.instance( {
                      title: self.translate( 'deferred' == record.state ? 'misc.resubmitTitle' : 'misc.submitTitle' ),
                      message: self.translate( 'deferred' == record.state ? 'misc.resubmitMessage' : 'misc.submitMessage' ),
                      closeText: 'applicant' == CnSession.role.name ? self.translate( 'misc.close' ) : 'Close'
                    } ).show().then( function() {
                      return self.transitionOnViewParent();
                    } );
                  } );
                }
              }
            } );
          },

          downloadReqn: function() {
            return CnHttpFactory.instance( {
              path: this.parentModel.getServiceResourcePath() + '?file=application',
              format: 'pdf'
            } ).file();
          },

          downloadDataChecklist: function() {
            return CnHttpFactory.instance( {
              path: this.parentModel.getServiceResourcePath() + '?file=checklist',
              format: 'pdf'
            } ).file();
          },

          downloadReviews: function() {
            return CnHttpFactory.instance( {
              path: this.parentModel.getServiceResourcePath() + '?file=reviews',
              format: 'txt'
            } ).file();
          },

          downloadFinalReport: function() {
            return CnHttpFactory.instance( {
              path: this.parentModel.getServiceResourcePath().replace( 'reqn', 'final_report' ),
              format: 'pdf'
            } ).file();
          },

          viewRecord: function() {
            return this.parentModel.transitionToViewState( this.record );
          },

          viewReport: function() {
            return $state.go( 'final_report.form', { identifier: this.record.getIdentifier() } );
          },

          displayDecisionNotice: function() {
            if( 'applicant' == CnSession.role.name &&
                this.record.decision_notice &&
                ( 'Agreement' == this.record.stage_type || 'Not Approved' == this.record.stage_type ) ) {
              // get the name of the user who did the chair review
              CnHttpFactory.instance( {
                path: this.parentModel.getServiceResourcePath(),
                data: { select: { column: 'chair_name' } }
              } ).get().then( function( response ) {
                // get the notice text and fill in the details
                var text = self.translate(
                  'Agreement' == self.record.stage_type ? 'decisionNotice.approved' : 'decisionNotice.notApproved'
                ).replace( /{{applicant_name}}/g, self.record.applicant_name )
                 .replace( /{{decision_notice}}/g, self.record.decision_notice )
                 .replace( /{{chair_full_name}}/g, null === response.data.chair_name ? '' : response.data.chair_name );

                CnModalMessageFactory.instance( {
                  title: self.parentModel.module.name.singular.ucWords() + ' ' +
                    self.record.identifier + ' ' + self.translate( 'decisionNotice.title' ),
                  closeText: 'applicant' == CnSession.role.name ? self.translate( 'misc.close' ) : 'Close',
                  message: text
                } ).show();
              } );
            }
          }
        } );

        this.coapplicantModel.metadata.getPromise(); // needed to get the coapplicant's metadata
        this.referenceModel.metadata.getPromise(); // needed to get the reference's metadata
      };
      return { instance: function( parentModel, root ) { return new object( parentModel, root ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnReqnModelFactory', [
    'CnBaseModelFactory', 'CnReqnListFactory', 'CnReqnViewFactory',
    'CnHttpFactory', 'CnSession', '$state', '$transitions', '$q',
    function( CnBaseModelFactory, CnReqnListFactory, CnReqnViewFactory,
              CnHttpFactory, CnSession, $state, $transitions, $q ) {
      var object = function( type ) {
        var self = this;

        CnBaseModelFactory.construct( this, module );
        this.type = type;
        if( 'lite' != this.type ) this.listModel = CnReqnListFactory.instance( this );
        this.viewModel = CnReqnViewFactory.instance( this, 'root' == this.type );

        // override the service collection path so that applicants can view their reqns from the home screen
        this.getServiceCollectionPath = function() {
          // ignore the parent if it is the root state
          return this.$$getServiceCollectionPath( 'root' == this.getSubjectFromState() );
        };

        // override the service collection
        this.getServiceData = function( type, columnRestrictLists ) {
          // only include the funding and ethics filenames in the view type in the lite instance
          var data = 'lite' == this.type
                   ? {
                       select: {
                         column: [
                           'state',
                           { table: 'reqn_version', column: 'funding_filename' },
                           { table: 'reqn_version', column: 'ethics_filename' },
                           { table: 'stage_type', column: 'phase' },
                           { table: 'stage_type', column: 'name', alias: 'stage_type' }
                         ]
                       }
                     }
                   : this.$$getServiceData( type, columnRestrictLists );

          // chairs only see DSAC reqns from the home screen
          if( 'root' == this.getSubjectFromState() ) {
            if( angular.isUndefined( data.modifier.where ) ) data.modifier.where = [];
            if( 'chair' == CnSession.role.name ) {
              data.modifier.where.push( {
                column: 'stage_type.name',
                operator: 'LIKE',
                value: '%DSAC%'
              } );
            } else if( 'smt' == CnSession.role.name ) {
              data.modifier.where.push( {
                column: 'stage_type.name',
                operator: 'LIKE',
                value: '%SMT%'
              } );
            }
          }

          return data;
        };

        // make the input lists from all groups more accessible
        this.inputList = {};
        module.inputGroupList.forEach( group => Object.assign( self.inputList, group.inputList ) );

        this.isApplicant = function() { return 'applicant' == CnSession.role.name; }
        this.isAdministrator = function() { return 'administrator' == CnSession.role.name; }

        var mainInputGroup = module.inputGroupList.findByProperty( 'title', '' );
        if( 'administrator' == CnSession.role.name ) {
          mainInputGroup.inputList.language_id.exclude = false;
          mainInputGroup.inputList.stage_type.exclude = false;
          mainInputGroup.inputList.state.exclude = false;
          mainInputGroup.inputList.data_available.exclude = false;
        } else {
          mainInputGroup.inputList.title.exclude = false;
          mainInputGroup.inputList.applicant_name.exclude = false;
          mainInputGroup.inputList.lay_summary.exclude = false;
        }

        this.getEditEnabled = function() {
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

          return this.$$getEditEnabled() && check;
        };

        this.getDeleteEnabled = function() {
          return this.$$getDeleteEnabled() &&
                 angular.isDefined( this.listModel.record ) &&
                 'new' == this.listModel.record.phase;
        };

        // override transitionToAddState
        this.transitionToAddState = function() {
          // immediately get a new reqn and view it (no add state required)
          return CnHttpFactory.instance( {
            path: 'reqn',
            data: { user_id: CnSession.user.id }
          } ).post().then( function ( response ) {
            // immediately view the new reqn
            return self.transitionToViewState( { getIdentifier: function() { return response.data; } } );
          } )
        };

        // override transitionToViewState
        this.transitionToViewState = function( record ) {
          if( this.isApplicant() ) $state.go( 'reqn.form', { identifier: record.getIdentifier() } );
          else this.$$transitionToViewState( record );
        };

        var misc = cenozoApp.lookupData.reqn.misc;
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

                // create ethics enum
                self.metadata.columnList.ethics.enumList = {
                  en: [ { value: '', name: misc.choose.en }, { value: true, name: misc.yes.en }, { value: false, name: misc.no.en } ],
                  fr: [ { value: '', name: misc.choose.fr }, { value: true, name: misc.yes.fr }, { value: false, name: misc.no.fr } ]
                };

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

                // create tracking enum
                self.metadata.columnList.tracking.enumList = {
                  en: [ { value: '', name: misc.choose.en }, { value: true, name: misc.yes.en }, { value: false, name: misc.no.en } ],
                  fr: [ { value: '', name: misc.choose.fr }, { value: true, name: misc.yes.fr }, { value: false, name: misc.no.fr } ]
                };

                // create comprehensive enum
                self.metadata.columnList.comprehensive.enumList = {
                  en: [ { value: '', name: misc.choose.en }, { value: true, name: misc.yes.en }, { value: false, name: misc.no.en } ],
                  fr: [ { value: '', name: misc.choose.fr }, { value: true, name: misc.yes.fr }, { value: false, name: misc.no.fr } ]
                };

                return CnHttpFactory.instance( {
                  path: 'language',
                  data: {
                    select: { column: [ 'id', 'name' ] },
                    modifier: {
                      where: { column: 'active', operator: '=', value: true },
                      order: 'name'
                    }
                  }
                } ).query().then( function success( response ) {
                  self.metadata.columnList.language_id.enumList = [];
                  response.data.forEach( function( item ) {
                    self.metadata.columnList.language_id.enumList.push( {
                      value: item.id,
                      name: item.name
                    } );
                  } );
                } );
              }
            } ),

            // only do the following for the root instance
            'root' != self.type ? $q.all() : $q.all( [
              CnHttpFactory.instance( {
                path: 'data_option_category',
                data: {
                  select: { column: [ 'id', 'name_en', 'name_fr', 'note_en', 'note_fr' ] },
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

                  cenozoApp.lookupData.reqn.part2[letter].tab = dataOptionCategory.name;
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
