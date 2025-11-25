DROP PROCEDURE IF EXISTS patch_data_option;
DELIMITER //
CREATE PROCEDURE patch_data_option()
  BEGIN

    SELECT "Adding new cost_combined column to data_option table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "data_option"
    AND column_name = "cost_combined";

    IF @test = 0 THEN
      ALTER TABLE data_option ADD COLUMN cost_combined TINYINT(1) NOT NULL DEFAULT 0 AFTER rank;
      UPDATE data_option
      JOIN data_selection ON data_option.id = data_selection.data_option_id
      SET data_option.cost_combined = data_selection.cost_combined;
    END IF;

  END //
DELIMITER ;

CALL patch_data_option();
DROP PROCEDURE IF EXISTS patch_data_option;
