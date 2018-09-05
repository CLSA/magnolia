define( function() {
  'use strict';

  try { var module = cenozoApp.module( 'production', true ); } catch( err ) { console.warn( err ); return; }
  angular.extend( module, {
    identifier: {
      parent: {
        subject: 'reqn',
        column: 'identifier'
      }
    },
    name: {
      singular: 'production',
      plural: 'productions',
      possessive: 'production\'s'
    }
  } );

  module.addInputGroup( '', {
    production_type_id: { title: 'Production Type', type: 'enum' },
    detail: { title: 'Details', type: 'string' },
    filename: { title: 'Attachment', type: 'file' }
  } );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnProductionAddFactory', [
    'CnBaseAddFactory',
    function( CnBaseAddFactory ) {
      var object = function( parentModel ) {
        CnBaseAddFactory.construct( this, parentModel );

        this.onNew = function( record ) {
          return this.$$onNew( record ).then( function() {
            // convert blank enum to empty string
            record.production_type_id = '';
          } );
        }
      };
      return { instance: function( parentModel ) { return new object( parentModel ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnProductionModelFactory', [
    'CnBaseModelFactory', 'CnProductionAddFactory',
    function( CnBaseModelFactory, CnProductionAddFactory ) {
      var object = function( root ) {
        var self = this;
        CnBaseModelFactory.construct( this, module );
        this.addModel = CnProductionAddFactory.instance( this );
      };

      return { instance: function() { return new object( false ); } };
    }
  ] );

} );
