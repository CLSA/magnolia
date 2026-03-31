CREATE TABLE stage_type_has_stage_type (
  stage_type_id INT(10) UNSIGNED NOT NULL,
  next_stage_type_id INT(10) UNSIGNED NOT NULL,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  PRIMARY KEY (stage_type_id, next_stage_type_id),
  INDEX fk_next_stage_type_id (next_stage_type_id ASC),
  INDEX fk_stage_type_id (stage_type_id ASC),
  CONSTRAINT fk_stage_type_has_stage_type_next_stage_type_id
    FOREIGN KEY (next_stage_type_id)
    REFERENCES magnolia.stage_type (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_stage_type_has_stage_type_stage_type_id
    FOREIGN KEY (stage_type_id)
    REFERENCES magnolia.stage_type (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;
