// extend the framework's module
define( [ 'reqn', 'root' ].reduce( function( list, name ) {
  return list.concat( cenozoApp.module( name ).getRequiredFiles() );
}, [] ), function() {
  'use strict';

  var module = cenozoApp.module( 'root' );

  // extend the view factory
  cenozo.providers.decorator( 'cnHomeDirective', [
    '$delegate', 'CnSession', 'CnHttpFactory', 'CnReqnModelFactory',
    function( $delegate, CnSession, CnHttpFactory, CnReqnModelFactory ) {

      // override the template for applicants
      if( 'applicant' == CnSession.role.name ) {
        var oldController = $delegate[0].controller;
        angular.extend( $delegate[0], {
          templateUrl: cenozoApp.getFileUrl( 'root', 'applicant_home.tpl.html' ),
          controller: function( $scope ) {
            oldController( $scope );
            $scope.reqnModel = CnReqnModelFactory.instance();
          }
        } );
      }

      return $delegate;
    }
  ] );

} );
