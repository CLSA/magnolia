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

UPDATE notification_type SET
  name = "Agreement Expiry Notice (1 month)"
WHERE name = "Agreement Expiry Notice";
