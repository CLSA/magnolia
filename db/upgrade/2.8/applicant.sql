DROP PROCEDURE IF EXISTS patch_applicant;
DELIMITER //
CREATE PROCEDURE patch_applicant()
  BEGIN

    SELECT "Adding note column to applicant table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "applicant"
    AND column_name = "note";

    IF @test = 0 THEN
      ALTER TABLE applicant ADD COLUMN note TEXT NULL DEFAULT NULL;
    END IF;

  END //
DELIMITER ;

CALL patch_applicant();
DROP PROCEDURE IF EXISTS patch_applicant;
