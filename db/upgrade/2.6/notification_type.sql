SELECT "Adding new notification types" AS "";

INSERT IGNORE INTO notification_type SET
  name = "Ethics Expiry Notice",
  title_en = "CLSA Data Access - Ethics Approval Expires Soon",
  title_fr = "Accès aux données de l’ÉLCV - Expiration prochaine de l’approbation éthique",
  message_en = "Dear Dr. {{applicant_name}},

This is a reminder that ethics for your project number {{identifier}}, entitled \"{{title}}\", is due to expire in approximately 1 month.  Once you have received the renewal ethics letter please log into Magnolia and include the file and new date of expiry in the project’s Ethics section.

If you have any questions, please contact us at access@clsa-elcv.ca.

The CLSA Data Access Team",
  message_fr = "Bonjour Dr / Dre {{applicant_name}},

Ce message vise à vous rappeler que l’approbation éthique de votre projet numéro {{identifier}}, intitulé \"{{title}}\", arrivera à échéance dans approximativement un mois. Lorsque vous aurez reçu une lettre d’approbation éthique, veuillez vous connecter à Magnolia afin d’y téléverser le fichier et d’y inscrire la nouvelle date d’échéance dans la section Éthique du projet. 

Si vous avez des questions, n’hésitez pas à nous écrire à l’adresse access@clsa-elcv.ca.

L’équipe d’accès aux données de l’ÉLCV";

INSERT IGNORE INTO notification_type SET
  name = "Agreement Expiry Notice",
  title_en = "CLSA Data Access - Agreement Expires Soon",
  title_fr = "Accès aux données de l’ÉLCV - Expiration imminente de l’entente",
  message_en = "Dear Dr. {{applicant_name}},

This is a reminder that your CLSA Access Agreement, for project number {{identifier}}, entitled \"{{title}}\", is due to expire in approximately one (1) month. Once your agreement expires you will be required to submit a final report to CLSA, cease analysis of the data, and destroy all transferred materials in your possession. Following termination of the Agreement, the Approved User’s right to publish pursuant to Section 8 of the agreement will also end. If you require an extension to the agreement to complete analysis or to publish your results please contact us immediately at access@clsa-elcv.ca.

The CLSA Data Access Team",
  message_fr = "Bonjour Dr / Dre {{applicant_name}},

La présente est un rappel que votre Entente d’accès aux données de l’ÉLCV, pour le projet numéro {{identifier}}, intitulé « {{title}} », expirera dans environ un (1) mois. Une fois l’entente expirée, vous devrez soumettre un rapport final à l’ÉLCV, en plus de cesser l’analyse des données et de détruire tous les matériaux transférés en votre possession. À la suite de la résiliation de l’entente, le droit de publication de l’utilisateur autorisé prendra également fin, conformément à la section 8 de l’entente. Si vous avez besoin d’une prolongation de l’entente pour terminer l’analyse ou pour publier vos résultats, veuillez nous contacter immédiatement à access@clsa-elcv.ca.

L’équipe d’accès aux données de l’ÉLCV";

INSERT IGNORE INTO notification_type SET
  name = "Approval Required, Final Report",
  title_en = "CLSA Data Access - Final Report Approval Required ({{identifier}})",
  title_fr = "Accès aux données de l’ÉLCV - Approbation du rapport final requise ({{identifier}})",
  message_en = "Dear Dr. {{applicant_name}},

Your approval is required on the final report for your application number {{identifier}}, on behalf of {{trainee_name}}, entitled \"{{title}}\".

Please log in to the CLSA online data application software, Magnolia (https://magnolia.clsa-elcv.ca/live/gl/). Review the final report and, if you are satisfied, submit the final report.

If you have any questions, please contact us at access@clsa-elcv.ca.

The CLSA Data Access Team",
  message_fr = "Bonjour Dr / Dre {{applicant_name}},

Le rapport final de votre projet numéro {{identifier}}, au nom de {{trainee_name}}, intitulée « {{title}} » requiert votre approbation.

Veuillez vous connecter à Magnolia, le logiciel de demande d’accès en ligne de l’ÉLCV (https://magnolia.clsa-elcv.ca/live/gl/). Vous pourrez passer en revue le rapport final et, si vous êtes satisfait, le soumettre.

Si vous avez des questions, n’hésitez pas à nous écrire à l’adresse access@clsa-elcv.ca.

L’équipe d’accès aux données de l’ÉLCV";
