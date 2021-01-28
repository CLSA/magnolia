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

  END //
DELIMITER ;

CALL patch_production_type();
DROP PROCEDURE IF EXISTS patch_production_type;
