DROP PROCEDURE IF EXISTS patch_reqn;
DELIMITER //
CREATE PROCEDURE patch_reqn()
  BEGIN

    SELECT "Adding new external column to reqn table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "external";

    IF @test = 0 THEN
      ALTER TABLE reqn ADD COLUMN external TINYINT(1) NOT NULL DEFAULT 0 AFTER identifier;
    END IF;

  END //
DELIMITER ;

CALL patch_reqn();
DROP PROCEDURE IF EXISTS patch_reqn;
SELECT "Adding triggers to reqn table" AS "";

DELIMITER $$

DROP TRIGGER IF EXISTS reqn_AFTER_INSERT $$
CREATE DEFINER = CURRENT_USER TRIGGER reqn_AFTER_INSERT AFTER INSERT ON reqn FOR EACH ROW
BEGIN
  CALL update_reqn_last_ethics_approval( NEW.id );
END$$

DELIMITER ;
