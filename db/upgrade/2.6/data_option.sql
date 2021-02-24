DROP PROCEDURE IF EXISTS patch_data_option;
DELIMITER //
CREATE PROCEDURE patch_data_option()
  BEGIN

    SELECT "Adding new condition_en and condition_fr columns to data_option table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "data_option"
    AND column_name = "condition_en";

    IF @test = 0 THEN
      ALTER TABLE data_option
      ADD COLUMN condition_fr TEXT NULL DEFAULT NULL AFTER name_fr,
      ADD COLUMN condition_en TEXT NULL DEFAULT NULL AFTER name_fr;
    END IF;

    SELECT "Adding new Medications data option" AS "";

    SELECT COUNT(*) INTO @test FROM data_option WHERE name_en = "Medications";

    IF @test = 0 THEN
      SELECT data_option_category_id, rank INTO @data_option_category_id, @rank
      FROM data_option WHERE name_en = "Physical Health II";

      UPDATE data_option SET rank = rank + 1
      WHERE data_option_category_id = @data_option_category_id AND rank > @rank
      ORDER BY rank DESC;

      INSERT INTO data_option SET
        data_option_category_id = @data_option_category_id,
        rank = @rank + 1,
        name_en = "Medications",
        name_fr = "TODO: TRANSLATION",
        note_en = "Medications Module (MEDI) includes information on prescription and non-prescription medications used regularly by CLSA Comprehensive Cohort participants. Main variables include: DIN, name, dosage, frequency, start date & duration of use, reason of use.",
        note_fr = "TODO: TRANSLATION";
    END IF;

  END //
DELIMITER ;

CALL patch_data_option();
DROP PROCEDURE IF EXISTS patch_data_option;
