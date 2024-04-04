SELECT "Creating new manuscript table" AS "";

CREATE TABLE IF NOT EXISTS manuscript (
  id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  reqn_id INT(10) UNSIGNED NOT NULL,
  title VARCHAR(511) NOT NULL,
  state ENUM('deferred', 'inactive', 'abandoned') NULL DEFAULT NULL,
  state_date DATE NULL DEFAULT NULL,
  suggested_revisions TINYINT(1) NOT NULL DEFAULT 0,
  note TEXT NULL,
  PRIMARY KEY (id),
  INDEX fk_reqn_id (reqn_id ASC),
  UNIQUE INDEX uq_reqn_id_title (reqn_id ASC, title ASC),
  CONSTRAINT fk_manuscript_reqn_id
    FOREIGN KEY (reqn_id)
    REFERENCES reqn (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


DELIMITER $$

DROP TRIGGER IF EXISTS manuscript_BEFORE_UPDATE$$
CREATE DEFINER = CURRENT_USER TRIGGER manuscript_BEFORE_UPDATE BEFORE UPDATE ON manuscript FOR EACH ROW
BEGIN
  IF !( NEW.state <=> OLD.state ) THEN
    SET NEW.state_date = IF( NEW.state IS NULL, NULL, UTC_TIMESTAMP() );
  END IF;
END$$

DELIMITER ;
