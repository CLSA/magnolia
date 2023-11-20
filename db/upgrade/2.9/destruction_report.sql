SELECT "Creating new destruction_report table" AS "";

CREATE TABLE IF NOT EXISTS destruction_report (
  id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL,
  create_timestamp TIMESTAMP NOT NULL,
  reqn_id INT(10) UNSIGNED NOT NULL,
  version INT(10) UNSIGNED NOT NULL DEFAULT 1,
  datetime DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX uq_reqn_id_version (reqn_id ASC, version ASC),
  INDEX fk_reqn_id (reqn_id ASC),
  CONSTRAINT fk_destruction_report_reqn_id
    FOREIGN KEY (reqn_id)
    REFERENCES reqn (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

DELIMITER $$

DROP TRIGGER IF EXISTS destruction_report_AFTER_INSERT$$
CREATE DEFINER=CURRENT_USER TRIGGER destruction_report_AFTER_INSERT AFTER INSERT ON destruction_report
FOR EACH ROW
BEGIN
  CALL update_reqn_current_destruction_report( NEW.reqn_id );
END$$

DROP TRIGGER IF EXISTS destruction_report_AFTER_DELETE$$
CREATE DEFINER=CURRENT_USER TRIGGER destruction_report_AFTER_DELETE AFTER DELETE ON destruction_report
FOR EACH ROW
BEGIN
  CALL update_reqn_current_destruction_report( OLD.reqn_id );
END$$

DELIMITER ;
