SELECT "Adding new reqn_version_has_amendment_type table" AS "";

CREATE TABLE IF NOT EXISTS reqn_version_has_amendment_type (
  reqn_version_id INT UNSIGNED NOT NULL,
  amendment_type_id INT UNSIGNED NOT NULL,
  update_timestamp TIMESTAMP NOT NULL,
  create_timestamp TIMESTAMP NOT NULL,
  PRIMARY KEY (reqn_version_id, amendment_type_id),
  INDEX fk_amendment_type_id (amendment_type_id ASC),
  INDEX fk_reqn_version_id (reqn_version_id ASC),
  CONSTRAINT fk_reqn_version_has_amendment_type_reqn_version_id
    FOREIGN KEY (reqn_version_id)
    REFERENCES reqn_version (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_reqn_version_has_amendment_type_amendment_type_id
    FOREIGN KEY (amendment_type_id)
    REFERENCES amendment_type (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;
