DROP PROCEDURE IF EXISTS patch_data_agreement;
DELIMITER //
CREATE PROCEDURE patch_data_agreement()
  BEGIN

    SELECT "Renaming version column to start_date in data_agreement table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "data_agreement"
    AND column_name = "version";

    IF @test = 1 THEN
      ALTER TABLE data_agreement CHANGE COLUMN version start_date DATE NOT NULL;
      ALTER TABLE data_agreement DROP INDEX uq_institution_version;
      ALTER TABLE data_agreement ADD UNIQUE KEY uq_institution_start_date (institution, start_date);
    END IF;

    SELECT "Adding new end_date column to data_agreement table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "data_agreement"
    AND column_name = "end_date";

    IF @test = 0 THEN
      ALTER TABLE data_agreement ADD COLUMN end_date DATE NULL DEFAULT NULL AFTER start_date;
    END IF;

  END //
DELIMITER ;

CALL patch_data_agreement();
DROP PROCEDURE IF EXISTS patch_data_agreement;
