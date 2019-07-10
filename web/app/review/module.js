define( function() {
  'use strict';

  try { var module = cenozoApp.module( 'review', true ); } catch( err ) { console.warn( err ); return; }
  angular.extend( module, {
    identifier: {
      parent: {
        subject: 'reqn',
        column: 'reqn.identifier'
      }
    },
    name: {
      singular: 'review',
      plural: 'reviews',
      possessive: 'review\'s'
    },
    columnList: {
      identifier: { column: 'reqn.identifier', title: 'Requisition' },
      review_type: {
        column: 'review_type.name',
        title: 'Type',
        isIncluded: function( $state, model ) { return 'root.home' != $state.current.name; }
      },
      user_full_name: {
        title: 'Reviewer',
        isIncluded: function( $state, model ) { return !model.isReviewer(); }
      },
      date: { title: 'Created On' },
      recommendation: {
        column: 'recommendation_type.name',
        title: 'Recommendation'
      },
      note: {
        title: 'Note',
        align: 'left',
        isIncluded: function( $state, model ) { return 'root.home' != $state.current.name; }
      }
    },
    defaultOrder: {
      column: 'identifier',
      reverse: false
    }
  } );

  module.addInputGroup( '', {
    identifier: {
      column: 'reqn.identifier',
      title: 'Requisition',
      type: 'lookup-typeahead',
      typeahead: {
        table: 'reqn',
        select: 'reqn.identifier',
        where: 'reqn.identifier'
      },
      constant: true
    },
    review_type: {
      column: 'review_type.name',
      title: 'Review Type',
      type: 'string',
      constant: true
    },
    user_id: {
      column: 'review.user_id',
      title: 'Reviewer',
      type: 'lookup-typeahead',
      typeahead: {
        table: 'user',
        select: 'CONCAT( user.first_name, " ", user.last_name, " (", user.name, ")" )',
        where: [ 'user.first_name', 'user.last_name', 'user.name' ]
      },
      constant: true
    },
    date: {
      title: 'Created On',
      type: 'date',
      constant: true
    },
    recommendation_type_id: {
      title: 'Recommendation',
      type: 'enum'
    },
    note: {
      title: 'Note',
      type: 'text'
    },
    reqn_id: { type: 'hidden' },
    review_type_id: { type: 'hidden' },
    current_reqn_version_id: { column: 'reqn_version.id', type: 'hidden' },
    funding_filename: { column: 'reqn_version.funding_filename', type: 'hidden' },
    ethics_filename: { column: 'reqn_version.ethics_filename', type: 'hidden' }
  } );

  module.addExtraOperation( 'view', {
    title: 'View Form',
    operation: function( $state, model ) {
      $state.go( 'reqn_version.view', { identifier: model.viewModel.record.current_reqn_version_id } );
    }
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
      title: 'Funding Letter',
      operation: function( $state, model ) { model.viewModel.downloadFundingLetter(); },
      isDisabled: function( $state, model ) { return !model.viewModel.record.funding_filename; }
    }, {
      title: 'Ethics Letter',
      operation: function( $state, model ) { model.viewModel.downloadEthicsLetter(); },
      isDisabled: function( $state, model ) { return !model.viewModel.record.ethics_filename; }
    }, {
      title: 'Reviews',
      operation: function( $state, model ) { model.viewModel.downloadReviews(); }
    } ]
  } );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnReviewList', [
    'CnReviewModelFactory',
    function( CnReviewModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'list.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnReviewModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnReviewView', [
    'CnReviewModelFactory',
    function( CnReviewModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'view.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnReviewModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnReviewListFactory', [
    'CnBaseListFactory',
    function( CnBaseListFactory ) {
      var object = function( parentModel ) { CnBaseListFactory.construct( this, parentModel ); };
      return { instance: function( parentModel ) { return new object( parentModel ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnReviewViewFactory', [
    'CnBaseViewFactory', 'CnReqnHelper', 'CnHttpFactory', 'CnSession',
    function( CnBaseViewFactory, CnReqnHelper, CnHttpFactory, CnSession ) {
      var object = function( parentModel, root ) {
        var self = this;
        CnBaseViewFactory.construct( this, parentModel, root );

        // administrators can edit any review, but other roles only have access to specific reviews
        // (updated after the record is loaded)
        angular.extend( this, {
          mayEdit: 'administrator' == CnSession.role.name,
          onView: function( force ) {
            self.mayEdit = 'administrator' == CnSession.role.name;
            return self.$$onView( force ).then( function() {
              if( !self.mayEdit ) {
                if( 'Admin' == self.record.review_type || 'SAC' == self.record.review_type ) {
                  self.mayEdit = false;
                } else if( 'Reviewer 1' == self.record.review_type || 'Reviewer 2' == self.record.review_type ) {
                  self.mayEdit = 'reviewer' == CnSession.role.name
                               ? self.record.user_id == CnSession.user.id
                               : 'chair' == CnSession.role.name;
                } else if( 'Chair' == self.record.review_type || 'Second Chair' == self.record.review_type ) {
                  self.mayEdit = 'chair' == CnSession.role.name;
                } else if( 'SMT' == self.record.review_type || 'Second SMT' == self.record.review_type ) {
                  self.mayEdit = 'smt' == CnSession.role.name;
                }
              }

              // determine which recommendation_type enum list to use based on the review type
              self.parentModel.metadata.columnList.recommendation_type_id.enumList =
                self.parentModel.recommendationList[self.record.review_type_id];
            } );
          },

          downloadApplication: function() { return CnReqnHelper.download( 'application', this.record.current_reqn_version_id ); },
          downloadChecklist: function() { return CnReqnHelper.download( 'checklist', this.record.current_reqn_version_id ); },
          downloadFundingLetter: function() { return CnReqnHelper.download( 'funding_filename', this.record.current_reqn_version_id ); },
          downloadEthicsLetter: function() { return CnReqnHelper.download( 'ethics_filename', this.record.current_reqn_version_id ); },
          downloadReviews: function() {
            return CnHttpFactory.instance( {
              path: 'reqn/' + this.record.reqn_id + '?file=reviews',
              format: 'txt'
            } ).file();
          }
        } );

        // add an additional check to see if the review is editable
        this.parentModel.getEditEnabled = function() { return self.parentModel.$$getEditEnabled() && self.mayEdit; };
      };
      return { instance: function( parentModel, root ) { return new object( parentModel, root ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnReviewModelFactory', [
    'CnBaseModelFactory', 'CnReviewListFactory', 'CnReviewViewFactory', 'CnSession', 'CnHttpFactory',
    function( CnBaseModelFactory, CnReviewListFactory, CnReviewViewFactory, CnSession, CnHttpFactory ) {
      var object = function( root ) {
        var self = this;
        CnBaseModelFactory.construct( this, module );
        this.listModel = CnReviewListFactory.instance( this );
        this.viewModel = CnReviewViewFactory.instance( this, root );

        this.recommendationList = {};

        // only allow editing user and date under particular roles
        if( 0 <= ['administrator','chair'].indexOf( CnSession.role.name ) ) {
          this.module.inputGroupList.findByProperty( 'title', '' ).inputList.user_id.constant = false;
          this.module.inputGroupList.findByProperty( 'title', '' ).inputList.date.constant = false;
        }

        this.isReviewer = function() { return 'reviewer' == CnSession.role.name; };

        // override the service collection path so that reviewers can view their reviews from the home screen
        this.getServiceCollectionPath = function() {
          // ignore the parent if it is root
          return this.$$getServiceCollectionPath( 'root' == this.getSubjectFromState() );
        };

        // override the service data so that reviewers only see their own incomplete reviews from the home screen
        this.getServiceData = function( type, columnRestrictLists ) {
          var data = this.$$getServiceData( type, columnRestrictLists );
          if( 'root' == this.getSubjectFromState() && 'reviewer' == CnSession.role.name ) {
            if( angular.isUndefined( data.modifier.where ) ) data.modifier.where = [];
            data.modifier.where.push( {
              column: 'review.user_id',
              operator: '=',
              value: CnSession.user.id
            } );
            data.modifier.where.push( {
              column: 'review.recommendation_type_id',
              operator: '=',
              value: null
            } );
          }
          return data;
        };
      
        // extend getMetadata
        this.getMetadata = function() {
          return this.$$getMetadata().then( function() {
            return CnHttpFactory.instance( {
              path: 'recommendation_type',
              data: {
                select: { column: [ 'id', 'name', 'review_type_id_list' ] },
                modifier: { order: 'id' }
              }
            } ).query().then( function success( response ) { 
              self.metadata.columnList.recommendation_type_id = { 
                required: false,
                enumList: [],
              };
              response.data.forEach( function( item ) { 
                item.review_type_id_list.split( ',' ).forEach( function( reviewTypeId ) {
                  if( angular.isUndefined( self.recommendationList[reviewTypeId] ) ) self.recommendationList[reviewTypeId] = [];
                  self.recommendationList[reviewTypeId].push( { value: item.id, name: item.name } );
                } );
              } );
            } );
          } );
        };

        // extend getTypeaheadData
        this.getTypeaheadData = function( input, viewValue ) {
          var data = this.$$getTypeaheadData( input, viewValue );

          // only include active reviewers (reviewer_only parameter handled by the service)
          if( 'user' == input.typeahead.table && null != this.viewModel.record.review_type.match( /Reviewer [0-9]/ ) )
            data.reviewer_only = true;

          return data;
        };
      };

      return {
        root: new object( true ),
        instance: function() { return new object( false ); }
      };
    }
  ] );

} );
