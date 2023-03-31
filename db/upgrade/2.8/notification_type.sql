SELECT "Adding new notification types" AS "";

INSERT IGNORE INTO notification_type SET
  name = "Unsubmitted Application Expiry Notice",
  title_en = "CLSA Data Access - Notice of Expiry",
  title_fr = "Accès aux données de l’ÉLCV - Avis d’expiration",
  message_en = "Dear Dr. {{applicant_name}},

You have an outstanding temporary requisition in Magnolia, project number {{identifier}}. As this temporary requisition has had no action in 18 months we will be deleting it in Magnolia in approximately one (1) month. Once this has been completed you will no longer see {{identifier}} in your list of requisitions when you log into Magnolia.

The CLSA Data Access Team",
  message_fr = "Bonjour Dr / Dre {{applicant_name}},

Vous avez une demande d’accès temporaire en attente dans Magnolia, numéro de projet {{identifier}}.  Comme cette demande d’accès temporaire n’a eu aucune suite depuis 18 mois, nous la supprimerons dans Magnolia dans environ un (1) mois. Une fois cette opération terminée, vous ne verrez plus {{identifier}} dans votre liste de demandes lorsque vous vous connecterez à Magnolia.

L’équipe d’accès aux données de l’ÉLCV";

INSERT IGNORE INTO notification_type SET
  name = "Communication Review",
  title_en = "Requisition {{identifier}} in Communication Review",
  title_fr = "Requisition {{identifier}} in Communication Review",
  message_en = "The following requisition is now in the Communication Review stage:

Type: {{reqn_type}}
Identifier: {{identifier}}
Applicant: {{applicant_name}}
Title: {{title}}
",
  message_fr = "The following requisition is now in the Communication Review stage:

Type: {{reqn_type}}
Identifier: {{identifier}}
Applicant: {{applicant_name}}
Title: {{title}}
";
