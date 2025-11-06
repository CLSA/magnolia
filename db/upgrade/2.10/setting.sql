DROP PROCEDURE IF EXISTS patch_setting;
DELIMITER //
CREATE PROCEDURE patch_setting()
  BEGIN

    -- determine the @cenozo database name
    SET @cenozo = (
      SELECT unique_constraint_schema
      FROM information_schema.referential_constraints
      WHERE constraint_schema = DATABASE()
      AND constraint_name = "fk_access_site_id"
    );

    SELECT "Adding new fee_national column to setting table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "setting"
    AND column_name = "fee_national";

    IF @test = 0 THEN
      ALTER TABLE setting ADD COLUMN fee_national INT(10) UNSIGNED NOT NULL DEFAULT 0;
    END IF;

    SELECT "Adding new fee_international column to setting table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "setting"
    AND column_name = "fee_international";

    IF @test = 0 THEN
      ALTER TABLE setting ADD COLUMN fee_international INT(10) UNSIGNED NOT NULL DEFAULT 0;
    END IF;

    SET @sql = CONCAT(
      "INSERT IGNORE INTO setting (site_id, fee_national, fee_international) ",
      "SELECT site.id, 3000, 5000 ",
      "FROM ", @cenozo, ".site"
    );
    PREPARE statement FROM @sql;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;

  END //
DELIMITER ;

CALL patch_setting();
DROP PROCEDURE IF EXISTS patch_setting;
