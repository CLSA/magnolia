cenozoApp.defineModule( { name: 'data_category', models: ['list', 'view'], create: module => {

  angular.extend( module, {
    identifier: { column: 'name_en' },
    name: {
      singular: 'data-category',
      plural: 'data-categories',
      possessive: 'data-category\'s'
    },
    columnList: {
      rank: { title: 'Rank', type: 'rank' },
      name_en: { title: 'Name' },
      comment: { title: 'Allow Comments', type: 'boolean' },
      has_condition: { title: 'Has Condition', type: 'boolean' },
      note_en: { title: 'Note', type: 'text', limit: 20 }
    },
    defaultOrder: { column: 'rank', reverse: false }
  } );

  module.addInputGroup( '', {
    rank: {
      title: 'Rank',
      type: 'rank',
      isConstant: true
    },
    comment: {
      title: 'Allow Comments',
      type: 'boolean'
    },
    name_en: {
      title: 'Name (English)',
      type: 'string'
    },
    name_fr: {
      title: 'Name (French)',
      type: 'string'
    },
    condition_en: {
      title: 'Condition (English)',
      type: 'text',
      help: 'If provided then this statement must be agreed to by the applicant as a ' + 
            'condition to checking off any data option belonging to this category'
    },
    condition_fr: {
      title: 'Condition (French)',
      type: 'text',
      help: 'If provided then this statement must be agreed to by the applicant as a ' +
            'condition to checking off any data option belonging to this category'
    },
    note_en: {
      title: 'Note (English)',
      type: 'text'
    },
    note_fr: {
      title: 'Note (French)',
      type: 'text'
    }
  } );

} } );
