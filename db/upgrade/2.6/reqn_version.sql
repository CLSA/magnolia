DROP PROCEDURE IF EXISTS patch_reqn_version;
DELIMITER //
CREATE PROCEDURE patch_reqn_version()
  BEGIN

    SELECT "Adding new agreement_start_date column to reqn_version table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn_version"
    AND column_name = "agreement_start_date";

    IF @test = 0 THEN
      ALTER TABLE reqn_version ADD COLUMN agreement_start_date DATE NULL DEFAULT NULL AFTER agreement_filename;
    END IF;

    SELECT "Adding new agreement_end_date column to reqn_version table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn_version"
    AND column_name = "agreement_end_date";

    IF @test = 0 THEN
      ALTER TABLE reqn_version ADD COLUMN agreement_end_date DATE NULL DEFAULT NULL AFTER agreement_start_date;
    END IF;

  END //
DELIMITER ;

CALL patch_reqn_version();
DROP PROCEDURE IF EXISTS patch_reqn_version;
