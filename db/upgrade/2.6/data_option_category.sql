DROP PROCEDURE IF EXISTS patch_data_option_category;
DELIMITER //
CREATE PROCEDURE patch_data_option_category()
  BEGIN

    SELECT "Adding new condition_en and condition_fr columns to data_option_category table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "data_option_category"
    AND column_name = "condition_en";

    IF @test = 0 THEN
      ALTER TABLE data_option_category
      ADD COLUMN condition_fr TEXT NULL DEFAULT NULL AFTER name_fr,
      ADD COLUMN condition_en TEXT NULL DEFAULT NULL AFTER name_fr;
    END IF;

  END //
DELIMITER ;

CALL patch_data_option_category();
DROP PROCEDURE IF EXISTS patch_data_option_category;
