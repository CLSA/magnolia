CREATE TABLE manuscript_stage_type_has_manuscript_stage_type (
  manuscript_stage_type_id INT(10) UNSIGNED NOT NULL,
  next_manuscript_stage_type_id INT(10) UNSIGNED NOT NULL,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  PRIMARY KEY (manuscript_stage_type_id, next_manuscript_stage_type_id),
  INDEX fk_manuscript_stage_type_id (next_manuscript_stage_type_id ASC),
  INDEX fk_next_manuscript_stage_type_id (manuscript_stage_type_id ASC),
  CONSTRAINT fk_mst_has_mst_manuscript_stage_type_id
    FOREIGN KEY (manuscript_stage_type_id)
    REFERENCES magnolia.manuscript_stage_type (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_mst_has_mst_next_manuscript_stage_type_id
    FOREIGN KEY (next_manuscript_stage_type_id)
    REFERENCES magnolia.manuscript_stage_type (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;
