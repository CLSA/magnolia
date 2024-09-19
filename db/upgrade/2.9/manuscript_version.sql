SELECT "Creating new manuscript_version table" AS "";

CREATE TABLE IF NOT EXISTS manuscript_version (
  id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  manuscript_id INT(10) UNSIGNED NOT NULL,
  version INT(10) UNSIGNED NULL DEFAULT 1,
  authors VARCHAR(45) NULL DEFAULT NULL,
  date DATE NOT NULL,
  journal VARCHAR(45) NULL DEFAULT NULL,
  clsa_title TINYINT(1) NULL DEFAULT NULL,
  clsa_title_justification TEXT NULL DEFAULT NULL,
  clsa_keyword TINYINT(1) NULL DEFAULT NULL,
  clsa_keyword_justification TEXT NULL DEFAULT NULL,
  clsa_reference TINYINT(1) NULL DEFAULT NULL,
  clsa_reference_number VARCHAR(45) NULL DEFAULT NULL,
  clsa_reference_justification TEXT NULL DEFAULT NULL,
  genomics TINYINT(1) NULL DEFAULT NULL,
  genomics_number VARCHAR(45) NULL DEFAULT NULL,
  genomics_justification TEXT NULL DEFAULT NULL,
  acknowledgment TEXT NULL DEFAULT NULL,
  dataset_version TINYINT(1) NULL DEFAULT NULL,
  seroprevalence TINYINT(1) NULL DEFAULT NULL,
  covid TINYINT(1) NULL DEFAULT NULL,
  disclaimer TINYINT(1) NULL DEFAULT NULL,
  statement TINYINT(1) NULL DEFAULT NULL,
  indigenous TINYINT(1) NULL DEFAULT NULL,
  objectives TEXT NULL DEFAULT NULL,
  PRIMARY KEY (id),
  INDEX fk_manuscript_id (manuscript_id ASC),
  CONSTRAINT fk_manuscript_version_manuscript_id
    FOREIGN KEY (manuscript_id)
    REFERENCES manuscript (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

DELIMITER $$

DROP TRIGGER IF EXISTS manuscript_version_BEFORE_INSERT$$
CREATE DEFINER=CURRENT_USER TRIGGER manuscript_version_BEFORE_INSERT BEFORE INSERT ON manuscript_version FOR EACH ROW
BEGIN
  IF( NEW.date IS NULL ) THEN
    SET NEW.date = DATE(UTC_TIMESTAMP());
  END IF;
END$$

DROP TRIGGER IF EXISTS manuscript_version_AFTER_INSERT$$
CREATE DEFINER=CURRENT_USER TRIGGER manuscript_version_AFTER_INSERT AFTER INSERT ON manuscript_version FOR EACH ROW
BEGIN
  CALL update_manuscript_current_manuscript_version( NEW.manuscript_id );
END$$

DROP TRIGGER IF EXISTS manuscript_version_BEFORE_UPDATE$$
CREATE DEFINER=CURRENT_USER TRIGGER manuscript_version_BEFORE_UPDATE BEFORE UPDATE ON manuscript_version FOR EACH ROW
BEGIN
  IF( NEW.clsa_title ) THEN SET NEW.clsa_title_justification = NULL; END IF;
  IF( NEW.clsa_keyword ) THEN SET NEW.clsa_keyword_justification = NULL; END IF;
  IF( NEW.clsa_reference ) THEN SET NEW.clsa_reference_justification = NULL; ELSE SET NEW.clsa_reference_number = NULL; END IF;
  IF( NEW.genomics ) THEN SET NEW.genomics_justification = NULL; ELSE SET NEW.genomics_number = NULL; END IF;
END$$

DROP TRIGGER IF EXISTS manuscript_version_AFTER_DELETE$$
CREATE DEFINER=CURRENT_USER TRIGGER manuscript_version_AFTER_DELETE AFTER DELETE ON manuscript_version FOR EACH ROW
BEGIN
  CALL update_manuscript_current_manuscript_version( OLD.manuscript_id );
END$$

DELIMITER ;
