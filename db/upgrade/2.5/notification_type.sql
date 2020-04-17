SELECT "Adding new notification types" AS "";

INSERT IGNORE INTO notification_type SET
  name = "Incomplete",
  title_en = "CLSA Data Access - Permanently Incomplete ({{identifier}})",
  title_fr = "Accès aux données de l’ÉLCV - Incomplet permanent ({{identifier}})",
  message_en = "Dear {{applicant_name}}:

Your application number {{identifier}}, entitled \"{{title}}\", has been declared permanently incomplete. Therefore, your application will not move forward through the review process.

If you have any questions, please contact us at access@clsa-elcv.ca.

The CLSA Data Access Team",
  message_fr = "Bonjour {{applicant_name}},

Votre demande numéro {{identifier}}, intitulée \"{{title}}\", a reçu la mention « incomplet permanent ». Par conséquent, elle ne continuera pas le processus d’évaluation.

Si vous avez des questions, veuillez nous contacter à access@clsa-elcv.ca.

L'équipe d'accès aux données de l’ÉLCV";

INSERT IGNORE INTO notification_type SET
  name = "Withdrawn",
  title_en = "CLSA Data Access - Permanently Withdrawn ({{identifier}})",
  title_fr = "Accès aux données de l’ÉLCV - Retrait permanent ({{identifier}})",
  message_en = "Dear {{applicant_name}}:

Your application number {{identifier}}, entitled \"{{title}}\", has been declared permanently withdrawn.

If you have any questions, please contact us at access@clsa-elcv.ca.

The CLSA Data Access Team",
  message_fr = "Bonjour {{applicant_name}},

Votre demande numéro {{identifier}}, intitulée \"{{title}}\", a reçu la mention « retrait permanent ».

Si vous avez des questions, veuillez nous contacter à access@clsa-elcv.ca.

L'équipe d'accès aux données de l’ÉLCV";

INSERT IGNORE INTO notification_type SET
  name = "Change Owner",
  title_en = "CLSA Data Access - Change of Primary Applicant ({{identifier}})",
  title_fr = "Accès aux données de l'ÉLCV - Changement de demandeur principal ({{identifier}})",
  message_en = "Dear Applicants,

  As requested, the owner of application number {{identifier}}, entitled \"{{title}}\" has been changed to {{applicant_name}}.{{if_trainee}}  {{applicant_name}} has also been assigned as supervisor for {{trainee_name}}'s project.{{endif_trainee}}

  If you have any questions, please contact us at access@clsa-elcv.ca.

  The CLSA Data Access Team",
  message_fr = "Chers candidats,

  Tel que demandé, le propriétaire de la demande numéro {{identifier}}, intitulée \"{{title}}\", a été changé pour {{applicant_name}}.{{if_trainee}}  {{applicant_name}} a également été désigné(e) comme superviseur du projet de {{trainee_name}}.{{endif_trainee}}

  Si vous avez des questions, n'hésitez pas à nous contacter à access@clsa-elcv.ca.

  L'équipe d'accès aux données de l'ÉLCV";

SELECT "Changing {{graduate_name}} to {{trainee_name}} in all notification types" AS "";

UPDATE notification_type SET
  title_en = REPLACE( title_en, "graduate_name", "trainee_name" ),
  title_fr = REPLACE( title_fr, "graduate_name", "trainee_name" ),
  message_en = REPLACE( message_en, "graduate_name", "trainee_name" ),
  message_fr = REPLACE( message_fr, "graduate_name", "trainee_name" );
