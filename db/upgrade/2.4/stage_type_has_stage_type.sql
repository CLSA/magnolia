SELECT "Changing the Decision Made stage so that it can now move to either Suggested Revisions or Agreement" AS "";

INSERT IGNORE INTO stage_type_has_stage_type( stage_type_id, next_stage_type_id )
SELECT stage_type.id, next_stage_type.id
FROM stage_type, stage_type AS next_stage_type
WHERE stage_type.name = "Decision Made"
AND next_stage_type.name IN( "Suggested Revisions", "Agreement" );

INSERT IGNORE INTO stage_type_has_stage_type( stage_type_id, next_stage_type_id )
SELECT stage_type.id, next_stage_type.id
FROM stage_type, stage_type AS next_stage_type
WHERE stage_type.name = "Suggested Revisions"
AND next_stage_type.name = "Agreement";
