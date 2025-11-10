DROP PROCEDURE IF EXISTS patch_amendment_type_fee_schedule;
DELIMITER //
CREATE PROCEDURE patch_amendment_type_fee_schedule()
  BEGIN

    SELECT "Creating new amendment_type_fee_schedule table" AS "";

    CREATE TABLE IF NOT EXISTS amendment_type_fee_schedule (
      id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
      update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
      create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
      amendment_type_id INT(10) UNSIGNED NOT NULL,
      fee_schedule_id INT(10) UNSIGNED NOT NULL,
      fee_national INT(10) NOT NULL DEFAULT 0,
      fee_international INT(10) NOT NULL DEFAULT 0,
      PRIMARY KEY (id),
      INDEX fk_amendment_type_id (amendment_type_id ASC),
      INDEX fk_fee_schedule_id (fee_schedule_id ASC),
      UNIQUE INDEX uq_amendment_type_id_fee_schedule_id (amendment_type_id ASC, fee_schedule_id ASC),
      CONSTRAINT fk_amendment_type_fee_schedule_amendment_type_id
        FOREIGN KEY (amendment_type_id)
        REFERENCES amendment_type (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
      CONSTRAINT fk_amendment_type_fee_schedule_fee_schedule_id
        FOREIGN KEY (fee_schedule_id)
        REFERENCES fee_schedule (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE)
    ENGINE = InnoDB;

    SELECT COUNT(*) INTO @test FROM amendment_type_fee_schedule;
    IF @test = 0 THEN
      INSERT INTO amendment_type_fee_schedule(amendment_type_id, fee_schedule_id, fee_national, fee_international)
      SELECT amendment_type.id, fee_schedule.id, amendment_type.fee_canada, amendment_type.fee_international
      FROM amendment_type, fee_schedule;
    END IF;

  END //
DELIMITER ;

CALL patch_amendment_type_fee_schedule();
DROP PROCEDURE IF EXISTS patch_amendment_type_fee_schedule;
