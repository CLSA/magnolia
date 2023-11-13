DROP PROCEDURE IF EXISTS patch_supplemental_file;
DELIMITER //
CREATE PROCEDURE patch_supplemental_file()
  BEGIN

    SELECT "Replacing filename_en with data_en column in supplemental_file table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "supplemental_file"
    AND column_name = "filename_en";

    IF @test = 1 THEN
      ALTER TABLE supplemental_file DROP COLUMN filename_en;
    END IF;

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "supplemental_file"
    AND column_name = "data_en";

    IF @test = 0 THEN
      ALTER TABLE supplemental_file ADD COLUMN data_en MEDIUMTEXT NOT NULL;
    END IF;

    SELECT "Replacing filename_fr with data_fr column in supplemental_file table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "supplemental_file"
    AND column_name = "filename_fr";

    IF @test = 1 THEN
      ALTER TABLE supplemental_file DROP COLUMN filename_fr;
    END IF;

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "supplemental_file"
    AND column_name = "data_fr";

    IF @test = 0 THEN
      ALTER TABLE supplemental_file ADD COLUMN data_fr MEDIUMTEXT NOT NULL;
    END IF;

  END //
DELIMITER ;

CALL patch_supplemental_file();
DROP PROCEDURE IF EXISTS patch_supplemental_file;
