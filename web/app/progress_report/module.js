define( function() {
  'use strict';

  try { var module = cenozoApp.module( 'progress_report', true ); } catch( err ) { console.warn( err ); return; }
  angular.extend( module, {
    identifier: {
      parent: {
        subject: 'requisition',
        column: 'requisition.identifier'
      }
    },
    name: {
      singular: 'progress report',
      plural: 'progress reports',
      possessive: 'progress report\'s',
      friendlyColumn: 'type'
    },
    columnList: {
      type: { title: 'Type' },
      date: { title: 'Date', type: 'date' }
    },
    defaultOrder: {
      column: 'progress_report.date',
      reverse: true
    }
  } );

  module.addInputGroup( '', {
    language: { column: 'language.code', type: 'string' },
    type: { type: 'string' },
    thesis_title: { type: 'string' },
    thesis_status: { type: 'string' },
    activities: { type: 'text' },
    findings: { type: 'text' },
    outcomes: { type: 'text' },
    date: { type: 'date' }
  } );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnProgressReportList', [
    'CnProgressReportModelFactory',
    function( CnProgressReportModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'list.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnProgressReportModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnProgressReportView', [
    'CnProgressReportModelFactory', 'cnRecordViewDirective',
    function( CnProgressReportModelFactory, cnRecordViewDirective ) {
      // used to piggy-back on the basic view controller's functionality (but not used in the DOM)
      var cnRecordView = cnRecordViewDirective[0];
      return {
        templateUrl: module.getFileUrl( 'view.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        link: function( scope, element, attrs ) {
          cnRecordView.link( scope, element, attrs );
        },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnProgressReportModelFactory.root;
          cnRecordView.controller[1]( $scope );

          $scope.t = function( value ) {
            return cenozoApp.translate(
              'final' == $scope.model.viewModel.record.type ? finalLookupData : annualLookupData,
              value,
              $scope.model.viewModel.record.language
            );
          };

          var annualLookupData = {
            heading: {
              en: 'Approved User Research Progress Report - Annual Report',
              fr: 'Rapport d’avancement de la recherche pour les utilisateurs autorisés - Rapport annuel'
            },
            instructions: {
              tab: { en: 'Instructions', fr: 'Consignes' },
              title: {
                en: 'Completing the CLSA Approved User Annual Report',
                fr: 'Remplir le rapport annuel pour les utilisateurs autorisés de l’ÉLCV'
              },
              text1: {
                en: 'The Annual Report must be submitted for projects with a 2-year term, at the project midway point, within 30 days of the 1 year anniversary of the Effective Date of the CLSA Access Agreement.',
                fr: 'Assurez-vous de bien remplir toutes les sections du rapport annuel. Au besoin, veuillez ajouter des pages en vous assurant d’indiquer clairement à quelle section elles sont annexées.'
              },
              text2: {
                en: 'Please ensure that you have completed <strong>all sections of the Annual Report</strong>. Please attach additional pages if necessary, clearly noting which section your are expanding upon.',
                fr: 'Assurez-vous de bien remplir <strong>toutes les sections du rapport annuel</strong>. Au besoin, veuillez ajouter des pages en vous assurant d’indiquer clairement à quelle section elles sont annexées.'
              },
              text3: {
                en: 'Consult us for any questions regarding the annual report at <a href="mailto:access@clsa-elcv.ca">access@clsa-elcv.ca</a>.',
                fr: 'Veuillez adresser toute question relative au rapport annuel à <a href="mailto:access@clsa-elcv.ca">access@clsa-elcv.ca</a>.'
              }
            },
            a1: {
              tab: { en: 'Annual Report', fr: 'Rapport annuel' },
              title: { en: 'Accomplishments', fr: 'Réalisations' },
              text: {
                en: 'The information reported in this section allows the CLSA to assess what progress has been made toward accomplishing the objectives set out in the initial application and the impact of the project towards the advancement of knowledge.',
                fr: 'Les informations transmises ci-dessous permettent à l’ÉLCV d’évaluer les progrès effectués qui mènent à l’atteinte des objectifs définis dans la demande initiale, et de mesurer l’impact du projet pour l’avancement des connaissances.'
              },
              a: {
                question: {
                  en: 'What was accomplished for this reporting period?',
                  fr: 'Quels sont les progrès réalisés pendant la période qui fait l’objet du rapport?'
                },
                activities: {
                  en: 'Major activities',
                  fr: 'Les activités importantes'
                },
                findings: {
                  en: 'Major findings, developments, or conclusions (both positive and negative)',
                  fr: 'Les observations, avancées ou conclusions importantes (positives et négatives)'
                },
                outcomes: {
                  en: 'Key outcomes or other achievements',
                  fr: 'Les principaux résultats et autres réalisations'
                }
              },
              b: {
                question: {
                  en: 'If this is a trainee project that has been granted a fee waiver, you must complete the information below. (Any publications must be reported in section ‘c’)',
                  fr: 'S’il s’agit du projet d’un stagiaire qui a bénéficié d’une exonération des frais, vous devez répondre au questions suivantes. (Les publications doivent être déclarées à la section « c »)'
                },
                thesis_title: {
                  en: 'Thesis title (if graduate student trainee)',
                  fr: 'Titre de la thèse (s’il s’agit d’un étudiant aux cycles supérieurs)'
                },
                thesis_status: {
                  en: 'Thesis status (Proposal in preparation, thesis in progress, submitted, approved)',
                  fr: 'État de la thèse (Proposition en cours de préparation, thèse en cours d’écriture, thèse déposée, thèse approuvée)'
                }
              },
              c: {
                question: {
                  en: 'What has the project produced?',
                  fr: 'Qu’est-ce que votre projet a produit?'
                },
                text: {
                  en: 'List any products resulting from the project during the reporting period. Please provide references where available, and for peer-reviewed publications please specify if ‘in press’, ‘submitted’ or ‘published’. If you have not yet done so, please provide a copy of peer-reviewed publications to the CLSA when submitting this report.',
                  fr: 'Énumérer les produits qui ont été développés dans le cadre de votre projet pendant la période en question.  Veuillez fournir les références lorsqu’elles sont disponibles. Pour les articles évalués par des pairs, veuillez spécifier s’ils sont « sous presse », « soumis » ou « publiés ». Si ce n’est pas déjà fait, veuillez fournir une copie des articles évalués par des pairs à l’ÉLCV en soumettant ce rapport.'
                },
                publication: {
                  en: 'Peer-reviewed publications - Format: Author, A. (Publication Year). Article title. Periodical Title, Volume (Issue), pp.-pp.',
                  fr: 'Publications évaluées par des pairs - Format : Auteur, A. (année de publication). Titre de l’article. Titre du périodique, Volume (numéro), pp.-pp.'
                },
                conference: {
                  en: 'Conference papers and presentations - Format: Author, A. (Publication Year). Title of Paper or Proceedings, Title of Conference, Location, Date.  Place of publication: Publisher.',
                  fr: 'Actes de conférence et présentations - Format : Auteur, A. (année de publication). Titre de l’article ou de l’acte, titre de la conférence, lieu, date.  Lieu de publication : Éditeur.'
                },
                mass_media: {
                  en: 'Mass media - Format: Author, A. (Publication Year). Article title. Retrieved from (URL) on (Date).',
                  fr: 'Médias - Format : Auteur, A. (année de publication). Titre de l’article. Tiré de (URL) le (Date).'
                },
                technology: {
                  en: 'Website(s), technologies, equipment or techniques',
                  fr: 'Site(s) Web, technologies, de l’équipement ou techniques'
                },
                invention: {
                  en: 'Inventions, patent applications,or licenses',
                  fr: 'Inventions, demandes de brevet ou de licence'
                },
                data: {
                  en: 'Derived variables, models, databases, audio or video products, software, educational aids or curricula',
                  fr: 'Variables dérivées, modèles, bases de données, documents audio ou vidéo, logiciels, outils ou programmes éducatifs'
                },
                collaboration: {
                  en: 'Collaborations - partnerships with academic institutions, non-profits, industrial or commercial firms, governments, or school systems.',
                  fr: 'Collaborations - partenariats avec des établissements universitaires, des organismes à but non lucratif, des entreprises industrielles ou commerciales, des gouvernements ou les milieux scolaires'
                }
              }
            }
          };

          var finalLookupData = {
            heading: {
              en: 'CLSA Approved User Research Progress Report - Final Report',
              fr: 'Rapport d’avancement de la recherche pour les utilisateurs autorisés de l’ÉLCV - Rapport final'
            },
            instructions: {
              title: {
              en: 'Completing the CLSA Approved User Final Report',
              fr: 'Remplir le rapport final pour les utilisateurs autorisés de l’ÉLCV'
              },
              text1: {
                en: 'The Final Report must be submitted at the end of the project, 1 year after the Effective Date of the CLSA Access Agreement for projects with a 1-year term and 2 years after the Effective Date of the CLSA Access Agreement for projects with a 2-year term. The Final Report must be submitted within 60 days after the end date of the CLSA Access Agreement.',
                fr: 'Le rapport final doit être envoyé à la fin du projet, un an après la date d’entrée en vigueur de l’Entente d’accès de l’ÉLCV pour les projets d’une durée d’un ans ou deux ans après la date d’entrée en vigueur de l’Entente d’accès de l’ÉLCV pour les projets d’une durée de deux ans. Le rapport final doit être soumis dans les 60 jours suivant la fin de l’Entente d’accès de l’ÉLCV.'
              },
              text2: {
                en: 'Please ensure that you have completed <strong>all of the sections of the Final Report</strong>. Please attach additional pages if necessary, clearly noting which section your are expanding upon.',
                fr: 'Assurez-vous de bien remplir <strong>toutes les sections du rapport</strong>. Au besoin, veuillez ajouter des pages en vous assurant d’indiquer clairement à quelle section elles sont annexées.'
              },
              text3: {
                en: 'Consult us for any questions regarding the final report at <a href="mailto:access@clsa-elcv.ca">access@clsa-elcv.ca</a>.',
                fr: 'Veuillez adresser toute question relative au rapport final à <a href="mailto:access@clsa-elcv.ca">access@clsa-elcv.ca</a>.'
              }
            },
            a1: {
              tab: {
                en: 'Final Report',
                fr: 'Rapport final'
              },
              title: {
                en: 'Accomplishments',
                fr: 'Réalisations'
              },
              text: {
                en: 'The information reported in this section allows the CLSA to assess what progress has been made toward accomplishing the objectives set out in the initial application and the impact of the project towards the advancement of knowledge.',
                fr: 'Les informations transmises ci-dessous permettent à l’ÉLCV d’évaluer les progrès effectués qui mènent à l’atteinte des objectifs définis dans la demande initiale, et de mesurer l’impact du projet pour l’avancement des connaissances.'
              },
              a: {
                question: {
                  en: 'What was accomplished in this study?',
                  fr: 'Quelles sont les réalisations de l’étude?'
                },
                activities: {
                  en: 'Major activities',
                  fr: 'Les activités importantes'
                },
                findings: {
                  en: 'Major findings, developments, or conclusions (both positive and negative)',
                  fr: 'Les observations, avancées ou conclusions importantes (positives et négatives)'
                },
                outcomes: {
                  en: 'Key outcomes or other achievements',
                  fr: 'Les principaux résultats et autres réalisations'
                }
              },
              b: {
                question: {
                  en: 'If this is a trainee project that has been granted a fee waiver, you must complete the information below. (Any publications must be reported in section ‘c’)',
                  fr: 'S’il s’agit du projet d’un stagiaire qui a bénéficié d’une exonération des frais, vous devez répondre au questions suivantes. (Les publications doivent être déclarées à la section « c »)'
                },
                thesis_title: {
                  en: 'Thesis title (if graduate student trainee)',
                  fr: 'Titre de la thèse (s’il s’agit d’un étudiant aux cycles supérieurs)'
                },
                thesis_status: {
                  en: 'Thesis status (Proposal in preparation, thesis in progress, submitted, approved)',
                  fr: 'État de la thèse (Proposition en cours de préparation, thèse en cours d’écriture, thèse déposée, thèse approuvée)'
                }
              },
              c: {
                question: {
                  en: 'What has the project produced?',
                  fr: 'Qu’est-ce que votre projet a produit?'
                },
                text: {
                  en: 'List any products resulting from the project during the reporting period. Please provide references where available, and for peer-reviewed publications please specify if ‘in press’, ‘submitted’ or ‘published’. If you have not yet done so, please provide a copy of peer-reviewed publications to the CLSA when submitting this report.',
                  fr: 'Énumérer les produits qui ont été développés dans le cadre de votre projet pendant la période en question.  Veuillez fournir les références lorsqu’elles sont disponibles. Pour les articles évalués par des pairs, veuillez spécifier s’ils sont « sous presse », « soumis » ou « publiés ». Si ce n’est pas déjà fait, veuillez fournir une copie des articles évalués par des pairs à l’ÉLCV en soumettant ce rapport.'
                },
                publication: {
                  en: 'Peer-reviewed publications - Format: Author, A. (Publication Year). Article title. Periodical Title, Volume (Issue), pp.-pp.',
                  fr: 'Publications évaluées par des pairs - Format : Auteur, A. (année de publication). Titre de l’article. Titre du périodique, Volume (numéro), pp.-pp.'
                },
                conference: {
                  en: 'Conference papers and presentations - Format: Author, A. (Publication Year). Title of Paper or Proceedings, Title of Conference, Location, Date.  Place of publication: Publisher.',
                  fr: 'Actes de conférence et présentations - Format : Auteur, A. (année de publication). Titre de l’article ou de l’acte, titre de la conférence, lieu, date.  Lieu de publication : Éditeur.'
                },
                mass_media: {
                  en: 'Mass media - Format: Author, A. (Publication Year). Article title. Retrieved from (URL) on (Date).',
                  fr: 'Médias - Format : Auteur, A. (année de publication). Titre de l’article. Tiré de (URL) le (Date).'
                },
                technology: {
                  en: 'Website(s), technologies, equipment or techniques',
                  fr: 'Site(s) Web, technologies, de l’équipement ou techniques'
                },
                invention: {
                  en: 'Inventions, patent applications,or licenses',
                  fr: 'Inventions, demandes de brevet ou de licence'
                },
                data: {
                  en: 'Derived variables, models, databases, audio or video products, software, educational aids or curricula',
                  fr: 'Variables dérivées, modèles, bases de données, documents audio ou vidéo, logiciels, outils ou programmes éducatifs'
                },
                collaboration: {
                  en: 'Collaborations - partnerships with academic institutions, non-profits, industrial or commercial firms, governments, or school systems.',
                  fr: 'Collaborations - partenariats avec des établissements universitaires, des organismes à but non lucratif, des entreprises industrielles ou commerciales, des gouvernements ou les milieux scolaires'
                }
              },
              d: {
                question: {
                  en: 'What is the impact of the project?',
                  fr: 'Quel est l’impact du projet?'
                },
                text: {
                  en: 'Describe distinctive contributions, major accomplishments, innovations, successes, or any change in practice or behavior that has come about as a result of the project.',
                  fr: 'Décrivez les contributions marquantes, les réalisations, innovations, succès importants ou les changements dans la pratique ou les comportements qui ont émergé des conclusions de votre projet.'
                }
              },
              e: {
                question: {
                  en: 'What opportunities for training and professional development has the project provided?',
                  fr: 'Quelles occasions de formation et de perfectionnement professionnel votre projet a-t-il offert?'
                },
                text: {
                  en: 'List any opportunities for training (i.e. student research assistants) and professional development (i.e. HQP development opportunities, lectures, courses) that the project has provided.',
                  fr: 'Énumérez toutes les occasions de formation et de perfectionnement professionnel que votre projet a offertes.'
                }
              },
              f: {
                question: {
                  en: 'How have the results been disseminated to communities of interest?',
                  fr: 'Comment avez-vous diffusé les résultats aux groupes d’intérêt?'
                },
                text: {
                  en: 'Describe any knowledge translation and outreach activities that have been undertaken.',
                  fr: 'Décrivez toutes les activités d’application des connaissances et de sensibilisation qui ont été réalisées.'
                }
              }
            }
          };

        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnProgressReportListFactory', [
    'CnBaseListFactory',
    function( CnBaseListFactory ) {
      var object = function( parentModel ) { CnBaseListFactory.construct( this, parentModel ); };
      return { instance: function( parentModel ) { return new object( parentModel ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnProgressReportViewFactory', [
    'CnBaseViewFactory', 'CnHttpFactory',
    function( CnBaseViewFactory, CnHttpFactory ) {
      var object = function( parentModel, root ) {
        var self = this;
        CnBaseViewFactory.construct( this, parentModel, root );

        // setup language and tab state parameters
        this.toggleLanguage = function() {
          var parent = this.parentModel.getParentIdentifier();
          this.record.language = 'en' == this.record.language ? 'fr' : 'en';
          return CnHttpFactory.instance( {
            path: parent.subject + '/' + parent.identifier,
            data: { language: this.record.language }
          } ).patch();
        };

        this.setTab = function( tab, transition ) { 
          if( angular.isUndefined( transition ) ) transition = true;
          if( 0 > ['instructions','a1'].indexOf( tab ) ) tab = 'instructions';
          this.tab = tab;
          this.parentModel.setQueryParameter( 't', tab );
          if( transition ) this.parentModel.reloadState( false, false, 'replace' );
        };

        this.tab = '';
        this.setTab( this.parentModel.getQueryParameter( 't' ), false );
      };
      return { instance: function( parentModel, root ) { return new object( parentModel, root ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnProgressReportModelFactory', [
    'CnBaseModelFactory', 'CnProgressReportListFactory', 'CnProgressReportViewFactory',
    'CnHttpFactory', '$state',
    function( CnBaseModelFactory, CnProgressReportListFactory, CnProgressReportViewFactory,
              CnHttpFactory, $state ) {
      var object = function( root ) {
        var self = this;
        CnBaseModelFactory.construct( this, module );
        this.listModel = CnProgressReportListFactory.instance( this );
        this.viewModel = CnProgressReportViewFactory.instance( this, root );

        // override transitionToAddState
        this.transitionToAddState = function() {
          // immediately get a new requisition and view it (no add state required)
          return CnHttpFactory.instance( {
            path: 'progress_report',
            data: { requisition_id: $state.params.identifier } // when adding the current id is always a req'n
          } ).post().then( function ( response ) { 
            // immediately view the new requisition
            return self.transitionToViewState( { getIdentifier: function() { return response.data; } } );
          } )
        };
      };

      return {
        root: new object( true ),
        instance: function() { return new object( false ); }
      };
    }
  ] );

} );
