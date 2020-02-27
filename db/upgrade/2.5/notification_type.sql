SELECT "Adding new notification types" AS "";

INSERT IGNORE INTO notification_type SET
  name = "Incomplete",
  title_en = "CLSA Data Access - Permanently Incomplete ({{identifier}})",
  title_fr = "TODO: TRANSLATION REQUIRED",
  message_en = "Dear {{applicant_name}}:

Your application number {{identifier}} entitled {{title}} has been declared permanently incomplete. Therefore, your application will not move forward through the review process.

If you have any questions, please contact us at access@clsa-elcv.ca.

The CLSA Data Access Team",
  message_fr = "TODO: TRANSLATION REQUIRED";

INSERT IGNORE INTO notification_type SET
  name = "Withdrawn",
  title_en = "CLSA Data Access - Permanently Withdrawn ({{identifier}})",
  title_fr = "TODO: TRANSLATION REQUIRED",
  message_en = "Dear {{applicant_name}}:

Your application number {{identifier}} entitled {{title}} has been declared permanently withdrawn.

If you have any questions, please contact us at access@clsa-elcv.ca.

The CLSA Data Access Team",
  message_fr = "TODO: TRANSLATION REQUIRED";
