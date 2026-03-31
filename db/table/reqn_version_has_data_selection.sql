CREATE TABLE reqn_version_has_data_selection (
  reqn_version_id INT(10) UNSIGNED NOT NULL,
  data_selection_id INT(10) UNSIGNED NOT NULL,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  PRIMARY KEY (reqn_version_id, data_selection_id),
  INDEX fk_data_selection_id (data_selection_id ASC),
  INDEX fk_reqn_version_id (reqn_version_id ASC),
  CONSTRAINT fk_reqn_version_has_data_selection_data_selection_id
    FOREIGN KEY (data_selection_id)
    REFERENCES magnolia.data_selection (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_reqn_version_has_data_selection_reqn_version_id
    FOREIGN KEY (reqn_version_id)
    REFERENCES magnolia.reqn_version (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;
