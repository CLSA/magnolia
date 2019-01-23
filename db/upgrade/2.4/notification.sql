DROP PROCEDURE IF EXISTS patch_notification;
DELIMITER //
CREATE PROCEDURE patch_notification()
  BEGIN

    SELECT "Removing email column from notification table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'notification'
    AND COLUMN_NAME = 'email';

    IF @test = 1 THEN

      INSERT INTO notification_email( update_timestamp, create_timestamp, notification_id, email )
      SELECT update_timestamp, create_timestamp, id, email
      FROM notification;

      ALTER TABLE notification DROP COLUMN email;

    END IF;

  END //
DELIMITER ;

CALL patch_notification();
DROP PROCEDURE IF EXISTS patch_notification;
