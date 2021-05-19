SELECT "Tweaking approval notifications for new designate users" AS "";

UPDATE notification_type
SET message_en = REPLACE( message_en, "on behalf of {{trainee_name}}, ", "{{if_trainee}}on behalf of {{trainee_name}}, {{endif_trainee}}" ),
    message_fr = REPLACE( message_fr, ", pour le projet de {{trainee_name}}", "{{if_trainee}}, pour le projet de {{trainee_name}}{{endif_trainee}}" )
WHERE name LIKE "Approval Required%"
AND message_en NOT LIKE "%{{if_trainee}}%"
AND message_fr NOT LIKE "%{{if_trainee}}%";
