DROP PROCEDURE IF EXISTS patch_applicant;
DELIMITER //
CREATE PROCEDURE patch_applicant()
  BEGIN

    SELECT "Adding suspended column to applicant table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "applicant"
    AND column_name = "suspended";

    IF @test = 0 THEN
      ALTER TABLE applicant ADD COLUMN suspended TINYINT(1) NOT NULL DEFAULT 0 AFTER supervisor_user_id;
    END IF;

    SELECT "Adding suspended column to applicant table" AS "";

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
