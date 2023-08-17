SELECT "Adding stage types to new Program of Research reqn type" AS "";

INSERT IGNORE INTO reqn_type_has_stage_type( reqn_type_id, stage_type_id )
SELECT reqn_type.id, stage_type_id
FROM reqn_type, reqn_type AS standard_reqn_type
JOIN reqn_type_has_stage_type ON standard_reqn_type.id = reqn_type_has_stage_type.reqn_type_id
WHERE reqn_type.name = "Program of Research"
AND standard_reqn_type.name = "Standard";
