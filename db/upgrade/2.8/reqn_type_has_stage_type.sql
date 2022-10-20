SELECT "Adding new stage types to all reqn_types" AS "";

INSERT IGNORE INTO reqn_type_has_stage_type( reqn_type_id, stage_type_id )
SELECT reqn_type.id, stage_type.id
FROM reqn_type, stage_type
WHERE stage_type.name IN (
  "Admin Report Review", "DCC Review", "Communications Review", "Pre Data Destruction", "Data Destruction"
);
