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

      UPDATE amendment_type SET rank = rank101 WHERE rank > 1;

      INSERT IGNORE INTO amendment_type( rank, new_user, reason_en, reason_fr ) VALUES
      ( 2, "trainee", "Changing Trainee", "Changer de stagiaire" );

      UPDATE amendment_type set rank = rank-100 WHERE rank > 100;
    END IF;

    SELECT "Removing fee_canada column from amendment_type table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "amendment_type"
    AND column_name = "fee_canada";

    IF @test = 1 THEN
      ALTER TABLE amendment_type DROP COLUMN fee_canada;
    END IF;

    SELECT "Removing fee_international column from amendment_type table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "amendment_type"
    AND column_name = "fee_international";

    IF @test = 1 THEN
      ALTER TABLE amendment_type DROP COLUMN fee_international;
    END IF;

  END //
DELIMITER ;

CALL patch_amendment_type();
DROP PROCEDURE IF EXISTS patch_amendment_type;


SELECT "Adding new trigger to amendment_type table" AS "";

DELIMITER $$

DROP TRIGGER IF EXISTS amendment_type_AFTER_INSERT$$
CREATE DEFINER=CURRENT_USER TRIGGER amendment_type_AFTER_INSERT AFTER INSERT ON amendment_type FOR EACH ROW
BEGIN
  INSERT INTO amendment_type_fee_schedule(amendment_type_id, fee_schedule_id)
  SELECT NEW.id, id FROM fee_schedule;
END$$

DELIMITER ;
