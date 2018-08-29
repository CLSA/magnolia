'use strict';

var cenozo = angular.module( 'cenozo' );

cenozo.controller( 'HeaderCtrl', [
  '$scope', 'CnBaseHeader',
  function( $scope, CnBaseHeader ) {
    // copy all properties from the base header
    CnBaseHeader.construct( $scope );
  }
] );

cenozoApp.translate = function( address, language ) {
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

  return get( this.lookupData );
};

cenozoApp.lookupData = {
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
      en: 'Additional information or instructions are available anywhere that the ⓘ symbol appears.  Hover your mouse cursor over the text to see the additional details.',
      fr: 'TRANSLATION REQUIRED'
    },
    text5: {
      en: 'Please ensure that you have completed <strong>all of the sections of the application</strong> form that are relevant to your application. Incomplete applications may result in processing delays or refusal of your application.',
      fr: 'Assurez-vous de bien remplir <strong>toutes les sections pertinentes du formulaire de demande d’accès</strong>.  Les demandes incomplètes pourront causer un retard dans le traitement de votre demande ou entraîner un refus.'
    }
  },
  part1: {
    tab: { en: 'Part 1', fr: '1<sup>re</sup> partie' },
    title: {
      en: 'Part 1 of 3: General Project Information',
      fr: 'Partie 1 de 3 : Renseignements généraux'
    },
    a1: {
      tab: { en: 'A1. Applicant', fr: 'A1. Demandeur' },
      text1: {
        en: '<strong>Primary Applicant</strong>: The primary applicant will be the contact person for the CLSA Access Agreement as well as for the data release and any relevant updates.',
        fr: '<strong>Demandeur principal</strong> : Le demandeur principal sera la personne-ressource pour l’Entente d’accès de l’ÉLCV, ainsi que pour la transmission des données et toute mise à jour pertinente.'
      },
      text2: {
        en: 'For <strong>Graduate student</strong> (MSc, PhD) applications, the primary applicant must be the supervisor and the student must be clearly identified. <strong>Postdoctoral Fellows</strong> are permitted to apply as a primary applicant, but the application must be co-signed by their supervisor. If requesting a Fee Waiver, the Postdoctoral Fellow must be listed as the primary applicant.',
        fr: 'Pour les <strong>demandes faites par des étudiants des cycles supérieurs</strong> (M. Sc., Ph. D.), le demandeur principal doit être le superviseur et l’étudiant doit être clairement identifié. Les <strong>boursiers postdoctoraux</strong> peuvent soumettre une demande à titre de demandeur principal, mais celle-ci doit être cosignée par leur superviseur (voir les sections A7 et A8). Le boursier postdoctoral doit être le demandeur principal pour bénéficier d’une exonération des frais.'
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
        en: 'In order to be eligible for the Fee Waiver for Graduate students, the application must clearly indicate that the proposed project forms part of a thesis. In order to be eligible for the Fee Waiver for Postdoctoral Fellows, the Fellow must be the primary applicant and the supervisor must sign the application.',
        fr: 'Pour que les étudiants des cycles supérieurs soient admissibles à l’exonération des frais, la demande doit indiquer clairement que le projet proposé s’inscrit dans une thèse (voir la section A1). Pour que les boursiers postdoctoraux soient admissibles à l’exonération des frais, le boursier doit être le demandeur principal et le superviseur doit signer la demande.'
      },
      waiver: { en: 'Fee Waiver Type', fr: 'Type d’exemption de frais' }
    },
    a2: {
      tab: { en: 'A2. Project Team', fr: 'A2. Équipe de projet' },
      text: {
        en: 'All Co-Applicants and Other Personnel must be listed in the table below. Please note that changes to the project team, including change of Primary Applicant and addition or removal of Co-Applicants and Support Personnel <strong>require an amendment</strong>. To request an Amendment Form, please email <a href="mailto:access@clsa-elcv.ca">access@clsa-elcv.ca</a>.',
        fr: 'Tous les codemandeurs et les membres du personnel de soutien doivent être identifiés dans le tableau suivant. Veuillez noter que tout changement à l’équipe de projet y compris un changement de demandeur principal et l’ajout ou le retrait d’un codemandeur ou d’un membre du personnel de soutien <strong>nécessite une modification</strong>. Pour obtenir le formulaire de modification, écrivez àeilto:access@clsa-elcv.ca">access@clsa-elcv.ca</a>.'
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
      tab: { en: 'A3. Timeline', fr: 'A3. Échéancier' },
      text1: {
        en: 'What is the anticipated time frame for this proposed project? In planning for your project, please consider in your time frame at least',
        fr: 'Quel est l’échéancier prévu du projet proposé? Lors de la planification de votre projet, veuillez prévoir au moins'
      },
      text2: {
        en: 'months from the application submission deadline to the time you receive your dataset.',
        fr: 'mois à compter de la date limite de soumission de votre candidature pour recevoir votre ensemble de données.'
      },
      deadline: { en: 'Application submission deadline', fr: 'Date limite de soumission' },
      start_date: { en: 'Anticipated start date', fr: 'Date prévue de début' },
      duration: { en: 'Proposed project duration', fr: 'Durée proposée du projet' }
    },
    a4: {
      tab: { en: 'A4. Description', fr: 'A4. Description' },
      text1: {
        en: 'Please adhere to word count and page limits.',
        fr: 'Veuillez respecter le nombre de mots et la limite de pages.'
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
        en: 'Please provide a description of the proposed project. The proposal should be informative and specific and <strong>no more than 750 words per section. Non-compliant applications will be returned.</strong>',
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
        en: 'Please include a list of the most relevant references',
        fr: 'Veuillez présenter une liste des références les plus pertinentes'
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
      tab: { en: 'A5. Scientific Review', fr: 'A5. Évaluation scientifique' },
      text: {
        en: 'Evidence of peer reviewed funding will be considered evidence of scientific review. If there are no plans to submit an application for financial support for this project please provide evidence of peer review (e.g. internal departmental review, thesis protocol defense, etc.) if available. If no evidence of scientific peer review is provided with this application then the project will undergo scientific review by the DSAC.',
        fr: 'Les documents attestant l’attribution du financement seront considérés comme une preuve d’évaluation par les pairs. Si vous ne planifiez pas demander de l’aide financière pour ce projet, veuillez fournir la preuve qu’une évaluation par les pairs a été réalisée (p. ex. évaluation départementale, défense du protocole de thèse, etc.) si disponible. Si aucune preuve d’évaluation scientifique par les pairs n’est soumise avec la demande, le DSAC procédera à l’évaluation scientifique du projet.'
      },
      funding: { en: 'Peer Reviewed Funding', fr: 'Financement évalué par les pairs' },
      funding_agency: { en: 'Funding agency', fr: 'L’Organisme de financement' },
      grant_number: { en: 'Grant Number', fr: 'Numéro de la subvention' }
    },
    a6: {
      tab: { en: 'A6. Ethics', fr: 'A6. Éthique' },
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
        en: 'Please mark with an “X” the checkbox for the sections containing the modules in the CLSA Baseline dataset that you are requesting.<br>In the <strong>Comments</strong> section, include other relevant information concerning your request, including rationale for the request of Additional Data (e.g. Images).<br>Please note that you cannot request data which are not listed on this Checklist.',
        fr: 'Inscrivez un « X » dans la case à côté des modules contenant les variables de l’ensemble de données de l’ÉLCV que vous demandez.<br>Ajoutez toute autre information pertinente à votre demande à la section <strong>Commentaires</strong>, y compris une justification de la demande de données supplémentaires (par exemple, les images).<br>TRANSLATION REQUIRED'
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
        en: '<strong>Additional Data available</strong><ul><li>Air Pollution and Meteorological Exposure Measurements (for all 50,000 CLSA participants).</li><li>Forward Sortation Areas (A forward sortation area (FSA) is a geographical region in which all postal codes start with the same three characters.)</li><li>Community names (Determined using the Postal Code Conversion File (PCCF) from Statistics Canada.)</li><li>Census Subdivision (CSD ; Codes and Names) / Subdivisions de recensement (Codes et noms)</li><li>Forward Sortation Areas (FSA) / Zones de tri d’acheminement</li></ul><br>Due to the sensitive nature of these geographic indicators, a special request must be made to receive CSDs and FSAs as part of your dataset.  Adequate justification must be provided within the project description (Application Part 1). By requesting these data, you also agree that you will not present in any form (presentation, publication, poster), an illustration of these geographic areas, when fewer than 50 CLSA participants.',
        fr: '<strong>Données supplémentaires disponibles</strong><ul><li>Les mesures de la pollution de l’air et de l’exposition météorologique (pour les 50 000 participants à l’ÉLCV).</li><li>Région de tri d’acheminement (Une région de tri d’acheminement (RTA) est une region géographique où tous les codes postaux ont les mêmes trois premiers caractères.)</li><li>Nom de la collectivité (Déterminé à l’aide du Fichier de conversion des codes postaux (FCCP) de Statistique Canada.</li><li>TRANSLATION REQUIRED</li><li>TRANSLATION REQUIRED</li></ul><br>TRANSLATION REQUIRED'
      },
      text5: {
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
    choose: { en: '(choose)', fr: '(choisir)' },
    requested: { en: 'requested', fr: 'demandé' },
    prevButton: { en: 'Return to the previous section', fr: 'TRANSLATION REQUIRED' },
    nextButton: { en: 'Proceed to the next section', fr: 'TRANSLATION REQUIRED' },
    pleaseConfirm: { en: 'Please confirm', fr: 'Veuillez confirmer' },
    remove: { en: 'Remove', fr: 'Supprimer' },
    words: { en: 'words', fr: 'mots' },
    chars: { en: 'characters', fr: 'TRANSLATION REQUIRED' },
    comments: { en: 'Comments', fr: 'Commentaires' },
    upload: { en: 'upload', fr: 'téléverser' },
    uploaded: { en: 'uploaded', fr: 'téléversé' },
    uploading: { en: 'uploading', fr: 'téléversement' },
    fileSize: { en: 'file size', fr: 'taille du fichier' },
    delete: { en: 'Delete', fr: 'Effacer' },
    submit: { en: 'Submit', fr: 'Soumettre' },
    submitWarning: {
      en: 'Are you sure that all changes are complete and the application is ready to be submitted?',
      fr: 'Êtes-vous sûr(e) d’avoir apporté tous les changements souhaités à la demande d’accès et qu’elle est prête à être soumise?'
    },
    missingFieldTitle: { en: 'Missing mandatory field', fr: 'Champ obligatoire manquant' },
    missingFieldMessage: {
      en: 'There are mandatory fields which are missing. You will now be redirected to where the incomplete fields can be found.  Please try re-submitting once all mandatory fields have been filled out.',
      fr: 'Des champs obligatoires sont manquants. Vous serez redirigé vers l’endroit où se trouvent les champs incomplets. Veuillez soumettre la demande d’accès à nouveau quand tous les champs obligatoires auront été remplis.'
    },
    tooManyCharactersTitle: { en: 'Too many characters', fr: 'TRANSLATION REQUIRED' },
    tooManyCharactersMessage: {
      en: 'Some of your descriptions are too long.  You will now be redirected to the general project information details.  Please try re-submitting once all descriptions are within the maximum limits.',
      fr: 'TRANSLATION REQUIRED'
    },
    invalidStartDateTitle: { en: 'Invalid start date', fr: 'TRANSLATION REQUIRED' },
    invalidStartDateMessage: {
      en: 'The start date you have provided is not acceptible.  You will now be redirected to where the start date field can be found.  Please try re-submitting once the start date has been corrected.',
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
      en: 'You must provide an institutional email.  Public email accounts such as @gmail.com are not allowed.',
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
};
