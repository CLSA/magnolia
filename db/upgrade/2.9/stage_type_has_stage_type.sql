SELECT "Adding completed as next possible stage type after pre-data destruction" AS "";

INSERT IGNORE INTO stage_type_has_stage_type( stage_type_id, next_stage_type_id )
SELECT stage_type.id, next_stage_type.id
FROM stage_type, stage_type AS next_stage_type
WHERE stage_type.name = "Pre Data Destruction"
AND next_stage_type.name = "Complete";
