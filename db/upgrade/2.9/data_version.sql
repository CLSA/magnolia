DROP PROCEDURE IF EXISTS patch_data_version;
DELIMITER //
CREATE PROCEDURE patch_data_version()
  BEGIN

    SELECT "Adding manuscript column to data_version table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "data_version"
    AND column_name = "manuscript";

    IF @test = 0 THEN
      ALTER TABLE data_version ADD COLUMN manuscript TINYINT(1) NOT NULL DEFAULT 0 AFTER name;

      UPDATE data_version set manuscript = 1
      WHERE name like "Comprehensive %" OR name LIKE "Tracking %";
    END IF;

  END //
DELIMITER ;

CALL patch_data_version();
DROP PROCEDURE IF EXISTS patch_data_version;
