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
      },
      unprepared: {
        column: 'stage.unprepared',
        title: 'Prep Required',
        type: 'boolean',
        isIncluded: function( $state, model ) { return !model.isApplicant(); }
      }
    },
    defaultOrder: {
      column: 'reqn.identifier',
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
      type: 'enum'
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
    unprepared: {
      title: 'Preparation Required',
      type: 'string',
      constant: true,
      exclude: true // modified in the model
    },

    // the following are for the form and will not appear in the view
    phase: { column: 'stage_type.phase', type: 'string', exclude: true },
    status: { column: 'stage_type.status', type: 'string', exclude: true },
    language: { type: 'string', column: 'language.code', exclude: true },
    deadline: { type: 'date', column: 'deadline.date', exclude: true },
    applicant_name: { type: 'string', exclude: true },
    applicant_position: { type: 'string', exclude: true },
    applicant_affiliation: { type: 'string', exclude: true },
    applicant_address: { type: 'string', exclude: true },
    applicant_phone: { type: 'string', exclude: true },
    applicant_email: { type: 'string', format: 'email', exclude: true },
    graduate_name: { type: 'string', exclude: true },
    graduate_program: { type: 'string', exclude: true },
    graduate_institution: { type: 'string', exclude: true },
    graduate_address: { type: 'string', exclude: true },
    graduate_phone: { type: 'string', exclude: true },
    graduate_email: { type: 'string', format: 'email', exclude: true },
    start_date: { type: 'date', exclude: true },
    duration: { type: 'string', exclude: true },
    title: { type: 'string', exclude: true },
    keywords: { type: 'string', exclude: true },
    lay_summary: { type: 'string', exclude: true },
    background: { type: 'text', exclude: true },
    objectives: { type: 'text', exclude: true },
    methodology: { type: 'text', exclude: true },
    analysis: { type: 'text', exclude: true },
    funding: { type: 'enum', exclude: true },
    funding_agency: { type: 'string', exclude: true },
    grant_number: { type: 'string', exclude: true },
    ethics: { type: 'boolean', exclude: true },
    ethics_date: { type: 'date', exclude: true },
    ethics_filename: { type: 'string', exclude: true },
    waiver: { type: 'enum', exclude: true },
    qnaire: { type: 'boolean', exclude: true },
    qnaire_comment: { type: 'text', exclude: true },
    physical: { type: 'boolean', exclude: true },
    physical_comment: { type: 'text', exclude: true },
    biomarker: { type: 'boolean', exclude: true },
    biomarker_comment: { type: 'text', exclude: true },
  } );

  module.addInputGroup( 'Deferral Notes', {
    deferral_note_part1_a1: {
      title: 'Part1 A1',
      type: 'text',
    },
    deferral_note_part1_a2: {
      title: 'Part1 A2',
      type: 'text',
    },
    deferral_note_part1_a3: {
      title: 'Part1 A3',
      type: 'text',
    },
    deferral_note_part1_a4: {
      title: 'Part1 A4',
      type: 'text',
    },
    deferral_note_part1_a5: {
      title: 'Part1 A5',
      type: 'text',
    },
    deferral_note_part1_a6: {
      title: 'Part1 A6',
      type: 'text',
    },
    deferral_note_part2_a: {
      title: 'Part2 A',
      type: 'text',
    },
    deferral_note_part2_b: {
      title: 'Part2 B',
      type: 'text',
    },
    deferral_note_part2_c: {
      title: 'Part2 C',
      type: 'text',
    }
  } );

  module.addExtraOperation( 'view', {
    title: 'View Form',
    operation: function( $state, model ) {
      $state.go( 'reqn.form', { identifier: model.viewModel.record.getIdentifier() } );
    }
  } );

  module.addExtraOperationGroup( 'view', {
    title: 'Special Operation',
    classes: 'btn-warning',
    isIncluded: function( $state, model ) { return model.viewModel.showDefer() || model.viewModel.showReject(); },
    operations: [ {
      title: 'Defer to Applicant',
      isIncluded: function( $state, model ) { return model.viewModel.showDefer(); },
      operation: function( $state, model ) { model.viewModel.defer(); }
    }, {
      title: 'Mark as Prepared',
      isIncluded: function( $state, model ) { return model.viewModel.showPrepare(); },
      operation: function( $state, model ) { model.viewModel.prepare(); }
    }, {
      title: 'Reject',
      isIncluded: function( $state, model ) { return model.viewModel.showReject(); },
      operation: function( $state, model ) { model.viewModel.reject(); }
    }, {
      title: 'Re-activate',
      isIncluded: function( $state, model ) { return model.viewModel.showReactivate(); },
      operation: function( $state, model ) { model.viewModel.reactivate(); }
    } ]
  } );

  module.addExtraOperation( 'view', {
    title: 'Next Stage',
    classes: 'btn-success',
    isIncluded: function( $state, model ) { return model.viewModel.showNextStage(); },
    operation: function( $state, model ) { model.viewModel.nextStage(); }
  } );

  module.addExtraOperationGroup( 'view', {
    title: 'Apply Decision',
    classes: 'btn-primary',
    isIncluded: function( $state, model ) { return model.viewModel.showDecide(); },
    operations: [ {
      title: 'Approved',
      operation: function( $state, model ) { model.viewModel.decide( 'yes' ); }
    }, {
      title: 'Conditional',
      operation: function( $state, model ) { model.viewModel.decide( 'conditional' ); }
    }, {
      title: 'Not Approved',
      operation: function( $state, model ) { model.viewModel.decide( 'no' ); }
    } ]
  } );

  module.addExtraOperation( 'view', {
    title: 'Download',
    operation: function( $state, model ) { model.viewModel.downloadForm(); }
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
    'CnReqnModelFactory', 'cnRecordViewDirective', 'CnSession', '$q',
    function( CnReqnModelFactory, cnRecordViewDirective, CnSession, $q ) {
      // used to piggy-back on the basic view controller's functionality (but not used in the DOM)
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

            // define the earliest date that the reqn may start
            scope.minStartDate = moment( scope.model.viewModel.record.deadline )
                                 .add( CnSession.application.startDateDelay, 'months' );
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
            scope.model.viewModel.wordCount.background = text ? text.split( ' ' ).length : 0;
          } );
          scope.$watch( 'model.viewModel.record.objectives', function( text ) {
            scope.model.viewModel.wordCount.objectives = text ? text.split( ' ' ).length : 0;
          } );
          scope.$watch( 'model.viewModel.record.methodology', function( text ) {
            scope.model.viewModel.wordCount.methodology = text ? text.split( ' ' ).length : 0;
          } );
          scope.$watch( 'model.viewModel.record.analysis', function( text ) {
            scope.model.viewModel.wordCount.analysis = text ? text.split( ' ' ).length : 0;
          } );
        },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnReqnModelFactory.root;
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
    'CnBaseViewFactory', 'CnCoapplicantModelFactory', 'CnReferenceModelFactory',
    'CnHttpFactory', 'CnModalMessageFactory', 'CnModalConfirmFactory', '$q',
    function( CnBaseViewFactory, CnCoapplicantModelFactory, CnReferenceModelFactory,
              CnHttpFactory, CnModalMessageFactory, CnModalConfirmFactory, $q ) {
      var object = function( parentModel, root ) {
        var self = this;
        CnBaseViewFactory.construct( this, parentModel, root );
        this.coapplicantModel = CnCoapplicantModelFactory.instance();
        this.coapplicantModel.metadata.getPromise(); // needed to get the coapplicant's metadata
        this.coapplicantList = [];
        this.referenceModel = CnReferenceModelFactory.instance();
        this.referenceModel.metadata.getPromise(); // needed to get the reference's metadata
        this.referenceList = [];
        this.dataOptionValueList = [];
        this.charCount = { lay_summary: 0 };
        this.wordCount = { background: 0, objectives: 0, methodology: 0, analysis: 0 };
        this.uploadingEthicsFile = false;

        this.deferred.promise.then( function() {
          if( angular.isDefined( self.stageModel ) ) self.stageModel.listModel.heading = 'Stage History';
        } );

        this.translate = function( value ) {
          return cenozoApp.translate( this.parentModel.lookupData, value, this.record.language );
        };

        // setup language and tab state parameters
        this.toggleLanguage = function() {
          this.record.language = 'en' == this.record.language ? 'fr' : 'en';
          return CnHttpFactory.instance( {
            path: this.parentModel.getServiceResourcePath(),
            data: { language: this.record.language }
          } ).patch();
        };

        // the sequencial list of all tabs where every item has an array of the three indexed tab values
        this.tab = [];
        this.tabSectionList = [
          [ 'instructions', null, null ],
          [ 'part1', 'a1', null ],
          [ 'part1', 'a2', null ],
          [ 'part1', 'a3', null ],
          [ 'part1', 'a4', null ],
          [ 'part1', 'a5', null ],
          [ 'part1', 'a6', null ],
          [ 'part2', null, 'notes' ],
          [ 'part2', null, 'a' ],
          [ 'part2', null, 'b' ],
          [ 'part2', null, 'c' ],
          [ 'part3', null, null ]
        ];

        this.setTab = function( index, tab, transition ) {
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
        };

        this.nextSection = function( reverse ) {
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
        };

        this.deferralNotesExist = function() {
          return this.record.deferral_note_part1_a1 || this.record.deferral_note_part1_a2 ||
                 this.record.deferral_note_part1_a3 || this.record.deferral_note_part1_a4 ||
                 this.record.deferral_note_part1_a5 || this.record.deferral_note_part1_a6 ||
                 this.record.deferral_note_part2_a || this.record.deferral_note_part2_b ||
                 this.record.deferral_note_part2_c;
        };

        this.getCoapplicantList = function() {
          return CnHttpFactory.instance( {
            path: this.parentModel.getServiceResourcePath() + '/coapplicant',
            data: {
              select: { column: [ 'id', 'name', 'position', 'affiliation', 'email', 'role', 'access' ] },
              modifier: { order: 'id', limit: 1000000 }
            }
          } ).query().then( function( response ) {
            self.coapplicantList = response.data;
          } );
        }

        this.removeCoapplicant = function( id ) {
          return CnHttpFactory.instance( {
            path: this.parentModel.getServiceResourcePath() + '/coapplicant/' + id
          } ).delete().then( function() {
            return self.getCoapplicantList();
          } );
        }

        this.getReferenceList = function() {
          return CnHttpFactory.instance( {
            path: this.parentModel.getServiceResourcePath() + '/reference',
            data: {
              select: { column: [ 'id', 'rank', 'reference' ] },
              modifier: { order: 'rank', limit: 1000000 }
            }
          } ).query().then( function( response ) {
            self.referenceList = response.data;
          } );
        }

        this.setReferenceRank = function( id, rank ) {
          return CnHttpFactory.instance( {
            path: this.parentModel.getServiceResourcePath() + '/reference/' + id,
            data: { rank: rank }
          } ).patch().then( function() {
            return self.getReferenceList();
          } );
        }

        this.removeReference = function( id ) {
          return CnHttpFactory.instance( {
            path: this.parentModel.getServiceResourcePath() + '/reference/' + id
          } ).delete().then( function() {
            return self.getReferenceList();
          } );
        }

        this.updateEthicsFileSize = function() {
          return CnHttpFactory.instance( {
            path: this.parentModel.getServiceResourcePath() + '?letter=1'
          } ).get().then( function( response ) {
            self.record.ethicsFileSize = response.data;
          } );
        };

        this.downloadEthicsFile = function() {
          return CnHttpFactory.instance( {
            path: this.parentModel.getServiceResourcePath() + '?letter=1',
            format: 'unknown'
          } ).file();
        };

        this.removeEthicsFile = function() {
          return this.onPatch( { ethics_filename: null } ).then( function() {
            return self.updateEthicsFileSize();
          } );
        };

        this.uploadEthicsFile = function() {
          this.uploadingEthicsFile = true;
          var data = new FormData();
          data.append( 'file', this.ethicsFile );
          var fileDetails = data.get( 'file' );

          // update the filename
          return CnHttpFactory.instance( {
            path: this.parentModel.getServiceResourcePath(),
            data: { ethics_filename: fileDetails.name }
          } ).patch().then( function() {
            self.record.ethics_filename = fileDetails.name;

            // upload the file
            return CnHttpFactory.instance( {
              path: self.parentModel.getServiceResourcePath() + '?letter=1',
              data: self.ethicsFile,
              format: 'unknown'
            } ).patch()
          } ).then( function() { return self.updateEthicsFileSize(); } )
             .finally( function() { self.uploadingEthicsFile = false; } );
        };

        this.getDataOptionValueList = function() {
          self.dataOptionValueList = [];
          return CnHttpFactory.instance( {
            path: 'data_option',
            data: { select: { column: [ { column: 'MAX(id)', alias: 'maxId', table_prefix: false } ] } }
          } ).get().then( function( response ) {
            for( var i = 0; i <= response.data[0].maxId; i++ ) self.dataOptionValueList[i] = false;
          } ).then( function() {
            return CnHttpFactory.instance( {
              path: self.parentModel.getServiceResourcePath() + '/data_option',
              data: { select: { column: [ 'id' ] } }
            } ).query().then( function( response ) {
              response.data.forEach( function( dataOption ) { self.dataOptionValueList[dataOption.id] = true; } );
            } );
          } );
        }

        this.setDataOptionValue = function( dataOptionId ) {
          var add = this.dataOptionValueList[dataOptionId];

          var http = CnHttpFactory.instance( {
            path: this.parentModel.getServiceResourcePath() + '/data_option' + ( add ? '' : '/' + dataOptionId ),
            data: add ? { add: dataOptionId } : undefined,
            onError: function( response ) {
              // 409 means the data option has already been added
              // 404 means the data option has already been deleted
              var ignoreCode = add ? 409 : 404;
              if( ignoreCode != response.status ) {
                self.dataOptionValueList[dataOptionId] = !self.dataOptionValueList[dataOptionId];
                CnModalMessageFactory.httpError( response );
              }
            }
          } );
          return add ? http.post() : http.delete();
        };

        this.showDelete = function() {
          return 'new' == this.record.phase && this.parentModel.getEditEnabled();
        };

        this.showSubmit = function() {
          return this.parentModel.isApplicant() && (
            'new' == this.record.phase || 'deferred' == this.record.state
          ) && this.parentModel.getEditEnabled();
        };
        this.submit = function() {
          return CnModalConfirmFactory.instance( {
            title: this.translate( 'misc.pleaseConfirm' ),
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
                a6: [ 'ethics' ]
              };

              var error = null;
              var errorTab = null;
              for( var tab in requiredTabList ) {
                var firstProperty = null;
                requiredTabList[tab].forEach( function( property ) {
                  if( null === self.record[property] || '' === self.record[property] ) {
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
                if( null != self.record.lay_summary && 1000 < self.record.lay_summary.length ) {
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
                CnModalMessageFactory.instance( error ).show().then( function() { self.setTab( 1, errorTab ); } );
              } else {
                return CnHttpFactory.instance( {
                  path: self.parentModel.getServiceResourcePath() + "?action=submit",
                  onError: function( response ) {
                    if( 409 == response.status ) {
                      CnModalMessageFactory.instance( {
                        title: self.translate( 'misc.invalidStartDateTitle' ),
                        message: self.translate( 'misc.invalidStartDateMessage' ),
                        error: true
                      } ).show().then( function() {
                        self.onView( true ).then( function() {
                          var element = cenozo.getFormElement( 'start_date' );
                          element.$error.custom = self.translate( 'misc.invalidStartDateTitle' );
                          cenozo.updateFormElement( element, true );
                          self.setTab( 1, 'a3' );
                        } );
                      } );
                    } else CnModalMessageFactory.httpError( response );
                  }
                } ).patch().then( function() { self.transitionOnViewParent(); } );
              }
            }
          } );
        };

        this.showNextStage = function() {
          return this.parentModel.isAdministrator() &&
                 !this.record.state && (
                   ( 'review' == this.record.phase && 'SMT Review' != this.record.stage_type ) ||
                   ( 'agreement' == this.record.phase && 'Report Required' != this.record.stage_type )
                 );
        };
        this.nextStage = function() {
          var message = 'Are you sure you wish to proceed to the next stage?';
          if( this.deferralNotesExist() ) {
            message += '\n\nWARNING: there are deferral notes present, you may wish to remove them before ' +
                       'proceeding to the next stage.';
          }
          return CnModalConfirmFactory.instance( {
            message: message
          } ).show().then( function( response ) {
            if( response ) {
              return CnHttpFactory.instance( {
                path: self.parentModel.getServiceResourcePath() + "?action=next_stage"
              } ).patch().then( function() {
                self.transitionOnViewParent();
              } );
            }
          } );
        };

        this.downloadForm = function() {
          return CnHttpFactory.instance( {
            path: this.parentModel.getServiceResourcePath(),
            format: 'pdf'
          } ).file();
        };

        this.showDecide = function() {
          return this.parentModel.getEditEnabled() &&
                 this.parentModel.isAdministrator() &&
                 'SMT Review' == this.record.stage_type &&
                 !this.record.state;
        };
        this.decide = function( decision ) {
          return CnModalConfirmFactory.instance( {
            message: 'Are you sure you wish to mark the ' + this.parentModel.module.name.singular + ' as ' + (
              'yes' == decision ? 'approved' :
              'conditional' == decision ? 'conditionally approved' :
              'not approved'
            ) + '?'
          } ).show().then( function( response ) {
            if( response ) {
              return CnHttpFactory.instance( {
                path: self.parentModel.getServiceResourcePath() + "?action=decide&approve=" + decision
              } ).patch().then( function() {
                self.transitionOnViewParent();
              } );
            }
          } );
        };

        this.showReject = function() {
          return this.parentModel.isAdministrator() &&
                 'rejected' != this.record.state &&
                 ( 'review' == this.record.phase || 'deferred' == this.record.state );
        };
        this.reject = function() {
          return CnModalConfirmFactory.instance( {
            message: 'Please ensure that rejection information is ready for the applicant before proceeding.' +
                     '\n\nDo you wish to proceed?'
          } ).show().then( function( response ) {
            if( response ) {
              return CnHttpFactory.instance( {
                path: self.parentModel.getServiceResourcePath() + "?action=reject"
              } ).patch().then( function() {
                self.record.state = 'rejected';
              } );
            }
          } );
        };

        this.showDefer = function() {
          return this.parentModel.getEditEnabled() &&
                 'deferred' != this.record.state &&
                 ( 'review' == this.record.phase || 'agreement' == this.record.phase );
        };
        this.defer = function() {
          var message = 'Are you sure you wish to defer to the applicant?';
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
              } );
            }
          } );
        };

        this.showAbandon = function() {
          return 'deferred' == this.record.state && 'review' == this.record.phase;
        };
        this.abandon = function() {
          return CnHttpFactory.instance( {
            path: this.parentModel.getServiceResourcePath() + "?action=abandon"
          } ).patch().then( function() {
            self.record.state = 'abandoned';
            self.transitionOnViewParent();
          } );
        };

        this.showReactivate = function() {
          return this.parentModel.isAdministrator() &&
                 ( 'abandoned' == this.record.state || 'rejected' == this.record.state );
        };
        this.reactivate = function() {
          return CnModalConfirmFactory.instance( {
            message: 'Are you sure you want to re-activate the ' + this.parentModel.module.name.singular + '?' +
              '\n\nThis will return to its previous "' + this.parentModel.viewModel.record.stage_type + '" stage.'
          } ).show().then( function( response ) {
            if( response ) {
              return CnHttpFactory.instance( {
                path: self.parentModel.getServiceResourcePath() + "?action=reactivate"
              } ).patch().then( function() {
                self.record.state = '';
              } );
            }
          } );
        };

        this.showPrepare = function() {
          return this.parentModel.isAdministrator() && 'Yes' == this.record.unprepared && !this.record.state;
        };
        this.prepare = function() {
          return CnHttpFactory.instance( {
            path: this.parentModel.getServiceResourcePath() + "?action=prepare"
          } ).patch().then( function() {
            self.record.unprepared = 'No';
            return self.stageModel.listModel.onList( true );
          } );
        };

        this.onView = function( force ) {
          // reset tab values
          this.setTab( 0, this.parentModel.getQueryParameter( 't0' ), false );
          this.setTab( 1, this.parentModel.getQueryParameter( 't1' ), false );
          this.setTab( 2, this.parentModel.getQueryParameter( 't2' ), false );

          return $q.all( [
            this.$$onView( force ).then( function() {
              return self.updateEthicsFileSize();
            } ),
            this.getCoapplicantList(),
            this.getReferenceList(),
            this.getDataOptionValueList()
          ] );
        }
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
      var object = function( root ) {
        var self = this;
        CnBaseModelFactory.construct( this, module );
        this.listModel = CnReqnListFactory.instance( this );
        this.viewModel = CnReqnViewFactory.instance( this, root );

        // override the service collection path so that applicants can view their requisitions from the home screen
        this.getServiceCollectionPath = function() {
          // ignore the parent if it is root
          return this.$$getServiceCollectionPath( 'root' == this.getSubjectFromState() );
        };

        // make the input lists from all groups more accessible
        this.inputList = {};
        module.inputGroupList.forEach( group => Object.assign( self.inputList, group.inputList ) );

        this.isApplicant = function() { return 'applicant' == CnSession.role.name; }
        this.isAdministrator = function() { return 'administrator' == CnSession.role.name; }

        if( this.isAdministrator() ) {
          var mainInputGroup = module.inputGroupList.findByProperty( 'title', '' );
          mainInputGroup.inputList.stage_type.exclude = false;
          mainInputGroup.inputList.state.exclude = false;
          mainInputGroup.inputList.unprepared.exclude = false;
        }

        this.getEditEnabled = function() {
          var phase = this.viewModel.record.phase;
          var roleCheck = 'applicant' == CnSession.role.name
                        ? 'new' == phase || ( 'review' == phase && 'deferred' == this.viewModel.record.state )
                        : 'administrator' == CnSession.role.name
                        ? 'new' == phase || ( 'review' == phase && !this.viewModel.record.state )
                        : false;
          return this.$$getEditEnabled() && roleCheck;
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

        this.dataOptionParentList = [];
        this.dataOptionList = [];

        this.getMetadata = function() {
          return $q.all( [
            self.$$getMetadata().then( function() {
              // create coapplicant access enum
              self.metadata.accessEnumList = {
                en: [ { value: true, name: 'Yes' }, { value: false, name: 'No' } ],
                fr: [ { value: true, name: 'Oui' }, { value: false, name: 'Non' } ]
              };

              // create ethics enum
              self.metadata.columnList.ethics.enumList = {
                en: [ {value:'',name:'(choose)'}, {value:true,name:'Yes'}, {value:false,name:'No'} ],
                fr: [ {value:'',name:'(choisir)'}, {value:true,name:'Oui'}, {value:false,name:'Non'} ]
              };

              // translate funding enum
              self.metadata.columnList.funding.enumList = {
                en: self.metadata.columnList.funding.enumList,
                fr: angular.copy( self.metadata.columnList.funding.enumList )
              };
              self.metadata.columnList.funding.enumList.fr[0].name = 'oui';
              self.metadata.columnList.funding.enumList.fr[1].name = 'non';
              self.metadata.columnList.funding.enumList.fr[2].name = 'demandé';

              self.metadata.columnList.funding.enumList.en.unshift( { value: '', name: '(choose)' } );
              self.metadata.columnList.funding.enumList.fr.unshift( { value: '', name: '(choisir)' } );

              // translate waiver enum
              self.metadata.columnList.waiver.enumList.unshift( { value: '', name: 'none' } );
              self.metadata.columnList.waiver.enumList = {
                en: self.metadata.columnList.waiver.enumList,
                fr: angular.copy( self.metadata.columnList.waiver.enumList )
              };
              self.metadata.columnList.waiver.enumList.en[1].name =
                 'Fee Waiver for Graduate student (MSc or PhD) for thesis only';
              self.metadata.columnList.waiver.enumList.en[2].name =
                 'Fee Waiver for Postdoctoral Fellow (limit 1 waiver for postdoctoral studies)';
              self.metadata.columnList.waiver.enumList.fr[0].name = 'aucun';
              self.metadata.columnList.waiver.enumList.fr[1].name =
                'Exonération pour un étudiant des cycles supérieurs (M. Sc. ou Ph. D.) pour la thèse seulement';
              self.metadata.columnList.waiver.enumList.fr[2].name =
                'Exonération pour un boursier postdoctoral ' +
                '(limite d’une exonération pour les études postdoctorales)';

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
            } ),

            CnHttpFactory.instance( {
              path: 'data_option_parent',
              data: {
                select: { column: [ 'id', 'name_en', 'name_fr', 'note_en', 'note_fr' ] },
                modifier: { limit: 1000000 }
              }
            } ).query().then( function( response ) {
              response.data.forEach( function( dataOptionParent ) {
                self.dataOptionParentList.push( {
                  id: null,
                  parentId: dataOptionParent.id,
                  name: { en: dataOptionParent.name_en, fr: dataOptionParent.name_fr },
                  note: { en: dataOptionParent.note_en, fr: dataOptionParent.note_fr },
                  parent: true
                } );
              } );

              return CnHttpFactory.instance( {
                path: 'data_option_subcategory',
                data: {
                  select: { column: [
                    'type', 'name_en', 'name_fr', 'note_en', 'note_fr', {
                      column: 'id',
                      alias: 'catId'
                    }, {
                      table: 'data_option',
                      column: 'id',
                      alias: 'optionId'
                    }, {
                      column: 'data_option_parent_id',
                      alias: 'parentId'
                    }, {
                      table: 'data_option',
                      column: 'type',
                      alias: 'option_type'
                    }, {
                      table: 'data_option',
                      column: 'replacement_en'
                    }, {
                      table: 'data_option',
                      column: 'replacement_fr'
                    }
                  ] },
                  modifier: {
                    join: [ {
                      table: 'data_option',
                      onleft: 'data_option_subcategory.id',
                      onright: 'data_option.data_option_subcategory_id'
                    } ],
                    order: [ 'data_option_subcategory.type', 'data_option_subcategory.rank' ],
                    limit: 1000000
                  }
                }
              } ).query().then( function( response ) {
                var currentType = null;
                var currentCatId = null;
                var currentParentId = null;
                response.data.forEach( function( dataOption ) {
                  var type = dataOption.type;
                  if( currentType != type ) {
                    // insert the new dataOption type if it doesn't already exist
                    if( angular.isUndefined( self.dataOptionList[type] ) ) self.dataOptionList[type] = [];
                    currentType = type;
                  }

                  if( currentParentId != dataOption.parentId ) {
                    // insert the parent
                    if( null != dataOption.parentId ) {
                      self.dataOptionList[type].push(
                        self.dataOptionParentList.findByProperty( 'parentId', dataOption.parentId )
                      );
                    } else {
                      self.dataOptionList[type].push( {
                        id: null,
                        parentId: null,
                        name: { en: '', fr: '' },
                        note: { en: null, fr: null },
                        parent: true
                      } );
                    }
                    currentParentId = dataOption.parentId;
                  }

                  if( currentCatId != dataOption.catId ) {
                    // insert the data option subcategory
                    self.dataOptionList[type].push( {
                      catId: dataOption.catId,
                      parentId: dataOption.parentId,
                      name: { en: dataOption.name_en, fr: dataOption.name_fr },
                      note: { en: dataOption.note_en, fr: dataOption.note_fr },
                      typeList: {},
                      parent: false
                    } );
                    currentCatId = dataOption.catId;
                  }

                  // insert the data option
                  self.dataOptionList[type]
                      .findByProperty( 'catId', dataOption.catId )
                      .typeList[dataOption.option_type] = {
                    id: dataOption.optionId,
                    replacement: { en: dataOption.replacement_en, fr: dataOption.replacement_fr }
                  };
                } );
              } );
            } )
          ] );
        };

        // fill in the start date delay
        CnSession.promise.then( function() {
          self.lookupData.part1.a3.text.en =
            self.lookupData.part1.a3.text.en.replace( '...', CnSession.application.startDateDelay );
          self.lookupData.part1.a3.text.fr =
            self.lookupData.part1.a3.text.fr.replace( '...', CnSession.application.startDateDelay );
        } );

        this.lookupData = {
          heading: {
            en: 'Data and Biospecimen Request Application',
            fr: 'Demande d’accès aux données et aux échantillons'
          },
          instructions: {
            tab: { en: 'Instructions', fr: 'Consignes' },
            title: {
              en: 'Instructions for completing an application',
              fr: 'Consignes pour remplir une demande'
            },
            text1: {
              en: 'Please consult the CLSA website for instructions, and policies and procedures for CLSA data and biospecimen access: <a href="http://www.clsa-elcv.ca/data-access" target="clsa">www.clsa-elcv.ca/data-access</a>. Applicants are also encouraged to review the pertinent sections of the relevant CLSA protocol(s), Data Collection Tools and Physical Assessments in advance of completing the application. Additional information on the variables in the CLSA dataset is on the <strong>CLSA Data Preview Portal</strong>.',
              fr: 'Veuillez consulter les consignes, les politiques et la procédure de demande d’accès aux données et aux échantillons sur le site Web de l’ÉLCV : <a href="https://www.clsa-elcv.ca/fr/acces-aux-donnees" target="clsa">www.clsa-elcv.ca/fr/acces-aux-donnees</a>. Nous encourageons les demandeurs à consulter les sections pertinentes du protocole de l’ÉLCV (en anglais seulement), les outils de collecte de données et les tests physiques avant de remplir une demande d’accès. Des informations supplémentaires sur les variables contenues dans l’ensemble de données de l’ÉLCV sont disponibles sur le <strong>Portail de données de l’ÉLCV</strong>.'
            },
            text2: {
              en: 'Consult us for any questions regarding your application at <a href="mailto:access@clsa-elcv.ca">access@clsa-elcv.ca</a>.',
              fr: 'Veuillez nous transmettre toute question relative aux demandes d’accès aux données de l’ÉLCV en écrivant à <a href="mailto:access@clsa-elcv.ca">access@clsa-elcv.ca</a>.'
            },
            text3: {
              en: 'The application is composed of 3 parts:<ul><li>Part 1: General Project Information</li><li>Part 2: Data Checklist</li><li>Part 3: Biospecimen Checklist</li></ul>',
              fr: 'La demande est séparée en trois parties :<ul><li>1<sup>re</sup> partie : Renseignements généraux</li><li>2<sup>e</sup> partie : Sélection des données</li><li>3<sup>e</sup> partie : Sélection des échantillons biologiques</li></ul>'
            },
            text4: {
              en: 'Additional information or instructions are available anywhere that the ⓘ symbol appears.  Hover your mouse cursor over the text to see the additional details.',
              fr: 'TRANSLATION REQUIRED'
            },
            text5: {
              en: 'Please ensure that you have completed <strong>all of the sections of the application</strong> form that are relevant to your application. Incomplete applications may result in processing delays or refusal of your application.',
              fr: 'Assurez-vous de bien remplir <strong>toutes les sections pertinentes du formulaire de demande d’accès</strong>.  Les demandes incomplètes pourront causer un retard dans le traitement de votre demande ou entraîner un refus.'
            }
          },
          part1: {
            tab: { en: 'Part 1', fr: '1<sup>re</sup> partie' },
            title: {
              en: 'Part 1 of 3: General Project Information',
              fr: 'Partie 1 de 3 : Renseignements généraux'
            },
            a1: {
              tab: { en: 'A1. Applicant', fr: 'A1. Demandeur' },
              text1: {
                en: '<strong>Primary Applicant</strong>: The primary applicant will be the contact person for the CLSA Access Agreement as well as for the data release and any relevant updates.',
                fr: '<strong>Demandeur principal</strong> : Le demandeur principal sera la personne-ressource pour l’Entente d’accès de l’ÉLCV, ainsi que pour la transmission des données et toute mise à jour pertinente.'
              },
              text2: {
                en: 'For <strong>Graduate student</strong> (MSc, PhD) applications, the primary applicant must be the supervisor and the student must be clearly identified. <strong>Postdoctoral Fellows</strong> are permitted to apply as a primary applicant, but the application must be co-signed by their supervisor. If requesting a Fee Waiver, the Postdoctoral Fellow must be listed as the primary applicant.',
                fr: 'Pour les <strong>demandes faites par des étudiants des cycles supérieurs</strong> (M. Sc., Ph. D.), le demandeur principal doit être le superviseur et l’étudiant doit être clairement identifié. Les <strong>boursiers postdoctoraux</strong> peuvent soumettre une demande à titre de demandeur principal, mais celle-ci doit être cosignée par leur superviseur (voir les sections A7 et A8). Le boursier postdoctoral doit être le demandeur principal pour bénéficier d’une exonération des frais.'
              },
              applicant_name: { en: 'Name', fr: 'Nom' },
              applicant_position: { en: 'Position', fr: 'Poste' },
              applicant_affiliation: { en: 'Affiliation', fr: 'Organisme d’appartenance' },
              applicant_address: { en: 'Mailing Address', fr: 'Adresse de correspondance' },
              applicant_phone: { en: 'Phone', fr: 'Téléphone' },
              applicant_email: { en: 'E-mail', fr: 'Courriel' },
              text3: {
                en: 'Complete this section if this is a Graduate student or Postdoctoral Fellow application (if Fellow is not the primary applicant)',
                fr: 'Remplir cette section si la demande est faite par un étudiant des cycles supérieurs ou un boursier postdoctoral (si le boursier n’est pas le demandeur principal)'
              },
              graduate_name: { en: 'Name', fr: 'Nom' },
              graduate_program: { en: 'Degree and Program of Study', fr: 'Grade et programme d’étude' },
              graduate_institution: { en: 'Institution of Enrollment', fr: 'Établissement d’étude' },
              graduate_address: { en: 'Current Mailing Address', fr: 'Adresse de correspondance actuelle' },
              graduate_phone: { en: 'Phone', fr: 'Téléphone' },
              graduate_email: { en: 'E-mail', fr: 'Courriel' },
              text4: {
                en: 'In order to be eligible for the Fee Waiver for Graduate students, the application must clearly indicate that the proposed project forms part of a thesis. In order to be eligible for the Fee Waiver for Postdoctoral Fellows, the Fellow must be the primary applicant and the supervisor must sign the application.',
                fr: 'Pour que les étudiants des cycles supérieurs soient admissibles à l’exonération des frais, la demande doit indiquer clairement que le projet proposé s’inscrit dans une thèse (voir la section A1). Pour que les boursiers postdoctoraux soient admissibles à l’exonération des frais, le boursier doit être le demandeur principal et le superviseur doit signer la demande.'
              },
              waiver: { en: 'Fee Waiver Type', fr: 'Type d’exemption de frais' }
            },
            a2: {
              tab: { en: 'A2. Project Team', fr: 'A2. Équipe de projet' },
              text: {
                en: 'All Co-Applicants and Other Personnel must be listed in the table below. Please note that changes to the project team, including change of Primary Applicant and addition or removal of Co-Applicants and Support Personnel <strong>require an amendment</strong>. To request an Amendment Form, please email <a href="mailto:access@clsa-elcv.ca">access@clsa-elcv.ca</a>.',
                fr: 'Tous les codemandeurs et les membres du personnel de soutien doivent être identifiés dans le tableau suivant. Veuillez noter que tout changement à l’équipe de projet y compris un changement de demandeur principal et l’ajout ou le retrait d’un codemandeur ou d’un membre du personnel de soutien <strong>nécessite une modification</strong>. Pour obtenir le formulaire de modification, écrivez àeilto:access@clsa-elcv.ca">access@clsa-elcv.ca</a>.'
              },
              noCoapplicants: {
                en: 'No co-applicants have been added.',
                fr: 'TRANSLATION REQUIRED'
              },
              name: { en: 'Name', fr: 'Nom' },
              position: { en: 'Position', fr: 'Poste' },
              affiliation: { en: 'Affiliation', fr: 'Organisme d’appartenance' },
              email: { en: 'E-mail', fr: 'Courriel' },
              role: { en: 'Role', fr: 'Rôle' },
              access: { en: 'Requires Access to Data', fr: 'Doit avoir accès aux données' },
              addCoapplicant: { en: 'Add Co-Applicant', fr: 'Ajouter codemandeurs' }
            },
            a3: {
              tab: { en: 'A3. Timeline', fr: 'A3. Échéancier' },
              text: {
                en: 'What is the anticipated time frame for this proposed project? In planning for your project, please consider in your time frame at least ... months from the application submission deadline to the time you receive your dataset.',
                fr: 'Quel est l’échéancier prévu du projet proposé? Lors de la planification de votre projet, veuillez prévoir au moins ... mois à compter de la date limite de soumission de votre candidature pour recevoir votre ensemble de données.'
              },
              deadline: { en: 'Application submission deadline', fr: 'Date limite de soumission' },
              start_date: { en: 'Anticipated start date', fr: 'Date prévue de début' },
              duration: { en: 'Proposed project duration', fr: 'Durée proposée du projet' }
            },
            a4: {
              tab: { en: 'A4. Description', fr: 'A4. Description' },
              text1: {
                en: 'Please adhere to word count and page limits.',
                fr: 'Veuillez respecter le nombre de mots et la limite de pages.'
              },
              title: { en: 'Project Title', fr: 'Titre du projet' },
              keywords: { en: 'Keywords', fr: 'Mots clés' },
              keywords_text: {
                en: 'Please provide 3-5 keywords describing your project.',
                fr: 'Veuillez fournir 3 à 5 mots clés décrivant votre projet.'
              },
              lay_summary: { en: 'Lay Summary', fr: 'Résumé non scientifique' },
              lay_summary_text: {
                en: 'Please provide a lay language summary of your project (<strong>maximum 1000 characters</strong>) suitable for posting on the CLSA website if your application is approved. Please ensure that the lay summary provides a stand-alone, informative description of your project.',
                fr: 'Veuillez fournir un résumé non scientifique de votre projet (<strong>TRANSLATION REQUIRED</strong>) pouvant être publié sur le site Web de l’ÉLCV si votre demande est approuvée. Assurez-vous de fournir un résumé détaillé et complet de votre projet.'
              },
              text2: {
                en: 'Please provide a description of the proposed project. The proposal should be informative and specific and <strong>no more than 750 words per section. Non-compliant applications will be returned.</strong>',
                fr: 'TRANSLATION REQUIRED'
              },
              background: { en: 'Background and Study Relevance', fr: 'Contexte et pertinence de l’étude' },
              objectives: {
                en: 'Study Objectives and/or Hypotheses',
                fr: 'Objectifs et/ou hypothèses de l’étude'
              },
              methodology: { en: 'Study Design and Methodology', fr: 'Modèle d’étude et méthodologie' },
              methodology_text: {
                en: 'The study design and methodology including an overview of the variables and/or biospecimens requested for the project. In no more than half a page, describe the inclusion and exclusion criteria for participants to be included in your study (e.g., age, sex, etc.).',
                fr: 'Modèle d’étude et méthodologie comprenant un survol de la liste de variables et/ou échantillons demandés. Sans dépasser une demi-page, décrivez les critères d’inclusion et d’exclusion des participants qui seront inclus dans votre étude (p. ex. âge, sexe, etc.).'
              },
              analysis: { en: 'Data Analysis', fr: 'Analyse de données' },
              analysis_text: {
                en: 'Brief description of the data analysis proposed (this section should include justification for the sample size requested). Requests for small subsets of the study participants must be justified.',
                fr: 'Brève description de l’analyse de données proposée (cette section devrait inclure la justification de la taille d’échantillon demandée). Les demandes de petits sous-groupes de participants doivent être justifiées.'
              },
              text3: {
                en: 'Please include a list of the most relevant references',
                fr: 'Veuillez présenter une liste des références les plus pertinentes'
              },
              number: { en: 'Number', fr: 'Numéro' },
              reference: { en: 'Reference', fr: 'Référence' },
              noReferences: {
                en: 'No references have been added.',
                fr: 'TRANSLATION REQUIRED'
              },
              addReference: { en: 'Add Reference', fr: 'Ajouter référence' }
            },
            a5: {
              tab: { en: 'A5. Scientific Review', fr: 'A5. Évaluation scientifique' },
              text: {
                en: 'Evidence of peer reviewed funding will be considered evidence of scientific review. If there are no plans to submit an application for financial support for this project please provide evidence of peer review (e.g. internal departmental review, thesis protocol defense, etc.) if available. If no evidence of scientific peer review is provided with this application then the project will undergo scientific review by the DSAC.',
                fr: 'Les documents attestant l’attribution du financement seront considérés comme une preuve d’évaluation par les pairs. Si vous ne planifiez pas demander de l’aide financière pour ce projet, veuillez fournir la preuve qu’une évaluation par les pairs a été réalisée (p. ex. évaluation départementale, défense du protocole de thèse, etc.) si disponible. Si aucune preuve d’évaluation scientifique par les pairs n’est soumise avec la demande, le DSAC procédera à l’évaluation scientifique du projet.'
              },
              funding: { en: 'Peer Reviewed Funding', fr: 'Financement évalué par les pairs' },
              funding_agency: { en: 'Funding agency', fr: 'L’Organisme de financement' },
              grant_number: { en: 'Grant Number', fr: 'Numéro de la subvention' }
            },
            a6: {
              tab: { en: 'A6. Ethics', fr: 'A6. Éthique' },
              text: {
                en: 'Please note that ethics approval is NOT required at the time of this application, but <strong>no data or biospecimens will be released until proof of ethics approval has been received by the CLSA.</strong>',
                fr: 'Notez que l’approbation éthique n’est PAS requise à cette étape de la demande, mais <strong>aucune donnée ou aucun échantillon ne seront transmis avant que l’ÉLCV ait reçu une preuve d’approbation éthique.</strong>'
              },
              ethics: {
                en: 'Has this project received ethics approval?',
                fr: 'Ce projet a-t-il reçu une approbation éthique?'
              },
              letter: {
                en: 'Digital copy of ethics approval letter',
                fr: 'Copie numérique de la lettre d’approbation éthique'
              },
              expiration: { en: 'Expiration date of approval', fr: 'Date limite d’autorisation' },
              response: { en: 'Expected date of response', fr: 'Date approximative de la réponse' }
            }
          },
          part2: {
            tab: { en: 'Part 2', fr: '2<sup>e</sup> partie' },
            title: { en: 'Part 2 of 3: Data Checklist', fr: 'Partie 2 de 3 : Sélection des données' },
            notes: {
              tab: { en: 'Notes', fr: 'Remarques' },
              text1: {
                en: '<strong>Included in all datasets</strong><ul><li>Sampling weights</li></ul>',
                fr: '<strong>Inclus dans tous les ensembles de données</strong><ul><li>Poids d’échantillonnage</li></ul>'
              },
              text2: {
                en: '<strong>Not included in datasets</strong><ul><li>Identifiable information collected (e.g. name, contact information, date of birth, health insurance number, and full postal code)</li></ul>',
                fr: '<strong>Exclus des ensembles de données</strong><ul><li>Informations d’identification recueillies (p. ex. nom, coordonnées, date de naissance, numéro d’assurance maladie et code postal complet)</li></ul>'
              },
              text3: {
                en: '<strong>Additional Data available</strong><ul><li>Air Pollution and Meteorological Exposure Measurements (for all 50,000 CLSA participants).</li><li>Forward Sortation Areas (A forward sortation area (FSA) is a geographical region in which all postal codes start with the same three characters.)</li><li>Community names (Determined using the Postal Code Conversion File (PCCF) from Statistics Canada.)</li></ul>',
                fr: '<strong>Données supplémentaires disponibles</strong><ul><li>Les mesures de la pollution de l’air et de l’exposition météorologique (pour les 50 000 participants à l’ÉLCV).</li><li>Région de tri d’acheminement (Une région de tri d’acheminement (RTA) est une region géographique où tous les codes postaux ont les mêmes trois premiers caractères.)</li><li>Nom de la collectivité (Déterminé à l’aide du Fichier de conversion des codes postaux (FCCP) de Statistique Canada.</li></ul>'
              },
              text4: {
                en: 'For more information on these data, please contact <a href="mailto:access@clsa-elcv.ca">access@clsa-elcv.ca</a>',
                fr: 'Pour en savoir plus sur ces données, veuillez écrire à <a href="mailto:access@clsa-elcv.ca">access@clsa-elcv.ca</a>'
              }
            },
            a: {
              tab: { en: 'Section A: Questionnaires', fr: 'Section A : Questionnaires' },
              question: {
                en: 'Please check if you are requesting questionnaire data from the CLSA BASELINE data collection',
                fr: 'Veuillez vérifier si vous demandez des données de questionnaire à partir de la collecte INITIALE de données de l’ÉLCV'
              },
              mcq: { en: 'Maintaining Contact Interview', fr: 'Entrevue de mi-parcours' },
              module: { en: 'Interview Module', fr: 'Module de l’entrevue' },
              tracking: {
                en: 'Tracking<br/>(Telephone Interview)',
                fr: 'Évaluation de surveillance<br/>(Entrevue téléphonique)'
              },
              comprehensive: {
                en: 'Comprehensive<br/>(Face-to-face Interview - In-home or DCS visit)',
                fr: 'Évaluation globale<br/>(Entrevue en personne - à domicile ou au DCS)'
              }
            },
            b: {
              tab: { en: 'Section B: Physical Assessments', fr: 'Section B : Examens physiques' },
              question: {
                en: 'Please check if you are requesting physical assessments from the CLSA BASELINE data collection',
                fr: 'Veuillez vérifier si vous demandez des données de examens physiques à partir de la collecte INITIALE de données de l’ÉLCV'
              },
              physical: { en: 'Physical Assessment', fr: 'Examen physique' },
              data: { en: 'Data', fr: 'Données' },
              image: { en: 'Image', fr: 'Image' }
            },
            c: {
              tab: {
                en: 'Section C: Biomarkers measured in blood',
                fr: 'Section C : Biomarqueurs mesurés dans le sang'
              },
              question: {
                en: 'Please check if you are requesting biomarkers measured in blood from the CLSA BASELINE data collection',
                fr: 'Veuillez vérifier si vous demandez des données de biomarqueurs mesurés dans le sang à partir de la collecte INITIALE de données de l’ÉLCV'
              },
              hematology: { en: 'Hematology Report (N = 30,000)', fr: 'Rapport hématologique (N = 30,000)' },
              data: { en: 'Data', fr: 'Données' }
            }
          },
          part3: {
            tab: { en: 'Part 3', fr: '3<sup>e</sup> partie' },
            title: { en: 'Part 3 of 3: Biospecimen Access', fr: 'Partie 3 de 3 : Accès aux échantillons' },
            text: {
              en: 'Biospecimen Access is not yet available',
              fr: 'Accès aux échantillons n’est pas encore disponible'
            }
          },
          misc: {
            prevButton: { en: 'Return to the previous section', fr: 'TRANSLATION REQUIRED' },
            nextButton: { en: 'Proceed to the next section', fr: 'TRANSLATION REQUIRED' },
            pleaseConfirm: { en: 'Please confirm', fr: 'Veuillez confirmer' },
            remove: { en: 'Remove', fr: 'Supprimer' },
            words: { en: 'words', fr: 'mots' },
            chars: { en: 'characters', fr: 'TRANSLATION REQUIRED' },
            comments: { en: 'Comments', fr: 'Commentaires' },
            upload: { en: 'upload', fr: 'téléverser' },
            uploaded: { en: 'uploaded', fr: 'téléversé' },
            uploading: { en: 'uploading', fr: 'téléversement' },
            fileSize: { en: 'file size', fr: 'taille du fichier' },
            delete: { en: 'Delete', fr: 'Effacer' },
            submit: { en: 'Submit', fr: 'Soumettre' },
            submitWarning: {
              en: 'Are you sure that all changes are complete and the application is ready to be submitted?',
              fr: 'Êtes-vous sûr(e) d’avoir apporté tous les changements souhaités à la demande d’accès et qu’elle est prête à être soumise?'
            },
            missingFieldTitle: { en: 'Missing mandatory field', fr: 'Champ obligatoire manquant' },
            missingFieldMessage: {
              en: 'There are mandatory fields which are missing. You will now be redirected to where the incomplete fields can be found.  Please try re-submitting once all mandatory fields have been filled out.',
              fr: 'Des champs obligatoires sont manquants. Vous serez redirigé vers l’endroit où se trouvent les champs incomplets. Veuillez soumettre la demande d’accès à nouveau quand tous les champs obligatoires auront été remplis.'
            },
            tooManyCharactersTitle: { en: 'Too many characters', fr: 'TRANSLATION REQUIRED' },
            tooManyCharactersMessage: {
              en: 'Some of your descriptions are too long.  You will now be redirected to the general project information details.  Please try re-submitting once all descriptions are within the maximum limits.',
              fr: 'TRANSLATION REQUIRED'
            },
            invalidStartDateTitle: { en: 'Invalid start date', fr: 'TRANSLATION REQUIRED' },
            invalidStartDateMessage: {
              en: 'The start date you have provided is not acceptible.  You will now be redirected to where the start date field can be found.  Please try re-submitting once the start date has been corrected.',
              fr: 'TRANSLATION REQUIRED'
            },
            deleteWarning: {
              en: 'Are you sure you want to delete the application?\n\nThis will permanently destroy all details you have provided. Once this is done there will be no way to restore the application!',
              fr: 'Êtes-vous sûr(e) de vouloir supprimer la demande d’accès? Toutes les informations fournies seront détruites et il vous sera impossible de les restaurer!'
            },
            abandon: { en: 'Abandon', fr: 'Abandonner' },
            abandonWarning: {
              en: 'Are you sure you want to abandon the application?\n\nYou will no longer have access to the application and the review process will be discontinued.',
              fr: 'Êtes-vous sûr(e) de vouloir abandonner la demande d’accès? Vous n’y aurez plus accès et le processus d’évaluation sera interrompu.'
            },
            email_text: {
              en: 'You must provide an institutional email.  Public email accounts such as @gmail.com are not allowed.',
              fr: 'TRANSLATION REQUIRED'
            }
          }
        };

      };

      return {
        root: new object( true ),
        instance: function() { return new object( false ); }
      };
    }
  ] );

} );
