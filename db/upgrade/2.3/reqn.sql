DROP PROCEDURE IF EXISTS patch_applicant;
DELIMITER //
CREATE PROCEDURE patch_applicant()
  BEGIN

    SELECT "Adding in new reqn.funding_filename column" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "funding_filename";

    IF @test = 0 THEN
      ALTER TABLE reqn
      ADD COLUMN funding_filename VARCHAR(255) NULL DEFAULT NULL AFTER funding;
    END IF;

  END //
DELIMITER ;

CALL patch_applicant();
DROP PROCEDURE IF EXISTS patch_applicant;
