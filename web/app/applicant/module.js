cenozoApp.defineModule( { name: 'applicant', models: ['add', 'list'], create: module => {

  angular.extend( module, {
    identifier: {},
    name: {
      singular: 'trainee',
      plural: 'trainees',
      possessive: 'trainee\'s'
    },
    columnList: {
      supervisor_full_name: {
        title: 'Supervisor',
        isIncluded: function( $state, model ) { return 'applicant.list' == $state.current.name; }
      },
      user_full_name: {
        title: 'Trainee'
      },
      user_name: {
        column: 'user.name',
        isIncluded: function( $state, model ) { return false; }
      }
    },
    defaultOrder: {
      column: 'user_full_name',
      reverse: false
    }
  } );

  module.addInputGroup( '', {
    supervisor_user_id: {
      column: 'applicant.supervisor_user_id',
      title: 'Supervisor',
      type: 'lookup-typeahead',
      typeahead: {
        table: 'user',
        select: 'CONCAT( user.first_name, " ", user.last_name, " (", user.name, ")" )',
        where: [ 'user.first_name', 'user.last_name', 'user.name' ]
      }
    },
    user_id: {
      column: 'applicant.user_id',
      title: 'Trainee',
      type: 'lookup-typeahead',
      typeahead: {
        table: 'user',
        select: 'CONCAT( user.first_name, " ", user.last_name, " (", user.name, ")" )',
        where: [ 'user.first_name', 'user.last_name', 'user.name' ],
        forceEmptyOnNew: true // otherwise the parent supervisor's name will populate when adding
      }
    }
  } );

} } );
