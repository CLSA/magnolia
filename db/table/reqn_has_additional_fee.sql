CREATE TABLE reqn_has_additional_fee (
  reqn_id INT(10) UNSIGNED NOT NULL,
  additional_fee_id INT UNSIGNED NOT NULL,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  PRIMARY KEY (reqn_id, additional_fee_id),
  INDEX fk_additional_fee_id (additional_fee_id ASC),
  INDEX fk_reqn_id (reqn_id ASC),
  CONSTRAINT fk_reqn_has_additional_fee_reqn_id
    FOREIGN KEY (reqn_id)
    REFERENCES magnolia.reqn (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT fk_reqn_has_additional_fee_additional_fee_id
    FOREIGN KEY (additional_fee_id)
    REFERENCES magnolia.additional_fee (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;
