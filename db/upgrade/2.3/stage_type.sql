SELECT "Updating which stage types can make decisions" AS "";

UPDATE stage_type
SET decision = IF( decision, 0, 1 )
WHERE name IN ( "DSAC Review", "Second DSAC Decision" );

UPDATE stage_type
SET notification_type_id = ( SELECT id FROM notification_type WHERE name = "Data Available" )
WHERE name = "Active";
