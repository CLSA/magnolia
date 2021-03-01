DROP PROCEDURE IF EXISTS patch_data_option_category;
DELIMITER //
CREATE PROCEDURE patch_data_option_category()
  BEGIN

    SELECT "Adding new comment column to data_option_category table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "data_option_category"
    AND column_name = "comment";

    IF @test = 0 THEN
      ALTER TABLE data_option_category
      ADD COLUMN comment TINYINT(1) NOT NULL DEFAULT 0 AFTER rank;

      -- the first four categories should show a rank
      UPDATE data_option_category SET comment = true WHERE rank <= 4;
    END IF;

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

    SELECT "Adding new data_option_categories" AS "";

    SELECT MAX( rank ) INTO @max_rank FROM data_option_category;

    INSERT IGNORE INTO data_option_category( rank, comment, name_en, name_fr ) VALUES
    ( @max_rank + 1, false, "Geographic Indicators", "TODO: TRANSLATE 1" ),
    ( @max_rank + 2, true, "COVID-19 Data", "TODO: TRANSLATE 2" );

  END //
DELIMITER ;

CALL patch_data_option_category();
DROP PROCEDURE IF EXISTS patch_data_option_category;
