DROP PROCEDURE IF EXISTS patch_output_source;
DELIMITER //
CREATE PROCEDURE patch_output_source()
  BEGIN

    SELECT "Adding new data column to output_source table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "output_source"
    AND column_name = "data";

    IF @test = 0 THEN
      ALTER TABLE output_source ADD COLUMN data LONGTEXT NULL DEFAULT NULL AFTER filename;
    END IF;

  END //
DELIMITER ;

CALL patch_output_source();
DROP PROCEDURE IF EXISTS patch_output_source;
