SELECT "Creating new requisition_has_data_option table" AS "";

CREATE TABLE IF NOT EXISTS requisition_has_data_option (
  requisition_id INT UNSIGNED NOT NULL,
  data_option_id INT UNSIGNED NOT NULL,
  update_timestamp TIMESTAMP NOT NULL,
  create_timestamp TIMESTAMP NOT NULL,
  PRIMARY KEY (requisition_id, data_option_id),
  INDEX fk_data_option_id (data_option_id ASC),
  INDEX fk_requisition_id (requisition_id ASC),
  CONSTRAINT fk_requisition_has_data_option_requisition_id
    FOREIGN KEY (requisition_id)
    REFERENCES requisition (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_requisition_has_data_option_data_option_id
    FOREIGN KEY (data_option_id)
    REFERENCES data_option (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;
