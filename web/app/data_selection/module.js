define( function() {
  'use strict';

  try { var module = cenozoApp.module( 'data_selection', true ); } catch( err ) { console.warn( err ); return; }
  angular.extend( module, {
    identifier: {
      parent: {
        subject: 'data_option',
        column: 'data_option.name_en'
      }
    },
    name: {
      singular: 'data-selection',
      plural: 'data-selections',
      possessive: 'data-selection\'s'
    },
    columnList: {
      option_rank: { column: 'data_option.rank', title: 'Data-Option Rank', type: 'rank' },
      option_name_en: { column: 'data_option.name_en', title: 'Data-Option Name' },
      study_phase: { column: 'study_phase.name', title: 'Study-Phase' },
      cost: { title: 'Cost', type: 'currency:$:0' },
      is_unavailable: { title: 'Unavailable', type: 'boolean' }
    },
    defaultOrder: { column: 'study_phase_id', reverse: false }
  } );

  module.addInputGroup( '', {
    data_option_id: {
      title: 'Data-Option',
      type: 'enum',
      isConstant: 'view'
    },
    study_phase_id: {
      title: 'Study-Phase',
      type: 'enum',
      isConstant: 'view'
    },
    cost: {
      title: 'Cost ($)',
      type: 'string',
      format: 'integer'
    },
    unavailable_en: {
      title: 'Unavailable Text (English)',
      type: 'string',
      help: 'If requisitions should not be allowed to select this data-selection then ' +
            'provide the English text that will replace the selection button.'

    },
    unavailable_fr: {
      title: 'Unavailable Text (French)',
      type: 'string',
      help: 'If requisitions should not be allowed to select this data-selection then ' +
            'provide the French text that will replace the selection button.'
    }
  } );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnDataSelectionList', [
    'CnDataSelectionModelFactory',
    function( CnDataSelectionModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'list.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnDataSelectionModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnDataSelectionView', [
    'CnDataSelectionModelFactory',
    function( CnDataSelectionModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'view.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnDataSelectionModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnDataSelectionListFactory', [
    'CnBaseListFactory',
    function( CnBaseListFactory ) {
      var object = function( parentModel ) { CnBaseListFactory.construct( this, parentModel ); };
      return { instance: function( parentModel ) { return new object( parentModel ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnDataSelectionViewFactory', [
    'CnBaseViewFactory',
    function( CnBaseViewFactory ) {
      var object = function( parentModel, root ) { CnBaseViewFactory.construct( this, parentModel, root, 'data_detail' ); }
      return { instance: function( parentModel, root ) { return new object( parentModel, root ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnDataSelectionModelFactory', [
    'CnBaseModelFactory', 'CnDataSelectionListFactory', 'CnDataSelectionViewFactory', 'CnHttpFactory',
    function( CnBaseModelFactory, CnDataSelectionListFactory, CnDataSelectionViewFactory, CnHttpFactory ) {
      var object = function( root ) {
        var self = this;
        CnBaseModelFactory.construct( this, module );
        this.listModel = CnDataSelectionListFactory.instance( this );
        this.viewModel = CnDataSelectionViewFactory.instance( this, root );

        // extend getMetadata
        this.getMetadata = async function() {
          var self = this;
          await this.$$getMetadata();

          var [dataOptionResponse, studyPhaseResponse] = await Promise.all( [
            CnHttpFactory.instance( {
              path: 'data_option',
              data: {
                select: { column: [ 'id', 'name_en', { table: 'data_category', column: 'name_en', alias: 'category' } ] },
                modifier: { order: [ 'data_category.rank', 'data_option.rank' ], limit: 1000 }
              }
            } ).query(),

            CnHttpFactory.instance( {
              path: 'study_phase',
              data: {
                select: { column: [ 'id', 'name', { table: 'study', column: 'name', alias: 'study' } ] },
                modifier: { order: [ 'study.name', 'study_phase.rank' ], limit: 1000 }
              }
            } ).query()
          ] );

          this.metadata.columnList.data_option_id.enumList = [];
          dataOptionResponse.data.forEach( function( item ) {
            self.metadata.columnList.data_option_id.enumList.push( {
              value: item.id, name: item.category + ': ' + item.name_en
            } );
          } );

          this.metadata.columnList.study_phase_id.enumList = [];
          studyPhaseResponse.data.forEach( function( item ) {
            self.metadata.columnList.study_phase_id.enumList.push( {
              value: item.id, name: item.study + ': ' + item.name
            } );
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
