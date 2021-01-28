SELECT "Adding new notification types" AS "";

INSERT IGNORE INTO notification_type SET
  name = "Ethics Expiry Notice",
  title_en = "CLSA Data Access - Ethics Approval Expires Soon",
  title_fr = "Accès aux données de l’ÉLCV - Expiration prochaine de l'approbation éthique",
  message_en = "Dear Dr. {{applicant_name}},

This is a reminder that ethics for your project number {{identifier}}, entitled \"{{title}}\", is due to expire in approximately 1 month.  Once you have received the renewal ethics letter please log into Magnolia and include the file and new date of expiry in the project's Ethics section.

If you have any questions, please contact us at access@clsa-elcv.ca.

The CLSA Data Access Team",
  message_fr = "Bonjour Dr / Dre {{applicant_name}},

Ce message vise à vous rappeler que l'approbation éthique de votre projet numéro {{identifier}}, intitulé \"{{title}}\", arrivera à échéance dans approximativement un mois. Lorsque vous aurez reçu une lettre d'approbation éthique, veuillez vous connecter à Magnolia afin d'y téléverser le fichier et d'y inscrire la nouvelle date d'échéance dans la section Éthique du projet. 

Si vous avez des questions, n'hésitez pas à nous écrire à l'adresse access@clsa-elcv.ca.

L'équipe d'accès aux données de l’ÉLCV";

INSERT IGNORE INTO notification_type SET
  name = "Agreement Expiry Notice",
  title_en = "CLSA Data Access - Agreement Expires Soon",
  title_fr = "TRANSLATION REQUIRED",
  message_en = "Dear Dr. {{applicant_name}},

TODO

If you have any questions, please contact us at access@clsa-elcv.ca.

The CLSA Data Access Team",
  message_fr = "TRANSLATION REQUIRED";

INSERT IGNORE INTO notification_type SET
  name = "Approval Required, Final Report",
  title_en = "CLSA Data Access - Final Report Approval Required ({{identifier}})",
  title_fr = "TRANSLATION REQUIRED",
  message_en = "Dear Dr. {{applicant_name}},

Your approval is required on the final report for your application number {{identifier}}, on behalf of {{trainee_name}}, entitled \"{{title}}\".

Please log in to the CLSA online data application software, Magnolia (https://magnolia.clsa-elcv.ca/live/gl/). Review the final report and, if you are satisfied, submit the final report.

If you have any questions, please contact us at access@clsa-elcv.ca.

The CLSA Data Access Team",
  message_fr = "TRANSLATION REQUIRED";
