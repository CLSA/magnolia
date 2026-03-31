CREATE TABLE amendment_type_fee_schedule (
  id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  amendment_type_id INT(10) UNSIGNED NOT NULL,
  fee_schedule_id INT(10) UNSIGNED NOT NULL,
  fee_national INT(10) NOT NULL DEFAULT 0,
  fee_international INT(10) NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  INDEX fk_amendment_type_id (amendment_type_id ASC),
  INDEX fk_fee_schedule_id (fee_schedule_id ASC),
  UNIQUE INDEX uq_amendment_type_id_fee_schedule_id (amendment_type_id ASC, fee_schedule_id ASC),
  CONSTRAINT fk_amendment_type_fee_schedule_amendment_type_id
    FOREIGN KEY (amendment_type_id)
    REFERENCES magnolia.amendment_type (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_amendment_type_fee_schedule_fee_schedule_id
    FOREIGN KEY (fee_schedule_id)
    REFERENCES magnolia.fee_schedule (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;
