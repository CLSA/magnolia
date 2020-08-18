SELECT "Creating new ethics_approval table" AS "";

CREATE TABLE IF NOT EXISTS ethics_approval (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL,
  create_timestamp TIMESTAMP NOT NULL,
  reqn_id INT UNSIGNED NOT NULL,
  filename VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  PRIMARY KEY (id),
  INDEX fk_reqn_id (reqn_id ASC),
  UNIQUE INDEX uq_reqn_id_date (reqn_id ASC, date ASC),
  CONSTRAINT fk_ethics_approval_reqn_id
    FOREIGN KEY (reqn_id)
    REFERENCES reqn (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


DELIMITER $$

DROP TRIGGER IF EXISTS ethics_approval_AFTER_INSERT $$
CREATE DEFINER = CURRENT_USER TRIGGER ethics_approval_AFTER_INSERT AFTER INSERT ON ethics_approval FOR EACH ROW
BEGIN
  CALL update_reqn_last_ethics_approval( NEW.reqn_id );
END$$

DROP TRIGGER IF EXISTS ethics_approval_AFTER_DELETE $$
CREATE DEFINER = CURRENT_USER TRIGGER ethics_approval_AFTER_DELETE AFTER DELETE ON ethics_approval FOR EACH ROW
BEGIN
  CALL update_reqn_last_ethics_approval( OLD.reqn_id );
END$$

DELIMITER ;
