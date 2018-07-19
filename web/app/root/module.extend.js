// extend the framework's module
define( [ 'reqn', 'review', 'root' ].reduce( function( list, name ) {
  return list.concat( cenozoApp.module( name ).getRequiredFiles() );
}, [] ), function() {
  'use strict';

  var module = cenozoApp.module( 'root' );

  // extend the view factory
  cenozo.providers.decorator( 'cnHomeDirective', [
    '$delegate', '$compile', 'CnSession', 'CnHttpFactory', 'CnReqnModelFactory', 'CnReviewModelFactory',
    function( $delegate, $compile, CnSession, CnHttpFactory, CnReqnModelFactory, CnReviewModelFactory ) {

      var oldController = $delegate[0].controller;
      var oldLink = $delegate[0].link;

      if( 'applicant' == CnSession.role.name ) {
        // override the template for applicants
        angular.extend( $delegate[0], {
          templateUrl: cenozoApp.getFileUrl( 'root', 'applicant_home.tpl.html' ),
          controller: function( $scope ) {
            oldController( $scope );
            $scope.reqnModel = CnReqnModelFactory.instance();
          }
        } );
      } else if( 'reviewer' == CnSession.role.name ) {
        // show reviewers the review list on their home page
        angular.extend( $delegate[0], {
          compile: function() {
            return function( scope, element, attrs ) {
              if( angular.isFunction( oldLink ) ) oldLink( scope, element, attrs );
              angular.element( element[0].querySelector( '.inner-view-frame div' ) ).append(
                '<cn-review-list model="reviewModel" remove-columns="recommendation"></cn-review-list>'
              );
              $compile( element.contents() )( scope );
            };
          },
          controller: function( $scope ) {
            oldController( $scope );
            $scope.reviewModel = CnReviewModelFactory.instance();
            $scope.reviewModel.listModel.heading = 'Outstanding Review List';
          }
        } );
      }

      return $delegate;
    }
  ] );

} );
