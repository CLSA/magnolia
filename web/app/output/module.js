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
        title: '', // defined by the reqn and final_report modules
        isIncluded: function() { return true; }
      },
      output_type_fr: {
        column: 'output_type.name_fr',
        title: '', // defined by the reqn and final_report modules
        isIncluded: function() { return false; }
      },
      detail: {
        title: '' // defined by the reqn and final_report modules
      },
      output_source_count: {
        title: '' // defined by the reqn and final_report modules
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
      title: 'Output Type',
      type: 'enum'
    },
    detail: {
      title: 'Detail',
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
    }
  } );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnOutputAdd', [
    'CnOutputModelFactory',
    function( CnOutputModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'add.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnOutputModelFactory.root;
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
    'CnOutputModelFactory',
    function( CnOutputModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'view.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnOutputModelFactory.root;

          // get the child cn-record-add's scope
          $scope.$on( 'cnRecordView ready', function( event, data ) {
            var cnRecordViewScope = data;

            // don't show the option to view the parent reqn to the applicant
            var parentExistsFn = cnRecordViewScope.parentExists;
            cnRecordViewScope.parentExists = function( subject ) {
              return $scope.model.isRole( 'applicant' ) && 'reqn' == subject ? false : parentExistsFn( subject );
            };
          } );
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnOutputAddFactory', [
    'CnBaseAddFactory',
    function( CnBaseAddFactory ) {
      var object = function( parentModel ) { CnBaseAddFactory.construct( this, parentModel ); };
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
    'CnBaseViewFactory', 'CnReqnModelFactory',
    function( CnBaseViewFactory, CnReqnModelFactory ) {
      var object = function( parentModel, root ) {
        CnBaseViewFactory.construct( this, parentModel, root );
        this.getViewReqnEnabled = function() { return CnReqnModelFactory.root.getViewEnabled(); }
      }
      return { instance: function( parentModel, root ) { return new object( parentModel, root ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnOutputModelFactory', [
    'CnBaseModelFactory', 'CnOutputAddFactory', 'CnOutputListFactory', 'CnOutputViewFactory',
    'CnSession', 'CnHttpFactory', '$state',
    function( CnBaseModelFactory, CnOutputAddFactory, CnOutputListFactory, CnOutputViewFactory,
              CnSession, CnHttpFactory, $state ) {
      var object = function( root ) {
        var self = this;
        CnBaseModelFactory.construct( this, module );
        this.addModel = CnOutputAddFactory.instance( this );
        this.listModel = CnOutputListFactory.instance( this );
        this.viewModel = CnOutputViewFactory.instance( this, root );

        angular.extend( this, {
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
                  select: { column: [ 'id', 'name_en' ] },
                  modifier: { order: 'name_en', limit: 1000 }
                }
              } ).query().then( function success( response ) {
                self.metadata.columnList.output_type_id.enumList = [];
                response.data.forEach( function( item ) {
                  self.metadata.columnList.output_type_id.enumList.push( {
                    value: item.id,
                    name: item.name_en
                  } );
                } );
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
