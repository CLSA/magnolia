SELECT "Reordering stage-type progression based on new stage types" AS "";

UPDATE stage_type_has_stage_type
SET next_stage_type_id = ( SELECT id FROM stage_type WHERE name = "Admin Report Review" )
WHERE stage_type_id = ( SELECT id FROM stage_type WHERE name = "Report Required" );

INSERT IGNORE INTO stage_type_has_stage_type( stage_type_id, next_stage_type_id )
SELECT stage_type.id, next_stage_type.id
FROM stage_type, stage_type AS next_stage_type
WHERE stage_type.name = "Admin Report Review"
AND next_stage_type.name = "DCC Review";

INSERT IGNORE INTO stage_type_has_stage_type( stage_type_id, next_stage_type_id )
SELECT stage_type.id, next_stage_type.id
FROM stage_type, stage_type AS next_stage_type
WHERE stage_type.name = "DCC Review"
AND next_stage_type.name = "Communications Review";

INSERT IGNORE INTO stage_type_has_stage_type( stage_type_id, next_stage_type_id )
SELECT stage_type.id, next_stage_type.id
FROM stage_type, stage_type AS next_stage_type
WHERE stage_type.name = "Communications Review"
AND next_stage_type.name = "Pre Data Destruction";

INSERT IGNORE INTO stage_type_has_stage_type( stage_type_id, next_stage_type_id )
SELECT stage_type.id, next_stage_type.id
FROM stage_type, stage_type AS next_stage_type
WHERE stage_type.name = "Pre Data Destruction"
AND next_stage_type.name = "Data Destruction";

INSERT IGNORE INTO stage_type_has_stage_type( stage_type_id, next_stage_type_id )
SELECT stage_type.id, next_stage_type.id
FROM stage_type, stage_type AS next_stage_type
WHERE stage_type.name = "Data Destruction"
AND next_stage_type.name = "Complete";
