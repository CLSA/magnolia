'use strict';

var cenozo = angular.module( 'cenozo' );

cenozo.controller( 'HeaderCtrl', [
  '$scope', 'CnBaseHeader',
  function( $scope, CnBaseHeader ) {
    // copy all properties from the base header
    CnBaseHeader.construct( $scope );
  }
] );

/* ######################################################################################################## */
cenozo.directive( 'cnViewInputWithDifferences',
  function() {
    return {
      templateUrl: cenozoApp.getFileUrl( 'magnolia', 'view-input-with-differences.tpl.html' ),
      restrict: 'E',
      scope: {
        model: '=',
        difference: '=',
        input: '=',
        noHelpIndicator: '=',
        noCols: '='
      },
      controller: [ '$scope', function( $scope ) {
        $scope.directive = 'cnViewInputWithDifferences';
      } ]
    };
  }
);

/* ######################################################################################################## */
cenozo.directive( 'cnDeferralNote',
  function() {
    return {
      templateUrl: cenozoApp.getFileUrl( 'magnolia', 'deferral-note.tpl.html' ),
      restrict: 'E',
      scope: { note: '@' },
      controller: [ '$scope', function( $scope ) {
        $scope.directive = 'cnDeferralNote';
      } ]
    };
  }
);

/* ######################################################################################################## */
cenozo.service( 'CnModalNoticeListFactory', [
  'CnModalMessageFactory', '$uibModal', '$state', '$window', '$filter',
  function( CnModalMessageFactory, $uibModal, $state, $window, $filter ) {
    var object = function( params ) {
      var self = this;
      angular.extend( this, {
        title: 'Title',
        closeText: 'Close',
        noticeList: []
      } );
      angular.extend( this, params );

      angular.extend( this, {
        printMessage: function() {
          var printWindow = $window.open(
            '',
            '_blank',
            'width=600,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no'
          );
          if( null == printWindow ) {
            CnModalMessageFactory.instance( {
              title: 'Permission Required',
              message: 'Your web browser is not allowing this site to open pop-up windows. ' +
                       'In order to download your notices you must allow pop-up windows in your browser\'s settings.',
              error: true
            } ).show();
          } else {
            printWindow.document.open();
            var body = '<html><body onload="window.print()">';
            this.noticeList.forEach( function( notice ) {
              body += '<h3>' + $filter( 'cnDatetime' )( notice.datetime, 'date' ) + ': ' + notice.title + '</h3>' +
                      '<div>' + $filter( 'cnNewlines' )( notice.description ) + '</div>';
            } );
            body += '</body></html>';

            printWindow.document.write( body );
            printWindow.document.close();
          }
        },

        show: function() {
          self.modal = $uibModal.open( {
            backdrop: 'static',
            keyboard: !self.block,
            modalFade: true,
            templateUrl: cenozoApp.getFileUrl( 'magnolia', 'modal-notice-list.tpl.html' ),
            controller: [ '$scope', '$uibModalInstance', function( $scope, $uibModalInstance ) {
              $scope.model = self;
              $scope.close = function() { $uibModalInstance.close( false ); };
            } ]
          } );

          return self.modal.result;
        },

        close: function() { if( angular.isDefined( this.modal ) ) this.modal.close( false ); }
      } );
    };

    return { instance: function( params ) { return new object( angular.isUndefined( params ) ? {} : params ); } };
  }
] );

cenozo.service( 'CnModalSubmitExternalFactory', [
  '$uibModal',
  function( $uibModal ) {
    var object = function( params ) {
      var self = this;
      angular.extend( this, params );

      angular.extend( this, {
        show: function() {
          return $uibModal.open( {
            backdrop: 'static',
            keyboard: true,
            modalFade: true,
            templateUrl: cenozoApp.getFileUrl( 'magnolia', 'modal-submit-external.tpl.html' ),
            controller: [ '$scope', '$uibModalInstance', function( $scope, $uibModalInstance ) {
              $scope.model = self;
              $scope.stage_type = 'Active';
              $scope.ok = function() { $uibModalInstance.close( $scope.stage_type ); };
              $scope.cancel = function() { $uibModalInstance.close( null ); };
            } ]
          } ).result;
        }
      } );
    }

    return { instance: function( params ) { return new object( angular.isUndefined( params ) ? {} : params ); } };
  }
] );

