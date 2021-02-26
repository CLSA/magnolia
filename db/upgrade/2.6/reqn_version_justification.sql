SELECT "Creating new reqn_version_justification table" AS "";

CREATE TABLE IF NOT EXISTS reqn_version_justification (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL,
  create_timestamp TIMESTAMP NOT NULL,
  reqn_version_id INT(10) UNSIGNED NOT NULL,
  data_option_id INT(10) UNSIGNED NOT NULL,
  description TEXT NULL DEFAULT NULL,
  PRIMARY KEY (id),
  INDEX fk_reqn_version_id (reqn_version_id ASC),
  INDEX fk_data_option_id (data_option_id ASC),
  UNIQUE INDEX uq_reqn_version_id_data_option_id (reqn_version_id ASC, data_option_id ASC),
  CONSTRAINT fk_reqn_version_justification_reqn_version_id
    FOREIGN KEY (reqn_version_id)
    REFERENCES reqn_version (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT fk_reqn_version_justification_data_option_id
    FOREIGN KEY (data_option_id)
    REFERENCES data_option (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;
