SELECT "Creating new reqn_has_data_option table" AS "";

CREATE TABLE IF NOT EXISTS reqn_has_data_option (
  reqn_id INT UNSIGNED NOT NULL,
  data_option_id INT UNSIGNED NOT NULL,
  update_timestamp TIMESTAMP NOT NULL,
  create_timestamp TIMESTAMP NOT NULL,
  PRIMARY KEY (reqn_id, data_option_id),
  INDEX fk_data_option_id (data_option_id ASC),
  INDEX fk_reqn_id (reqn_id ASC),
  CONSTRAINT fk_reqn_has_data_option_reqn_id
    FOREIGN KEY (reqn_id)
    REFERENCES reqn (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_reqn_has_data_option_data_option_id
    FOREIGN KEY (data_option_id)
    REFERENCES data_option (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;
