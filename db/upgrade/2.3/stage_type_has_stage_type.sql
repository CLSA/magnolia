SELECT "Moving decision from first to second DSAC stage type" AS "";

UPDATE stage_type_has_stage_type
JOIN stage_type ON stage_type_has_stage_type.stage_type_id = stage_type.id
JOIN stage_type AS next_stage_type ON stage_type_has_stage_type.next_stage_type_id = next_stage_type.id
SET stage_type_id = ( SELECT id FROM stage_type WHERE name = "Second DSAC Decision" )
WHERE stage_type.name = "DSAC Review"
AND next_stage_type.name = "Decision Made";
