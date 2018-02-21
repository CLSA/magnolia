'use strict';

var cenozo = angular.module( 'cenozo' );

cenozo.controller( 'HeaderCtrl', [
  '$scope', 'CnBaseHeader',
  function( $scope, CnBaseHeader ) {
    // copy all properties from the base header
    CnBaseHeader.construct( $scope );
  }
] );

cenozoApp.translate = function( lookupData, address, language ) {
  var addressParts = address.split('.');

  function get( array, index ) {
    if( angular.isUndefined( index ) ) index = 0;
    var part = addressParts[index];
    return angular.isUndefined( array[part] )
         ? 'ERROR'
         : angular.isDefined( array[part][language] )
         ? array[part][language]
         : get( array[part], index+1 );
  }

  return get( lookupData );
};
