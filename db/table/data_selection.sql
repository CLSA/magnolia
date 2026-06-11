CREATE TABLE data_selection (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  data_option_id int(10) unsigned NOT NULL,
  study_phase_id int(10) unsigned NOT NULL,
  unavailable_en varchar(255) DEFAULT NULL,
  unavailable_fr varchar(255) DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_data_option_id_study_phase_id (data_option_id,study_phase_id),
  KEY fk_data_option_id (data_option_id),
  KEY fk_study_phase_id (study_phase_id),
  CONSTRAINT fk_data_selection_data_option_id
    FOREIGN KEY (data_option_id)
    REFERENCES data_option (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT fk_data_selection_study_phase_id
    FOREIGN KEY (study_phase_id)
    REFERENCES cenozo_mg.study_phase (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;