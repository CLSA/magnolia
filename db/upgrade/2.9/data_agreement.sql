DROP PROCEDURE IF EXISTS patch_data_agreement;
DELIMITER //
CREATE PROCEDURE patch_data_agreement()
  BEGIN

    SELECT "Replacing filename with data column in data_agreement table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "data_agreement"
    AND column_name = "filename";

    IF @test = 1 THEN
      ALTER TABLE data_agreement DROP COLUMN filename;
    END IF;

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "data_agreement"
    AND column_name = "data";

    IF @test = 0 THEN
      ALTER TABLE data_agreement ADD COLUMN data MEDIUMTEXT NOT NULL;
    END IF;

  END //
DELIMITER ;

CALL patch_data_agreement();
DROP PROCEDURE IF EXISTS patch_data_agreement;
