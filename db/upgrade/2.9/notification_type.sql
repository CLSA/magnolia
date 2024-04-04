SELECT "Adding new notification types" AS "";

INSERT IGNORE INTO notification_type SET
  name = "Agreement Expiry Notice (2 months)",
  title_en = "CLSA Data Access - Agreement Expires Soon",
  title_fr = "Accès aux données de l’ÉLCV - Expiration imminente de l’entente",
  message_en = "Dear Dr. {{applicant_name}},

This is a reminder that your CLSA Access Agreement, for project number {{identifier}}, entitled \"{{title}}\", is due to expire in approximately two (2) months. Once your agreement expires you will be required to submit a final report to CLSA, cease analysis of the data, and destroy all transferred materials in your possession. Following termination of the Agreement, the Approved User’s right to publish pursuant to Section 8 of the agreement will also end. If you require an extension to the agreement to complete analysis or to publish your results please contact us immediately at access@clsa-elcv.ca.

The CLSA Data Access Team",
  message_fr = "Bonjour Dr / Dre {{applicant_name}},

La présente est un rappel que votre Entente d’accès aux données de l’ÉLCV, pour le projet numéro {{identifier}}, intitulé « {{title}} », expirera dans environ deux (2) mois. Une fois l’entente expirée, vous devrez soumettre un rapport final à l’ÉLCV, en plus de cesser l’analyse des données et de détruire tous les matériaux transférés en votre possession. À la suite de la résiliation de l’entente, le droit de publication de l’utilisateur autorisé prendra également fin, conformément à la section 8 de l’entente. Si vous avez besoin d’une prolongation de l’entente pour terminer l’analyse ou pour publier vos résultats, veuillez nous contacter immédiatement à access@clsa-elcv.ca.

L’équipe d’accès aux données de l’ÉLCV";

-- the name of the next notification type has changed
UPDATE notification_type
SET name = "Deferred Application Reminder (first)"
WHERE name = "Deferred Application Reminder";

INSERT IGNORE INTO notification_type SET
  name = "Deferred Application Reminder (first)",
  title_en = "Action Required Deferred",
  title_fr = "Action requise différée",
  message_en = "Dear Dr. {{applicant_name}},

