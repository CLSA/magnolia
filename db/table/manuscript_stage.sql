CREATE TABLE manuscript_stage (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  manuscript_id int(10) unsigned NOT NULL,
  manuscript_stage_type_id int(10) unsigned NOT NULL,
  user_id int(10) unsigned DEFAULT NULL,
  datetime datetime DEFAULT NULL,
  PRIMARY KEY (id),
  KEY fk_manuscript_stage_manuscript_id (manuscript_id),
  KEY fk_manuscript_stage_manuscript_stage_type_id (manuscript_stage_type_id),
  KEY fk_manuscript_stage_user_id (user_id),
  CONSTRAINT fk_manuscript_stage_manuscript_id
    FOREIGN KEY (manuscript_id)
    REFERENCES manuscript (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT fk_manuscript_stage_manuscript_stage_type_id
    FOREIGN KEY (manuscript_stage_type_id)
    REFERENCES manuscript_stage_type (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_manuscript_stage_user_id
    FOREIGN KEY (user_id)
    REFERENCES cenozo_mg.user (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
