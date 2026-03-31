CREATE TABLE data_justification (
  id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  reqn_version_id INT(10) UNSIGNED NOT NULL,
  data_option_id INT(10) UNSIGNED NOT NULL,
  description TEXT NULL DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX uq_reqn_version_id_data_option_id (reqn_version_id ASC, data_option_id ASC),
  INDEX fk_reqn_version_id (reqn_version_id ASC),
  INDEX fk_data_option_id (data_option_id ASC),
  CONSTRAINT fk_data_justification_data_option_id
    FOREIGN KEY (data_option_id)
    REFERENCES magnolia.data_option (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_data_justification_reqn_version_id
    FOREIGN KEY (reqn_version_id)
    REFERENCES magnolia.reqn_version (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;
