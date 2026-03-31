CREATE TABLE output (
  id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  reqn_id INT(10) UNSIGNED NOT NULL,
  output_type_id INT(10) UNSIGNED NOT NULL,
  detail VARCHAR(511) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX uq_reqn_id_detail USING HASH (reqn_id, detail),
  INDEX fk_output_type_id (output_type_id ASC),
  INDEX fk_reqn_id (reqn_id ASC),
  CONSTRAINT fk_output_output_type_id
    FOREIGN KEY (output_type_id)
    REFERENCES magnolia.output_type (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_output_reqn_id
    FOREIGN KEY (reqn_id)
    REFERENCES magnolia.reqn (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;
