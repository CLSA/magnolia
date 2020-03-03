define( function() {
  'use strict';

  try { var module = cenozoApp.module( 'reqn', true ); } catch( err ) { console.warn( err ); return; }

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
      reqn_type: {
        column: 'reqn_type.name',
        title: 'Type'
      },
      user_full_name: {
        title: 'Owner',
        isIncluded: function( $state, model ) { return !model.isApplicant(); }
      },
      graduate_full_name: {
        title: 'Trainee'
      },
      deadline: {
        column: 'deadline.name',
        title: 'Deadline'
      },
      amendment_version: {
        title: 'Version'
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
      state_days: {
        title: 'Days On Hold',
        type: 'number',
        isIncluded: function( $state, model ) { return !model.isApplicant(); },
        help: 'The number of days since the requisition was put on hold (empty if the requisition hasn\'t been held up)'
      },
      stage_type: {
        column: 'stage_type.name',
        title: 'Stage',
        type: 'string',
        isIncluded: function( $state, model ) { return !model.isApplicant() && !model.isReviewer(); }
      },
      reqn_version_id: {
        column: 'reqn_version.id',
        type: 'hidden'
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
      type: 'string',
      isConstant: function( $state, model ) { return !model.isAdministrator(); },
      isExcluded: 'add'
    },
    reqn_type_id: {
      title: 'Requisition Type',
      type: 'enum',
      isConstant: function( $state, model ) {
        return model.isAdministrator() && (
          angular.isUndefined( model.viewModel.record.stage_type ) || 'New' == model.viewModel.record.stage_type
        ) ? false : 'view';
      },
      isExcluded: function( $state, model ) { return !model.isAdministratorOrReadonly(); }
    },
    deadline_id: {
      title: 'Deadline',
      type: 'enum',
      isConstant: function( $state, model ) {
        // only allow the deadline to be changed while in the admin review stage (hide if there is no deadline)
        return !model.isAdministrator() ||
               angular.isUndefined( model.viewModel.record.phase ) ||
               'review' != model.viewModel.record.phase;
      },
      isExcluded: function( $state, model ) {
        return !model.isAdministrator() ||
               angular.isUndefined( model.viewModel.record.deadline_id ) ||
               null == model.viewModel.record.deadline_id ? true : 'add';
      }
    },
    user_id: {
      title: 'Owner',
      type: 'lookup-typeahead',
      typeahead: {
        table: 'user',
        select: 'CONCAT( user.first_name, " ", user.last_name, " (", user.name, ")" )',
        where: [ 'user.first_name', 'user.last_name', 'user.name' ]
      },
      isConstant: function( $state, model ) {
        // never constant when adding a new reqn
        if( 'reqn.add' == $state.current.name ) return false;

        // if the reqn has an agreement then we can't directly change the primary applicant
        return 0 < model.viewModel.record.has_agreements;
      }
    },
    graduate_id: {
      title: 'Trainee',
      type: 'enum',
      isConstant: function( $state, model ) { return !model.isAdministrator(); },
      isExcluded: 'add'
    },
    language_id: {
      title: 'Language',
      type: 'enum',
      isConstant: function( $state, model ) { return !model.isAdministrator(); },
      isExcluded: function( $state, model ) { return !model.isAdministratorOrReadonly(); }
    },
    stage_type: {
      title: 'Current Stage',
      column: 'stage_type.name',
      type: 'string',
      isConstant: true,
      isExcluded: function( $state, model ) { return model.isAdministratorOrReadonly() ? 'add' : true; }
    },
    state: {
      title: 'State',
      type: 'enum',
      isConstant: true,
      isExcluded: function( $state, model ) { return model.isAdministratorOrReadonly() ? 'add' : true; }
    },
    state_date: {
      title: 'State Set On',
      type: 'date',
      isConstant: true,
      isExcluded: function( $state, model ) { return model.isAdministratorOrReadonly() ? 'add' : true; }
    },
    data_expiry_date: {
      title: 'Data Expiry Date',
      type: 'date',
      isConstant: function( $state, model ) {
        // show the study data available if we're in the active phase
        return angular.isUndefined( model.viewModel.record.phase ) || 'active' != model.viewModel.record.phase;
      },
      isExcluded: function( $state, model ) { return model.isAdministratorOrReadonly() ? 'add' : true; }
    },
    title: {
      column: 'reqn_version.title',
      title: 'Title',
      type: 'string',
      isConstant: true,
      isExcluded: function( $state, model ) { return model.isAdministratorOrReadonly(); }
    },
    lay_summary: {
      column: 'reqn_version.lay_summary',
      title: 'Lay Summary',
      type: 'text',
      isConstant: true,
      isExcluded: function( $state, model ) { return model.isAdministratorOrReadonly(); }
    },
    instruction_filename: {
      column: 'instruction_filename',
      title: 'Additional Documentation',
      type: 'file',
      isConstant: function( $state, model ) { return !model.isAdministrator(); },
      isExcluded: function( $state, model ) {
        // show the agreement and instruction files if we're past the review stage
        return angular.isUndefined( model.viewModel.record.phase ) ||
               !['active','complete'].includes( model.viewModel.record.phase );
      }
    },
    suggested_revisions: {
      title: 'Suggested Revisions',
      type: 'boolean',
      isExcluded: function( $state, model ) {
        // show the suggested revisions checkbox to admins when in the decision made stage
        return !model.isAdministrator() ||
               angular.isUndefined( model.viewModel.record.stage_type ) ||
               'Decision Made' != model.viewModel.record.stage_type ||
               angular.isUndefined( model.viewModel.record.next_stage_type ) ||
               'Not Approved' == model.viewModel.record.next_stage_type;
      }
    },
    note: {
      title: 'Administrative Note',
      type: 'text',
      isExcluded: function( $state, model ) { return !model.isAdministratorOrReadonly(); }
    },

    current_reqn_version_id: { column: 'reqn_version.id', type: 'string', isExcluded: true },
    amendment: { column: 'reqn_version.amendment', type: 'string', isExcluded: true },
    funding_filename: { column: 'reqn_version.funding_filename', type: 'string', isExcluded: true },
    ethics_filename: { column: 'reqn_version.ethics_filename', type: 'string', isExcluded: true },
    has_agreements: { type: 'boolean', isExcluded: true },
    data_directory: { type: 'string', isExcluded: true },
    phase: { column: 'stage_type.phase', type: 'string', isExcluded: true },
    status: { column: 'stage_type.status', type: 'string', isExcluded: true },
    lang: { type: 'string', column: 'language.code', isExcluded: true },
    deadline: { type: 'date', column: 'deadline.date', isExcluded: true }
  } );

  module.addInputGroup( 'Deferral Notes', {
    deferral_note_amendment: {
      title: 'Amendment',
      type: 'text',
      isExcluded: function( $state, model ) {
        // show the amendment deferral note to admins when an amendment is active
        return !model.isAdministrator() ||
               angular.isUndefined( model.viewModel.record.amendment ) || '.' == model.viewModel.record.amendment;
      }
    },
    deferral_note_1a: { title: 'Part1: A1', type: 'text', isExcluded: 'add' },
    deferral_note_1b: { title: 'Part1: A2', type: 'text', isExcluded: 'add' },
    deferral_note_1c: { title: 'Part1: A3', type: 'text', isExcluded: 'add' },
    deferral_note_1d: { title: 'Part1: A4', type: 'text', isExcluded: 'add' },
    deferral_note_1e: { title: 'Part1: A5', type: 'text', isExcluded: 'add' },
    deferral_note_1f: { title: 'Part1: A6', type: 'text', isExcluded: 'add' },
    deferral_note_2a: { title: 'Part2: Questionnaires', type: 'text', isExcluded: 'add' },
    deferral_note_2b: { title: 'Part2: Physical Assessment', type: 'text', isExcluded: 'add' },
    deferral_note_2c: { title: 'Part2: Biomarkers', type: 'text', isExcluded: 'add' },
    deferral_note_2d: { title: 'Part2: Genomics', type: 'text', isExcluded: 'add' },
    deferral_note_2e: { title: 'Part2: Linked Data', type: 'text', isExcluded: 'add' }
  } );

  module.addExtraOperation( 'view', {
    title: 'View Form',
    operation: function( $state, model ) {
      $state.go( 'reqn_version.view', { identifier: model.viewModel.record.current_reqn_version_id } );
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
    classes: 'btn-danger',
    isIncluded: function( $state, model ) { return model.viewModel.show( 'abandon' ); },
    isDisabled: function( $state, model ) { return !model.viewModel.enabled( 'abandon' ); },
    operation: function( $state, model ) { model.viewModel.abandon(); }
  } );

  module.addExtraOperation( 'view', {
    title: 'De-activate',
    classes: 'btn-danger',
    isIncluded: function( $state, model ) { return model.viewModel.show( 'deactivate' ); },
    isDisabled: function( $state, model ) { return !model.viewModel.enabled( 'deactivate' ); },
    operation: function( $state, model ) { model.viewModel.deactivate(); }
  } );

  module.addExtraOperation( 'view', {
    title: 'Re-activate',
    classes: 'btn-warning',
    isIncluded: function( $state, model ) { return model.viewModel.show( 'reactivate' ); },
    isDisabled: function( $state, model ) { return !model.viewModel.enabled( 'reactivate' ); },
    operation: function( $state, model ) { model.viewModel.reactivate(); }
  } );

  module.addExtraOperation( 'view', {
    title: 'Incomplete',
    classes: 'btn-danger',
    isIncluded: function( $state, model ) { return model.viewModel.show( 'incomplete' ); },
    isDisabled: function( $state, model ) { return !model.viewModel.enabled( 'incomplete' ); },
    operation: function( $state, model ) { model.viewModel.incomplete(); }
  } );

  module.addExtraOperation( 'view', {
    title: 'Withdraw',
    classes: 'btn-danger',
    isIncluded: function( $state, model ) { return model.viewModel.show( 'withdraw' ); },
    isDisabled: function( $state, model ) { return !model.viewModel.enabled( 'withdraw' ); },
    operation: function( $state, model ) { model.viewModel.withdraw(); }
  } );

  module.addExtraOperation( 'view', {
    title: 'Recreate',
    classes: 'btn-success',
    isIncluded: function( $state, model ) { return model.viewModel.show( 'recreate' ); },
    isDisabled: function( $state, model ) { return !model.viewModel.enabled( 'recreate' ); },
    operation: function( $state, model ) { model.viewModel.recreate(); }
  } );

  module.addExtraOperation( 'view', {
    title: 'Proceed',
    classes: 'btn-success',
    isIncluded: function( $state, model ) { return model.viewModel.show( 'proceed' ); },
    isDisabled: function( $state, model ) { return !model.viewModel.enabled( 'proceed' ); },
    operation: function( $state, model ) { model.viewModel.proceed(); }
  } );

  module.addExtraOperationGroup( 'view', {
    title: 'Proceed...',
    isIncluded: function( $state, model ) { return model.viewModel.show( 'amendment proceed' ); },
    isDisabled: function( $state, model ) { return !model.viewModel.enabled( 'proceed' ); },
    classes: 'btn-success',
    operations: [ {
      title: 'To Feasibility Review',
      operation: function( $state, model ) { model.viewModel.proceed( 'Feasibility Review' ); },
      isIncluded: function( $state, model ) { return model.viewModel.show( 'amendment feasibility review' ); }
    }, {
      title: 'To DSAC Review',
      operation: function( $state, model ) { model.viewModel.proceed( 'DSAC Review' ); },
      isIncluded: function( $state, model ) { return model.viewModel.show( 'amendment dsac review' ); }
    }, {
      title: 'To Decision Made',
      operation: function( $state, model ) { model.viewModel.proceed( 'Decision Made' ); },
      isIncluded: function( $state, model ) { return model.viewModel.show( 'amendment decision made' ); }
    }, {
      title: 'To Agreement',
      operation: function( $state, model ) { model.viewModel.proceed( 'Agreement' ); },
      isIncluded: function( $state, model ) { return model.viewModel.show( 'amendment agreement' ); }
    }, {
      title: 'To Data Release',
      operation: function( $state, model ) { model.viewModel.proceed( 'Data Release' ); },
      isIncluded: function( $state, model ) { return model.viewModel.show( 'amendment data release' ); }
    }, {
      title: 'To Active',
      operation: function( $state, model ) { model.viewModel.proceed( 'Active' ); },
      isIncluded: function( $state, model ) { return model.viewModel.show( 'amendment active' ); }
    } ]
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
      operation: function( $state, model ) { model.viewModel.downloadApplication(); }
    }, {
      title: 'Data Checklist',
      operation: function( $state, model ) { model.viewModel.downloadChecklist(); }
    }, {
      title: 'Application + Data Checklist',
      operation: function( $state, model ) { model.viewModel.downloadApplicationAndChecklist(); }
    }, {
      title: 'Funding Letter',
      operation: function( $state, model ) { model.viewModel.downloadFundingLetter(); },
      isDisabled: function( $state, model ) { return !model.viewModel.record.funding_filename; }
    }, {
      title: 'Ethics Letter/Exemption',
      operation: function( $state, model ) { model.viewModel.downloadEthicsLetter(); },
      isDisabled: function( $state, model ) { return !model.viewModel.record.ethics_filename; }
    }, {
      title: 'Agreement Letters',
      operation: function( $state, model ) { model.viewModel.downloadAgreementLetters(); },
      isDisabled: function( $state, model ) { return !model.viewModel.record.has_agreements; }
    }, {
      title: 'Notices',
      operation: function( $state, model ) { model.viewModel.displayDecisionNotice(); }
    }, {
      title: 'Reviews',
      operation: function( $state, model ) { model.viewModel.downloadReviews(); }
    }, {
      title: 'Final Report',
      operation: function( $state, model ) { model.viewModel.downloadFinalReport(); },
      isIncluded: function( $state, model ) {
        return ['Report Required', 'Complete'].includes( model.viewModel.record.stage_type );
      }
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
  cenozo.providers.directive( 'cnReqnAdd', [
    'CnReqnModelFactory',
    function( CnReqnModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'add.tpl.html' ),
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
  cenozo.providers.directive( 'cnReqnView', [
    'CnReqnModelFactory', 'CnSession',
    function( CnReqnModelFactory, CnSession ) {
      return {
        templateUrl: module.getFileUrl( 'view.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnReqnModelFactory.root;

          // remove the decision and deferral note input group if we're not an admin
          if( 3 > CnSession.role.tier ) {
            $scope.$on( 'cnRecordView linked', function( event, data ) {
              var index = data.dataArray.findIndexByProperty( 'title', 'Decision and Deferral Notes' );
              if( null != index ) data.dataArray.splice( index, 1 );
            } );
          }
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnReqnAddFactory', [
    'CnBaseAddFactory',
    function( CnBaseAddFactory ) {
      var object = function( parentModel ) { CnBaseAddFactory.construct( this, parentModel ); };
      return { instance: function( parentModel ) { return new object( parentModel ); } };
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
    'CnBaseViewFactory', 'CnReqnHelper', 'CnSession', 'CnHttpFactory',
    'CnModalMessageFactory', 'CnModalConfirmFactory', 'CnModalNoticeListFactory', '$window', '$state', '$q',
    function( CnBaseViewFactory, CnReqnHelper, CnSession, CnHttpFactory,
              CnModalMessageFactory, CnModalConfirmFactory, CnModalNoticeListFactory, $window, $state, $q ) {
      var object = function( parentModel, root ) {
        var self = this;
        CnBaseViewFactory.construct( this, parentModel, root );

        this.deferred.promise.then( function() {
          if( angular.isDefined( self.stageModel ) ) self.stageModel.listModel.heading = 'Stage History';
        } );

        this.configureFileInput( 'instruction_filename' );

        angular.extend( this, {
          show: function( subject ) { return CnReqnHelper.showAction( subject, this.record ); },
          abandon: function() {
            return CnReqnHelper.abandon(
              this.record.getIdentifier(),
              '.' != this.record.amendment,
              this.record.lang
            ).then( function( response ) {
              if( response ) {
                self.record.state = 'abandoned';
                self.record.state_date = moment().format( 'YYYY-MM-DD' );
                self.updateFormattedRecord( 'state_date', 'date' );
                if( angular.isDefined( self.notificationModel ) ) self.notificationModel.listModel.onList( true );
              }
            } );
          },
          delete: function() { return CnReqnHelper.delete( this.record.getIdentifier(), this.record.lang ); },
          translate: function( value ) { return CnReqnHelper.translate( 'reqn', value, this.record.lang ); },
          viewReport: function() { return CnReqnHelper.viewReport( this.record.getIdentifier() ); },
          downloadApplication: function() { return CnReqnHelper.download( 'application', this.record.current_reqn_version_id ); },
          downloadChecklist: function() { return CnReqnHelper.download( 'checklist', this.record.current_reqn_version_id ); },
          downloadApplicationAndChecklist: function() {
            return CnReqnHelper.download( 'application_and_checklist', this.record.current_reqn_version_id );
          },
          downloadFundingLetter: function() { return CnReqnHelper.download( 'funding_filename', this.record.current_reqn_version_id ); },
          downloadEthicsLetter: function() { return CnReqnHelper.download( 'ethics_filename', this.record.current_reqn_version_id ); },
          downloadAgreementLetters: function() {
            return CnHttpFactory.instance( {
              path: this.parentModel.getServiceResourcePath() + '?file=agreements',
              format: 'zip'
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

          resetData: function() {
            CnHttpFactory.instance( {
              path: self.parentModel.getServiceResourcePath() + '?action=reset_data'
            } ).patch().then( function( response ) {
              self.onView();
              CnModalMessageFactory.instance( {
                title: 'Study Data Reset',
                message: response.data ?
                  'This ' + self.parentModel.module.name.possessive +
                  ' study data has been made available and will automatically expire in ' +
                  CnSession.application.studyDataExpiry + ' days.' :
                  'Warning: The ' + self.parentModel.module.name.singular + ' has no data to make available.',
                error: !response.data
              } ).show();
            } );
          },
          canResetData: function() {
            // administrators and applicants can view data when in the active stage
            var stage_type = this.record.stage_type ? this.record.stage_type : '';
            return 'administrator' == CnSession.role.name && ( 'Data Release' == stage_type || 'Active' == stage_type );
          },
          viewData: function() {
            $window.open( CnSession.application.studyDataUrl + '/' + self.record.data_directory, 'studyData' + self.record.id );
          },
          canViewData: function() {
            // administrators and applicants can view data when in the active stage
            var stage_type = this.record.stage_type ? this.record.stage_type : '';
            return ( 'administrator' == CnSession.role.name && ['Data Release','Active'].includes( stage_type ) ) ||
                   ( 'applicant' == CnSession.role.name && 'Active' == stage_type );
          },
          onView: function( force ) {
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
              return CnHttpFactory.instance( {
                path: 'user/' + self.record.user_id + '/graduate',
                data: {
                  select: { column: [ 'id', 'graduate_full_name' ] },
                  modifier: {
                    where: { column: 'user.active', operator: '=', value: true },
                    order: 'user.first_name'
                  }
                }
              } ).query().then( function success( response ) {
                self.parentModel.metadata.columnList.graduate_id.enumList = [];
                response.data.forEach( function( item ) {
                  self.parentModel.metadata.columnList.graduate_id.enumList.push( {
                    value: item.id,
                    name: item.graduate_full_name
                  } );
                } );
              } )
            } );
          },

          onPatch: function( data ) {
            var changingUser = angular.isDefined( data.user_id );
            var promiseList = [];

            // show a warning when changing the primary applicant
            if( changingUser ) {
              var message = 'Changing the ' + this.parentModel.module.name.possessive + ' primary applicant will immediately remove ' +
                            'it from the old owner\'s ' + this.parentModel.module.name.singular + ' list and add it to the new ' +
                            'owner\'s list.  Also, a notification will be sent to both the old and new applicants explaining the ' +
                            'transfer of ownership.';
              if( this.record.graduate_id )
                message += '\n\nAdditionally, this ' + this.parentModel.module.name.possessive + ' trainee\'s supervisor will also ' +
                           'be changed to the new primary applicant.  If there are any other requisitions with the same trainee ' +
                           'then they will also be reassigned to the new owner.';

              message += '\n\nAre you sure you wish to proceed?';

              promiseList.push(
                CnModalConfirmFactory.instance( {
                  title: 'Change Owner' + ( this.record.graduate_id ? ' (And Supervisor)' : '' ),
                  message: message
                } ).show().then( function( response ) {
                  return response;
                } )
              );
            }

            return $q.all( promiseList ).then( function( response ) {
              if( 0 == response.length || response[0] ) {
                return self.$$onPatch( data ).then( function() {
                  // Reload the view if we're changing the suggested revisions (the next stage will change)
                  // or reqn type (the deadline might change)
                  if( angular.isDefined( data.suggested_revisions ) || angular.isDefined( data.reqn_type_id ) ) return self.onView();
                } );
              } else if( changingUser ) {
                // we're not making the change so put back the old user
                self.record.user_id = self.backupRecord.user_id;
                self.formattedRecord.user_id = self.backupRecord.formatted_user_id;
                if( angular.isDefined( self.notificationModel ) ) self.notificationModel.listModel.onList( true );
              }
            } );
          },

          deferralNotesExist: function() {
            return this.record.deferral_note_amendment ||
                   this.record.deferral_note_1a || this.record.deferral_note_1b ||
                   this.record.deferral_note_1c || this.record.deferral_note_1d ||
                   this.record.deferral_note_1e || this.record.deferral_note_1f ||
                   this.record.deferral_note_2a || this.record.deferral_note_2b ||
                   this.record.deferral_note_2c || this.record.deferral_note_2d ||
                   this.record.deferral_note_2e;
          },

          enabled: function( subject ) {
            var state = this.record.state ? this.record.state : '';

            if( ['abandon', 'deactivate', 'defer', 'incomplete', 'withdraw', 'reactivate', 'recreate'].includes( subject ) ) {
              return true;
            } else if( ['proceed','reject'].includes( subject ) ) {
              return !state && null != this.record.next_stage_type;
            } else return false;
          },

          proceed: function( stageType ) {
            var message = 'Are you sure you wish to move this ' + this.parentModel.module.name.singular + ' to the "' +
              ( angular.isDefined( stageType ) ? stageType : this.record.next_stage_type ) + '" stage?';
            if( 'administrator' == CnSession.role.name && this.deferralNotesExist() ) {
              message += '\n\nWARNING: there are deferral notes present, you may wish to remove them before proceeding.';
            }
            return CnModalConfirmFactory.instance( {
              message: message
            } ).show().then( function( response ) {
              if( response ) {
                var queryString = '?action=next_stage';
                if( angular.isDefined( stageType ) ) queryString += '&stage_type=' + stageType;
                return CnHttpFactory.instance( {
                  path: self.parentModel.getServiceResourcePath() + queryString,
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
                  self.record.state_date = moment().format( 'YYYY-MM-DD' );
                  self.updateFormattedRecord( 'state_date', 'date' );
                  if( angular.isDefined( self.reqnVersionModel ) ) self.reqnVersionModel.listModel.onList( true );
                  if( angular.isDefined( self.notificationModel ) ) self.notificationModel.listModel.onList( true );
                } );
              }
            } );
          },

          deactivate: function() {
            return CnModalConfirmFactory.instance( {
              message: 'Are you sure you wish to de-activate the ' + this.parentModel.module.name.singular + '?' +
                '\n\nThe applicant will no longer be able to edit or submit the ' + this.parentModel.module.name.singular + '.'
            } ).show().then( function( response ) {
              if( response ) {
                return CnHttpFactory.instance( {
                  path: self.parentModel.getServiceResourcePath() + "?action=deactivate"
                } ).patch().then( function() {
                  self.record.state = 'inactive';
                  self.record.state_date = moment().format( 'YYYY-MM-DD' );
                  self.updateFormattedRecord( 'state_date', 'date' );
                  if( angular.isDefined( self.notificationModel ) ) self.notificationModel.listModel.onList( true );
                } );
              }
            } );
          },

          incomplete: function() {
            return CnModalConfirmFactory.instance( {
              message: 'Are you sure you wish to mark this ' + this.parentModel.module.name.singular + ' as permanently incomplete?' +
                '\n\nThere is no undoing this action. However, once moved to the incomplete stage the ' +
                this.parentModel.module.name.singular + ' can be recreated as a new application.'
            } ).show().then( function( response ) {
              if( response ) {
                return CnHttpFactory.instance( {
                  path: self.parentModel.getServiceResourcePath() + "?action=incomplete"
                } ).patch().then( function() {
                  self.onView();
                  if( angular.isDefined( self.stageModel ) ) self.stageModel.listModel.onList( true );
                  if( angular.isDefined( self.notificationModel ) ) self.notificationModel.listModel.onList( true );
                } );
              }
            } );
          },

          withdraw: function() {
            return CnModalConfirmFactory.instance( {
              message: 'Are you sure you wish to mark this ' + this.parentModel.module.name.singular + ' as permanently withdrawn?' +
                '\n\nThere is no undoing this action. However, once moved to the withdrawn stage the ' +
                this.parentModel.module.name.singular + ' can be recreated as a new application.'
            } ).show().then( function( response ) {
              if( response ) {
                return CnHttpFactory.instance( {
                  path: self.parentModel.getServiceResourcePath() + "?action=withdraw"
                } ).patch().then( function() {
                  self.onView();
                  if( angular.isDefined( self.stageModel ) ) self.stageModel.listModel.onList( true );
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
                  self.record.state = 'abandoned' == self.record.state ? 'deferred' : '';
                  self.record.state_date = 'abandoned' == self.record.state ? moment().format( 'YYYY-MM-DD' ) : null;
                  self.updateFormattedRecord( 'state_date', 'date' );
                  if( angular.isDefined( self.notificationModel ) ) self.notificationModel.listModel.onList( true );
                } );
              }
            } );
          },

          recreate: function() {
            return CnModalConfirmFactory.instance( {
              message: 'Are you sure you wish to recreate the ' + this.parentModel.module.name.singular + '?' +
                '\n\nA new ' + this.parentModel.module.name.singular + ' will be created using all of the details ' +
                'provided in this ' + this.parentModel.module.name.singular + '.'
            } ).show().then( function( response ) {
              if( response ) {
                return CnHttpFactory.instance( {
                  path: self.parentModel.getServiceCollectionPath() + "?clone=" + self.record.identifier
                } ).post().then( function( response ) {
                  // redirect to the new requestion
                  return $state.go( 'reqn.view', { identifier: response.data } );
                } );
              }
            } );
          },

          displayDecisionNotice: function() {
            var noticeList = [];
            return CnHttpFactory.instance( {
              path: this.parentModel.getServiceResourcePath() + '/notice',
              data: { modifier: { order: { datetime: true } } }
            } ).query().then( function( response ) {
              CnModalNoticeListFactory.instance( {
                title: 'Notice List',
                closeText: self.translate( 'misc.close' ),
                noticeList: response.data
              } ).printMessage();
            } );
          }

        } );
      };
      return { instance: function( parentModel, root ) { return new object( parentModel, root ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnReqnModelFactory', [
    'CnReqnHelper', 'CnBaseModelFactory', 'CnReqnAddFactory', 'CnReqnListFactory', 'CnReqnViewFactory',
    'CnHttpFactory', 'CnSession', '$state', '$q',
    function( CnReqnHelper, CnBaseModelFactory, CnReqnAddFactory, CnReqnListFactory, CnReqnViewFactory,
              CnHttpFactory, CnSession, $state, $q ) {
      var object = function( root ) {
        var self = this;

        CnBaseModelFactory.construct( this, module );
        this.addModel = CnReqnAddFactory.instance( this );
        this.listModel = CnReqnListFactory.instance( this );
        this.viewModel = CnReqnViewFactory.instance( this, root );

        // override the service collection path so that applicants can view their reqns from the home screen
        this.getServiceCollectionPath = function() {
          // ignore the parent if it is the root state
          return this.$$getServiceCollectionPath( 'root' == this.getSubjectFromState() );
        };

        // make the input lists from all groups more accessible
        this.isApplicant = function() { return 'applicant' == CnSession.role.name; };
        this.isAdministrator = function() { return 'administrator' == CnSession.role.name; };
        this.isAdministratorOrReadonly = function() { return ['administrator','readonly'].includes( CnSession.role.name ); };
        this.isReviewer = function() { return 'reviewer' == CnSession.role.name; };

        this.getEditEnabled = function() {
          var phase = this.viewModel.record.phase ? this.viewModel.record.phase : '';
          var state = this.viewModel.record.state ? this.viewModel.record.state : '';
          return this.$$getEditEnabled() && (
            'applicant' == CnSession.role.name ?
            'new' == phase || ( 'deferred' == state && 'review' == phase ) :
            'administrator' == CnSession.role.name
          );
        };

        this.getDeleteEnabled = function() {
          return this.$$getDeleteEnabled() &&
                 angular.isDefined( this.listModel.record ) &&
                 'new' == this.listModel.record.phase;
        };

        // override transitionToAddState (used when applicant creates a new reqn)
        this.transitionToAddState = function() {
          // for applicants immediately get a new reqn and view it (no add state required)
          return 'applicant' != CnSession.role.name ? this.$$transitionToAddState() : CnHttpFactory.instance( {
            path: 'reqn',
            data: { user_id: CnSession.user.id }
          } ).post().then( function ( response ) {
            // get the new reqn version id
            return CnHttpFactory.instance( {
              path: 'reqn/' + response.data,
              data: { select: { column: { table: 'reqn_version', column: 'id', alias: 'reqn_version_id' } } }
            } ).get().then( function( response ) {
              return $state.go( 'reqn_version.view', { identifier: response.data.reqn_version_id } );
            } );
          } )
        };

        // override transitionToViewState (used when application views a reqn)
        this.transitionToViewState = function( record ) {
          if( this.isApplicant() ) $state.go( 'reqn_version.view', { identifier: record.reqn_version_id } );
          else this.$$transitionToViewState( record );
        };

        // override the service collection
        this.getServiceData = function( type, columnRestrictLists ) {
          var data = this.$$getServiceData( type, columnRestrictLists );

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

        this.getMetadata = function() {
          return self.$$getMetadata().then( function() {
            return $q.all( [
              CnHttpFactory.instance( {
                path: 'reqn_type',
                data: {
                  select: { column: [ 'id', 'name' ] },
                  modifier: { order: 'name' }
                }
              } ).query().then( function success( response ) {
                self.metadata.columnList.reqn_type_id.enumList = [];
                response.data.forEach( function( item ) {
                  self.metadata.columnList.reqn_type_id.enumList.push( {
                    value: item.id,
                    name: item.name
                  } );
                } );
              } ),

              CnHttpFactory.instance( {
                path: 'deadline',
                data: {
                  select: { column: [ 'id', 'name' ] },
                  modifier: { order: 'date', desc: true }
                }
              } ).query().then( function success( response ) {
                self.metadata.columnList.deadline_id.enumList = [];
                response.data.forEach( function( item ) {
                  self.metadata.columnList.deadline_id.enumList.push( {
                    value: item.id,
                    name: item.name
                  } );
                } );
              } ),

              CnHttpFactory.instance( {
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
              } )
            ] );
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
