SELECT "Adding new notification types" AS "";

INSERT IGNORE INTO notification_type SET
  name = "Requisition Submitted",
  title_en = "Magnolia - Requisition {{identifier}} submitted",
  title_fr = "Magnolia - Requisition {{identifier}} submitted",
  message_en = "The following requisition has been submitted:

Identifier: {{identifier}}
Applicant: {{applicant_name}}
Title: ({{title}}",
  message_fr = "The following requisition has been submitted:

Identifier: {{identifier}}
Applicant: {{applicant_name}}
Title: ({{title}}";

INSERT IGNORE INTO notification_type SET
  name = "Approval Required",
  title_en = "CLSA Data Access - Approval Required",
  title_fr = "Accès aux données de l’ÉLCV — TRANSLATION REQUIRED",
  message_en = "Dear Dr. {{applicant_name}},

Your approval is required on your application number {{identifier}}, entitled {{title}}.

Please log in to the CLSA online data application software, Magnolia (https://magnolia.clsa-elcv.ca/live/gl/). Review the application and, if you are satisfied, submit the application.

Your application will continue through the review process and you will be contacted with the outcome at a later date.

If you have any questions, please contact us at access@clsa-elcv.ca.

The CLSA Data Access Team",
  message_fr = "Bonjour Dr {{applicant_name}},

Votre demande d’accès {{identifier}}, intitulée {{title}}, TRANSLATION REQUIRED.

TRANSLATION REQUIRED.

Votre demande passera alors à la prochaine étape du processus d’évaluation et vous serez contacté(e) avec le résultat à une date ultérieure.

Si vous avez des questions, veuillez nous contacter à access@clsa-elcv.ca.

L’équipe d’accès aux données de l’ÉLCV";
