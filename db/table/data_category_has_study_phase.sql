CREATE TABLE data_category_has_study_phase (
  data_category_id INT(10) UNSIGNED NOT NULL,
  study_phase_id INT(10) UNSIGNED NOT NULL,
  update_timestamp TIMESTAMP NULL DEFAULT NULL,
  create_timestamp TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (data_category_id, study_phase_id),
  INDEX fk_study_phase_id (study_phase_id ASC),
  INDEX fk_data_category_id (data_category_id ASC),
  CONSTRAINT fk_data_category_has_study_phase_data_category_id
    FOREIGN KEY (data_category_id)
    REFERENCES magnolia.data_category (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT fk_data_category_has_study_phase_study_phase_id
    FOREIGN KEY (study_phase_id)
    REFERENCES cenozo.study_phase (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;
