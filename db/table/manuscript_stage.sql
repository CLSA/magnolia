CREATE TABLE manuscript_stage (
  id INT(10) UNSIGNED NOT NULL,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  manuscript_id INT(10) UNSIGNED NOT NULL,
  manuscript_stage_type_id INT(10) UNSIGNED NOT NULL,
  user_id INT(10) UNSIGNED NULL DEFAULT NULL,
  datetime DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (id),
  INDEX fk_manuscript_stage_manuscript_id (manuscript_id ASC),
  INDEX fk_manuscript_stage_manuscript_stage_type_id (manuscript_stage_type_id ASC),
  INDEX fk_manuscript_stage_user_id (user_id ASC),
  CONSTRAINT fk_manuscript_stage_manuscript_id
    FOREIGN KEY (manuscript_id)
    REFERENCES magnolia.manuscript (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT fk_manuscript_stage_manuscript_stage_type_id
    FOREIGN KEY (manuscript_stage_type_id)
    REFERENCES magnolia.manuscript_stage_type (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_manuscript_stage_user_id
    FOREIGN KEY (user_id)
    REFERENCES cenozo.user (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;
