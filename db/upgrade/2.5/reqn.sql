DROP PROCEDURE IF EXISTS patch_reqn;
DELIMITER //
CREATE PROCEDURE patch_reqn()
  BEGIN

    SELECT "Adding 'inactive' option to state enum in reqn table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "state"
    AND column_type LIKE "%'inactive'%";

    IF @test = 0 THEN
      ALTER TABLE reqn MODIFY COLUMN state ENUM('deferred', 'inactive', 'abandoned') NULL DEFAULT NULL;
    END IF;

  END //
DELIMITER ;

CALL patch_reqn();
DROP PROCEDURE IF EXISTS patch_reqn;
