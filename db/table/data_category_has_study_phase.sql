CREATE TABLE data_category_has_study_phase (
  data_category_id int(10) unsigned NOT NULL,
  study_phase_id int(10) unsigned NOT NULL,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (data_category_id,study_phase_id),
  KEY fk_study_phase_id (study_phase_id),
  KEY fk_data_category_id (data_category_id),
  CONSTRAINT fk_data_category_has_study_phase_data_category_id
    FOREIGN KEY (data_category_id)
    REFERENCES data_category (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT fk_data_category_has_study_phase_study_phase_id
    FOREIGN KEY (study_phase_id)
    REFERENCES cenozo_mg.study_phase (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;