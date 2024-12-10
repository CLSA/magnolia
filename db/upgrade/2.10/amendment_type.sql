DROP PROCEDURE IF EXISTS patch_amendment_type;
DELIMITER //
CREATE PROCEDURE patch_amendment_type()
  BEGIN

    SELECT "Altering new_user column in amendment_type table" AS "";

    SELECT column_type = "tinyint(1)" INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "amendment_type"
    AND column_name = "new_user";

    IF @test = 1 THEN
      ALTER TABLE amendment_type
      MODIFY COLUMN new_user ENUM("applicant", "trainee") NULL DEFAULT NULL;

      UPDATE amendment_type
      SET new_user = IF( reason_en = "Changing Primary Applicant", "applicant", NULL );
    END IF;

    SELECT COUNT(*) INTO @test
    FROM amendment_type
    WHERE reason_en = "Changing Trainee";

    IF @test = 0 THEN
      SELECT "Adding new amendment type" AS "";

      UPDATE amendment_type SET rank = rank+101 WHERE rank > 1;

      INSERT IGNORE INTO amendment_type( rank, new_user, reason_en, reason_fr ) VALUES
      ( 2, "trainee", "Changing Trainee", "TODO: TRANSLATE" );

      UPDATE amendment_type set rank = rank-100 WHERE rank > 100;
    END IF;

  END //
DELIMITER ;

CALL patch_amendment_type();
DROP PROCEDURE IF EXISTS patch_amendment_type;
