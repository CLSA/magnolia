define( [ 'reqn' ].reduce( function( list, name ) {
  return list.concat( cenozoApp.module( name ).getRequiredFiles() );
}, [] ), function() {
  'use strict';

  try { var module = cenozoApp.module( 'output', true ); } catch( err ) { console.warn( err ); return; }

  angular.extend( module, {
    identifier: {
      parent: [ {
        subject: 'reqn',
        column: 'reqn.identifier'
      }, {
        subject: 'final_report',
        column: 'final_report.id'
      } ]
    },
    name: {
      singular: 'output',
      plural: 'outputs',
      possessive: 'output\'s'
    },
    columnList: {
      identifier: {
        column: 'reqn.identifier',
        title: 'Requisition',
        isIncluded: function( $state, model ) { return 'output_type' == model.getSubjectFromState(); }
      },
      output_type_en: {
        column: 'output_type.name_en',
        title: '', // defined by the reqn, output_type and final_report modules
        isIncluded: function() { return true; }
      },
      output_type_fr: {
        column: 'output_type.name_fr',
        title: '', // defined by the reqn, output_type and final_report modules
        isIncluded: function() { return false; }
      },
      detail: {
        title: '' // defined by the reqn, output_type and final_report modules
      },
      output_source_count: {
        title: '' // defined by the reqn, output_type and final_report modules
      }
    },
    defaultOrder: {
      column: 'detail',
      reverse: false
    }
  } );

  module.addInputGroup( '', {
    reqn_id: {
      column: 'output.reqn_id',
      title: 'Requisition',
      type: 'lookup-typeahead',
      typeahead: {
        table: 'reqn',
        select: 'reqn.identifier',
        where: [ 'reqn.identifier' ]
      },
      isExcluded: function( $state, model ) {
        return 'output_type' != model.getSubjectFromState();
      }
    },
    output_type_id: {
      title: '', // defined below
      type: 'enum'
    },
    detail: {
      title: '', // defined below
      type: 'string'
    },
    identifier: {
      column: 'reqn.identifier',
      type: 'string',
      isExcluded: true
    },
    final_report_id: {
      column: 'final_report.id',
      type: 'string',
      isExcluded: true
    },
    lang: { column: 'language.code', type: 'string', isExcluded: true }
  } );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnOutputAdd', [
    'CnOutputModelFactory', 'CnHttpFactory', 'CnReqnHelper', '$q',
    function( CnOutputModelFactory, CnHttpFactory, CnReqnHelper, $q ) {
      return {
        templateUrl: module.getFileUrl( 'add.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnOutputModelFactory.root;

          $scope.$on( 'cnRecordAdd ready', function( event, data ) {
            var cnRecordAddView = data;
            var parent = $scope.model.getParentIdentifier();
            var promiseList = [];
            var len = promiseList.length;
            if( 'final_report' == parent.subject ) {
              promiseList.push( CnHttpFactory.instance( {
                path: 'final_report/' + parent.identifier,
                data: { select: { column: { table: 'language', column: 'code', alias: 'lang' } } }
              } ).get().then( response => response.data.lang ) );
            }

            $q.all( promiseList ).then( function( response ) {
              var lang = len == response.length ? 'en' : response[len];
              var enumListItem = cnRecordAddView.dataArray[0].inputArray.findByProperty( 'key', 'output_type_id' ).enumList[0];
              enumListItem.name = CnReqnHelper.translate( 'output', 'choose', lang );
              angular.extend( cnRecordAddView, {
                getCancelText: function() { return CnReqnHelper.translate( 'output', 'cancel', lang ); },
                getSaveText: function() { return CnReqnHelper.translate( 'output', 'save', lang ); }
              } );
            } );
          } );
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnOutputList', [
    'CnOutputModelFactory',
    function( CnOutputModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'list.tpl.html' ),
        restrict: 'E',
        scope: {
          model: '=?',
          simple: '@'
        },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnOutputModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnOutputView', [
    'CnOutputModelFactory', 'CnReqnHelper',
    function( CnOutputModelFactory, CnReqnHelper ) {
      return {
        templateUrl: module.getFileUrl( 'view.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnOutputModelFactory.root;

          // get the child cn-record-add's scope
          $scope.$on( 'cnRecordView ready', function( event, data ) {
            var cnRecordViewScope = data;
            var origin = $scope.model.getQueryParameter( 'origin', true );
            var parentExistsFn = cnRecordViewScope.parentExists;
            angular.extend( cnRecordViewScope, {
              // don't show the option to view the parent reqn to the applicant
              parentExists: function( subject ) {
                return $scope.model.isRole( 'applicant' ) && 'reqn' == subject ? false : parentExistsFn( subject );
              },
              getDeleteText: function() {
                return 'final_report' == origin ?
                  CnReqnHelper.translate( 'output', 'delete', $scope.model.viewModel.record.lang ) :
                  'Delete';
              },
              getViewText: function( subject ) {
                return 'final_report' == subject && 'final_report' == origin ?
                  CnReqnHelper.translate( 'output', 'viewFinalReport', $scope.model.viewModel.record.lang ) :
                  'View ' + cnRecordViewScope.parentName( subject );
              }
            } );
          } );

          // note, we are changing the output-source list, not the output list
          $scope.$on( 'cnRecordList ready', function( event, data ) {
            var cnRecordListScope = data;
            var origin = $scope.model.getQueryParameter( 'origin', true );
            angular.extend( cnRecordListScope, {
              getAddText: function() {
                return CnReqnHelper.translate( 'output', 'add', 'final_report' == origin ? $scope.model.viewModel.record.lang : 'en' );
              }
            } );
          } );
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnOutputAddFactory', [
    'CnBaseAddFactory', 'CnHttpFactory', 'CnReqnHelper', '$q',
    function( CnBaseAddFactory, CnHttpFactory, CnReqnHelper, $q ) {
      var object = function( parentModel ) {
        var self = this;
        CnBaseAddFactory.construct( this, parentModel );

        this.onNew = function( record ) {
          var parent = self.parentModel.getParentIdentifier();
          var promiseList = [ self.$$onNew( record ) ];
          var len = promiseList.length;

          if( 'final_report' == parent.subject ) {
            promiseList.push( CnHttpFactory.instance( {
              path: 'final_report/' + parent.identifier,
              data: { select: { column: { table: 'language', column: 'code', alias: 'lang' } } }
            } ).get().then( response => response.data.lang ) );
          }

          return $q.all( promiseList ).then( function( response ) {
            var lang = len == response.length ? 'en' : response[len];
            self.parentModel.updateLanguage( lang );
            self.heading = CnReqnHelper.translate( 'output', 'createOutput', lang );
          } );
        };
      };
      return { instance: function( parentModel ) { return new object( parentModel ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnOutputListFactory', [
    'CnBaseListFactory',
    function( CnBaseListFactory ) {
      var object = function( parentModel ) {
        var self = this;
        CnBaseListFactory.construct( this, parentModel );

        // The final report's output list is in "simple" mode which means the pagination widget isn't visible,
        // so to make sure that all records show changethe itemsPerPage value to 100 (it is assumed that no
        // reqn will have more than 100 outputs)
        this.onList = function( replace ) {
          self.paginationModel.itemsPerPage = 'final_report' == this.parentModel.getSubjectFromState() ? 100 : 20;
          return self.$$onList( replace );
        }
      };
      return { instance: function( parentModel ) { return new object( parentModel ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnOutputViewFactory', [
    'CnBaseViewFactory', 'CnReqnModelFactory', 'CnReqnHelper',
    function( CnBaseViewFactory, CnReqnModelFactory, CnReqnHelper ) {
      var object = function( parentModel, root ) {
        var self = this;
        CnBaseViewFactory.construct( this, parentModel, root );

        angular.extend( this, {
          getViewReqnEnabled: function() { return CnReqnModelFactory.root.getViewEnabled(); },

          updateOutputSourceListLanguage: function( lang ) {
            var columnList = cenozoApp.module( 'output_source' ).columnList;
            columnList.filename.title = CnReqnHelper.translate( 'output', 'filename', lang );
            columnList.url.title = CnReqnHelper.translate( 'output', 'url', lang );
          },

          onView: function( force ) {
            return self.$$onView( force ).then( function() {
              var origin = self.parentModel.getQueryParameter( 'origin', true );
              var lang = 'final_report' == origin ? self.record.lang : 'en';
              self.parentModel.updateLanguage( lang );
              self.updateOutputSourceListLanguage( lang );
              self.outputSourceModel.listModel.heading = CnReqnHelper.translate( 'output', 'outputSourceListHeading', lang );
              self.heading = CnReqnHelper.translate( 'output', 'outputDetails', lang );
            } );
          }
        } );
      }
      return { instance: function( parentModel, root ) { return new object( parentModel, root ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnOutputModelFactory', [
    'CnBaseModelFactory', 'CnOutputAddFactory', 'CnOutputListFactory', 'CnOutputViewFactory',
    'CnSession', 'CnHttpFactory', 'CnReqnHelper', '$state',
    function( CnBaseModelFactory, CnOutputAddFactory, CnOutputListFactory, CnOutputViewFactory,
              CnSession, CnHttpFactory, CnReqnHelper, $state ) {
      var object = function( root ) {
        var self = this;
        CnBaseModelFactory.construct( this, module );
        this.addModel = CnOutputAddFactory.instance( this );
        this.listModel = CnOutputListFactory.instance( this );
        this.viewModel = CnOutputViewFactory.instance( this, root );

        angular.extend( this, {
          updateLanguage: function( lang ) {
            var group = self.module.inputGroupList.findByProperty( 'title', '' );
            group.inputList.output_type_id.title = CnReqnHelper.translate( 'output', 'output_type', lang );
            group.inputList.detail.title = CnReqnHelper.translate( 'output', 'detail', lang );
            self.metadata.getPromise().then( function() {
              self.metadata.columnList.output_type_id.enumList =
                self.metadata.columnList.output_type_id.enumLists[lang];
            } );
          },

          setupBreadcrumbTrail: function() {
            // change the breadcrumb trail based on the origin parameter
            self.$$setupBreadcrumbTrail();
            var origin = self.getQueryParameter( 'origin', true );
            if( 'final_report' == origin ) {
              var parent = self.getParentIdentifier();
              var index = CnSession.breadcrumbTrail.findIndexByProperty( 'title', 'Final Report' );
              CnSession.breadcrumbTrail[index+1].go = function() {
                $state.go( 'final_report.view', { identifier: parent.identifier, t: 'part2' } );
              };
              delete CnSession.breadcrumbTrail[index].go;
            }
          },

          getParentIdentifier: function() {
            var response = {};

            // make sure to use the appropriate parent based on the origin parameter
            var origin = self.getQueryParameter( 'origin' );
            if( 'final_report' == origin ) {
              var parent = self.module.identifier.parent.findByProperty( 'subject', 'final_report' );
              response = {
                subject: parent.subject,
                identifier: parent.getIdentifier( self.viewModel.record )
              };
              if( angular.isDefined( parent.friendly ) ) response.friendly = parent.friendly;
            } else response = self.$$getParentIdentifier();

            return response;
          },

          transitionToAddState: function() {
            if( 'final_report' == self.getSubjectFromState() ) {
              $state.go(
                '^.add_' + self.module.subject.snake,
                { parentIdentifier: $state.params.identifier, origin: 'final_report' }
              );
            } else self.$$transitionToAddState();
          },

          transitionToViewState: function( record ) {
            // add the origin when transitioning to the view state
            var stateName = $state.current.name;
            var stateParams = {
              identifier: record.getIdentifier(),
              origin: self.getSubjectFromState()
            };
            if( 'view' == stateName.substring( stateName.lastIndexOf( '.' ) + 1 ) )
              stateParams.parentIdentifier = $state.params.identifier;
            return $state.go( self.module.subject.snake + '.view', stateParams );
          },

          transitionToLastState: function() {
            // if we're transitioning back to the final report then load the output list in part2
            if( 'final_report' == self.getSubjectFromState() ) {
              $state.go( 'final_report.view', { identifier: self.getParentIdentifier().identifier, t: 'part2' } );
            } else return self.$$transitionToLastState();
          },

          transitionToParentViewState: function( subject, identifier ) {
            // if we're transitioning back to the final report then load the output list in part2
            return 'final_report' == subject ?
              $state.go( 'final_report.view', { identifier: self.viewModel.record.final_report_id, t: 'part2' } ) :
              self.$$transitionToParentViewState( subject, identifier );
          },

          getMetadata: function() {
            return self.$$getMetadata().then( function() {
              return CnHttpFactory.instance( {
                path: 'output_type',
                data: {
                  select: { column: [ 'id', 'name_en', 'name_fr' ] },
                  modifier: { order: 'name_en', limit: 1000 }
                }
              } ).query().then( function success( response ) {
                // we need both languages, we'll dynamically choose which one to use
                self.metadata.columnList.output_type_id.enumLists = { en: [], fr: [] };
                response.data.forEach( function( item ) {
                  self.metadata.columnList.output_type_id.enumLists.en.push( {
                    value: item.id,
                    name: item.name_en
                  } );
                  self.metadata.columnList.output_type_id.enumLists.fr.push( {
                    value: item.id,
                    name: item.name_fr
                  } );
                } );

                // sort the french enum list
                self.metadata.columnList.output_type_id.enumLists.fr.sort(
                  (a, b) => (a.name < b.name ? -1 : a.name == b.name ? 0 : 1)
                );
              } );
            } );
          }
        } );
      };

      return {
        root: new object( true ),
        instance: function() { return new object( false ); }
      };
    }
  ] );

} );
