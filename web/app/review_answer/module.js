define( function() {
  'use strict';

  try { var module = cenozoApp.module( 'review_answer', true ); } catch( err ) { console.warn( err ); return; }
  angular.extend( module, {
    identifier: {
      parent: {
        subject: 'review',
        column: 'review.id'
      }
    },
    name: {
      singular: 'answer',
      plural: 'answers',
      possessive: 'answer\'s'
    },
    columnList: {
      question: { column: 'review_type_question.question', title: 'Question', type: 'text', limit: 200 },
      answer: { title: 'Answer', type: 'boolean' }
    },
    defaultOrder: { column: 'review_type_question.rank', reverse: false }
  } );

  module.addInputGroup( '', {
    question: {
      column: 'review_type_question.question',
      title: 'Question',
      type: 'text',
      isConstant: true
    },
    answer: {
      title: 'Answer',
      type: 'boolean'
    }
  } );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnReviewAnswerEntry', [
    'CnReviewAnswerModelFactory',
    function( CnReviewAnswerModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'entry.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.reviewAnswerModel ) ) $scope.reviewAnswerModel = CnReviewAnswerModelFactory.root;
          $scope.refresh = function() { $scope.reviewAnswerModel.entryModel.onView(); }
          $scope.refresh();
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnReviewAnswerList', [
    'CnReviewAnswerModelFactory',
    function( CnReviewAnswerModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'list.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnReviewAnswerModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnReviewAnswerView', [
    'CnReviewAnswerModelFactory',
    function( CnReviewAnswerModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'view.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnReviewAnswerModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnReviewAnswerEntryFactory', [
    'CnHttpFactory', '$state',
    function( CnHttpFactory, $state ) {
      var object = function( parentModel ) {
        angular.extend( object, {
          parentModel: parentModel,
          isReady: false,
          answerList: null,
          answerOptionList: [
            { value: null, name: '(Select Yes or No)' },
            { value: true, name: 'Yes' },
            { value: false, name: 'No' }
          ],
          onView: async function() {
            this.isReady = false;

            try {
              var response = await CnHttpFactory.instance( {
                path: ['review', this.parentModel.getQueryParameter( 'identifier', true ), 'review_answer' ].join( '/' ),
                data: {
                  select: { column: [ 'id', 'answer', 'comment', { table: 'review_type_question', column: 'question' } ] },
                  modifier: { order: 'review_type_question.rank' }
                }
              } ).query();
              this.answerList = response.data;
            } finally {
              this.isReady = true;
            }
          },
          patch: async function( property, id ) {
            this.isReady = false;

            try {
              var data = {};
              data[property] = this.answerList.findByProperty( 'id', id )[property];
              await CnHttpFactory.instance( { path: ['review_answer', id].join( '/' ), data: data } ).patch();
            } finally {
              this.isReady = true;
            }
          }
        } );

        return object;
      };
      return { instance: function( parentModel ) { return new object( parentModel ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnReviewAnswerListFactory', [
    'CnBaseListFactory',
    function( CnBaseListFactory ) {
      var object = function( parentModel ) { CnBaseListFactory.construct( this, parentModel ); };
      return { instance: function( parentModel ) { return new object( parentModel ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnReviewAnswerViewFactory', [
    'CnBaseViewFactory',
    function( CnBaseViewFactory ) {
      var object = function( parentModel, root ) { CnBaseViewFactory.construct( this, parentModel, root ); }
      return { instance: function( parentModel, root ) { return new object( parentModel, root ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnReviewAnswerModelFactory', [
    'CnBaseModelFactory', 'CnReviewAnswerEntryFactory', 'CnReviewAnswerListFactory', 'CnReviewAnswerViewFactory',
    function( CnBaseModelFactory, CnReviewAnswerEntryFactory, CnReviewAnswerListFactory, CnReviewAnswerViewFactory ) {
      var object = function( root ) {
        var self = this;
        CnBaseModelFactory.construct( this, module );
        this.entryModel = CnReviewAnswerEntryFactory.instance( this );
        this.listModel = CnReviewAnswerListFactory.instance( this );
        this.viewModel = CnReviewAnswerViewFactory.instance( this, root );
      };

      return {
        root: new object( true ),
        instance: function() { return new object( false ); }
      };
    }
  ] );

} );
