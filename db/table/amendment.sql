CREATE TABLE amendment (
  id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  reqn_id INT(10) UNSIGNED NOT NULL,
  name CHAR(1) NOT NULL,
  fee_schedule_id INT(10) UNSIGNED NOT NULL,
  fee INT(10) NULL DEFAULT NULL,
  override_fee INT(10) NULL DEFAULT NULL,
  note TEXT NULL DEFAULT NULL,
  PRIMARY KEY (id),
  INDEX fk_reqn_id (reqn_id ASC),
  UNIQUE INDEX uq_reqn_id_name (reqn_id ASC, name ASC),
  INDEX fk_fee_schedule_id (fee_schedule_id ASC),
  CONSTRAINT fk_amendment_reqn_id
    FOREIGN KEY (reqn_id)
    REFERENCES magnolia.reqn (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_amendment_fee_schedule_id
    FOREIGN KEY (fee_schedule_id)
    REFERENCES magnolia.fee_schedule (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;
