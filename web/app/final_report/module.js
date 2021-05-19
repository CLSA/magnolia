define( [ 'output' ].reduce( function( list, name ) {
  return list.concat( cenozoApp.module( name ).getRequiredFiles() );
}, [] ), function() {
  'use strict';

  try { var module = cenozoApp.module( 'final_report', true ); } catch( err ) { console.warn( err ); return; }

  angular.extend( module, {
    identifier: {
      parent: {
        subject: 'reqn',
        column: 'reqn.identifier'
      }
    },
    name: {
      singular: 'final report',
      plural: 'final reports',
      possessive: 'final report\'s'
    },
    columnList: {
      version: {
        title: 'Version',
        type: 'rank'
      },
      datetime: {
        title: 'Date & Time',
        type: 'datetime'
      }
    },
    defaultOrder: {
      column: 'final_report.version',
      reverse: false
    }
  } );

  module.addInputGroup( '', {
    identifier: {
      column: 'reqn.identifier',
      title: 'Identifier',
      type: 'string'
    },

    // the following are for the form and will not appear in the view
    version: { type: 'string' },
    current_reqn_version_id: { column: 'reqn_version.id', type: 'string' },
    trainee_user_id: { column: 'reqn.trainee_user_id', type: 'string' },
    state: { column: 'reqn.state', type: 'string' },
    stage_type: { column: 'stage_type.name', type: 'string' },
    phase: { column: 'stage_type.phase', type: 'string' },
    lang: { column: 'language.code', type: 'string' },
    activities: { type: 'text' },
    findings: { type: 'text' },
    outcomes: { type: 'text' },
    thesis_title: { type: 'text' },
    thesis_status: { type: 'text' },
    impact: { type: 'text' },
    opportunities: { type: 'text' },
    dissemination: { type: 'text' },
    waiver: { column: 'reqn_version.waiver', type: 'string' },
    deferral_note_report1: { column: 'reqn.deferral_note_report1', type: 'text' },
    deferral_note_report2: { column: 'reqn.deferral_note_report2', type: 'text' },
    deferral_note_report3: { column: 'reqn.deferral_note_report3', type: 'text' }
  } );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnFinalReportList', [
    'CnFinalReportModelFactory',
    function( CnFinalReportModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'list.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnFinalReportModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnFinalReportView', [
    'CnFinalReportModelFactory', 'cnRecordViewDirective', 'CnReqnModelFactory', 'CnReqnHelper', 'CnSession',
    function( CnFinalReportModelFactory, cnRecordViewDirective, CnReqnModelFactory, CnReqnHelper, CnSession ) {
      // used to piggy-back on the basic view controller's functionality
      var cnRecordView = cnRecordViewDirective[0];
      var reqnModel = CnReqnModelFactory.instance();

      return {
        templateUrl: module.getFileUrl( 'view.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        link: function( scope, element, attrs ) {
          cnRecordView.link( scope, element, attrs );

          scope.liteModel.viewModel.onView();

          scope.model.viewModel.afterView( function() {
            // setup the breadcrumbtrail
            CnSession.setBreadcrumbTrail(
              [ {
                title: reqnModel.module.name.plural.ucWords(),
                go: async function() { await reqnModel.transitionToListState(); }
              }, {
                title: scope.model.viewModel.record.identifier,
                go: async function() {
                  await reqnModel.transitionToViewState( {
                    getIdentifier: function() { return 'identifier=' + scope.model.viewModel.record.identifier; }
                  } );
                }
              }, {
                title: scope.model.module.name.singular.ucWords(),
                go: async function() { await scope.model.transitionToViewState( scope.model.viewModel.record ); }
              } ]
            );
          } );
        },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnFinalReportModelFactory.root;
          if( angular.isUndefined( $scope.liteModel ) ) $scope.liteModel = CnFinalReportModelFactory.lite;
          cnRecordView.controller[1]( $scope );
          $scope.t = function( value ) {
            return $scope.model.viewModel.record.lang ?
              CnReqnHelper.translate( 'finalReport', value, $scope.model.viewModel.record.lang ) : '';
          };

          $scope.getHeading = function() {
            var status = null;
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
              $scope.model.viewModel.record.version,
              null != status ? '(' + status + ')' : ''
            ].join( ' ' );
          };

          $scope.compareTo = async function( version ) {
            $scope.model.viewModel.compareRecord = version;
            $scope.liteModel.viewModel.compareRecord = version;
            $scope.model.setQueryParameter( 'c', null == version ? undefined : version.version );
            await $scope.model.reloadState( false, false, 'replace' );
          };
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnFinalReportListFactory', [
    'CnBaseListFactory',
    function( CnBaseListFactory ) {
      var object = function( parentModel ) { CnBaseListFactory.construct( this, parentModel ); };
      return { instance: function( parentModel ) { return new object( parentModel ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnFinalReportViewFactory', [
    'CnBaseViewFactory', 'CnOutputModelFactory', 'CnReqnHelper', 'CnHttpFactory',
    'CnModalMessageFactory', 'CnModalConfirmFactory', 'CnSession', '$state',
    function( CnBaseViewFactory, CnOutputModelFactory, CnReqnHelper, CnHttpFactory,
              CnModalMessageFactory, CnModalConfirmFactory, CnSession, $state ) {
      var object = function( parentModel, root ) {
        CnBaseViewFactory.construct( this, parentModel, root );

        angular.extend( this, {
          compareRecord: null,
          versionList: [],
          translate: function( value ) {
            return this.record.lang ? CnReqnHelper.translate( 'finalReport', value, this.record.lang ) : '';
          },
          show: function( subject ) { return CnReqnHelper.showAction( subject, this.record ); },
          viewReqn: function() {
            return this.parentModel.transitionToParentViewState( 'reqn', 'identifier=' + this.record.identifier );
          },
          viewReqnVersion: function() {
            return this.parentModel.transitionToParentViewState( 'reqn_version', this.record.current_reqn_version_id );
          },

          onView: async function( force ) {
            // reset tab value
            this.setFormTab( this.parentModel.getQueryParameter( 't' ), false );

            // reset compare version and differences
            this.compareRecord = null;

            await this.$$onView( force );

            if( 'lite' != this.parentModel.type ) {
              cenozoApp.setLang( this.record.lang );
              this.updateOutputListLanguage( this.record.lang );
              await this.getVersionList();
            }
          },

          onPatch: async function( data ) {
            var property = Object.keys( data )[0];
            if( !this.parentModel.getEditEnabled() ) throw new Error( 'Calling onPatch() but edit is not enabled.' );

            if( null == property.match( /^deferral_note/ ) ) {
              await this.$$onPatch( data );
            } else { // make sure to send patches to deferral notes to the parent reqn
              var parent = this.parentModel.getParentIdentifier();
              var httpObj = {
                path: parent.subject + '/' + parent.identifier,
                data: data
              };
              var self = this;
              httpObj.onError = function( response ) { self.onPatchError( response ); };
              try {
                await CnHttpFactory.instance( httpObj ).patch();
                this.afterPatchFunctions.forEach( function( fn ) { fn(); } );
              } catch( error ) {
                // handled by onError above
              }
            }
          },

          updateOutputListLanguage: function( lang ) {
            var columnList = cenozoApp.module( 'output' ).columnList;
            columnList.output_type_en.isIncluded = function( $state, model ) { return 'en' == lang; };
            columnList.output_type_fr.isIncluded = function( $state, model ) { return 'fr' == lang; };
            columnList.output_type_en.title = CnReqnHelper.translate( 'output', 'output_type', 'en' );
            columnList.output_type_fr.title = CnReqnHelper.translate( 'output', 'output_type', 'fr' );
            columnList.detail.title = CnReqnHelper.translate( 'output', 'detail', lang );
            columnList.output_source_count.title = CnReqnHelper.translate( 'output', 'output_source_count', lang );
          },

          // setup language and tab state parameters
          toggleLanguage: function() {
            this.record.lang = 'en' == this.record.lang ? 'fr' : 'en';
            this.updateOutputListLanguage( this.record.lang );

            return CnHttpFactory.instance( {
              path: 'reqn/identifier=' + this.record.identifier,
              data: { language: this.record.lang }
            } ).patch();
          },

          formTab: '',
          tabSectionList: ['instructions','part1','part2','part3'],
          setFormTab: async function( tab, transition ) {
            if( angular.isUndefined( transition ) ) transition = true;

            // find the tab section
            var selectedTabSection = null;
            this.tabSectionList.some( function( tabSection ) {
              if( tab == tabSection ) {
                selectedTabSection = tabSection;
                return true;
              }
            } );

            // get the tab (or default of none was found)
            tab = null != selectedTabSection ? selectedTabSection : 'instructions';

            this.formTab = tab;
            this.parentModel.setQueryParameter( 't', tab );

            if( transition ) await this.parentModel.reloadState( false, false, 'replace' );

            // update all textarea sizes
            angular.element( 'textarea[cn-elastic]' ).trigger( 'elastic' );
          },

          nextSection: async function( reverse ) {
            if( angular.isUndefined( reverse ) ) reverse = false;

            var currentTabSectionIndex = this.tabSectionList.indexOf( this.formTab );
            if( null != currentTabSectionIndex ) {
              var tabSection = this.tabSectionList[currentTabSectionIndex + (reverse?-1:1)];
              if( angular.isDefined( tabSection ) ) await this.setFormTab( tabSection );
            }
          },

          addOutput: function() {
            CnOutputModelFactory.root.transitionToAddState();
          },

          getDifferences: function( finalReport2 ) {
            var finalReport1 = this.record;
            var differences = {
              diff: false,
              part1: {
                diff: false,
                activities: false,
                findings: false,
                outcomes: false,
                thesis_title: false,
                thesis_status: false
              },
              part3: {
                diff: false,
                impact: false,
                opportunities: false,
                dissemination: false
              }
            };

            if( null != finalReport2 ) {
              for( var part in differences ) {
                if( !differences.hasOwnProperty( part ) ) continue;
                if( 'diff' == part ) continue; // used to track overall diff

                for( var property in differences[part] ) {
                  if( !differences[part].hasOwnProperty( property ) ) continue;

                  // not an array means we have a property to directly check
                  // note: we need to convert empty strings to null to make sure they compare correctly
                  var value1 = '' === finalReport1[property] ? null : finalReport1[property];
                  var value2 = '' === finalReport2[property] ? null : finalReport2[property];
                  if( value1 != value2 ) {
                    differences.diff = true;
                    differences[part].diff = true;
                    differences[part][property] = true;
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
              path: parent.subject + '/' + parent.identifier + '/final_report'
            } ).query();

            this.versionList = response.data;

            var compareVersion = this.parentModel.getQueryParameter( 'c' );
            if( angular.isDefined( compareVersion ) )
              this.compareRecord = this.versionList.findByProperty( 'version', compareVersion );

            // add a null object to the version list so we can turn off comparisons
            if( 1 < this.versionList.length ) this.versionList.unshift( null );

            // Calculate all differences for all versions (in reverse order so we can find the last agreement version)
            this.versionList.reverse();

            this.lastAgreementVersion = null;
            var self = this;
            this.versionList.forEach( function( version ) {
              if( null != version ) version.differences = self.getDifferences( version );
            } );

            // if no different list was defined then make it an empty list
            if( null == this.agreementDifferenceList ) this.agreementDifferenceList = [];

            // put the order of the version list back to normal
            this.versionList.reverse();
          },

          submit: async function() {
            var record = this.record;
            var response = await CnModalConfirmFactory.instance( {
              title: this.translate( 'misc.pleaseConfirm' ),
              noText: 'applicant' == CnSession.role.name ? this.translate( 'misc.no' ) : 'No',
              yesText: 'applicant' == CnSession.role.name ? this.translate( 'misc.yes' ) : 'Yes',
              message: this.translate( 'misc.submitWarning' )
            } ).show();

            if( response ) {
              // make sure that certain properties have been defined, one tab at a time
              var requiredTabList = {
                'part1': [ 'activities', 'findings', 'outcomes', 'thesis_title', 'thesis_status' ],
                'part3': [ 'impact', 'opportunities', 'dissemination' ]
              };

              var error = null;
              var errorTab = null;
              for( var tab in requiredTabList ) {
                var firstProperty = null;
                var self = this;
                requiredTabList[tab].filter( function( property ) {
                  if( 'part1' == tab ) {
                    // only check thesis properties if the reqn has a trainee
                    return null == property.match( /thesis/ ) || self.record.trainee_user_id;
                  }

                  // check everything else
                  return true;
                } ).forEach( function( property ) {
                  // check for the property's value
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

              if( null != error ) {
                // if there was an error then display it now
                if( 'applicant' == CnSession.role.name ) error.closeText = this.translate( 'misc.close' );
                await CnModalMessageFactory.instance( error ).show();
                await this.setFormTab( errorTab );
              } else {
                // now check to make sure this version is different from the last (the first is always different)
                var response = await CnHttpFactory.instance( {
                  path: this.parentModel.getServiceResourcePath(),
                  data: { select: { column: 'has_changed' } }
                } ).get();

                var proceed = false;
                if( response.data.has_changed ) {
                  proceed = true;
                } else {
                  // no changes made so warn the user before proceeding
                  proceed = await CnModalConfirmFactory.instance( {
                    title: this.translate( 'misc.pleaseConfirm' ),
                    noText: this.translate( 'misc.no' ),
                    yesText: this.translate( 'misc.yes' ),
                    message: this.translate( 'misc.noChangesMessage' )
                  } ).show();
                }

                // changes have been made, so submit now
                if( proceed ) {
                  var parent = this.parentModel.getParentIdentifier();
                  await CnHttpFactory.instance( {
                    path: parent.subject + '/' + parent.identifier + "?action=submit"
                  } ).patch();

                  var code = CnSession.user.id == this.record.trainee_user_id ?
                    ( 'deferred' == this.record.state ? 'traineeResubmit' : 'traineeSubmit' ) :
                    ( 'deferred' == this.record.state ? 'resubmit' : 'submit' );
                  await CnModalMessageFactory.instance( {
                    title: this.translate( 'misc.' + code + 'Title' ),
                    message: this.translate( 'misc.' + code + 'Message' ),
                    closeText: this.translate( 'misc.close' )
                  } ).show();

                  if( this.parentModel.isRole( 'applicant' ) ) {
                    await $state.go( 'root.home' );
                  } else {
                    await this.onView( true ); // refresh
                  }
                }
              }
            }
          }
        } );
      };
      return { instance: function( parentModel, root ) { return new object( parentModel, root ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnFinalReportModelFactory', [
    'CnBaseModelFactory', 'CnFinalReportListFactory', 'CnFinalReportViewFactory', 'CnSession', '$state',
    function( CnBaseModelFactory, CnFinalReportListFactory, CnFinalReportViewFactory, CnSession, $state ) {
      var object = function( type ) {
        CnBaseModelFactory.construct( this, module );
        this.type = type;
        if( 'lite' != this.type ) this.listModel = CnFinalReportListFactory.instance( this );

        angular.extend( this, {
          viewModel: CnFinalReportViewFactory.instance( this, 'root' == this.type ),
          inputList: {},

          setupBreadcrumbTrail: function() {
            var trail = [];

            if( this.isRole( 'applicant' ) ) {
              trail = [
                { title: 'Final Report' },
                { title: this.viewModel.record.identifier }
              ];
            } else {
              trail = [ {
                title: 'Requisitions',
                go: async function() { await $state.go( 'reqn.list' ); }
              }, {
                title: this.viewModel.record.identifier,
                go: async function() {
                  await $state.go( 'reqn.view', { identifier: 'identifier=' + this.viewModel.record.identifier } );
                }
              }, {
                title: 'Final Report version ' + this.viewModel.record.version
              } ];
            }

            CnSession.setBreadcrumbTrail( trail );
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
