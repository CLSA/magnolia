CREATE TABLE data_category_study_phase (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  data_category_id int(10) unsigned NOT NULL,
  study_phase_id int(10) unsigned NOT NULL,
  cost_combined tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  UNIQUE KEY uq_data_category_id_study_phase_id (data_category_id,study_phase_id),
  KEY fk_data_category_id (data_category_id),
  KEY fk_study_phase_id (study_phase_id),
  CONSTRAINT fk_data_category_study_phase_data_category_id
    FOREIGN KEY (data_category_id)
    REFERENCES data_category (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_data_category_study_phase_study_phase_id
    FOREIGN KEY (study_phase_id)
    REFERENCES cenozo_mg.study_phase (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
