CREATE TABLE review_type (
  id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  name VARCHAR(45) NOT NULL,
  stage_type_id INT(10) UNSIGNED NOT NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX uq_name (name ASC),
  INDEX fk_stage_type_id (stage_type_id ASC),
  CONSTRAINT fk_review_type_stage_type_id
    FOREIGN KEY (stage_type_id)
    REFERENCES magnolia.stage_type (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;
