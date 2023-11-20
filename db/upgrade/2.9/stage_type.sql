SELECT "Adding notification type to Pre Data Destruction stage type" AS "";

UPDATE stage_type, notification_type
SET notification_type_id = notification_type.id
WHERE stage_type.name = "Pre Data Destruction"
AND notification_type.name = "Data Destruction Required";
