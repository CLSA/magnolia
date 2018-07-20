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
    user_id: {
      column: 'reqn.user_id',
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
    'CnBaseViewFactory', 'CnHttpFactory',
    function( CnBaseViewFactory, CnHttpFactory ) {
      var object = function( parentModel, root ) {
        var self = this;
        CnBaseViewFactory.construct( this, parentModel, root );

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
