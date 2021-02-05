DROP PROCEDURE IF EXISTS patch_production_type;
DELIMITER //
CREATE PROCEDURE patch_production_type()
  BEGIN

    SELECT "Renaming production_type table to output_type" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.TABLES
    WHERE table_schema = DATABASE()
    AND table_name = "production_type";

    IF @test = 1 THEN
      RENAME TABLE production_type TO output_type;
    END IF;

    SELECT "Dropping rank column from output_type table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "output_type"
    AND column_name = "rank";

    IF @test = 1 THEN
      ALTER TABLE output_type DROP COLUMN rank;
    END IF;

    SELECT "Adding unique keys to output_type table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "output_type"
    AND column_name = "name_en"
    AND column_key = "UNI";

    IF @test = 0 THEN
      ALTER TABLE output_type ADD UNIQUE INDEX uq_name_en( name_en );
    END IF;

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "output_type"
    AND column_name = "name_fr"
    AND column_key = "UNI";

    IF @test = 0 THEN
      ALTER TABLE output_type ADD UNIQUE INDEX uq_name_fr( name_fr );
    END IF;

  END //
DELIMITER ;

CALL patch_production_type();
DROP PROCEDURE IF EXISTS patch_production_type;
