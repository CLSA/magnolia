DROP PROCEDURE IF EXISTS patch_additional_fee;
DELIMITER //
CREATE PROCEDURE patch_additional_fee()
  BEGIN

    SELECT "Removing cost column from additional_fee table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "additional_fee"
    AND column_name = "cost";

    IF @test = 1 THEN
      ALTER TABLE additional_fee DROP COLUMN cost;
    END IF;

  END //
DELIMITER ;

CALL patch_additional_fee();
DROP PROCEDURE IF EXISTS patch_additional_fee;


SELECT "Adding new trigger to additional_fee table" AS "";

DELIMITER $$

DROP TRIGGER IF EXISTS additional_fee_AFTER_INSERT$$
CREATE DEFINER=CURRENT_USER TRIGGER additional_fee_AFTER_INSERT AFTER INSERT ON additional_fee FOR EACH ROW
BEGIN
  INSERT INTO additional_fee_fee_schedule(additional_fee_id, fee_schedule_id)
  SELECT NEW.id, id FROM fee_schedule;
END$$

DELIMITER ;
