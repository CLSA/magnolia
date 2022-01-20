DROP PROCEDURE IF EXISTS patch_deadline;
DELIMITER //
CREATE PROCEDURE patch_deadline()
  BEGIN

    SELECT "Converting date column in deadline table to datetime" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "deadline"
    AND column_name = "date";

    IF @test = 1 THEN
      ALTER TABLE deadline
        CHANGE COLUMN date datetime DATETIME NOT NULL,
        DROP INDEX uq_date,
        ADD UNIQUE KEY uq_datetime (datetime);

      -- convert all to midnight local time
      UPDATE deadline SET datetime = CONVERT_TZ( datetime, 'Canada/Eastern', 'UTC' );
    END IF;

  END //
DELIMITER ;

CALL patch_deadline();
DROP PROCEDURE IF EXISTS patch_deadline;
