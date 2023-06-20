DROP PROCEDURE IF EXISTS patch_reqn_version;
DELIMITER //
CREATE PROCEDURE patch_reqn_version()
  BEGIN

     -- determine the @cenozo database name
     SET @cenozo = (
       SELECT unique_constraint_schema
       FROM information_schema.referential_constraints
       WHERE constraint_schema = DATABASE()
       AND constraint_name = "fk_access_site_id"
     );

    SELECT "Adding indigenous_inuit column to reqn_version table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn_version"
    AND column_name = "indigenous_inuit";

    IF @test = 0 THEN
      ALTER TABLE reqn_version ADD COLUMN indigenous_inuit TINYINT(1) NULL DEFAULT NULL AFTER indigenous;

      -- When first deployed set value to old indigenous value
      UPDATE reqn_version SET indigenous_inuit = indigenous;
    END IF;

    SELECT "Adding indigenous_metis column to reqn_version table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn_version"
    AND column_name = "indigenous_metis";

    IF @test = 0 THEN
      ALTER TABLE reqn_version ADD COLUMN indigenous_metis TINYINT(1) NULL DEFAULT NULL AFTER indigenous;

      -- When first deployed set value to old indigenous value
      UPDATE reqn_version SET indigenous_metis = indigenous;
    END IF;

    SELECT "Adding indigenous_first_nation column to reqn_version table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn_version"
    AND column_name = "indigenous_first_nation";

    IF @test = 0 THEN
      ALTER TABLE reqn_version ADD COLUMN indigenous_first_nation TINYINT(1) NULL DEFAULT NULL AFTER indigenous;

      -- When first deployed set value to old indigenous value
      UPDATE reqn_version SET indigenous_first_nation = indigenous;
    END IF;

    SELECT "Dropping indigenous column from reqn_version table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn_version"
    AND column_name = "indigenous";

    IF @test = 1 THEN
      ALTER TABLE reqn_version DROP COLUMN indigenous;
    END IF;

    SELECT "Adding indigenous4_filename column to reqn_version table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn_version"
    AND column_name = "indigenous4_filename";

    IF @test = 0 THEN
      ALTER TABLE reqn_version ADD COLUMN indigenous4_filename VARCHAR(255)
      NULL DEFAULT NULL AFTER indigenous_description;
    END IF;

    SELECT "Adding indigenous3_filename column to reqn_version table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn_version"
    AND column_name = "indigenous3_filename";

    IF @test = 0 THEN
      ALTER TABLE reqn_version ADD COLUMN indigenous3_filename VARCHAR(255)
      NULL DEFAULT NULL AFTER indigenous_description;
    END IF;

    SELECT "Adding indigenous2_filename column to reqn_version table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn_version"
    AND column_name = "indigenous2_filename";

    IF @test = 0 THEN
      ALTER TABLE reqn_version ADD COLUMN indigenous2_filename VARCHAR(255)
      NULL DEFAULT NULL AFTER indigenous_description;
    END IF;

    SELECT "Adding indigenous1_filename column to reqn_version table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn_version"
    AND column_name = "indigenous1_filename";

    IF @test = 0 THEN
      ALTER TABLE reqn_version ADD COLUMN indigenous1_filename VARCHAR(255)
      NULL DEFAULT NULL AFTER indigenous_description;
    END IF;

  END //
DELIMITER ;

CALL patch_reqn_version();
DROP PROCEDURE IF EXISTS patch_reqn_version;


SELECT "Removing no longer needed before-update trigger from reqn_version table" AS "";
DROP TRIGGER IF EXISTS reqn_version_BEFORE_UPDATE;
