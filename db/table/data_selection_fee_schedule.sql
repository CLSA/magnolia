CREATE TABLE data_selection_fee_schedule (
  id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  data_selection_id INT(10) UNSIGNED NOT NULL,
  fee_schedule_id INT(10) UNSIGNED NOT NULL,
  fee INT(10) NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  INDEX fk_data_selection_id (data_selection_id ASC),
  INDEX fk_fee_schedule_id (fee_schedule_id ASC),
  UNIQUE INDEX uq_data_selection_id_fee_schedule_id (data_selection_id ASC, fee_schedule_id ASC),
  CONSTRAINT fk_data_selection_fee_schedule_data_selection_id
    FOREIGN KEY (data_selection_id)
    REFERENCES magnolia.data_selection (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_data_selection_fee_schedule_fee_schedule_id
    FOREIGN KEY (fee_schedule_id)
    REFERENCES magnolia.fee_schedule (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;
