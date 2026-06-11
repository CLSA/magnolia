CREATE TABLE applicant (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  user_id int(10) unsigned NOT NULL,
  supervisor_user_id int(10) unsigned DEFAULT NULL,
  suspended tinyint(1) NOT NULL DEFAULT 0,
  newsletter tinyint(1) NOT NULL DEFAULT 0,
  note text DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_user_id (user_id),
  KEY fk_user_id (user_id),
  KEY fk_supervisor_user_id (supervisor_user_id),
  CONSTRAINT fk_applicant_supervisor_user_id
    FOREIGN KEY (supervisor_user_id)
    REFERENCES cenozo_mg.user (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT fk_applicant_user_id
    FOREIGN KEY (user_id)
    REFERENCES cenozo_mg.user (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;