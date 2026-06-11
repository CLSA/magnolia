CREATE TABLE stage (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  amendment_id int(10) unsigned NOT NULL,
  stage_type_id int(10) unsigned NOT NULL,
  user_id int(10) unsigned DEFAULT NULL,
  datetime datetime DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_amendment_id_stage_type_id (amendment_id,stage_type_id),
  KEY fk_stage_type_id (stage_type_id),
  KEY fk_user_id (user_id),
  KEY fk_amendment_id (amendment_id),
  CONSTRAINT fk_stage_amendment_id
    FOREIGN KEY (amendment_id)
    REFERENCES amendment (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_stage_stage_type_id
    FOREIGN KEY (stage_type_id)
    REFERENCES stage_type (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_stage_user_id
    FOREIGN KEY (user_id)
    REFERENCES cenozo_mg.user (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;