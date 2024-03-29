-- -----------------------------------------------------
-- Roles
-- -----------------------------------------------------
SET AUTOCOMMIT=0;

-- make sure all roles exist
INSERT IGNORE INTO cenozo.role( name, tier, all_sites ) VALUES
( "administrator", 3, true ),
( "applicant", 1, false ),
( "communication", 1, true ),
( "reviewer", 1, true ),
( "chair", 1, true ),
( "readonly", 1, true ),
( "ec", 1, true );

COMMIT;
