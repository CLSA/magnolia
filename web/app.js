'use strict';

var cenozo = angular.module( 'cenozo' );

cenozo.controller( 'HeaderCtrl', [
  '$scope', 'CnBaseHeader',
  function( $scope, CnBaseHeader ) {
    // copy all properties from the base header
    CnBaseHeader.construct( $scope );
  }
] );

cenozoApp.translate = function( subject, address, language ) {
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
};

cenozoApp.lookupData = {
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
        en: 'Please consult the CLSA website for instructions, and policies and procedures for CLSA data and biospecimen access: <a href="http://www.clsa-elcv.ca/data-access" target="clsa">www.clsa-elcv.ca/data-access</a>. Applicants are also encouraged to review the pertinent sections of the relevant CLSA protocol(s), Data Collection Tools and Physical Assessments in advance of completing the application. Additional information on the variables in the CLSA dataset is on the <strong>CLSA Data Preview Portal</strong>.',
        fr: 'Veuillez consulter les consignes, les politiques et la procédure de demande d’accès aux données et aux échantillons sur le site Web de l’ÉLCV : <a href="https://www.clsa-elcv.ca/fr/acces-aux-donnees" target="clsa">www.clsa-elcv.ca/fr/acces-aux-donnees</a>. Nous encourageons les demandeurs à consulter les sections pertinentes du protocole de l’ÉLCV (en anglais seulement), les outils de collecte de données et les tests physiques avant de remplir une demande d’accès. Des informations supplémentaires sur les variables contenues dans l’ensemble de données de l’ÉLCV sont disponibles sur le <strong>Portail de données de l’ÉLCV</strong>.'
      },
      text2: {
        en: 'Consult us for any questions regarding your application at <a href="mailto:access@clsa-elcv.ca">access@clsa-elcv.ca</a>.',
        fr: 'Veuillez nous transmettre toute question relative aux demandes d’accès aux données de l’ÉLCV en écrivant à <a href="mailto:access@clsa-elcv.ca">access@clsa-elcv.ca</a>.'
      },
      text3: {
        en: 'The application is composed of 3 parts:<ul><li>Part 1: General Project Information</li><li>Part 2: Data Checklist</li><li>Part 3: Biospecimen Checklist</li></ul>',
        fr: 'La demande est séparée en trois parties :<ul><li>1<sup>re</sup> partie : Renseignements généraux</li><li>2<sup>e</sup> partie : Sélection des données</li><li>3<sup>e</sup> partie : Sélection des échantillons biologiques</li></ul>'
      },
      text4: {
        en: 'Additional information or instructions are available anywhere that the ⓘ symbol appears. Hover your mouse cursor over the text to see the additional details.',
        fr: 'TRANSLATION REQUIRED'
      },
      text5: {
        en: 'Please ensure that you have completed <strong>all of the sections of the application</strong> form that are relevant to your application. Incomplete applications may result in processing delays or refusal of your application.',
        fr: 'Assurez-vous de bien remplir <strong>toutes les sections pertinentes du formulaire de demande d’accès</strong>. Les demandes incomplètes pourront causer un retard dans le traitement de votre demande ou entraîner un refus.'
      }
    },
    part1: {
      tab: { en: 'Part 1', fr: '1<sup>re</sup> partie' },
      title: {
        en: 'Part 1 of 3: General Project Information',
        fr: 'Partie 1 de 3 : Renseignements généraux'
      },
      a1: {
        tab: { en: 'Applicant', fr: 'Demandeur' },
        text1: {
          en: '<strong>Primary Applicant</strong>: The primary applicant will be the contact person for the CLSA Access Agreement as well as for the data release and any relevant updates.',
          fr: '<strong>Demandeur principal</strong> : Le demandeur principal sera la personne-ressource pour l’Entente d’accès de l’ÉLCV, ainsi que pour la transmission des données et toute mise à jour pertinente.'
        },
        text2: {
          en: 'For <strong>Graduate student</strong> (MSc, PhD) applications, the primary applicant must be the supervisor and the student must be clearly identified. <strong>Postdoctoral Fellows</strong> are permitted to apply as a primary applicant, but the supervisor must accept responsibility for the data and will be required to sign the CLSA Access agreement. If requesting a Fee Waiver, the Postdoctoral Fellow must be listed as the primary applicant.',
          fr: 'Pour les <strong>demandes faites par des étudiants des cycles supérieurs</strong> (M. Sc., Ph. D.), le demandeur principal doit être le superviseur et l’étudiant doit être clairement identifié. TRANSLATION REQUIRED'
        },
        applicant_name: { en: 'Name', fr: 'Nom' },
        applicant_position: { en: 'Position', fr: 'Poste' },
        applicant_affiliation: { en: 'Affiliation', fr: 'Organisme d’appartenance' },
        applicant_address: { en: 'Mailing Address', fr: 'Adresse de correspondance' },
        applicant_phone: { en: 'Phone', fr: 'Téléphone' },
        applicant_email: { en: 'E-mail', fr: 'Courriel' },
        text3: {
          en: 'Complete this section if this is a Graduate student or Postdoctoral Fellow application (if Fellow is not the primary applicant)',
          fr: 'Remplir cette section si la demande est faite par un étudiant des cycles supérieurs ou un boursier postdoctoral (si le boursier n’est pas le demandeur principal)'
        },
        graduate_name: { en: 'Name', fr: 'Nom' },
        graduate_program: { en: 'Degree and Program of Study', fr: 'Grade et programme d’étude' },
        graduate_institution: { en: 'Institution of Enrollment', fr: 'Établissement d’étude' },
        graduate_address: { en: 'Current Mailing Address', fr: 'Adresse de correspondance actuelle' },
        graduate_phone: { en: 'Phone', fr: 'Téléphone' },
        graduate_email: { en: 'E-mail', fr: 'Courriel' },
        text4: {
          en: 'In order to be eligible for the Fee Waiver for Graduate students, the application must clearly indicate that the proposed project forms part of a thesis. In order to be eligible for the Fee Waiver for Postdoctoral Fellows, the Fellow must be the primary applicant and the supervisor must sign the CLSA Access Agreement.',
          fr: 'Pour que les étudiants des cycles supérieurs soient admissibles à l’exonération des frais, la demande doit indiquer clairement que le projet proposé s’inscrit dans une thèse. Pour que les boursiers postdoctoraux soient admissibles à l’exonération des frais, le boursier doit être le demandeur principal et le superviseur doit signer l’Entente d’accès de l’ÉLCV.'
        },
        waiver: { en: 'Fee Waiver Type', fr: 'Type d’exemption de frais' }
      },
      a2: {
        tab: { en: 'Project Team', fr: 'Équipe de projet' },
        text: {
          en: 'All Co-Applicants and Other Personnel must be listed below. Please note that changes to the project team, including change of Primary Applicant and addition or removal of Co-Applicants and Support Personnel <strong>require an amendment</strong>. To request an Amendment Form, please email <a href="mailto:access@clsa-elcv.ca">access@clsa-elcv.ca</a>.',
          fr: 'Tous les codemandeurs et les membres du personnel de soutien doivent être identifiés ci-dessous. Veuillez noter que tout changement à l’équipe de projet y compris un changement de demandeur principal et l’ajout ou le retrait d’un codemandeur ou d’un membre du personnel de soutien <strong>nécessite une modification</strong>. Pour obtenir le formulaire de modification, écrivez àeilto:access@clsa-elcv.ca">access@clsa-elcv.ca</a>.'
        },
        noCoapplicants: {
          en: 'No co-applicants have been added.',
          fr: 'TRANSLATION REQUIRED'
        },
        name: { en: 'Name', fr: 'Nom' },
        position: { en: 'Position', fr: 'Poste' },
        affiliation: { en: 'Affiliation', fr: 'Organisme d’appartenance' },
        email: { en: 'E-mail', fr: 'Courriel' },
        role: { en: 'Role', fr: 'Rôle' },
        access: { en: 'Requires Access to Data', fr: 'Doit avoir accès aux données' },
        addCoapplicant: { en: 'Add Co-Applicant', fr: 'Ajouter codemandeurs' }
      },
      a3: {
        tab: { en: 'Timeline', fr: 'Échéancier' },
        text1: {
          en: 'What is the anticipated time frame for this proposed project? In planning for your project, please consider in your time frame at least ',
          fr: 'Quel est l’échéancier prévu du projet proposé? Lors de la planification de votre projet, veuillez prévoir au moins '
        },
        text2: {
          en: ' months from the application submission deadline to the time you receive your dataset.',
          fr: ' mois à compter de la date limite de soumission de votre candidature pour recevoir votre ensemble de données.'
        },
        deadline: { en: 'Application submission deadline', fr: 'Date limite de soumission' },
        start_date: { en: 'Anticipated start date', fr: 'Date prévue de début' },
        duration: { en: 'Proposed project duration', fr: 'Durée proposée du projet' }
      },
      a4: {
        tab: { en: 'Description', fr: 'Description' },
        text1: {
          en: 'Please adhere to character count limits.',
          fr: 'Veuillez respecter le nombre de mots.'
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
          fr: 'Veuillez fournir un résumé non scientifique de votre projet (<strong>TRANSLATION REQUIRED</strong>) pouvant être publié sur le site Web de l’ÉLCV si votre demande est approuvée. Assurez-vous de fournir un résumé détaillé et complet de votre projet.'
        },
        text2: {
          en: 'Please provide a description of the proposed project. The proposal should be informative and specific and <strong>no more than 4500 characters per section. Non-compliant applications will be returned.</strong>',
          fr: 'TRANSLATION REQUIRED'
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
          fr: 'Veuillez présenter une liste des références les plus pertinentes (TRANSLATION REQUIRED '
        },
        text4: {
          en: ')',
          fr: ')'
        },
        number: { en: 'Number', fr: 'Numéro' },
        reference: { en: 'Reference', fr: 'Référence' },
        noReferences: {
          en: 'No references have been added.',
          fr: 'TRANSLATION REQUIRED'
        },
        addReference: { en: 'Add Reference', fr: 'Ajouter référence' }
      },
      a5: {
        tab: { en: 'Scientific Review', fr: 'Évaluation scientifique' },
        text: {
          en: 'Evidence of peer reviewed funding will be considered evidence of scientific review. If there are no plans to submit an application for financial support for this project please provide evidence of peer review (e.g. internal departmental review, thesis protocol defense, etc.) if available. If no evidence of scientific peer review is provided with this application then the project will undergo scientific review by the DSAC.',
          fr: 'Les documents attestant l’attribution du financement seront considérés comme une preuve d’évaluation par les pairs. Si vous ne planifiez pas demander de l’aide financière pour ce projet, veuillez fournir la preuve qu’une évaluation par les pairs a été réalisée (p. ex. évaluation départementale, défense du protocole de thèse, etc.) si disponible. Si aucune preuve d’évaluation scientifique par les pairs n’est soumise avec la demande, le DSAC procédera à l’évaluation scientifique du projet.'
        },
        funding: { en: 'Peer Reviewed Funding', fr: 'Financement évalué par les pairs' },
        funding_agency: { en: 'Funding agency', fr: 'L’Organisme de financement' },
        grant_number: { en: 'Grant Number', fr: 'Numéro de la subvention' }
      },
      a6: {
        tab: { en: 'Ethics', fr: 'Éthique' },
        text: {
          en: 'Please note that ethics approval is NOT required at the time of this application, but <strong>no data or biospecimens will be released until proof of ethics approval has been received by the CLSA.</strong>',
          fr: 'Notez que l’approbation éthique n’est PAS requise à cette étape de la demande, mais <strong>aucune donnée ou aucun échantillon ne seront transmis avant que l’ÉLCV ait reçu une preuve d’approbation éthique.</strong>'
        },
        ethics: {
          en: 'Has this project received ethics approval?',
          fr: 'Ce projet a-t-il reçu une approbation éthique?'
        },
        letter: {
          en: 'Digital copy of ethics approval letter',
          fr: 'Copie numérique de la lettre d’approbation éthique'
        },
        expiration: { en: 'Expiration date of approval', fr: 'Date limite d’autorisation' },
        response: { en: 'Expected date of response', fr: 'Date approximative de la réponse' }
      }
    },
    part2: {
      tab: { en: 'Part 2', fr: '2<sup>e</sup> partie' },
      title: { en: 'Part 2 of 3: Data Checklist', fr: 'Partie 2 de 3 : Sélection des données' },
      notes: {
        tab: { en: 'Notes', fr: 'Remarques' },
        text1: {
          en: 'Please mark the sections containing the modules in the CLSA Baseline dataset that you are requesting.  Please note that you cannot request data which are not listed on this Checklist.',
          fr: ''
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
          en: 'For more information on these data, please contact <a href="mailto:access@clsa-elcv.ca">access@clsa-elcv.ca</a>',
          fr: 'Pour en savoir plus sur ces données, veuillez écrire à <a href="mailto:access@clsa-elcv.ca">access@clsa-elcv.ca</a>'
        }
      },
      a: {
        tab: { en: '', fr: '' },
        module: { en: 'Data Module', fr: 'Module de données' },
        tracking: {
          en: 'Tracking<br/>(Telephone Interview) (TRM)',
          fr: 'Évaluation de surveillance<br/>(Entrevue téléphonique) (TRM)'
        },
        comprehensive: {
          en: 'Comprehensive<br/>(Face-to-face Interview - In-home or DCS visit) (COM)',
          fr: 'Évaluation globale<br/>(Entrevue en personne - à domicile ou au DCS) (COM)'
        }
      },
      b: { tab: { en: '', fr: '' }, module: { en: '', fr: '' }, tracking: { en: '', fr: '' }, comprehensive: { en: '', fr: '' } },
      c: { tab: { en: '', fr: '' }, module: { en: '', fr: '' }, tracking: { en: '', fr: '' }, comprehensive: { en: '', fr: '' } },
      d: { tab: { en: '', fr: '' }, module: { en: '', fr: '' }, tracking: { en: '', fr: '' }, comprehensive: { en: '', fr: '' } },
      e: {
        tab: { en: '', fr: '' },
        module: { en: 'Linked Data', fr: 'Données liées' },
        tracking: {
          en: 'Tracking<br/>(Telephone Interview) (TRM)',
          fr: 'Évaluation de surveillance<br/>(Entrevue téléphonique) (TRM)'
        },
        comprehensive: {
          en: 'Comprehensive<br/>(Face-to-face Interview - In-home or DCS visit) (COM)',
          fr: 'Évaluation globale<br/>(Entrevue en personne - à domicile ou au DCS) (COM)'
        }
      },
      f: {
        tab: { en: '', fr: '' },
        module: { en: '', fr: '' },
        tracking: { en: '', fr: '' },
        comprehensive: { en: '', fr: '' },
        title1: { en: 'Images', fr: 'TRANSLATION REQUIRED' },
        text1: {
          en: 'Images are available by special request for Carotid Intima Media Thickness (cIMT), IVA Lateral Spine (DXA), Retinal Scan (RS), Electrocardiogram (ECG; tracings) and Spirometry (SPR, flow curves). To request image data, please use the ‘Comments’ box below and explain in Part 1 of the Application, why your project requires use of images. Please note that a request to receive image data from the CLSA will incur additional costs, beyond the current data access fee; it may prolong processing time of your application, and  the time to receive your image data may be longer than the 6 months to receive alphanumeric data. For more information, please contact <a href="mailto:access@clsa-elcv.ca">access@clsa-elcv.ca</a>.',
          fr: 'Il est possible d’obtenir les données en format image sur demande spéciale pour les mesures suivantes : épaisseur de l’intima-média carotidienne (cIMT), analyse intervertébrale (IVA) de la colonne vertébrale (DXA), balayage de la rétine (RS), électrocardiogramme (ECG, tracés) et spirométrie (SPR, courbes de débit). Pour demander des données en format images, utilisez la case « Commentaires » ci-dessous et, à la Partie 1 de la demande, expliquez pourquoi ces images seront utiles à votre projet. Veuillez noter qu’une demande d’obtention d’images de l’ÉLCV entraînera des coûts supplémentaires, au-delà des frais d’accès aux données actuels. Cette demande peut prolonger le temps nécessaire au traitement de votre demande et le délai de réception de vos images peut être plus long que les six mois prévus pour les données alphanumériques. Pour en savoir plus sur ces demandes, veuillez contacter <a href="mailto:access@clsa-elcv.ca">access@clsa-elcv.ca</a>.'
        },
        title2: { en: 'Raw Data', fr: 'TRANSLATION REQUIRED' },
        text2: {
          en: 'Raw data are available by special request for Cognition (COG), Bone Density by DEXA (DXA), Bio-Impedance by DEXA (DXA) and Tonometry (TON). For more information and for details on how to request these data, please contact <a href="mailto:access@clsa-elcv.ca">access@clsa-elcv.ca</a>.',
          fr: 'Les données brutes sont disponibles sur demande spéciale pour les mesures suivantes : Cognition (COG), Densité osseuse par DEXA (DXA), Bio-impédance par DEXA (DXA) et Tonométrie (TON). Pour en savoir plus sur ces données et comment en faire la demande, veuillez écrire à <a href="mailto:access@clsa-elcv.ca">access@clsa-elcv.ca</a>.'
        },
        title3: { en: 'Geographic Indicators', fr: 'TRANSLATION REQUIRED' },
        text3: {
          en: '<ol><li>Forward Sortation Areas (A forward sortation area (FSA) is a geographical region in which all postal codes start with the same three characters.)</li><li>Census Subdivision Codes and Names - determined using the Postal Code Conversion File (PCCF) from Statistics Canada. (A census subdivision (CSD) is a geographic unit defined by Statistics Canada, roughly corresponding to municipalities, whose unique codes can be linked to other sociodemographic or census data)</li></ol>Due to the sensitive nature of these geographic indicators, a special request must be made to receive CSDs and FSAs as part of your dataset.  Adequate justification must be provided within the project description (Application Part 1) as well as in the Comments box below. By requesting these data, you also agree that you will not present in any form (presentation, publication, poster), an illustration of these geographic areas with fewer than 50 CLSA participants per FSA or CSD. For more information, please contact <a href="mailto:access@clsa-elcv.ca">access@clsa-elcv.ca</a>.',
          fr: '<ol><li>Région de tri d’acheminement (Une région de tri d’acheminement (RTA) est une region géographique où tous les codes postaux ont les mêmes trois premiers caractères.)</li><li>Codes et noms des subdivisions de recensement déterminé à l’aide du Fichier de conversion des codes postaux (FCCP) de Statistique Canada. Une subdivision de recensement (SDR) est une unité géographique définie par Statistique Canada correspondant approximativement aux municipalités, dont les codes uniques peuvent être liés à d’autres données sociodémographiques ou de recensement.</li></ol>TRANSLATION REQUIRED'
        },
        text4: {
          en: 'In the Comments, include other relevant information concerning your request, including rationale for the request of Additional Data (e.g. Images).',
          fr: 'Ajoutez toute autre information pertinente à votre demande à la section Commentaires, y compris une justification de la demande de données supplémentaires (par exemple, les images).'
        }
      },
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
      choose: { en: '(choose)', fr: '(choisir)' },
      requested: { en: 'requested', fr: 'demandé' },
      prevButton: { en: 'Return to the previous section', fr: 'TRANSLATION REQUIRED' },
      nextButton: { en: 'Proceed to the next section', fr: 'TRANSLATION REQUIRED' },
      pleaseConfirm: { en: 'Please confirm', fr: 'Veuillez confirmer' },
      remove: { en: 'Remove', fr: 'Supprimer' },
      chars: { en: 'characters', fr: 'TRANSLATION REQUIRED' },
      comments: { en: 'Comments', fr: 'Commentaires' },
      delete: { en: 'Delete', fr: 'Effacer' },
      download: { en: 'Download', fr: 'TRANSLATION REQUIRED' },
      finalReport: { en: 'Final Report', fr: 'Rapport final' },
      submit: { en: 'Submit', fr: 'Soumettre' },
      submitWarning: {
        en: 'Are you sure that all changes are complete and the application is ready to be submitted?',
        fr: 'Êtes-vous sûr(e) d’avoir apporté tous les changements souhaités à la demande d’accès et qu’elle est prête à être soumise?'
      },
      missingFieldTitle: { en: 'Missing mandatory field', fr: 'Champ obligatoire manquant' },
      missingFieldMessage: {
        en: 'There are mandatory fields which are missing. You will now be redirected to where the incomplete fields can be found. Please try re-submitting once all mandatory fields have been filled out.',
        fr: 'Des champs obligatoires sont manquants. Vous serez redirigé vers l’endroit où se trouvent les champs incomplets. Veuillez soumettre la demande d’accès à nouveau quand tous les champs obligatoires auront été remplis.'
      },
      tooManyCharactersTitle: { en: 'Too many characters', fr: 'TRANSLATION REQUIRED' },
      tooManyCharactersMessage: {
        en: 'Some of your descriptions are too long. You will now be redirected to the general project information details. Please try re-submitting once all descriptions are within the maximum limits.',
        fr: 'TRANSLATION REQUIRED'
      },
      invalidStartDateTitle: { en: 'Invalid start date', fr: 'TRANSLATION REQUIRED' },
      invalidStartDateMessage: {
        en: 'The start date you have provided is not acceptable. You will now be redirected to where the start date field can be found. Please try re-submitting once the start date has been corrected.',
        fr: 'TRANSLATION REQUIRED'
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
      emailText: {
        en: 'You must provide an institutional email. Public email accounts such as @gmail.com are not allowed.',
        fr: 'TRANSLATION REQUIRED'
      },
      graduateFeeWaiver: {
        en: 'Fee Waiver for Graduate student (MSc or PhD) for thesis only',
        fr: 'Exonération pour un étudiant des cycles supérieurs (M. Sc. ou Ph. D.) pour la thèse seulement'
      },
      postdocFeeWaiver: {
        en: 'Fee Waiver for Postdoctoral Fellow (limit 1 waiver for postdoctoral studies)',
        fr: 'Exonération pour un boursier postdoctoral (limite d’une exonération pour les études postdoctorales)'
      },
      clickToSelect: {
        en: '(click to select)',
        fr: 'TRANSLATION REQUIRED'
      }
    }
  },
  finalReport: {
    heading: {
      en: 'CLSA Approved User Research Final Report',
      fr: 'TRANSLATION REQUIRED'
    },
    instructions: {
      tab: { en: 'Instructions', fr: 'Consignes' },
      title: {
        en: 'Completing the CLSA Approved User Final Report',
        fr: 'Remplir le rapport final pour les utilisateurs autorisés de l’ÉLCV'
      },
      text1: {
        en: 'The information reported in this report allows the CLSA to assess what progress has been made toward accomplishing the objectives set out in the initial application and the impact of the project towards the advancement of knowledge.',
        fr: 'TRANSLATION REQUIRED'
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
          en: 'What are the graduate thesis details?',
          fr: 'TRANSLATION REQUIRED'
        },
        text: {
          en: 'Since this is a trainee project that has been granted a fee waiver, you must complete the information below. (Any publications must be reported in the next section)',
          fr: 'TRANSLATION REQUIRED'
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
      number: { en: 'Number', fr: 'Numéro' },
      type: { en: 'Type', fr: 'TRANSLATION REQUIRED' },
      production: { en: 'Production', fr: 'TRANSLATION REQUIRED' },
      productionType: { en: 'Production Type', fr: 'TRANSLATION REQUIRED' },
      details: { en: 'Details', fr: 'TRANSLATION REQUIRED' },
      noProductions: { en: 'No productions have been added.', fr: 'TRANSLATION REQUIRED' },
      addProduction: { en: 'Add Production', fr: 'TRANSLATION REQUIRED' },
      attachment: { en: 'Attachment', fr: 'TRANSLATION REQUIRED' }
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
      prevButton: { en: 'Return to the previous section', fr: 'TRANSLATION REQUIRED' },
      nextButton: { en: 'Proceed to the next section', fr: 'TRANSLATION REQUIRED' }
    }
  }
};
