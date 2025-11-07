DROP PROCEDURE IF EXISTS patch_fee_schedule;
DELIMITER //
CREATE PROCEDURE patch_fee_schedule()
  BEGIN

    SELECT "CREATING NEW fee_schedule table" AS "";

    CREATE TABLE IF NOT EXISTS fee_schedule (
      id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
      update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
      create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
      name VARCHAR(45) NOT NULL,
      datetime DATETIME NOT NULL,
      fee_national INT(10) UNSIGNED NOT NULL DEFAULT 0,
      fee_international INT(10) UNSIGNED NOT NULL DEFAULT 0,
      PRIMARY KEY (id),
      UNIQUE INDEX uq_name (name ASC),
      UNIQUE INDEX uq_datetime (datetime ASC))
    ENGINE = InnoDB;

    SELECT COUNT(*) INTO @test FROM fee_schedule;
    IF @test = 0 THEN
      INSERT IGNORE INTO fee_schedule SET
        name = "Original",
        datetime = "2010-01-01 05:00:00",
        fee_national = 3000,
        fee_international = 5000;
    END IF; 

  END //
DELIMITER ;

CALL patch_fee_schedule();
DROP PROCEDURE IF EXISTS patch_fee_schedule;


DELIMITER $$

DROP TRIGGER IF EXISTS fee_schedule_AFTER_INSERT$$
CREATE DEFINER=CURRENT_USER TRIGGER fee_schedule_AFTER_INSERT AFTER INSERT ON fee_schedule FOR EACH ROW
BEGIN
  SET @last_fee_schedule_id = NULL;
  SELECT MAX(datetime) INTO @max_datetime FROM fee_schedule WHERE datetime < NEW.datetime;

  IF @max_datetime IS NOT NULL THEN
    SELECT id INTO @last_fee_schedule_id FROM fee_schedule WHERE datetime = @datetime;

    INSERT INTO additional_fee_fee_schedule(additional_fee_id, fee_schedule_id, fee_national)
    SELECT * FROM (
      SELECT additional_fee_id, NEW.id, fee_national
      FROM additional_fee_fee_schedule
      JOIN fee_schedule ON additional_fee_fee_schedule.fee_schedule_id = fee_schedule.id
      WHERE fee_schedule.datetime = @datetime
    ) AS temp;

    INSERT INTO amendment_type_fee_schedule(amendment_type_id, fee_schedule_id, fee_national, fee_international)
    SELECT * FROM (
      SELECT amendment_type_id, NEW.id, fee_national, fee_international
      FROM amendment_type_fee_schedule
      JOIN fee_schedule ON amendment_type_fee_schedule.fee_schedule_id = fee_schedule.id
      WHERE fee_schedule.datetime = @datetime
    ) AS temp;

    INSERT INTO data_selection_fee_schedule(data_selection_id, fee_schedule_id, fee_national)
    SELECT * FROM (
      SELECT data_selection_id, NEW.id, fee_national
      FROM data_selection_fee_schedule
      JOIN fee_schedule ON data_selection_fee_schedule.fee_schedule_id = fee_schedule.id
      WHERE fee_schedule.datetime = @datetime
    ) AS temp;
  ELSE
    INSERT INTO additional_fee_fee_schedule(additional_fee_id, fee_schedule_id)
    SELECT id, NEW.id FROM additional_fee;

    INSERT INTO amendment_type_fee_schedule(amendment_type_id, fee_schedule_id)
    SELECT id, NEW.id FROM amendment_type;

    INSERT INTO data_selection_fee_schedule(data_selection_id, fee_schedule_id)
    SELECT id, NEW.id FROM data_selection;
  END IF;
END$$

DELIMITER ;
