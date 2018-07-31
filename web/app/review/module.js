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
      recommendation: { title: 'Recommendation' },
      note: {
        title: 'Note',
        align: 'left',
        isIncluded: function( $state, model ) { return 'root.home' != $state.current.name; }
      }
    },
    defaultOrder: {
      column: 'date',
      reverse: true
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
    recommendation: {
      title: 'Recommendation',
      type: 'enum'
    },
    note: {
      title: 'Note',
      type: 'text'
    }
  } );

  module.addExtraOperation( 'view', {
    title: 'View Form',
    operation: function( $state, model ) { $state.go( 'reqn.form', model.getParentIdentifier() ); }
  } );

  module.addExtraOperation( 'view', {
    title: 'Download',
    operation: function( $state, model ) { model.viewModel.downloadForm(); }
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
    'CnBaseViewFactory', 'CnHttpFactory', 'CnSession',
    function( CnBaseViewFactory, CnHttpFactory, CnSession ) {
      var object = function( parentModel, root ) {
        var self = this;
        CnBaseViewFactory.construct( this, parentModel, root );

        // administrators can edit any review, but other roles only have access to specific reviews (updated after the record is loaded)
        this.mayEdit = 'administrator' == CnSession.role.name;
        this.onView = function( force ) {
          self.mayEdit = 'administrator' == CnSession.role.name;
          return self.$$onView( force ).then( function() {
            if( !self.mayEdit ) {
              if( self.record.user_id == CnSession.user.id ) {
                self.mayEdit = true;
              } else {
                if( 'Admin' == self.record.review_type || 'SAC' == self.record.review_type ) {
                  self.mayEdit = false;
                } else if( 'Reviewer 1' == self.record.review_type || 'Reviewer 2' == self.record.review_type ) {
                  self.mayEdit = 'reviewer' == CnSession.role.name || 'chair' == CnSession.role.name;
                } else if( 'Chair' == self.record.review_type || 'Second Chair' == self.record.review_type ) {
                  self.mayEdit = 'chair' == CnSession.role.name;
                } else if( 'SMT' == self.record.review_type || 'Second SMT' == self.record.review_type ) {
                  self.mayEdit = 'smt' == CnSession.role.name;
                }
              }
            }

            // disable the Revise recommendation option if this is the second Chair or SMT review
            self.parentModel.metadata.getPromise().then( function() {
              self.parentModel.metadata.columnList.recommendation.enumList.findByProperty( 'name', 'Revise' ).disabled = 
                'Second Chair' == self.record.review_type || 'Second SMT' == self.record.review_type;
            } );
          } );
        };

        // add an additional check to see if the review is editable
        this.parentModel.getEditEnabled = function() {
          return self.parentModel.$$getEditEnabled() && self.mayEdit;
        };

        this.downloadForm = function() {
          var parent = self.parentModel.getParentIdentifier();
          return CnHttpFactory.instance( {
            path: parent.subject + '/' + parent.identifier,
            format: 'pdf'
          } ).file();
        };
      };
      return { instance: function( parentModel, root ) { return new object( parentModel, root ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnReviewModelFactory', [
    'CnBaseModelFactory', 'CnReviewListFactory', 'CnReviewViewFactory', 'CnSession',
    function( CnBaseModelFactory, CnReviewListFactory, CnReviewViewFactory, CnSession ) {
      var object = function( root ) {
        var self = this;
        CnBaseModelFactory.construct( this, module );
        this.listModel = CnReviewListFactory.instance( this );
        this.viewModel = CnReviewViewFactory.instance( this, root );

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

        // override the service data so that reviewers only see incomplete reviews from the home screen
        this.getServiceData = function( type, columnRestrictLists ) {
          var data = this.$$getServiceData( type, columnRestrictLists );
          if( 'root' == this.getSubjectFromState() && 'reviewer' == CnSession.role.name ) {
            if( angular.isUndefined( data.modifier.where ) ) data.modifier.where = [];
            data.modifier.where.push( {
              column: 'review.recommendation',
              operator: '=',
              value: null
            } );
          }
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
