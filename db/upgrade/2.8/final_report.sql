DROP PROCEDURE IF EXISTS patch_final_report;
DELIMITER //
CREATE PROCEDURE patch_final_report()
  BEGIN

    SELECT "Adding achieved_objectives column to final_report table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "final_report"
    AND column_name = "achieved_objectives";

    IF @test = 0 THEN
      ALTER TABLE final_report ADD COLUMN achieved_objectives TINYINT(1) NULL DEFAULT NULL AFTER datetime;
    END IF;

    SELECT "Removing activities column to final_report table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "final_report"
    AND column_name = "activities";

    IF @test = 1 THEN
      ALTER TABLE final_report DROP COLUMN activities;
    END IF;

    SELECT "Removing outcomes column to final_report table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "final_report"
    AND column_name = "outcomes";

    IF @test = 1 THEN
      ALTER TABLE final_report DROP COLUMN outcomes;
    END IF;

  END //
DELIMITER ;

CALL patch_final_report();
DROP PROCEDURE IF EXISTS patch_final_report;
