SELECT "Updating which stage types can make decisions" AS "";

UPDATE stage_type
SET decision = IF( decision, 0, 1 )
WHERE name IN ( "DSAC Review", "Second DSAC Decision" );
