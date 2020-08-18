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
