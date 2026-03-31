CREATE TABLE data_selection (
  id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  data_option_id INT(10) UNSIGNED NOT NULL,
  study_phase_id INT(10) UNSIGNED NOT NULL,
  unavailable_en VARCHAR(255) NULL DEFAULT NULL,
  unavailable_fr VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX uq_data_option_id_study_phase_id (data_option_id ASC, study_phase_id ASC),
  INDEX fk_data_option_id (data_option_id ASC),
  INDEX fk_study_phase_id (study_phase_id ASC),
  CONSTRAINT fk_data_selection_data_option_id
    FOREIGN KEY (data_option_id)
    REFERENCES magnolia.data_option (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT fk_data_selection_study_phase_id
    FOREIGN KEY (study_phase_id)
    REFERENCES cenozo.study_phase (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;
