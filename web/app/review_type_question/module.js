define( function() {
  'use strict';

  try { var module = cenozoApp.module( 'review_type_question', true ); } catch( err ) { console.warn( err ); return; }

  angular.extend( module, {
    identifier: {
      parent: {
        subject: 'review_type',
        column: 'review_type.name'
      }
    },
    name: {
      singular: 'question',
      plural: 'questions',
      possessive: 'question\'s'
    },
    columnList: {
      rank: { title: 'Rank', type: 'rank' },
      question: { title: 'Question', type: 'text', limit: 200 }
    },
    defaultOrder: { column: 'rank', reverse: false }
  } );

  module.addInputGroup( '', {
    rank: { title: 'Rank', type: 'rank' },
    question: { title: 'Question', type: 'text' }
  } );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnReviewTypeQuestionAdd', [
    'CnReviewTypeQuestionModelFactory',
    function( CnReviewTypeQuestionModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'add.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnReviewTypeQuestionModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnReviewTypeQuestionList', [
    'CnReviewTypeQuestionModelFactory',
    function( CnReviewTypeQuestionModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'list.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnReviewTypeQuestionModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnReviewTypeQuestionView', [
    'CnReviewTypeQuestionModelFactory',
    function( CnReviewTypeQuestionModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'view.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnReviewTypeQuestionModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnReviewTypeQuestionAddFactory', [
    'CnBaseAddFactory',
    function( CnBaseAddFactory ) {
      var object = function( parentModel ) { CnBaseAddFactory.construct( this, parentModel ); };
      return { instance: function( parentModel ) { return new object( parentModel ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnReviewTypeQuestionListFactory', [
    'CnBaseListFactory',
    function( CnBaseListFactory ) {
      var object = function( parentModel ) { CnBaseListFactory.construct( this, parentModel ); };
      return { instance: function( parentModel ) { return new object( parentModel ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnReviewTypeQuestionViewFactory', [
    'CnBaseViewFactory',
    function( CnBaseViewFactory ) {
      var object = function( parentModel, root ) { CnBaseViewFactory.construct( this, parentModel, root ); }
      return { instance: function( parentModel, root ) { return new object( parentModel, root ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnReviewTypeQuestionModelFactory', [
    'CnBaseModelFactory', 'CnReviewTypeQuestionAddFactory', 'CnReviewTypeQuestionListFactory', 'CnReviewTypeQuestionViewFactory',
    function( CnBaseModelFactory, CnReviewTypeQuestionAddFactory, CnReviewTypeQuestionListFactory, CnReviewTypeQuestionViewFactory ) {
      var object = function( root ) {
        CnBaseModelFactory.construct( this, module );
        this.addModel = CnReviewTypeQuestionAddFactory.instance( this );
        this.listModel = CnReviewTypeQuestionListFactory.instance( this );
        this.viewModel = CnReviewTypeQuestionViewFactory.instance( this, root );
      };

      return {
        root: new object( true ),
        instance: function() { return new object( false ); }
      };
    }
  ] );

} );
