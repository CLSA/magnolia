// extend the framework's module
define( [ 'reqn', 'review', 'root' ].reduce( function( list, name ) {
  return list.concat( cenozoApp.module( name ).getRequiredFiles() );
}, [] ), function() {
  'use strict';

  var reqnModule = cenozoApp.module( 'reqn' );
  var reviewModule = cenozoApp.module( 'review' );

  // extend the view factory
  cenozo.providers.decorator( 'cnHomeDirective', [
    '$delegate', '$compile', 'CnSession', 'CnHttpFactory', 'CnReqnModelFactory', 'CnReviewModelFactory',
    function( $delegate, $compile, CnSession, CnHttpFactory, CnReqnModelFactory, CnReviewModelFactory ) {

      var oldController = $delegate[0].controller;
      var oldLink = $delegate[0].link;

      if( [ 'applicant', 'designate' ].includes( CnSession.role.name ) ) {
        angular.extend( $delegate[0], {
          // override the template for applicants
          templateUrl: cenozoApp.getFileUrl( 'root', 'applicant_home.tpl.html' ),
          controller: function( $scope ) {
            oldController( $scope );
            $scope.reqnModel = CnReqnModelFactory.instance();
            $scope.user = CnSession.user;

            // add the newsletter signup button event handler
            $scope.toggleNewsletter = function() {
              CnHttpFactory.instance( {
                path: 'self/0',
                data: { applicant: { newsletter: $scope.user.newsletter } },
                onError: function( error ) { $scope.user.newsletter = !$scope.user.newsletter; }
              } ).patch();
            };
          }
        } );
      } else if( ['chair','smt'].includes( CnSession.role.name ) ) {
        // show chairs the reqn list on their home page
        angular.extend( $delegate[0], {
          compile: function() {
            return function( scope, element, attrs ) {
              if( angular.isFunction( oldLink ) ) oldLink( scope, element, attrs );
              angular.element( element[0].querySelector( '.inner-view-frame div' ) ).append(
                '<cn-reqn-list model="reqnModel" remove-columns="ethics_expiry state state_days"></cn-reqn-list>'
              );
              $compile( element.contents() )( scope );
            };
          },
          controller: function( $scope ) {
            oldController( $scope );
            $scope.reqnModel = CnReqnModelFactory.instance();
            $scope.reqnModel.listModel.heading =
              ( 'chair' == CnSession.role.name ? 'DSAC' : 'SMT' ) + ' ' + reqnModule.name.singular.ucWords() + ' List';
          }
        } );
      } else if( 'reviewer' == CnSession.role.name ) {
        // show reviewers the review list on their home page
        angular.extend( $delegate[0], {
          compile: function() {
            return function( scope, element, attrs ) {
              if( angular.isFunction( oldLink ) ) oldLink( scope, element, attrs );
              angular.element( element[0].querySelector( '.inner-view-frame div' ) ).append(
                '<cn-review-list model="reviewModel"></cn-review-list>'
              );
              $compile( element.contents() )( scope );
            };
          },
          controller: function( $scope ) {
            oldController( $scope );
            $scope.reviewModel = CnReviewModelFactory.instance();
            $scope.reviewModel.listModel.heading = 'Outstanding ' + reviewModule.name.singular.ucWords() + ' List';
          }
        } );
      }

      return $delegate;
    }
  ] );

} );
