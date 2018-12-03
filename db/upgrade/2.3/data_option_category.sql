DROP PROCEDURE IF EXISTS patch_data_option_category;
DELIMITER //
CREATE PROCEDURE patch_data_option_category()
  BEGIN

    SELECT "Removing comprehensive column from data_option_category table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "data_option_category"
    AND column_name = "comprehensive";

    IF @test THEN
      ALTER TABLE data_option_category DROP COLUMN comprehensive;
    END IF;

    SELECT "Removing tracking column from data_option_category table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "data_option_category"
    AND column_name = "tracking";

    IF @test THEN
      ALTER TABLE data_option_category DROP COLUMN tracking;
    END IF;

  END //
DELIMITER ;

CALL patch_data_option_category();
DROP PROCEDURE IF EXISTS patch_data_option_category;
