DROP PROCEDURE IF EXISTS patch_data_selection;
DELIMITER //
CREATE PROCEDURE patch_data_selection()
  BEGIN

    SELECT "Removing cost column from data_selection table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "data_selection"
    AND column_name = "cost";

    IF @test = 1 THEN
      ALTER TABLE data_selection DROP COLUMN cost;
    END IF;

  END //
DELIMITER ;

CALL patch_data_selection();
DROP PROCEDURE IF EXISTS patch_data_selection;


SELECT "Adding new trigger to data_selection table" AS "";

DELIMITER $$

DROP TRIGGER IF EXISTS data_selection_AFTER_INSERT$$
CREATE DEFINER=CURRENT_USER TRIGGER data_selection_AFTER_INSERT AFTER INSERT ON data_selection FOR EACH ROW
BEGIN
  INSERT INTO data_selection_fee_schedule(data_selection_id, fee_schedule_id)
  SELECT NEW.id, id FROM fee_schedule;
END$$

DELIMITER ;
