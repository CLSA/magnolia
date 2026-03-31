CREATE TABLE additional_fee_fee_schedule (
  id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  additional_fee_id INT UNSIGNED NOT NULL,
  fee_schedule_id INT(10) UNSIGNED NOT NULL,
  fee INT(10) NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  INDEX fk_additional_fee_id (additional_fee_id ASC),
  INDEX fk_fee_schedule_id (fee_schedule_id ASC),
  UNIQUE INDEX uq_additional_fee_id_fee_schedule_id (additional_fee_id ASC, fee_schedule_id ASC),
  CONSTRAINT fk_additional_fee_fee_schedule_additional_fee_id
    FOREIGN KEY (additional_fee_id)
    REFERENCES magnolia.additional_fee (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_additional_fee_fee_schedule_fee_schedule_id
    FOREIGN KEY (fee_schedule_id)
    REFERENCES magnolia.fee_schedule (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;
