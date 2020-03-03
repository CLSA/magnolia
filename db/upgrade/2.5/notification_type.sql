SELECT "Adding new notification types" AS "";

INSERT IGNORE INTO notification_type SET
  name = "Incomplete",
  title_en = "CLSA Data Access - Permanently Incomplete ({{identifier}})",
  title_fr = "Accès aux données de l’ÉLCV - Incomplet permanent ({{identifier}})",
  message_en = "Dear {{applicant_name}}:

Your application number {{identifier}} entitled {{title}} has been declared permanently incomplete. Therefore, your application will not move forward through the review process.

If you have any questions, please contact us at access@clsa-elcv.ca.

The CLSA Data Access Team",
  message_fr = "Bonjour {{applicant_name}},

Votre demande numéro {{identifier}}, intitulée {{title}}, a reçu la mention « incomplet permanent ». Par conséquent, elle ne continuera pas le processus d’évaluation.

Si vous avez des questions, veuillez nous contacter à access@clsa-elcv.ca.

L'équipe d'accès aux données de l’ÉLCV";

INSERT IGNORE INTO notification_type SET
  name = "Withdrawn",
  title_en = "CLSA Data Access - Permanently Withdrawn ({{identifier}})",
  title_fr = "Accès aux données de l’ÉLCV - Retrait permanent ({{identifier}})",
  message_en = "Dear {{applicant_name}}:

Your application number {{identifier}} entitled {{title}} has been declared permanently withdrawn.

If you have any questions, please contact us at access@clsa-elcv.ca.

The CLSA Data Access Team",
  message_fr = "Bonjour {{applicant_name}},

Votre demande numéro {{identifier}}, intitulée {{title}}, a reçu la mention « retrait permanent ».

Si vous avez des questions, veuillez nous contacter à access@clsa-elcv.ca.

L'équipe d'accès aux données de l’ÉLCV";

INSERT IGNORE INTO notification_type SET
  name = "Change Owner",
  title_en = "CLSA Data Access - Change of Primary Applicant ({{identifier}})",
  title_fr = "TODO: TRANSLATION REQUIRED",
  message_en = "TODO: message body required",
  message_fr = "TODO: TRANSLATION REQUIRED";
