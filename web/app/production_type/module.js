define( function() {
  'use strict';

  try { var module = cenozoApp.module( 'production_type', true ); } catch( err ) { console.warn( err ); return; }
  angular.extend( module, {
    identifier: {},
    name: {
      singular: 'production type',
      plural: 'production types',
      possessive: 'production type\'s'
    }
  } );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnProductionTypeAddFactory', [
    'CnBaseAddFactory',
    function( CnBaseAddFactory ) {
      var object = function( parentModel ) { CnBaseAddFactory.construct( this, parentModel ); };
      return { instance: function( parentModel ) { return new object( parentModel ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnProductionTypeModelFactory', [
    'CnBaseModelFactory', 'CnProductionTypeAddFactory',
    function( CnBaseModelFactory, CnProductionTypeAddFactory ) {
      var object = function( root ) {
        var self = this;
        CnBaseModelFactory.construct( this, module );
        this.addModel = CnProductionTypeAddFactory.instance( this );
      };

      return { instance: function() { return new object( false ); } };
    }
  ] );

} );
