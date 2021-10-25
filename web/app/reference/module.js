cenozoApp.defineModule( { name: 'reference', models: 'add', create: module => {

  angular.extend( module, {
    identifier: {
      parent: {
        subject: 'reqn_version',
        column: 'id'
      }
    },
    name: {
      singular: 'reference',
      plural: 'references',
      possessive: 'reference\'s'
    }
  } );

} } );
