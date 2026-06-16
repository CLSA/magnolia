DROP PROCEDURE IF EXISTS patch_amendment;
DELIMITER //
CREATE PROCEDURE patch_amendment()
  BEGIN

    SELECT "Adding new paid column to amendment table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "amendment"
    AND column_name = "paid";

    IF @test = 0 THEN
      ALTER TABLE amendment
      ADD COLUMN paid TINYINT(1) NULL DEFAULT NULL
      AFTER override_fee;

      UPDATE amendment SET paid = 1 WHERE IFNULL( override_fee, fee ) > 0;
    END IF;

  END //
DELIMITER ;

CALL patch_amendment();
DROP PROCEDURE IF EXISTS patch_amendment;
