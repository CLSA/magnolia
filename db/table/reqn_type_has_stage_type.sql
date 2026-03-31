CREATE TABLE reqn_type_has_stage_type (
  reqn_type_id INT(10) UNSIGNED NOT NULL,
  stage_type_id INT(10) UNSIGNED NOT NULL,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  PRIMARY KEY (reqn_type_id, stage_type_id),
  INDEX fk_stage_type_id (stage_type_id ASC),
  INDEX fk_reqn_type_id (reqn_type_id ASC),
  CONSTRAINT fk_reqn_type_has_stage_type_reqn_type_id
    FOREIGN KEY (reqn_type_id)
    REFERENCES magnolia.reqn_type (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT fk_reqn_type_has_stage_type_stage_type_id
    FOREIGN KEY (stage_type_id)
    REFERENCES magnolia.stage_type (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;