Your application number {{identifier}}, entitled \"{{title}}\", requires action in order to move it forward.
Please log in to the CLSA online data application software, Magnolia (https://magnolia.clsa-elcv.ca/live/gl/), complete the changes and submit for further review.
If you have any questions, please contact us at access@clsa-elcv.ca.

The CLSA Data Access Team",

  message_fr = "Bonjour Dr / Dre {{applicant_name}}, 

Votre demande d’accès {{identifier}}, intitulée « {{title}} », requiert votre attention afin de le faire avancer. 
Connectez-vous à Magnolia, le logiciel de demande d’accès aux données en ligne de l’ÉLCV (https://magnolia.clsa-elcv.ca/live/gl/), veuillez effectuer toutes les modifications et soumettre la demande à nouveau. 
Si vous avez des questions, veuillez nous contacter à access@clsa-elcv.ca. 

L’équipe d’accès aux données de l’ÉLCV";

INSERT IGNORE INTO notification_type SET
  name = "Deferred Application Reminder (second)",
  title_en = "Action Required Deferred 2nd Reminder",
  title_fr = "Action requise différée 2e rappel",
  message_en = "Dear Dr. {{applicant_name}},
 
Your application number {{identifier}}, entitled \"{{title}}\", requires action in order to move it forward.
 
As per the previous reminder on {{TODAY-6W}} your application is not in an active stage. If you do not complete the action by {{TODAY+2W}}, your application will be returned to the last active stage and any changes that you were making will not be approved.
 
Please log in to the CLSA online data application software, Magnolia (https://magnolia.clsa-elcv.ca/live/gl/), complete the changes and submit for further review.
 
If you have any questions, please contact us at access@clsa-elcv.ca.
 
The CLSA Data Access Team",
  message_fr = "Bonjour Dr / Dre {{applicant_name}}, 

Votre demande d’accès {{identifier}}, intitulée « {{title}} », requiert votre attention avant de poursuivre son évaluation. 

Comme indiqué dans le rappel du {{TODAY-6W}}, votre demande n’est pas active. Si vous ne faites pas l’action requise avant le {{TODAY+2W}}, elle retournera à la dernière étape active, ce qui rejettera les modifications apportées.

Pour modifier votre demande et la soumettre à nouveau, connectez-vous à Magnolia, le logiciel de demande d’accès aux données en ligne de l’ÉLCV (https://magnolia.clsa-elcv.ca/live/gl/). 

Si vous avez des questions, veuillez nous contacter à access@clsa-elcv.ca. 

L’équipe d’accès aux données de l’ÉLCV";

INSERT IGNORE INTO notification_type SET
  name = "Deferred Manuscript Reminder (first)",
  title_en = "Manuscript Action Required Deferred",
  title_fr = "TODO: TRANSLATE",
  message_en = "Dear Dr. {{applicant_name}},

The manuscript entitled \"{{manuscript_title}}\" for your application number {{identifier}} requires action in order to move it forward.

Please log in to the CLSA online data application software, Magnolia (https://magnolia.clsa-elcv.ca/live/gl/), complete the changes and submit for further review.
If you have any questions, please contact us at access@clsa-elcv.ca.

The CLSA Data Access Team",

  message_fr = "Bonjour Dr / Dre {{applicant_name}}, 

TODO: TRANSLATE
Connectez-vous à Magnolia, le logiciel de demande d’accès aux données en ligne de l’ÉLCV (https://magnolia.clsa-elcv.ca/live/gl/), veuillez effectuer toutes les modifications et soumettre la demande à nouveau. 
Si vous avez des questions, veuillez nous contacter à access@clsa-elcv.ca. 

L’équipe d’accès aux données de l’ÉLCV";

INSERT IGNORE INTO notification_type SET
  name = "Deferred Manuscript Reminder (second)",
  title_en = "Manuscript Action Required Deferred 2nd Reminder",
  title_fr = "TODO: TRANSLATE",
  message_en = "Dear Dr. {{applicant_name}},
 
The manuscript entitled \"{{manuscript_title}}\" for your application number {{identifier}} requires action in order to move it forward.
 
As per the previous reminder on {{TODAY-6W}} your manuscript is not copmlete. If you do not complete the action by {{TODAY+2W}}, your manuscript will not be approved.
 
Please log in to the CLSA online data application software, Magnolia (https://magnolia.clsa-elcv.ca/live/gl/), complete the changes and submit for further review.
 
If you have any questions, please contact us at access@clsa-elcv.ca.
 
The CLSA Data Access Team",
  message_fr = "Bonjour Dr / Dre {{applicant_name}}, 

TODO: TRANSLATE

TODO: TRANSLATE

Pour modifier votre demande et la soumettre à nouveau, connectez-vous à Magnolia, le logiciel de demande d’accès aux données en ligne de l’ÉLCV (https://magnolia.clsa-elcv.ca/live/gl/). 

Si vous avez des questions, veuillez nous contacter à access@clsa-elcv.ca. 

L’équipe d’accès aux données de l’ÉLCV";

INSERT IGNORE INTO notification_type SET
  name = "Data Destruction Required",
  title_en = "CLSA Data Access - Data Destruction Required ({{identifier}})",
  title_fr = "Accès aux données de l’ÉLCV - Destruction des données requise",
  message_en = "Dear Dr. {{applicant_name}},

As per your CLSA Access Agreement, you are required to submit a Data Destruction Certificate for your application number {{identifier}}, entitled \"{{title}}\".

Please log in to the CLSA online data application software, Magnolia (https://magnolia.clsa-elcv.ca/live/gl/), where you will be able to complete the required information and submit for review.

If you have any questions, please contact us at access@clsa-elcv.ca.

The CLSA Data Access Team",

  message_fr = "Dr/Dre {{applicant_name}},

Conformément à votre Entente d’accès aux données de l’ÉLCV, vous devez soumettre une attestation de destruction de données pour votre projet numéro {{identifier}}, intitulé « {{title}} ».

Vous pouvez soumettre les informations requises via Magnolia, le logiciel de demande d’accès en ligne de l’ÉLCV (https://magnolia.clsa-elcv.ca/live/gl/).

Si vous avez des questions, n’hésitez pas à nous contacter à access@clsa-elcv.ca.

L’équipe d’accès aux données de l’ÉLCV";

INSERT IGNORE INTO notification_type SET
  name = "Approval Required, Destruction Report",
  title_en = "CLSA Data Access - Destruction Report Approval Required ({{identifier}})",
  title_fr = "Accès aux données de l’ÉLCV - Approbation du rapport de destruction requise",
  message_en = "Dear Dr. {{applicant_name}},

Your approval is required on the destruction report for your application number {{identifier}}, {{if_trainee}}on behalf of {{trainee_name}}, {{endif_trainee}}entitled \"{{title}}\".

Please log in to the CLSA online data application software, Magnolia (https://magnolia.clsa-elcv.ca/live/gl/). Review the final report and, if you are satisfied, submit the final report.

If you have any questions, please contact us at access@clsa-elcv.ca.

The CLSA Data Access Team",
  message_fr = "Dr/Dre {{applicant_name}},

Le rapport final de votre projet numéro {{identifier}}, {{if_trainee}} au nom de {{trainee_name}}, {{endif_trainee}} intitulé « {{title}} » requiert votre approbation.

Veuillez vous connecter à Magnolia, le logiciel de demande d’accès en ligne de l’ÉLCV (https://magnolia.clsa-elcv.ca/live/gl/). Vous pourrez passer en revue le rapport final et, si le tout vous convient, le soumettre. Si vous avez des questions, n’hésitez pas à nous contacter à access@clsa-elcv.ca.

L’équipe d’accès aux données de l’ÉLCV";

INSERT IGNORE INTO notification_type SET
  name = "Approval Required, Manuscript Report",
  title_en = "CLSA Data Access - Manuscript Report Approval Required ({{identifier}})",
  title_fr = "TODO: TRANSLATE",
  message_en = "Dear Dr. {{applicant_name}},

Your approval is required on the manuscript entitled \"{{manuscript_title}}\" for your application number {{identifier}}{{if_trainee}} on behalf of {{trainee_name}}{{endif_trainee}}.

Please log in to the CLSA online data application software, Magnolia (https://magnolia.clsa-elcv.ca/live/gl/). Review the manuscript report and, if you are satisfied, submit it.

If you have any questions, please contact us at access@clsa-elcv.ca.

The CLSA Data Access Team",
  message_fr = "Dr/Dre {{applicant_name}},

TODO: TRANSLATE

TODO: TRANSLATE

TODO: TRANSLATE

L’équipe d’accès aux données de l’ÉLCV";

INSERT IGNORE INTO notification_type SET
  name = "Notice of decision (manuscript)",
  title_en = "CLSA Data Access - Notice of Decision ({{identifier}}, manuscript {{manuscript_title}})",
  title_fr = "Accès aux données de l’ÉLCV - Avis de décision (TODO: TRANSLATE)",
  message_en = "Dear Dr. {{applicant_name}},

The Notice of Decision is ready for the manuscript entitled \"{{manuscript_title}}\" for your application number {{identifier}}.

Please log in to the CLSA online data application software, Magnolia (https://magnolia.clsa-elcv.ca/live/gl/), where you will be able to consult the Notice.

If you have any questions, please contact us at access@clsa-elcv.ca.

The CLSA Data Access Team",
  message_fr = "Bonjour Dr / Dre {{applicant_name}},

TODO: TRANSLATE

Pour consulter l’avis, connectez-vous à Magnolia, le logiciel de demande d’accès aux données en ligne de l’ÉLCV (https://magnolia.clsa-elcv.ca/live/gl/).

Si vous avez des questions, veuillez nous contacter à access@clsa-elcv.ca.

L’équipe d’accès aux données de l’ÉLCV"; 

INSERT IGNORE INTO notification_type SET
  name = "Action required (manuscript)",
  title_en = "CLSA Data Access - ACTION REQUIRED (manuscript for {{identifier}})",
  title_fr = "Accès aux données de l’ÉLCV - ACTION REQUISE (TODO: TRANSLATE)",
  message_en = "Dear Dr. {{applicant_name}},

An action is required on your manuscript entitled \"{{manuscript_title}}\" for application number {{identifier}}.

Please log in to the CLSA online data application software, Magnolia (https://magnolia.clsa-elcv.ca/live/gl/). Look for the \"Attention\" box on the manuscript. Follow the instructions given to remedy the issue. Once you are sure you have made all the revisions, re-submit the manuscript.

Your manuscript will continue through the review process and you will be contacted with the outcome at a later date.

If you have any questions, please contact us at access@clsa-elcv.ca.

The CLSA Data Access Team",
  message_fr = "Bonjour Dr / Dre {{applicant_name}},

TODO: TRANSLATE

TODO: TRANSLATE

TODO: TRANSLATE

Si vous avez des questions, veuillez nous contacter à access@clsa-elcv.ca.

L’équipe d’accès aux données de l’ÉLCV";

UPDATE notification_type SET name = "Agreement Expiry Notice (1 month)"
WHERE name = "Agreement Expiry Notice";