cenozo.service( 'CnReqnHelper', [
  'CnSession', 'CnHttpFactory', 'CnModalConfirmFactory', '$state',
  function( CnSession, CnHttpFactory, CnModalConfirmFactory, $state ) {
    var object = {
      showAction: function( subject, record ) {
        var role = CnSession.role.name;
        var phase = record.phase ? record.phase : '';
        var state = record.state ? record.state : '';
        var stage_type = record.stage_type ? record.stage_type : '';

        if( 'submit' == subject ) {
          return ( 'applicant' == role || 'administrator' == role ) &&
                 ( 'new' == phase || 'deferred' == state );
        } else if( 'view' == subject ) {
          return 'applicant' != role;
        } else if( 'abandon' == subject ) {
          return '.' == record.amendment ?
                 // non-amendment process
                 ['administrator','applicant'].includes( role ) &&
                 'deferred' == state &&
                 'review' == phase :
                 // amendment process
                 ['administrator','applicant'].includes( role ) &&
                 'Admin Review' == record.stage_type;
        } else if( 'delete' == subject ) {
          return 'new' == phase;
        } else if( 'defer' == subject ) {
          return 'administrator' == role &&
                 !['abandoned','inactive','deferred'].includes( state ) &&
                 ['review','active'].includes( phase );
        } else if( 'amend' == subject ) {
          return ['administrator','applicant'].includes( role ) &&
                 !['abandoned','deferred'].includes( state ) &&
                 'active' == phase && 'Report Required' != stage_type;
        } else if( 'deactivate' == subject ) {
          return 'administrator' == role &&
                 !['abandoned','inactive'].includes( state ) &&
                 !['new','complete'].includes( phase );
        } else if( 'incomplete' == subject ) {
          return 'administrator' == role &&
                 '.' == record.amendment &&
                 ( 'review' == phase || ['Agreement', 'Data Release'].includes( record.stage_type ) );
        } else if( 'withdraw' == subject ) {
          return 'administrator' == role &&
                 'active' == phase;
        } else if( 'reactivate' == subject ) {
          return 'administrator' == role && ['abandoned','inactive'].includes( state );
        } else if( 'recreate' == subject ) {
          return 'administrator' == role && 'complete' == phase;
        } else if( 'report' == subject ) {
          return ['Report Required','Complete'].includes( stage_type );
        } else if( 'proceed' == subject ) {
          return 'complete' != phase && (
                   ( 'administrator' == role && 'new' != phase ) ||
                   ( 'chair' == role && stage_type.includes( 'DSAC' ) ) ||
                   ( 'smt' == role && stage_type.includes( 'SMT' ) )
                 ) && !this.showAction( 'amendment proceed', record );
        } else if( 'reject' == subject ) {
          return 'DSAC Selection' == stage_type &&
                 ['administrator','chair'].includes( role );
        } else if( 'compare' == subject ) {
          return 'applicant' != role;
        } else if( 'external proceed' == subject ) {
          return record.external &&
                 'new' == phase &&
                 'administrator' == role;
        } else if( 'amendment proceed' == subject ) {
          return '.' != record.amendment &&
                 ['Admin Review','Feasibility Review','Decision Made','Agreement'].includes( stage_type ) &&
                 'administrator' == role;
        } else if( 'amendment feasibility review' == subject ) {
          return 'Admin Review' == stage_type;
        } else if( 'amendment dsac review' == subject ) {
          return 'Feasibility Review' == stage_type;
        } else if( 'amendment decision made' == subject ) {
          return ['Admin Review','Feasibility Review'].includes( stage_type );
        } else if( 'amendment agreement' == subject ) {
          return 'Decision Made' == stage_type;
        } else if( 'amendment data release' == subject ) {
          return ['Decision Made','Agreement'].includes( stage_type );
        } else if( 'amendment active' == subject ) {
          return ['Decision Made','Agreement'].includes( stage_type );
        } else return false;
      },

      abandon: function( reqnIdentifier, amendment, language ) {
        var message = '';
        if( amendment ) {
          if( 'applicant' == CnSession.role.name ) {
            message = this.translate( 'reqn', 'misc.abandonAmendmentWarning', language );
          } else {
            message = 'Are you sure you want to abandon the amendment?' +
              '\n\nThe amendment process will be discontinued and the requisition will be returned back to its previous status.';
          }
        } else {
          if( 'applicant' == CnSession.role.name ) {
            message = this.translate( 'reqn', 'misc.abandonWarning', language );
          } else {
            message = 'Are you sure you wish to abandon the requisition?' +
              '\n\nThe applicant will no longer have access to the requisition and the review process will ' +
              'be discontinued. It is possible to re-activate the requisition at a later time.';
          }
        }
        return CnModalConfirmFactory.instance( {
          title: 'applicant' == CnSession.role.name ? this.translate( 'reqn', 'misc.pleaseConfirm', language ) : 'Please Confirm',
          noText: 'applicant' == CnSession.role.name ? this.translate( 'reqn', 'misc.no', language ) : 'No',
          yesText: 'applicant' == CnSession.role.name ? this.translate( 'reqn', 'misc.yes', language ) : 'Yes',
          message: message
        } ).show().then( function( response ) {
          if( response ) {
            return CnHttpFactory.instance( { path: 'reqn/' + reqnIdentifier + "?action=abandon" } ).patch().then( function() {
              return true;
            } );
          } else return false;
        } );
      },

      delete: function( reqnIdentifier, language ) {
        return CnModalConfirmFactory.instance( {
          title: 'applicant' == CnSession.role.name ? this.translate( 'reqn', 'misc.pleaseConfirm', language ) : 'Please Confirm',
          noText: 'applicant' == CnSession.role.name ? this.translate( 'reqn', 'misc.no', language ) : 'No',
          yesText: 'applicant' == CnSession.role.name ? this.translate( 'reqn', 'misc.yes', language ) : 'Yes',
          message: this.translate( 'reqn', 'misc.deleteWarning', language )
        } ).show().then( function( response ) {
          if( response ) {
            return CnHttpFactory.instance( { path: 'reqn/' + reqnIdentifier } ).delete().then( function() {
              $state.go( 'applicant' == CnSession.role.name ? 'root.home' : 'reqn.list' );
            } );
          }
        } );
      },

      download: function( subject, id ) {
        var http = {
          path: 'final_report' == subject ? 'final_report/' + id : 'reqn_version/' + id + '?file=' + subject,
          format: 'final_report' == subject ? 'pdf' : 'unknown'
        };
        return CnHttpFactory.instance( http ).file();
      },

      translate: function( subject, address, language ) {
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

        return get( this.lookupData[subject] );
      },

      lookupData: {
        reqn: {
          heading: {
            en: 'Data and Biospecimen Request Application',
            fr: 'Demande d’accès aux données et aux échantillons'
          },
          instructions: {
            tab: { en: 'Instructions', fr: 'Consignes' },
            title: {
              en: 'Instructions for completing an application',
              fr: 'Consignes pour remplir une demande'
            },
            text1: {
              en: 'Please note that the CLSA <strong>only accepts applications for data that are available at the time of submission</strong>.  To know what data are currently available, please consult the <a href="https://www.clsa-elcv.ca/doc/3162" target="data_availability">CLSA Data Availability Table</a> which is regularly updated as data become available.  Applications proposing the use of data that are not available at the time of submission will not be considered for review, and you will need to reapply once those data become available.',
              fr: 'Veuillez noter que l’ÉLCV <strong>accepte les demandes uniquement pour les données disponibles au moment de la soumission</strong>. Pour connaître les données disponibles actuellement, consultez le <a href="https://www.clsa-elcv.ca/doc/3162" target="data_availability">tableau de disponibilité des données de l’ÉLCV</a>, qui est mis à jour régulièrement à mesure que de nouvelles données deviennent disponibles. Les demandes proposant l’utilisation de données qui ne sont pas disponibles au moment de la soumission ne seront pas examinées, et il faudra présenter une nouvelle demande dès que ces données seront disponibles.'
            },
            text2: {
              en: 'Please consult the CLSA website for instructions, policies, and procedures for CLSA data and biospecimen access: <a href="http://www.clsa-elcv.ca/data-access" target="clsa">www.clsa-elcv.ca/data-access</a>. Applicants are also encouraged to review the pertinent sections of the relevant CLSA protocol(s), Data Collection Tools and Physical Assessments in advance of completing the application. Additional information on the variables in the CLSA dataset is on the <a href="https://datapreview.clsa-elcv.ca/" target="dpp">CLSA Data Preview Portal</a>.',
              fr: 'Veuillez consulter les consignes, les politiques et la procédure de demande d’accès aux données et aux échantillons sur le site Web de l’ÉLCV : <a href="https://www.clsa-elcv.ca/fr/acces-aux-donnees" target="clsa">www.clsa-elcv.ca/fr/acces-aux-donnees</a>. Nous encourageons les demandeurs à consulter les sections pertinentes du protocole de l’ÉLCV (en anglais seulement), les outils de collecte de données et les tests physiques avant de remplir une demande d’accès. Des informations supplémentaires sur les variables contenues dans l’ensemble de données de l’ÉLCV sont disponibles sur le <a href="https://datapreview.clsa-elcv.ca/" target="dpp">Portail de données de l’ÉLCV</a>.'
            },
            text3: {
              en: 'Consult us for any questions regarding your application at <a href="mailto:access@clsa-elcv.ca">access@clsa-elcv.ca</a>.',
              fr: 'Veuillez nous transmettre toute question relative aux demandes d’accès aux données de l’ÉLCV en écrivant à <a href="mailto:access@clsa-elcv.ca">access@clsa-elcv.ca</a>.'
            },
            text4: {
              en: 'The application is composed of 3 parts:<ul><li>Part 1: General Project Information</li><li>Part 2: Data Checklist</li><li>Part 3: Biospecimen Checklist (forthcoming)</li></ul>',
              fr: 'La demande est séparée en trois parties :<ul><li>1<sup>re</sup> partie : Renseignements généraux</li><li>2<sup>e</sup> partie : Sélection des données</li><li>3<sup>e</sup> partie : Sélection des échantillons biologiques (à venir)</li></ul>'
            },
            text5: {
              en: 'Additional information or instructions are available anywhere that the ⓘ symbol appears. Hover your mouse cursor over the text to see the additional details.',
              fr: 'Des informations ou des instructions supplémentaires sont disponibles partout où le symbole ⓘ apparaît. Passez le curseur sur le texte pour voir les informations supplémentaires.'
            },
            text6: {
              en: 'Please ensure that you have completed <strong>all of the sections of the application</strong> form that are relevant to your application. Incomplete applications may result in processing delays or refusal of your application.',
              fr: 'Assurez-vous de bien remplir <strong>toutes les sections pertinentes du formulaire de demande d’accès</strong>. Les demandes incomplètes pourront causer un retard dans le traitement de votre demande ou entraîner un refus.'
            }
          },
          amendment: {
            tab: { en: 'Amendment', fr: 'Modification' },
            title: {
              en: 'Amendment Details',
              fr: 'Détails de la modification'
            },
            text1: {
              en: "Amendment requests will be reviewed as they are received. Amendments must NOT be operationalized until the amendment has been approved.",
              fr: "Les demandes de modification seront évalués au fur et à mesure qu’ils seront reçus. Vous DEVEZ attendre l’autorisation avant d’effectuer les modifications demandées."
            },
            text2: {
              en: 'All requests will be reviewed by the CLSA. If the change is deemed to be significant, the request will be forwarded to the Chair of the CLSA Data and Biospecimen Access Committee (DSAC) who may request a new application be submitted for review and approval. Certain changes may require an amendment to your CLSA Access Agreement.',
              fr: 'Toutes les demandes seront révisées par l’ÉLCV. Si les changements apportés sont jugés majeurs, la demande sera envoyée au président du Comité chargé de l’accès aux données et aux échantillons biologiques qui pourrait exiger qu’une nouvelle demande d’accès soit soumise et approuvée. Certains changements peuvent nécessiter une modification de votre Entente d’accès de l’ÉLCV.'
            },
            text3: {
              en: "Please indicate the purpose of your amendment request. (Check ALL that apply):",
              fr: "Veuillez indiquer le motif de votre demande de modification (cochez toutes les cases qui s’appliquent) :"
            },
            atLeastOne: {
              en: "You must select at least one reason for your amendment request.",
              fr: "Vous devez sélectionner au moins un motif pour votre demande de modification."
            },
            newUser: {
              en: "Please provide the name of the new primary applicant",
              fr: "Veuillez fournir le nom du nouveau demandeur principal"
            },
            newUserNoticeTitle: { en: 'Please Note', fr: 'Notez bien' },
            newUserNotice: {
              en: 'Changing the primary applicant, once approved, will remove your access to this application and transfer ownership to the new applicant.\n\nAre you sure you wish to proceed?',
              fr: 'Une fois approuvé, le changement de demandeur principal supprimera votre accès à cette demande et la propriété du compte sera transférée au nouveau demandeur.\n\nÊtes-vous sûr(e) de vouloir continuer?'
            },
            newUserIsTraineeNoticeTitle: { en: 'Please Note', fr: 'Notez bien' },
            newUserIsTraineeNotice: {
              en: 'The applicant you have selected is a trainee.  Please select a new applicant which does not have a supervisor.',
              fr: 'Le demandeur que vous avez sélectionné est un stagiaire. Veuillez sélectionner un nouveau demandeur qui n’a pas de superviseur.'
            }
          },
          part1: {
            tab: { en: 'Part 1', fr: '1<sup>re</sup> partie' },
            title: {
              en: 'Part 1 of 3: General Project Information',
              fr: 'Partie 1 de 3 : Renseignements généraux'
            },
            a: {
              tab: { en: 'Applicant', fr: 'Demandeur' },
              text1: {
                en: '<strong>Primary Applicant</strong>: The primary applicant will be the contact person for the CLSA Access Agreement as well as for the data release and any relevant updates.',
                fr: '<strong>Demandeur principal</strong> : Le demandeur principal sera la personne-ressource pour l’Entente d’accès de l’ÉLCV, ainsi que pour la transmission des données et toute mise à jour pertinente.'
              },
              text2: {
                en: 'For Trainee (MSc, PhD and Postdoctoral Fellow) applications, the primary applicant must be the supervisor and the trainee must be clearly identified.',
                fr: 'Pour les demandes soumises par des étudiants (M. Sc., Ph. D.) ou des chercheurs postdoctoraux, le demandeur principal doit être le superviseur. L’étudiant ou le chercheur postdoctoral doit être clairement identifié dans la demande.'
              },
              applicant_name: { en: 'Name', fr: 'Nom' },
              applicant_position: { en: 'Position', fr: 'Poste' },
              applicant_affiliation: { en: 'Institution', fr: 'Établissement' },
              applicant_address: { en: 'Mailing Address', fr: 'Adresse de correspondance' },
              applicant_phone: { en: 'Phone', fr: 'Téléphone' },
              applicant_email: { en: 'E-mail', fr: 'Courriel' },
              text3: {
                en: 'Complete this section if this is a Trainee application (MSc, PhD and Postdoctoral Fellow).',
                fr: 'Remplissez cette section si la demande est pour un étudiant (M. Sc., Ph. D.) ou un chercheur postdoctoral.'
              },
              trainee_name: { en: 'Name', fr: 'Nom' },
              trainee_program: { en: 'Degree and Program of Study', fr: 'Grade et programme d’étude' },
              trainee_institution: { en: 'Institution of Enrollment', fr: 'Établissement d’étude' },
              trainee_address: { en: 'Current Mailing Address', fr: 'Adresse de correspondance actuelle' },
              trainee_phone: { en: 'Phone', fr: 'Téléphone' },
              trainee_email: { en: 'E-mail', fr: 'Courriel' },
              text4: {
                en: 'Graduate students (MSc or PhD) who wish to obtain the CLSA data for the sole purpose of their thesis, and postdoctoral fellows (limit 1 waiver per postdoc) who wish to obtain the CLSA data for the sole purpose of their postdoctoral project who are enrolled at Canadian institutions for their graduate degree or postdoc, can apply for a fee waiver. Canadian trainees working outside Canada but funded through a Canadian source are also eligible for a fee waiver. Trainees eligible for a fee waiver are also waived the supplemental data fee for images and raw data. The CIHR Catalyst Grants for the use of CLSA Data are not eligible for Trainee Fee Waivers.',
                fr: 'Les étudiants de deuxième et troisième cycle (M. Sc. ou Ph. D.) et les chercheurs postdoctoraux (limite d’une exonération par post doctorat) qui désirent utiliser les données de l’ÉLCV uniquement pour leur recherche et qui sont inscrits à un établissement canadien peuvent demander une exonération des frais. Les stagiaires canadiens qui travaillent à l’extérieur du Canada, mais qui sont financés par un organisme canadien peuvent également demander une exonération des frais. L’exonération des frais pour les stagiaires admissibles s’applique également aux frais additionnels demandés pour les images et les données brutes. Les subventions catalyseur pour l’analyse des données de l’ÉLCV ne sont pas admissibles à l’exonération des frais pour les stagiaires.'
              },
              waiver: { en: 'Fee Waiver Type', fr: 'Type d’exemption de frais' }
            },
            b: {
              tab: { en: 'Project Team', fr: 'Équipe de projet' },
              text: {
                en: 'All Co-Applicants and Other Personnel must be listed below. You must inform your collaborators that you have included them on this application. Please note that changes to the project team, including change of Primary Applicant and addition or removal of Co-Applicants and Support Personnel <strong>require an amendment</strong>. To submit an Amendment request, please click on “Create Amendment” in the upper-right corner of your screen and follow the instructions.',
                fr: 'Tous les codemandeurs et les membres du personnel de soutien doivent être identifiés ci-dessous. Vous devez informer vos collaborateurs que vous les avez inclus dans cette demande. Veuillez noter que tout changement à l’équipe de projet y compris un changement de demandeur principal et l’ajout ou le retrait d’un codemandeur ou d’un membre du personnel de soutien <strong>nécessite une modification</strong>. Pour soumettre une demande de modification, veuillez cliquer sur « Créer une modification » dans le coin supérieur droit de votre écran et suivre les instructions.'
              },
              noCoapplicants: {
                en: 'No co-applicants have been added.',
                fr: 'Aucun codemandeur n’a été ajouté.'
              },
              name: { en: 'Name', fr: 'Nom' },
              position: { en: 'Position', fr: 'Poste' },
              affiliation: { en: 'Affiliation', fr: 'Organisme d’appartenance' },
              email: { en: 'E-mail', fr: 'Courriel' },
              role: { en: 'Role', fr: 'Rôle' },
              access: { en: 'Requires Access to Data', fr: 'Doit avoir accès aux données' },
              addCoapplicant: { en: 'Add Co-Applicant', fr: 'Ajouter codemandeurs' },
              coapplicantAgreementText: {
                en: 'All Co-Applicants and Support Personnel being added to the project, who will require direct access to the CLSA data, must sign the co-applicant agreement form (download button below) and agree to comply with the conditions outlined in Articles 2.1 and 2.3 of the CLSA Access Agreement.',
                fr: 'Tous les codemandeurs et le personnel de soutien ajoutés au projet qui auront besoin d’un accès direct aux données de l’ÉLCV doivent signer le formulaire d’entente de codemandeur (lien de téléchargement ci-dessous) et accepter de se conformer aux conditions énoncées aux articles 2.1 et 2.3 de l’Entente d’accès de l’ÉLCV.'
              },
              coapplicantAgreementButton: {
                en: 'Download Co-Applicant Agreement Form Template',
                fr: 'Télécharger le modèle de formulaire d’entente de codemandeur'
              },
              coapplicantAgreement: {
                en: 'Changes to co-applicants agreement',
                fr: 'Modifications à apporter à l’entente de codemandeur'
              }
            },
            c: {
              tab: { en: 'Timeline', fr: 'Échéancier' },
              text1: {
                en: 'What is the anticipated time frame for this proposed project? In planning for your project, please consider in your time frame <strong>at least ',
                fr: 'Quel est l’échéancier prévu du projet proposé? Lors de la planification de votre projet, veuillez prévoir <strong>au moins '
              },
              text2: {
                en: ' months from the application submission deadline</strong> to the time you receive your dataset.',
                fr: ' mois à compter de la date limite de soumission</strong> de votre candidature pour recevoir votre ensemble de données.'
              },
              text3: {
                en: 'Project duration: The length of time you propose to use the CLSA data for analysis. You may choose 2 or 3 years.',
                fr: 'Durée du projet : la durée pendant laquelle vous proposez d’utiliser les données de l’ÉLCV à des fins d’analyse. Vous pouvez choisir entre 2 ou 3 ans.'
              },
              text4: {
                en: 'Agreement duration: An approved project will have an additional two years beyond the project duration to complete all work, and to disseminate the results in the form of manuscripts or presentations, as noted within the CLSA Access Agreement.',
                fr: 'Durée de l’entente : un projet approuvé disposera de deux années supplémentaires au-delà de la durée du projet pour achever tous les travaux et diffuser les résultats sous la forme de manuscrits et de présentations, tel qu’indiqué dans l’entente d’accès aux données de l’ÉLCV.'
              },
              deadline: { en: 'Application submission deadline', fr: 'Date limite de soumission' },
              start_date: { en: 'Anticipated start date', fr: 'Date prévue de début' },
              duration: { en: 'Proposed project duration', fr: 'Durée proposée du projet' }
            },
            d: {
              tab: { en: 'Description', fr: 'Description' },
              text1: {
                en: '<strong>Provide the level of detail you would normally provide in a grant application. Failure to provide adequate detail to assess feasibility will result in rejection of the application.</strong> Please adhere to character count limits.',
                fr: '<strong>Fournissez autant de détails que vous fourniriez normalement dans une demande de subvention. Si l’information pour évaluer la faisabilité du projet n’est pas assez détaillée, la demande sera rejetée.</strong> Veuillez respecter les limites de caractères.'
              },
              title: { en: 'Project Title', fr: 'Titre du projet' },
              keywords: { en: 'Keywords', fr: 'Mots clés' },
              keywords_text: {
                en: 'Please provide 3-5 keywords describing your project.',
                fr: 'Veuillez fournir 3 à 5 mots clés décrivant votre projet.'
              },
              lay_summary: { en: 'Lay Summary', fr: 'Résumé non scientifique' },
              lay_summary_text: {
                en: 'Please provide a lay language summary of your project (<strong>maximum 1000 characters</strong>) suitable for posting on the CLSA website if your application is approved. Please ensure that the lay summary provides a stand-alone, informative description of your project.',
                fr: 'Veuillez fournir un résumé non scientifique de votre projet (<strong>maximum 1000 caractères</strong>) pouvant être publié sur le site Web de l’ÉLCV si votre demande est approuvée. Assurez-vous de fournir un résumé détaillé et complet de votre projet.'
              },
              text2: {
                en: 'Please provide a description of the proposed project. The proposal should be informative and specific and <strong>no more than 4500 characters per section. Non-compliant applications will be returned.</strong>',
                fr: 'Veuillez fournir une description du projet proposé. La proposition doit être informative et précise sans dépasser 4500 caractères par section. Les demandes non conformes seront renvoyées au demandeur.'
              },
              background: { en: 'Background and Study Relevance', fr: 'Contexte et pertinence de l’étude' },
              objectives: {
                en: 'Study Objectives and/or Hypotheses',
                fr: 'Objectifs et/ou hypothèses de l’étude'
              },
              methodology: { en: 'Study Design and Methodology', fr: 'Modèle d’étude et méthodologie' },
              methodology_text: {
                en: 'The study design and methodology including an overview of the variables and/or biospecimens requested for the project. In no more than half a page, describe the inclusion and exclusion criteria for participants to be included in your study (e.g., age, sex, etc.).',
                fr: 'Modèle d’étude et méthodologie comprenant un survol de la liste de variables et/ou échantillons demandés. Sans dépasser une demi-page, décrivez les critères d’inclusion et d’exclusion des participants qui seront inclus dans votre étude (p. ex. âge, sexe, etc.).'
              },
              analysis: { en: 'Data Analysis', fr: 'Analyse de données' },
              analysis_text: {
                en: 'Brief description of the data analysis proposed (this section should include justification for the sample size requested). Requests for small subsets of the study participants must be justified.',
                fr: 'Brève description de l’analyse de données proposée (cette section devrait inclure la justification de la taille d’échantillon demandée). Les demandes de petits sous-groupes de participants doivent être justifiées.'
              },
              text3: {
                en: 'Please include a list of the most relevant references (maximum ',
                fr: 'Veuillez présenter une liste des références les plus pertinentes (maximum '
              },
              text4: {
                en: ')',
                fr: ')'
              },
              number: { en: 'Number', fr: 'Numéro' },
              reference: { en: 'Reference', fr: 'Référence' },
              noReferences: {
                en: 'No references have been added.',
                fr: 'Aucune référence n’a été ajoutée.'
              },
              addReference: { en: 'Add Reference', fr: 'Ajouter référence' }
            },
            e: {
              tab: { en: 'Scientific Review', fr: 'Évaluation scientifique' },
              text: {
                en: 'Evidence of peer reviewed funding will be considered evidence of scientific review. <strong>If you have selected "yes", please upload proof of funding notification.</strong> If there are no plans to submit an application for financial support for this project please provide evidence of peer review (e.g. internal departmental review, thesis protocol defense, etc.) if available. If no evidence of scientific peer review is provided with this application then the project will undergo scientific review by the DSAC.',
                fr: 'Les documents attestant l’attribution du financement seront considérés comme une preuve d’évaluation par les pairs. <strong>Si vous avez sélectionné « oui », veuillez télécharger une preuve de l’avis de financement.</strong> Si vous ne planifiez pas demander de l’aide financière pour ce projet, veuillez fournir la preuve qu’une évaluation par les pairs a été réalisée (p. ex. évaluation départementale, défense du protocole de thèse, etc.) si disponible. Si aucune preuve d’évaluation scientifique par les pairs n’est soumise avec la demande, le DSAC procédera à l’évaluation scientifique du projet.'
              },
              funding: { en: 'Peer Reviewed Funding', fr: 'Financement évalué par les pairs' },
              funding_agency: { en: 'Funding agency', fr: 'L’Organisme de financement' },
              grant_number: { en: 'Grant Number', fr: 'Numéro de la subvention' },
              letter: {
                en: 'Digital copy of funding letter',
                fr: 'Copie numérique de la lettre de financement'
              }
            },
            f: {
              tab: { en: 'Ethics', fr: 'Éthique' },
              text: {
                en: 'Please note that ethics approval is NOT required at the time of this application, but <strong>no data or biospecimens will be released until proof of ethics approval has been received by the CLSA.</strong>',
                fr: 'Notez que l’approbation éthique n’est PAS requise à cette étape de la demande, mais <strong>aucune donnée ou aucun échantillon ne seront transmis avant que l’ÉLCV ait reçu une preuve d’approbation éthique.</strong>'
              },
              approvalListNote: {
                en: 'Updated ethics approval documents can be added to your requisition <strong>without the need to create a new amendment</strong>.  Simply click the Add button below to upload the document.',
                fr: 'Vous pouvez mettre à jour les documents d’approbation éthique relatifs à votre demande <strong>sans créer un nouvel amendement</strong>. Il suffit de cliquer sur le bouton « Ajouter » ci-dessous pour téléverser le document.'
              },
              ethics: {
                en: 'Has this project received ethics approval?',
                fr: 'Ce projet a-t-il reçu une approbation éthique?'
              },
              letter: {
                en: 'Digital copy of ethics approval letter or proof of exemption',
                fr: 'Copie numérique de la lettre d’approbation ou une lettre d’exemption de la part du Comité d’éthique'
              },
              expiration: { en: 'Expiration date of approval', fr: 'Date limite d’autorisation' },
              response: { en: 'Expected date of response', fr: 'Date approximative de la réponse' },
            }
          },
          part2: {
            tab: { en: 'Part 2', fr: '2<sup>e</sup> partie' },
            title: { en: 'Part 2 of 3: Data Checklist', fr: 'Partie 2 de 3 : Sélection des données' },
            notes: {
              tab: { en: 'Notes', fr: 'Remarques' },
              text1: {
                en: 'Please mark the sections containing the modules in the CLSA dataset that you are requesting.',
                fr: 'Veuillez sélectionner chaque module de l’ensemble de données de l’ÉLCV que vous demandez, et ce, pour chacune des vagues (départ et/ou 1er suivi) de collecte de données qui vous intéresse.'
              },
              text2: {
                en: '<strong>Included in all datasets</strong><ul><li>Sampling weights</li></ul>',
                fr: '<strong>Inclus dans tous les ensembles de données</strong><ul><li>Poids d’échantillonnage</li></ul>'
              },
              text3: {
                en: '<strong>Not included in datasets</strong><ul><li>Identifiable information collected (e.g. name, contact information, date of birth, health insurance number, and full postal code)</li></ul>',
                fr: '<strong>Exclus des ensembles de données</strong><ul><li>Informations d’identification recueillies (p. ex. nom, coordonnées, date de naissance, numéro d’assurance maladie et code postal complet)</li></ul>'
              },
              text4: {
                en: 'For more information on these data, please visit our website: <a href="https://www.clsa-elcv.ca" target="clsa">www.clsa-elcv.ca</a>.',
                fr: 'Pour en savoir plus sur ces données, veuillez consulter notre site Web: <a href="https://www.clsa-elcv.ca" target="clsa">www.clsa-elcv.ca</a>.'
              }
            },
            cohort: {
              tab: { en: 'Cohort & Longitudinal Analyses', fr: 'Analyses de cohorte et longitudinales' },
              text1: {
                en: 'Please select the cohort (Tracking and/or Comprehensive - YOU MUST SELECT "YES" FOR AT LEAST ONE COHORT) for which you are requesting data:',
                fr: 'Veuillez sélectionner la cohorte (surveillance et/ou globale) pour laquelle vous demandez des données (VOUS DEVEZ SÉLECTIONNER AU MOINS UNE COHORTE) :'
              },
              text2: {
                en: 'You will be able to make your selection of the wave of data collection (Baseline and/or Follow-up 1) within the Data Checklist.',
                fr: 'Vous pourrez sélectionner la vague de collecte de données (départ et/ou 1er suivi) dans le tableau de sélection de données.'
              },
              tracking: {
                en: 'Tracking Cohort (Telephone Interview)',
                fr: 'Évaluation de surveillance (Entrevue téléphonique)'
              },
              trackingHelp: {
                en: 'Participants providing data through telephone interviews only. No physical assessment data, medications data or biomarker data are available for this cohort. For further information on what data are available for the Tracking Cohort, consult the CLSA Data Availability Table on our website.',
                fr: 'Cohorte de surveillance (entrevue téléphonique) : Les participants de cette cohorte fournissent des données uniquement via une entrevue téléphonique. Aucune donnée sur les tests physiques, les médicaments ou les biomarqueurs n’est disponible pour cette cohorte. Pour plus d’informations sur les données disponibles pour la cohorte de surveillance, consultez le tableau de disponibilité des données de l’ÉLCV sur notre site Web.'
              },
              comprehensive: {
                en: 'Comprehensive Cohort (In-home Interview & DCS visit)',
                fr: 'Évaluation globale (Entrevue à domicile et au site)'
              },
              comprehensiveHelp: {
                en: 'Participants providing data through an In-home interview and during a visit to a Data Collection Site. Physical assessment, medications and biomarker data are available for this cohort only. For further information on what data are available for the Tracking Cohort, consult the CLSA Data Availability Table on our website.',
                fr: 'Cohorte globale (entrevue à domicile et visite à un Site de collecte de données) : Les participants de cette cohorte fournissent des données via une entrevue à domicile et une visite à un Site de collecte de données. Les tests physiques, les médicaments et les données sur les biomarqueurs sont disponibles pour cette cohorte uniquement. Pour plus d’informations sur les données disponibles pour la cohorte globale, consultez le tableau de disponibilité des données de l’ÉLCV sur notre site Web.'
              },
              bothCohortNoticeTitle: { en: 'Please Note', fr: 'Notez bien' },
              bothCohortNotice: {
                en: 'Please be sure to fully explain in "Part 1 - Description" section of your application, how you will use the data from both the Tracking and Comprehensive cohorts in your analyses, accounting for the differences in the data available for each cohort. For further information on what data are available for the Tracking and Comprehensive Cohort, consult the CLSA Data Availability Table on our website.',
                fr: 'À la « Partie 1 - Description » de votre demande d’accès, assurez-vous de bien expliquer comment les données des cohortes globale et de surveillance seront utilisées dans vos analyses, en tenant compte des différences entre les données disponibles pour chaque cohorte. Pour plus d’informations sur les données disponibles pour la cohorte de surveillance et la cohorte globale, consultez le tableau de disponibilité des données de l’ÉLCV sur notre site Web.'
              },
              longitudinal: {
                en: 'Is this project part of longitudinal analyses involving a previously approved project using CLSA data?',
                fr: 'Ce projet fait-il partie d’analyses longitudinales en lien avec un projet utilisant les données de l’ÉLCV déjà approuvé?'
              },
              last_identifier: {
                en: 'Please enter the application number of the related CLSA approved project',
                fr: 'Veuillez entrer le numéro de demande du projet connexe approuvé par l’ÉLCV.'
              }
            },
            a: {
              tab: { en: '', fr: '' },
              module: { en: 'Data Module', fr: 'Module de données' },
              heading: { en: '', fr: '' }
            },
            b: { tab: { en: '', fr: '' }, module: { en: '', fr: '' }, heading: { en: '', fr: '' } },
            c: { tab: { en: '', fr: '' }, module: { en: '', fr: '' }, heading: { en: '', fr: '' } },
            d: {
              tab: { en: '', fr: '' },
              module: { en: 'Linked Data', fr: 'Données liées' },
              heading: {
                en: 'When requesting these data, please note that if your CLSA Data and Biospecimen Request Application is approved, you will also be required to sign a <a href="https://canue.ca/wp-content/uploads/2018/11/CANUE-Data-Use-and-Sharing-via-Third-Party-Agreement.pdf" target="canue_agreement">Data Use and Sharing via Third Party Agreement</a> (available for consultation and <a href="http://canue.ca/data/" target="canue">download here</a>), and submit it to the CLSA.  For a detailed list of the linked variables please consult the <a href="https://www.clsa-elcv.ca/doc/2743" target="linked_data">Linked Data Summary Table</a> available in the Data and Biospecimens section of the CLSA website, <a href="https://www.clsa-elcv.ca/" target="clsa">www.clsa-elcv.ca</a>.',
                fr: 'Lorsque vous demandez l’accès à ces données, veuillez noter que si votre demande d’accès aux données et aux échantillons biologiques de l’ÉLCV est approuvée, vous devrez également signer une Entente de partage et d’utilisation des données via une tierce partie autorisée (en anglais seulement - <a href="https://canue.ca/wp-content/uploads/2018/11/CANUE-Data-Use-and-Sharing-via-Third-Party-Agreement.pdf" target="canue_agreement">Data Use and Sharing via Third Party Agreement</a>) (disponible pour consultation et <a href="http://canue.ca/data/" target="canue">téléchargement ici</a>) et la soumettre à l’ÉLCV.  Pour obtenir une liste détaillée des variables liées, veuillez consulter le <a href="https://www.clsa-elcv.ca/sites/default/files/documents/clsa_linked_data_v1.0_2018jul11_fr_ims.pdf" target="donnees liees">Tableau récapitulatif des données liées</a> disponible à la section Données et échantillons biologiques du site Web de l’ÉLCV, <a href="https://www.clsa-elcv.ca/" target="clsa">www.clsa-elcv.ca</a>.'
              },
              data_sharing: {
                en: 'Completed copy of CANUE Data Use and Sharing via Third Party Agreement',
                fr: 'Copie complété de l’Entente de partage et d’utilisation des données via une tierce partie autorisée de CANUE'
              }
            },
            e: {
              tab: { en: '', fr: '' },
              module: { en: '', fr: '' },
              heading: {
                en: 'Additional data including images (e.g. DXA, Retinal scan) and raw data (e.g. Spirometry, ECG, Cognition) are available for some modules of the CLSA, as described in the CLSA Data Availability Table on our website. To request these data, please check the corresponding field below, and in the Justification box:<ol><li>specify which subtype/format of the data you are requesting where multiple types are available</li><li>provide detailed justification explaining how these data will help to achieve proposed objectives</li><li>describe how they will be analysed</li><li>provide evidence, if available, that you have the experience and resources to work with these types of data (i.e. references of publications)</li></ol>Please note that the request for Additional data incurs additional costs beyond the current data access fee, and these are outlined in the Fees section of our website. Requests for additional data may prolong the processing time of your application, and it may take longer to receive these data than the 6 months to receive alphanumeric data. For more information, please contact <a href="mailto:access@clsa-elcv.ca">access@clsa-elcv.ca</a>.',
                fr: 'Des données additionnelles, y compris les images (p. ex. DEXA, imagerie rétinienne) et les données brutes (p. ex. spirométrie, ECG, cognition) sont disponibles pour certains modules de l’ÉLCV, comme indiqué dans le Tableau de disponibilité des données de l’ÉLCV publié sur notre site Web. Pour demander ces données, veuillez cocher le champ correspondant ci-dessous. Ensuite, dans la case ‘Justification’ :<ol><li>indiquez le sous-type ou le format des données que vous demandez lorsque plusieurs types sont disponibles</li><li>fournissez une justification détaillée expliquant comment ces données aideront à atteindre les objectifs proposés</li><li>décrivez comment ces données seront analysées</li><li>fournissez la preuve, le cas échéant, que vous disposez de l’expérience et des ressources nécessaires pour utiliser ce type de données (références de publications)</li></ol>Veuillez noter que les demandes de données additionnelles entraînent des frais supplémentaires en plus des frais d’accès actuels, ces derniers étant décrits dans la section « Frais » de notre site Web. Les demandes de données additionnelles peuvent prolonger le traitement de votre demande d’accès et la réception de ces données peut prendre plus de temps que les six mois prévus pour la réception des données alphanumériques. Pour plus d’information, veuillez nous contacter à l’adresse <a href="mailto:access@clsa-elcv.ca">access@clsa-elcv.ca</a>.'
              }
            },
            f: {
              tab: { en: '', fr: '' },
              module: { en: '', fr: '' },
              heading: {
                en: '<ol><li>Forward Sortation Areas (A forward sortation area (FSA) is a geographic region in which all postal codes start with the same three characters.)</li><li>Census Subdivision Codes and Names - determined using the Postal Code Conversion File (PCCF) from Statistics Canada. (A census subdivision (CSD) is a geographic unit defined by Statistics Canada, roughly corresponding to municipalities, whose unique codes can be linked to other sociodemographic or census data)</li></ol>Due to the sensitive nature of these geographic indicators, a special request must be made to receive CSDs and FSAs as part of your dataset.  Adequate justification must be provided within the project description (Application Part 1) as well as in the Comments box below. By requesting these data, you also agree that you will not present in any form (presentation, publication, poster), an illustration of these geographic areas with fewer than 50 CLSA participants per FSA or CSD. For more information, please contact <a href="mailto:access@clsa-elcv.ca">access@clsa-elcv.ca</a>.',
                fr: '<ol><li>Région de tri d’acheminement (Une région de tri d’acheminement (RTA) est une region géographique où tous les codes postaux ont les mêmes trois premiers caractères.)</li><li>Codes et noms des subdivisions de recensement déterminé à l’aide du Fichier de conversion des codes postaux (FCCP) de Statistique Canada. Une subdivision de recensement (SDR) est une unité géographique définie par Statistique Canada correspondant approximativement aux municipalités, dont les codes uniques peuvent être liés à d’autres données sociodémographiques ou de recensement.</li></ol>En raison de la nature de ces indicateurs géographiques, une demande spéciale doit être faite pour que les SDR et les RTA soient incluses dans votre ensemble de données. Une justification adéquate doit être fournie dans la description du projet (partie 1 de la demande). En demandant ces données, vous acceptez également de ne pas présenter sous quelque forme que ce soit (présentation, publication, affiche) une illustration des zones géographiques habitées par moins de 50 participants à l’ÉLCV. Pour toute information supplémentaire, veuillez écrire à <a href="mailto:access@clsa-elcv.ca">access@clsa-elcv.ca</a>.'
              }
            },
            g: {
              tab: { en: '', fr: '' },
              module: { en: '', fr: '' },
              heading: {
                en: 'Please mark the sections containing the modules in the CLSA dataset that you are requesting.',
                fr: 'Veuillez cocher les sections contenant les modules de l’ensemble de données de l’ÉLCV que vous demandez.'
              }
            }
          },
          part3: {
            tab: { en: 'Part 3', fr: '3<sup>e</sup> partie' },
            title: { en: 'Part 3 of 3: Biospecimen Access', fr: 'Partie 3 de 3 : Accès aux échantillons' },
            text: {
              en: 'Biospecimen Access is not yet available',
              fr: 'Accès aux échantillons n’est pas encore disponible'
            }
          },
          misc: {
            no: { en: 'No', fr: 'Non' },
            yes: { en: 'Yes', fr: 'Oui' },
            close: { en: 'Close', fr: 'Ferme' },
            none: { en: 'none', fr: 'aucun' },
            add: { en: 'Add', fr: 'Ajouter' },
            ok: { en: 'OK', fr: 'OK' },
            cancel: { en: 'Cancel', fr: 'Annuler' },
            choose: { en: '(choose)', fr: '(choisir)' },
            exempt: { en: 'exempt', fr: 'exempt(e)' },
            requested: { en: 'requested', fr: 'demandé' },
            prevButton: { en: 'Return to the previous section', fr: 'Retourner à la section précédente' },
            nextButton: { en: 'Proceed to the next section', fr: 'Passez à la section suivante' },
            pleaseConfirm: { en: 'Please confirm', fr: 'Veuillez confirmer' },
            remove: { en: 'Remove', fr: 'Supprimer' },
            chars: { en: 'characters', fr: 'caractères' },
            comments: { en: 'Comments', fr: 'Commentaires' },
            delete: { en: 'Delete', fr: 'Effacer' },
            download: { en: 'Download', fr: 'Télécharger' },
            application: { en: 'Application', fr: 'Soumission' },
            dataChecklist: { en: 'Data Checklist', fr: 'Sélection des données' },
            applicationAndDataChecklist: { en: 'Application + Data Checklist', fr: 'Soumission + sélection des données' },
            dataSharing: { en: 'Data Sharing Agreement', fr: 'Entente de partage de données' },
            notices: { en: 'Notices', fr: 'Notifications' },
            studyData: { en: 'Study Data', fr: 'Données d’étude' },
            finalReport: { en: 'Final Report', fr: 'Rapport final' },
            notAvailable: { en: 'not yet available', fr: 'pas encore disponible' },
            notApplicable: { en: 'not applicable', fr: 'sans objet' },
            baseline: { en: 'Baseline', fr: 'Départ' },
            followup1: { en: 'Follow-up 1', fr: '1er suivi' },
            file: { en: 'File', fr: 'Fichier' },
            expirationDate: { en: 'Expiration Date', fr: 'Date limite' },
            addEthicsApproval: { en: 'Add Ethics Approval', fr: 'Ajouter une lettre d’approbation éthique' },
            reportRequiredWarning: {
              en: 'This application\'s final report is required, would you like to view it now?',
              fr: 'Il faut fournir un rapport final pour cette demande, souhaitez-vous l’afficher maintenant?'
            },
            amend: { en: 'Create Amendment', fr: 'Effectuer une modification' },
            amendWarning: {
              en: 'Are you sure you wish to create an amendment?\n\nThe application form will be re-opened and you will be able to make and submit changes.',
              fr: 'Êtes-vous sûr de vouloir effectuer une modification? Le formulaire de demande sera rouvert. Vous pourrez alors apporter des modifications et les soumettre.'
            },
            submit: { en: 'Submit', fr: 'Soumettre' },
            submitTitle: {
              en: 'Application Submitted',
              fr: 'Demande soumise'
            },
            submitMessage: {
              en: 'You have successfully submitted your CLSA Data and Biospecimen Request Application and it will now be reviewed. You will receive an email with further instructions if your attention is required and/or when the review process is complete. You can go online to Magnolia any time to view the status of your application. For timelines of the anticipated notice of decision, please check the Data Access Application Process page of our website.',
              fr: 'Votre demande d’accès aux données et aux échantillons biologiques de l’ÉLCV a bien été soumise. Elle sera maintenant évaluée. Vous recevrez un courriel avec des instructions supplémentaires si nous avons besoin d’autre information et lorsque le processus d’évaluation sera terminé. Vous pouvez vous connecter à Magnolia à tout moment pour consulter le statut de votre demande. Pour connaître les dates approximatives d’envoi de l’avis de décision, veuillez consulter la page Processus de demande d’accès aux données de notre site Web.'
            },
            traineeSubmitTitle: {
              en: 'Application Submitted for Supervisor Approval',
              fr: 'Demande envoyée au superviseur pour approbation'
            },
            traineeSubmitMessage: {
              en: 'You have successfully submitted your CLSA Data and Biospecimen Request Application and your supervisor will receive an email to request approval. You will receive an email with further instructions if your attention is required and/or when the review process is complete. You can go online to Magnolia any time to view the status of your application. For timelines of the anticipated notice of decision, please check the Data Access Application Process page of our website.',
              fr: 'Votre demande d’accès aux données et aux échantillons de l’ÉLCV a été soumise avec succès. Votre superviseur recevra une demande d’approbation par courriel. Elle sera maintenant évaluée. Vous recevrez un courriel avec des instructions supplémentaires si nous avons besoin d’autre information et lorsque le processus d’évaluation sera terminé. Vous pouvez vous connecter à Magnolia à tout moment pour consulter le statut de votre demande. Pour connaître les dates approximatives d’envoi de l’avis de décision, veuillez consulter la page Processus de demande d’accès aux données de notre site Web.'
            },
            resubmitTitle: {
              en: 'Application Resubmitted',
              fr: 'Demande resoumise',
            },
            resubmitMessage: {
              en: 'You have successfully resubmitted your CLSA Data and Biospecimen Request Application. You will receive an email with further instructions if your attention is required and/or when the review process is complete. You can go online to Magnolia any time to view the status of your application. For timelines of the anticipated notice of decision, please check the Data Access Application Process page of our website.',
              fr: 'Votre demande d’accès aux données et aux échantillons biologiques de l’ÉLCV a bien été resoumise. Vous recevrez un courriel avec des instructions supplémentaires si nous avons besoin d’autre information et lorsque le processus d’évaluation sera terminé. Vous pouvez vous connecter à Magnolia à tout moment pour consulter le statut de votre demande. Pour connaître les dates approximatives d’envoi de l’avis de décision, veuillez consulter la page Processus de demande d’accès aux données de notre site Web.'
            },
            traineeResubmitTitle: {
              en: 'Application Resubmitted for Supervisor Approval',
              fr: 'Demande envoyée à nouveau au superviseur pour approbation',
            },
            traineeResubmitMessage: {
              en: 'You have successfully resubmitted your CLSA Data and Biospecimen Request Application and your supervisor will receive an email to request approval. You will receive an email with further instructions if your attention is required and/or when the review process is complete. You can go online to Magnolia any time to view the status of your application. For timelines of the anticipated notice of decision, please check the Data Access Application Process page of our website.',
              fr: 'Votre demande d’accès aux données et aux échantillons de l’ÉLCV a été resoumise avec succès. Votre superviseur recevra une demande d’approbation par courriel. Vous recevrez un courriel avec des instructions supplémentaires si nous avons besoin d’autre information et lorsque le processus d’évaluation sera terminé. Vous pouvez vous connecter à Magnolia à tout moment pour consulter le statut de votre demande. Pour connaître les dates approximatives d’envoi de l’avis de décision, veuillez consulter la page Processus de demande d’accès aux données de notre site Web.'
            },
            submitWarning: {
              en: 'Are you sure that all changes are complete and the application is ready to be submitted?',
              fr: 'Êtes-vous sûr(e) d’avoir apporté tous les changements souhaités à la demande d’accès et qu’elle est prête à être soumise?'
            },
            missingFieldTitle: { en: 'Missing mandatory field', fr: 'Champ obligatoire manquant' },
            missingFieldMessage: {
              en: 'There are mandatory fields which are missing. You will now be redirected to where the incomplete fields can be found. Please try re-submitting once all mandatory fields have been filled out.',
              fr: 'Des champs obligatoires sont manquants. Vous serez redirigé vers l’endroit où se trouvent les champs incomplets. Veuillez soumettre la demande d’accès à nouveau quand tous les champs obligatoires auront été remplis.'
            },
            invalidNewApplicantTitle: { en: 'Invalid applicant', fr: 'Demandeur incorrect' },
            invalidNewApplicantMessage: {
              en: 'It is not possible to change the primary applicant to the user you have selected because their role in the system is not that of an applicant.  Please try selecting a different user.',
              fr: 'Il n’est pas possible de remplacer le demandeur principal par l’utilisateur que vous avez sélectionné, car cet utilisateur n’a pas le rôle de demandeur. Veuillez essayer de sélectionner un autre utilisateur.'
            },
            invalidStartDateTitle: { en: 'Invalid start date', fr: 'Date de début non valide' },
            invalidStartDateMessage: {
              en: 'The start date you have provided is not acceptable. You will now be redirected to where the start date field can be found. Please try re-submitting once the start date has been corrected.',
              fr: 'La date de début indiquée n’est pas acceptable. Vous serez redirigé à l’endroit où se trouve le champ de date de début. Veuillez essayer de soumettre à nouveau une fois la date de début corrigée.'
            },
            noChangesMessage: {
              en: 'You have not made any changes to the form since your last submission.  Are you sure you wish to proceed?',
              fr: 'Vous n’avez apporté aucune modification au formulaire depuis votre dernière soumission. Êtes-vous sûr(e) de vouloir continuer?'
            },
            deleteWarning: {
              en: 'Are you sure you want to delete the application?\n\nThis will permanently destroy all details you have provided. Once this is done there will be no way to restore the application!',
              fr: 'Êtes-vous sûr(e) de vouloir supprimer la demande d’accès?\n\nToutes les informations fournies seront détruites et il vous sera impossible de les restaurer!'
            },
            abandon: { en: 'Abandon', fr: 'Abandonner' },
            abandonWarning: {
              en: 'Are you sure you want to abandon the application?\n\nYou will no longer have access to the application and the review process will be discontinued.',
              fr: 'Êtes-vous sûr(e) de vouloir abandonner la demande d’accès?\n\nVous n’y aurez plus accès et le processus d’évaluation sera interrompu.'
            },
            abandonAmendmentWarning: {
              en: 'Are you sure you want to abandon the amendment?\n\nThe amendment process will be discontinued and your application will be returned back to its previous status.',
              fr: 'Êtes-vous sûr de vouloir abandonner la modification? Le processus de modification sera interrompu et votre demande sera renvoyée à son statut précédent.'
            },
            emailText: {
              en: 'You must provide an institutional email. Public email accounts such as @gmail.com are not allowed.',
              fr: 'Vous devez fournir un courriel institutionnel. Les comptes de messagerie publics tels que @gmail.com ne sont pas autorisés.'
            },
            duration2Years: {
              en: '2 Years',
              fr: '2 ans'
            },
            duration3Years: {
              en: '3 Years',
              fr: '3 années'
            },
            duration2p1Years: {
              en: '2 Years + 1 Additional Year',
              fr: '2 ans + 1 année supplémentaire'
            },
            duration2p2Years: {
              en: '2 Years + 2 Additional Years',
              fr: '2 ans + 2 années supplémentaires'
            },
            duration2p3Years: {
              en: '2 Years + 3 Additional Years',
              fr: '2 ans + 3 années supplémentaires'
            },
            duration3p1Years: {
              en: '3 Years + 1 Additional Year',
              fr: '3 ans + 1 année supplémentaire'
            },
            duration3p2Years: {
              en: '3 Years + 2 Additional Years',
              fr: '3 ans + 2 années supplémentaires'
            },
            duration3p3Years: {
              en: '3 Years + 3 Additional Years',
              fr: '3 ans + 3 années supplémentaires'
            },
            traineeFeeWaiver: {
              en: 'Fee Waiver for Graduate student (MSc or PhD) for thesis only',
              fr: 'Exonération pour un étudiant des cycles supérieurs (M. Sc. ou Ph. D.) pour la thèse seulement'
            },
            postdocFeeWaiver: {
              en: 'Fee Waiver for Postdoctoral Fellow (limit 1 waiver for postdoctoral studies)',
              fr: 'Exonération pour un boursier postdoctoral (limite d’une exonération pour les études postdoctorales)'
            },
            clickToSelect: {
              en: '(click to select)',
              fr: '(cliquez pour sélectionner)'
            }
          }
        },
        finalReport: {
          heading: {
            en: 'CLSA Approved User Research Final Report',
            fr: 'Rapport final de la recherche pour les utilisateurs autorisés par l’ÉLCV'
          },
          instructions: {
            tab: { en: 'Instructions', fr: 'Consignes' },
            title: {
              en: 'Completing the CLSA Approved User Final Report',
              fr: 'Remplir le rapport final pour les utilisateurs autorisés de l’ÉLCV'
            },
            text1: {
              en: 'The information reported in this report allows the CLSA to assess what progress has been made toward accomplishing the objectives set out in the initial application and the impact of the project towards the advancement of knowledge.',
              fr: 'Les informations transmises dans ce rapport permettent à l’ÉLCV d’évaluer les progrès effectués qui mènent à l’atteinte des objectifs définis dans la demande initiale, et de mesurer l’impact du projet sur l’avancement des connaissances.'
            },
            text2: {
              en: 'The Final Report must be submitted at the end of the project, 1 year after the Effective Date of the CLSA Access Agreement for projects with a 1-year term and 2 years after the Effective Date of the CLSA Access Agreement for projects with a 2-year term. The Final Report must be submitted within 60 days after the end date of the CLSA Access Agreement.',
              fr: 'Le rapport final doit être envoyé à la fin du projet, un an après la date d’entrée en vigueur de l’Entente d’accès de l’ÉLCV pour les projets d’une durée d’un ans ou deux ans après la date d’entrée en vigueur de l’Entente d’accès de l’ÉLCV pour les projets d’une durée de deux ans. Le rapport final doit être soumis dans les 60 jours suivant la fin de l’Entente d’accès de l’ÉLCV.'
            },
            text3: {
              en: 'Please ensure that you have completed <strong>all of the sections of the Final Report</strong>. Please attach additional pages if necessary, clearly noting which section your are expanding upon.',
              fr: 'Assurez-vous de bien remplir <strong>toutes les sections du rapport</strong>. Au besoin, veuillez ajouter des pages en vous assurant d’indiquer clairement à quelle section elles sont annexées.'
            },
            text4: {
              en: 'Consult us for any questions regarding the final report at <a href="mailto:access@clsa-elcv.ca">access@clsa-elcv.ca</a>.',
              fr: 'Veuillez adresser toute question relative au rapport final à <a href="mailto:access@clsa-elcv.ca">access@clsa-elcv.ca</a>.'
            }
          },
          part1: {
            tab: { en: 'Part 1', fr: '1<sup>re</sup> partie' },
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
                en: 'Graduate thesis details',
                fr: 'Informations sur la these'
              },
              text: {
                en: 'Since this is a trainee project that has been granted a fee waiver, you must complete the information below. (Any publications must be reported in the next section)',
                fr: 'Comme il s’agit d’un projet de stagiaire auquel une exonération des frais a été accordée, vous devez remplir les informations ci-dessous. (Toute publication doit être rapportée à la section suivante)'
              },
              thesis_title: {
                en: 'Thesis title (if graduate student trainee)',
                fr: 'Titre de la thèse (s’il s’agit d’un étudiant aux cycles supérieurs)'
              },
              thesis_status: {
                en: 'Thesis status (Proposal in preparation, thesis in progress, submitted, approved)',
                fr: 'État de la thèse (Proposition en cours de préparation, thèse en cours d’écriture, thèse déposée, thèse approuvée)'
              }
            }
          },
          part2: {
            tab: { en: 'Part 2', fr: '2<sup>e</sup> partie' },
            question: {
              en: 'What has the project produced?',
              fr: 'Qu’est-ce que votre projet a produit?'
            },
            text: {
              en: 'List any products resulting from the project during the reporting period. Please provide references where available, and for peer-reviewed publications please specify if ‘in press’, ‘submitted’ or ‘published’. If you have not yet done so, please provide a copy of peer-reviewed publications to the CLSA when submitting this report.',
              fr: 'Énumérer les produits qui ont été développés dans le cadre de votre projet pendant la période en question. Veuillez fournir les références lorsqu’elles sont disponibles. Pour les articles évalués par des pairs, veuillez spécifier s’ils sont « sous presse », « soumis » ou « publiés ». Si ce n’est pas déjà fait, veuillez fournir une copie des articles évalués par des pairs à l’ÉLCV en soumettant ce rapport.'
            },
            addOutput: { en: 'Add Output', fr: 'Ajouter une réalisation' }
          },
          part3: {
            tab: { en: 'Part 3', fr: '3<sup>e</sup> partie' },
            a: {
              question: {
                en: 'What is the impact of the project?',
                fr: 'Quel est l’impact du projet?'
              },
              text: {
                en: 'Describe distinctive contributions, major accomplishments, innovations, successes, or any change in practice or behavior that has come about as a result of the project.',
                fr: 'Décrivez les contributions marquantes, les réalisations, innovations, succès importants ou les changements dans la pratique ou les comportements qui ont émergé des conclusions de votre projet.'
              }
            },
            b: {
              question: {
                en: 'What opportunities for training and professional development has the project provided?',
                fr: 'Quelles occasions de formation et de perfectionnement professionnel votre projet a-t-il offert?'
              },
              text: {
                en: 'List any opportunities for training (i.e. student research assistants) and professional development (i.e. HQP development opportunities, lectures, courses) that the project has provided.',
                fr: 'Énumérez toutes les occasions de formation et de perfectionnement professionnel que votre projet a offertes.'
              }
            },
            c: {
              question: {
                en: 'How have the results been disseminated to communities of interest?',
                fr: 'Comment avez-vous diffusé les résultats aux groupes d’intérêt?'
              },
              text: {
                en: 'Describe any knowledge translation and outreach activities that have been undertaken.',
                fr: 'Décrivez toutes les activités d’application des connaissances et de sensibilisation qui ont été réalisées.'
              }
            }
          },
          misc: {
            choose: { en: '(choose)', fr: '(choisir)' },
            remove: { en: 'Remove', fr: 'Supprimer' },
            prevButton: { en: 'Return to the previous section', fr: 'Retourner à la section précédente' },
            nextButton: { en: 'Proceed to the next section', fr: 'Passez à la section suivante' },
            download: { en: 'Download', fr: 'Télécharger' },
            application: { en: 'Application', fr: 'Soumission' },
            submit: { en: 'Submit', fr: 'Soumettre' },
            finalReport: { en: 'Final Report', fr: 'Rapport final' },
            pleaseConfirm: { en: 'Please confirm', fr: 'Veuillez confirmer' },
            submitTitle: {
              en: 'Final Report Submitted',
              fr: 'Rapport final soumise'
            },
            submitMessage: {
              en: 'You have successfully submitted your Final Report and it will now be reviewed. You will receive an email with further instructions if your attention is required and/or when the review process is complete. You can go online to Magnolia any time to view the status of your report.',
              fr: 'Votre rapport final a été soumis avec succès. Il sera maintenant examiné. Vous recevrez un courriel avec des instructions supplémentaires en cas de besoin et lorsque le processus d’examen sera terminé. Vous pouvez vous connecter à Magnolia à tout moment pour consulter l’état de votre rapport.'
            },
            traineeSubmitTitle: {
              en: 'Final Report Submitted for Supervisor Approval',
              fr: 'Rapport final soumis au superviseur pour approbation'
            },
            traineeSubmitMessage: {
              en: 'You have successfully submitted your Final Report and your supervisor will receive an email to request approval. You will receive an email with further instructions if your attention is required and/or when the review process is complete. You can go online to Magnolia any time to view the status of your report.',
              fr: 'Votre rapport final a été soumis avec succès. Votre superviseur recevra un courriel lui demandant son approbation. Vous recevrez un courriel avec des instructions supplémentaires en cas de besoin et lorsque le processus d’examen sera terminé. Vous pouvez vous connecter à Magnolia à tout moment pour consulter l’état de votre rapport.'
            },
            resubmitTitle: {
              en: 'Final Report Resubmitted',
              fr: 'Rapport final resoumise',
            },
            resubmitMessage: {
              en: 'You have successfully resubmitted your Final Report. You will receive an email with further instructions if your attention is required and/or when the review process is complete. You can go online to Magnolia any time to view the status of your application.',
              fr: 'Votre rapport final a été resoumis avec succès. Vous recevrez un courriel avec des instructions supplémentaires en cas de besoin et lorsque le processus d’examen sera terminé. Vous pouvez vous connecter à Magnolia à tout moment pour voir l’état de votre demande.'
            },
            traineeResubmitTitle: {
              en: 'Final Report Resubmitted for Supervisor Approval',
              fr: 'Rapport final envoyée à nouveau au superviseur pour approbation',
            },
            traineeResubmitMessage: {
              en: 'You have successfully resubmitted your Final Report and your supervisor will receive an email to request approval. You will receive an email with further instructions if your attention is required and/or when the review process is complete. You can go online to Magnolia any time to view the status of your report.',
              fr: 'Votre rapport final a été resoumis avec succès. Votre superviseur recevra un courriel lui demandant son approbation. Vous recevrez un courriel avec des instructions supplémentaires en cas de besoin et lorsque le processus d’examen sera terminé. Vous pouvez vous connecter à Magnolia à tout moment pour consulter l’état de votre rapport.'
            },
            submitWarning: {
              en: 'Are you sure that all changes are complete and the report is ready to be submitted?',
              fr: 'Êtes-vous sûr d’avoir apporté toutes les modifications souhaitées et de vouloir soumettre le rapport?'
            },
            missingFieldTitle: { en: 'Missing mandatory field', fr: 'Champ obligatoire manquant' },
            missingFieldMessage: {
              en: 'There are mandatory fields which are missing. You will now be redirected to where the incomplete fields can be found. Please try re-submitting once all mandatory fields have been filled out.',
              fr: 'Des champs obligatoires sont manquants. Vous allez maintenant être redirigé vers les champs incomplets. Veuillez réessayer lorsque tous les champs obligatoires auront été remplis.'
            },
            noChangesMessage: {
              en: 'You have not made any changes to the report since your last submission.  Are you sure you wish to proceed?',
              fr: 'Vous n’avez apporté aucune modification au rapport depuis votre dernière soumission. Êtes-vous sûr de vouloir continuer?'
            }
          }
        },
        output: {
          add: { en: 'Add', fr: 'Ajouter' },
          output_type: { en: 'Output Type', fr: 'Type de réalisation' },
          detail: { en: 'Details', fr: 'Informations' },
          filename: { en: 'Attachment', fr: 'Pièce jointe' },
          url: { en: 'URL', fr: 'URL' },
          addOutputSource: { en: 'Add Source', fr: 'Ajouter une source' },
          outputSourceListHeading: { en: 'Source List', fr: 'Liste des sources' },
          output_source_count: { en: 'Sources', fr: 'Sources' },
          createOutput: { en: 'Create Output', fr: 'Créer une réalisation' },
          createOutputSource: { en: 'Create Output Source', fr: 'Créer une source pour une réalisation' },
          viewFinalReport: { en: 'View Final Report', fr: 'Afficher le rapport final' },
          viewOutput: { en: 'View Output', fr: 'Afficher la réalisation' },
          outputDetails: { en: 'Output Details', fr: 'Informations sur la réalisation' },
          outputSourceDetails: { en: 'Output Source Details', fr: 'Informations sur la source de la réalisation' },
          save: { en: 'Save', fr: 'Sauvegarder' },
          cancel: { en: 'Cancel', fr: 'Annuler' },
          delete: { en: 'Delete', fr: 'Effacer' },
          choose: { en: '(choose)', fr: '(choisir)' },
          newOutputSourceTitle: { en: 'Please Note', fr: 'Notez bien' },
          newOutputSourceMessage: { en: 'You must provide either a file or URL', fr: 'Vous devez fournir un fichier ou une URL' }
        }
      }
    };

    // fill in dynamic content
    object.promise = CnHttpFactory.instance( {
      path: 'data_option_category',
      data: {
        select: { column: [ 'name_en', 'name_fr' ] },
        modifier: { order: 'rank', limit: 1000 }
      }
    } ).query().then( function( response ) {
      var letter = 'a';
      response.data.forEach( function( cat ) {
        object.lookupData.reqn.part2[letter].tab = { en: cat.name_en, fr: cat.name_fr };
        letter = String.fromCharCode( letter.charCodeAt(0) + 1 );
      } );
    } );

    return object;
  }
] );
