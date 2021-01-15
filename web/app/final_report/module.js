define( [ 'production', 'production_type' ].reduce( function( list, name ) {
  return list.concat( cenozoApp.module( name ).getRequiredFiles() );
}, [] ), function() {
  'use strict';

  try { var module = cenozoApp.module( 'final_report', true ); } catch( err ) { console.warn( err ); return; }

  var productionModule = cenozoApp.module( 'production' );

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
    }
  } );

  module.addInputGroup( '', {
    identifier: {
      column: 'reqn.identifier',
      title: 'Identifier',
      type: 'string'
    },

    // the following are for the form and will not appear in the view
    language: { column: 'language.code', type: 'string', isExcluded: true },
    activities: { type: 'text', isExcluded: true },
    findings: { type: 'text', isExcluded: true },
    outcomes: { type: 'text', isExcluded: true },
    thesis_title: { type: 'text', isExcluded: true },
    thesis_status: { type: 'text', isExcluded: true },
    impact: { type: 'text', isExcluded: true },
    opportunities: { type: 'text', isExcluded: true },
    dissemination: { type: 'text', isExcluded: true },
    waiver: { column: 'reqn_version.waiver', type: 'string', isExcluded: true }
  } );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnFinalReportView', [
    'CnFinalReportModelFactory', 'cnRecordViewDirective', 'CnReqnModelFactory', 'CnReqnHelper', 'CnSession', '$q',
    function( CnFinalReportModelFactory, cnRecordViewDirective, CnReqnModelFactory, CnReqnHelper, CnSession, $q ) {
      // used to piggy-back on the basic view controller's functionality
      var cnRecordView = cnRecordViewDirective[0];
      var reqnModel = CnReqnModelFactory.instance();

      return {
        templateUrl: module.getFileUrl( 'view.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        link: function( scope, element, attrs ) {
          cnRecordView.link( scope, element, attrs );
          scope.isAddingProduction = false;
          scope.isDeletingProduction = [];

          scope.model.viewModel.afterView( function() {
            // setup the breadcrumbtrail
            CnSession.setBreadcrumbTrail(
              [ {
                title: reqnModel.module.name.plural.ucWords(),
                go: function() { reqnModel.transitionToListState(); }
              }, {
                title: scope.model.viewModel.record.identifier,
                go: function() {
                  reqnModel.transitionToViewState( {
                    getIdentifier: function() { return 'identifier=' + scope.model.viewModel.record.identifier; }
                  } );
                }
              }, {
                title: scope.model.module.name.singular.ucWords(),
                go: function() { scope.model.transitionToViewState( scope.model.viewModel.record ); }
              } ]
            );
          } );
        },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnFinalReportModelFactory.root;
          cnRecordView.controller[1]( $scope );
          $scope.t = function( value ) {
            return CnReqnHelper.translate( 'finalReport', value, $scope.model.viewModel.record.language );
          };
        
          // production resources
          var productionAddModel = $scope.model.viewModel.productionModel.addModel;
          $scope.productionRecord = {};
          productionAddModel.onNew( $scope.productionRecord );

          $scope.addProduction = function() {
            if( $scope.model.viewModel.productionModel.getAddEnabled() ) {
              var form = cenozo.getScopeByQuerySelector( '#part2Form' ).part2Form;

              // we need to check each add-input for errors
              var valid = true;
              for( var property in $scope.model.viewModel.productionModel.module.inputGroupList[0].inputList ) {
                // get the property's form element and remove any conflict errors, then see if it's invalid
                var currentElement = cenozo.getFormElement( property );
                if( currentElement ) {
                  currentElement.$error.conflict = false;
                  cenozo.updateFormElement( currentElement );
                  if( currentElement.$invalid ) {
                    valid = false;
                    break;
                  }
                }
              }
              if( !valid ) {
                // dirty all inputs so we can find the problem
                cenozo.forEachFormElement( 'part2Form', function( element ) { element.$dirty = true; } ); 
              } else {
                $scope.isAddingProduction = true;
                productionAddModel.onAdd( $scope.productionRecord ).then( function( response ) {
                  form.$setPristine();
                  return $q.all( [
                    productionAddModel.onNew( $scope.productionRecord ),
                    $scope.model.viewModel.getProductionList()
                  ] );
                } ).finally( function() { $scope.isAddingProduction = false; } ); 
              }
            }
          };

          $scope.removeProduction = function( id ) {
            if( $scope.model.viewModel.productionModel.getDeleteEnabled() ) {
              if( !$scope.isDeletingProduction.includes( id ) ) $scope.isDeletingProduction.push( id );
              var index = $scope.isDeletingProduction.indexOf( id );
              $scope.model.viewModel.removeProduction( id ).finally( function() {
                if( 0 <= index ) $scope.isDeletingProduction.splice( index, 1 ); 
              } );
            }
          };

          $scope.check = function( property ) {
            // The cn-final-report-form directive makes use of cn-add-input directives.  These directives need their
            // parent to have a check() function which checks to see whether the input is valid or not.  Since
            // that function is usually in the cn-record-add directive we have to implement on here instead.
            var element = cenozo.getFormElement( property );
            if( element ) {
              element.$error.format = !$scope.model.viewModel.productionModel.testFormat(
                property, $scope.productionRecord[property]
              );
              cenozo.updateFormElement( element, true );
            }
          };
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnFinalReportViewFactory', [
    'CnBaseViewFactory', 'CnReqnHelper', 'CnHttpFactory', 'CnProductionModelFactory', '$q',
    function( CnBaseViewFactory, CnReqnHelper, CnHttpFactory, CnProductionModelFactory, $q ) {
      var object = function( parentModel, root ) {
        var self = this;
        CnBaseViewFactory.construct( this, parentModel, root );

        angular.extend( this, {
          onView: function( force ) {
            // reset tab value
            this.setFormTab( this.parentModel.getQueryParameter( 't' ), false );

            return $q.all( [
              this.$$onView( force ),
              this.getProductionList(),
              this.getProductionTypeList()
            ] );

            return this.$$onView( force );
          },

          // setup language and tab state parameters
          toggleLanguage: function() {
            this.record.language = 'en' == this.record.language ? 'fr' : 'en';
            return CnHttpFactory.instance( {
              path: 'reqn/identifier=' + this.record.identifier,
              data: { language: this.record.language }
            } ).patch();
          },

          productionModel: CnProductionModelFactory.instance(),
          productionList: [],
          productionTypeList: {
            en: [ { value: '', name: CnReqnHelper.translate( 'finalReport', 'misc.choose', 'en' ) } ],
            fr: [ { value: '', name: CnReqnHelper.translate( 'finalReport', 'misc.choose', 'fr' ) } ]
          },

          formTab: '',
          tabSectionList: ['instructions','part1','part2','part3'],
          setFormTab: function( tab, transition ) {
            if( angular.isUndefined( transition ) ) transition = true;
            if( !this.tabSectionList.includes( tab ) ) tab = 'instructions';
            this.formTab = tab;
            this.parentModel.setQueryParameter( 't', tab );
            if( transition ) this.parentModel.reloadState( false, false, 'replace' );

            // update all textarea sizes
            angular.element( 'textarea[cn-elastic]' ).trigger( 'elastic' );
          },

          nextSection: function( reverse ) {
            if( angular.isUndefined( reverse ) ) reverse = false;

            var currentTabSectionIndex = this.tabSectionList.indexOf( this.formTab );
            if( null != currentTabSectionIndex ) {
              var tabSection = this.tabSectionList[currentTabSectionIndex + (reverse?-1:1)];
              if( angular.isDefined( tabSection ) ) this.setFormTab( tabSection );
            }
          },

          getProductionList: function() {
            return CnHttpFactory.instance( {
              path: this.parentModel.getServiceResourcePath() + '/production',
              data: {
                select: {
                  column: [
                    'id', 'detail',
                    { table: 'production_type', column: 'rank' },
                    { table: 'production_type', column: 'name_en' },
                    { table: 'production_type', column: 'name_fr' }
                  ]
                },
                modifier: { limit: 1000000 }
              }
            } ).query().then( function( response ) {
              self.productionList = response.data;
            } );
          },

          getProductionTypeList: function() {
            return CnHttpFactory.instance( {
              path: 'production_type',
              data: {
                select: { column: [ 'id', 'rank', 'name_en', 'name_fr', 'note_en', 'note_fr' ] },
                modifier: { order: 'rank', limit: 1000000 }
              }
            } ).query().then( function( response ) {
              response.data.forEach( function( item ) {
                self.productionTypeList.en.push( { value: item.id, name: item.name_en, note: item.note_en } );
                self.productionTypeList.fr.push( { value: item.id, name: item.name_fr, note: item.note_fr } );
              } );
            } );
          },

          getProductionTypeNote: function( productionTypeId ) {
            var productionType = this.productionTypeList[this.record.language].findByProperty( 'value', productionTypeId );
            return null == productionType ? '' : productionType.note;
          },

          removeProduction: function( id ) {
            return CnHttpFactory.instance( {
              path: this.parentModel.getServiceResourcePath() + '/production/' + id
            } ).delete().then( function() {
              return self.getProductionList();
            } );
          }
        } );

        this.productionModel.metadata.getPromise(); // needed to get the production's metadata
      };
      return { instance: function( parentModel, root ) { return new object( parentModel, root ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnFinalReportModelFactory', [
    'CnBaseModelFactory', 'CnFinalReportViewFactory', 'CnHttpFactory', '$state',
    function( CnBaseModelFactory, CnFinalReportViewFactory, CnHttpFactory, $state ) {
      var object = function( root ) {
        var self = this;
        CnBaseModelFactory.construct( this, module );
        this.viewModel = CnFinalReportViewFactory.instance( this, root );
      };

      return {
        root: new object( true ),
        instance: function() { return new object( false ); }
      };
    }
  ] );

} );
