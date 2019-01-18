SELECT "Adding new requisition-submitted notification type" AS "";

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
