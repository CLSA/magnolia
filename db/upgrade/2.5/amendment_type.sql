DROP PROCEDURE IF EXISTS patch_amendment_type;
DELIMITER //
CREATE PROCEDURE patch_amendment_type()
  BEGIN

    SELECT "Adding new rank column to amendment_type table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "amendment_type"
    AND column_name = "rank";

    IF @test = 0 THEN
      ALTER TABLE amendment_type ADD COLUMN rank INT UNSIGNED NOT NULL AFTER create_timestamp;
      UPDATE amendment_type SET rank = id + 1;
      ALTER TABLE amendment_type ADD UNIQUE INDEX uq_rank (rank ASC);
    END IF;

    SELECT "Adding new new_user column to amendment_type table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "amendment_type"
    AND column_name = "new_user";

    IF @test = 0 THEN
      ALTER TABLE amendment_type ADD COLUMN new_user TINYINT(1) NOT NULL AFTER rank;
    END IF;

  END //
DELIMITER ;

CALL patch_amendment_type();
DROP PROCEDURE IF EXISTS patch_amendment_type;
    
SELECT "Adding new amendment type" AS "";

INSERT IGNORE INTO amendment_type( rank, new_user, reason_en, reason_fr ) VALUES
( 1, 1, "Changing Primary Applicant", "TODO: TRANSLATION REQUIRED" );
