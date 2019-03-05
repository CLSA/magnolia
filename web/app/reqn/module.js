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
      version: {
        column: 'reqn_version.version',
        title: 'Version',
        type: 'rank'
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
      exclude: 'add'
    },
    reqn_type_id: {
      title: 'Requisition Type',
      type: 'enum',
      constant: 'view',
      exclude: true // modified in the model
    },
    deadline_id: {
      title: 'Deadline',
      type: 'enum',
      exclude: true // modified in the model
    },
    user_id: {
      title: 'Owner',
      type: 'lookup-typeahead',
      typeahead: {
        table: 'user',
        select: 'CONCAT( user.first_name, " ", user.last_name, " (", user.name, ")" )',
        where: [ 'user.first_name', 'user.last_name', 'user.name' ]
      },
      constant: 'view'
    },
    graduate_id: {
      title: 'Trainee',
      type: 'enum',
      exclude: 'add'
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
    lay_summary: {
      column: 'reqn_version.lay_summary',
      title: 'Lay Summary',
      type: 'text',
      constant: true,
      exclude: true // modified in the model
    },
    agreement_filename: {
      column: 'agreement_filename',
      title: 'Agreement File',
      type: 'file',
      exclude: true // modified in the model
    },
    instruction_filename: {
      column: 'instruction_filename',
      title: 'Instruction File',
      type: 'file',
      exclude: true // modified in the model
    },
    note: {
      title: 'Administrative Note',
      type: 'text',
      exclude: true // modified in the model
    },

    current_reqn_version_id: { column: 'reqn_version.id', type: 'string', exclude: true },
    data_directory: { type: 'string', exclude: true },
    phase: { column: 'stage_type.phase', type: 'string', exclude: true },
    status: { column: 'stage_type.status', type: 'string', exclude: true },
    decision: { column: 'stage_type.decision', type: 'boolean', exclude: true },
    lang: { type: 'string', column: 'language.code', exclude: true },
    deadline: { type: 'date', column: 'deadline.date', exclude: true }
  } );

  module.addInputGroup( 'Decision and Deferral Notes', {
    decision_notice: {
      title: 'Notice of Decision',
      type: 'text',
      exclude: 'add'
    },
    deferral_note_1a: {
      title: 'Part1: A1',
      type: 'text',
      exclude: 'add'
    },
    deferral_note_1b: {
      title: 'Part1: A2',
      type: 'text',
      exclude: 'add'
    },
    deferral_note_1c: {
      title: 'Part1: A3',
      type: 'text',
      exclude: 'add'
    },
    deferral_note_1d: {
      title: 'Part1: A4',
      type: 'text',
      exclude: 'add'
    },
    deferral_note_1e: {
      title: 'Part1: A5',
      type: 'text',
      exclude: 'add'
    },
    deferral_note_1f: {
      title: 'Part1: A6',
      type: 'text',
      exclude: 'add'
    },
    deferral_note_2a: {
      title: 'Part2: Questionnaires',
      type: 'text',
      exclude: 'add'
    },
    deferral_note_2b: {
      title: 'Part2: Physical Assessment',
      type: 'text',
      exclude: 'add'
    },
    deferral_note_2c: {
      title: 'Part2: Biomarkers',
      type: 'text',
      exclude: 'add'
    },
    deferral_note_2d: {
      title: 'Part2: Genomics',
      type: 'text',
      exclude: 'add'
    },
    deferral_note_2e: {
      title: 'Part2: Linked Data',
      type: 'text',
      exclude: 'add'
    },
    deferral_note_2f: {
      title: 'Part2: Additional Data',
      type: 'text',
      exclude: 'add'
    }
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
      operation: function( $state, model ) { model.viewModel.downloadApplication(); }
    }, {
      title: 'Data Checklist',
      operation: function( $state, model ) { model.viewModel.downloadChecklist(); }
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
    'CnBaseViewFactory',
    'CnReqnHelper', 'CnSession', 'CnHttpFactory', 'CnModalMessageFactory', 'CnModalConfirmFactory', '$window',
    function( CnBaseViewFactory,
              CnReqnHelper, CnSession, CnHttpFactory, CnModalMessageFactory, CnModalConfirmFactory, $window ) {
      var object = function( parentModel, root ) {
        var self = this;
        CnBaseViewFactory.construct( this, parentModel, root );

        this.deferred.promise.then( function() {
          if( angular.isDefined( self.stageModel ) ) self.stageModel.listModel.heading = 'Stage History';
        } );

        this.configureFileInput( 'agreement_filename' );
        this.configureFileInput( 'instruction_filename' );

        angular.extend( this, {
          show: function( subject ) { return CnReqnHelper.showAction( subject, this.record ); },
          abandon: function() {
            return CnReqnHelper.abandon( this.record.getIdentifier(), this.record.lang  ).then( function() {
              self.record.state = 'abandoned';
              if( angular.isDefined( self.notificationModel ) ) self.notificationModel.listModel.onList( true );
            } );
          },
          delete: function() { return CnReqnHelper.delete( this.record.getIdentifier(), this.record.lang ); },
          translate: function( value ) { return CnReqnHelper.translate( 'reqn', value, this.record.lang ); },
          viewReport: function() { return CnReqnHelper.viewReport( this.record.getIdentifier() ); },
          downloadApplication: function() { return CnReqnHelper.download( 'application', this.record.current_reqn_version_id ); },
          downloadChecklist: function() { return CnReqnHelper.download( 'checklist', this.record.current_reqn_version_id ); },
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

              // only allow the deadline to be changed while in the admin review stage
              mainInputGroup.inputList.deadline_id.constant =
                3 > CnSession.role.tier || 'Admin Review' != self.record.stage_type;

              // show the agreement and instruction files if we're past the review stage
              mainInputGroup.inputList.agreement_filename.exclude = 0 > ['active','complete'].indexOf( self.record.phase );
              mainInputGroup.inputList.instruction_filename.exclude = 0 > ['active','complete'].indexOf( self.record.phase );

              // show the study data available if we're in the active phase
              mainInputGroup.inputList.data_available.exclude = 'active' != self.record.phase;

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
            return self.$$onPatch( data ).then( function() {
              // reload the view if we're changing the decision notice (the proceed button's enable state is affected by it)
              if( angular.isDefined( data.decision_notice ) ) return self.onView();
            } );
          },

          deferralNotesExist: function() {
            return this.record.deferral_note_1a || this.record.deferral_note_1b ||
                   this.record.deferral_note_1c || this.record.deferral_note_1d ||
                   this.record.deferral_note_1e || this.record.deferral_note_1f ||
                   this.record.deferral_note_2a || this.record.deferral_note_2b ||
                   this.record.deferral_note_2c || this.record.deferral_note_2d ||
                   this.record.deferral_note_2e || this.record.deferral_note_2f;
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
                  if( angular.isDefined( self.reqnVersionModel ) ) self.reqnVersionModel.listModel.onList( true );
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
        this.isApplicant = function() { return 'applicant' == CnSession.role.name; }
        this.isAdministrator = function() { return 'administrator' == CnSession.role.name; }

        var mainInputGroup = module.inputGroupList.findByProperty( 'title', '' );
        if( 'administrator' == CnSession.role.name ) {
          mainInputGroup.inputList.reqn_type_id.exclude = false;
          mainInputGroup.inputList.deadline_id.exclude = 'add';
          mainInputGroup.inputList.language_id.exclude = false;
          mainInputGroup.inputList.stage_type.exclude = 'add';
          mainInputGroup.inputList.state.exclude = 'add';
          mainInputGroup.inputList.data_available.exclude = 'add';
          mainInputGroup.inputList.note.exclude = false;
        } else {
          mainInputGroup.inputList.title.exclude = false;
          mainInputGroup.inputList.lay_summary.exclude = false;
        }

        this.getEditEnabled = function() {
          var phase = this.viewModel.record.phase ? this.viewModel.record.phase : '';
          var state = this.viewModel.record.state ? this.viewModel.record.state : '';
          var stage_type = this.viewModel.record.stage_type ? this.viewModel.record.stage_type : '';

          var check = false;
          if( 'applicant' == CnSession.role.name ) {
            check = 'new' == phase || ( 'deferred' == state && 'review' == phase );
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

        // override transitionToAddState
        this.transitionToViewState = function( record ) {
          if( this.isApplicant() ) $state.go( 'reqn_version.view', { identifier: record.reqn_version_id } );
          else this.$$transitionToViewState( record );
        };

        // override the service collection
        this.getServiceData = function( type, columnRestrictLists ) {
          // only include the funding and ethics filenames in the view type in the lite instance
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
