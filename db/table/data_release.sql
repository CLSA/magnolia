CREATE TABLE data_release (
  id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  reqn_id INT(10) UNSIGNED NOT NULL,
  data_version_id INT(10) UNSIGNED NOT NULL,
  category ENUM('standard', 'amendment', 'data release update') NOT NULL DEFAULT 'standard',
  date DATE NOT NULL,
  PRIMARY KEY (id),
  INDEX fk_reqn_id (reqn_id ASC),
  INDEX fk_data_version_id (data_version_id ASC),
  UNIQUE INDEX uq_reqn_id_data_version_id_date (reqn_id ASC, data_version_id ASC, date ASC),
  CONSTRAINT fk_data_release_data_version_id
    FOREIGN KEY (data_version_id)
    REFERENCES magnolia.data_version (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_data_release_reqn_id
    FOREIGN KEY (reqn_id)
    REFERENCES magnolia.reqn (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;
