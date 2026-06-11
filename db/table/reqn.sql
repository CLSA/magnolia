CREATE TABLE reqn (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  reqn_type_id int(10) unsigned NOT NULL,
  user_id int(10) unsigned NOT NULL,
  trainee_user_id int(10) unsigned DEFAULT NULL,
  designate_user_id int(10) unsigned DEFAULT NULL,
  language_id int(10) unsigned NOT NULL,
  deadline_id int(10) unsigned DEFAULT NULL,
  special_fee_waiver_id int(10) unsigned DEFAULT NULL,
  identifier varchar(45) NOT NULL,
  state enum('deferred','inactive','abandoned') DEFAULT NULL,
  state_date date DEFAULT NULL,
  data_directory varchar(45) DEFAULT NULL,
  data_expiry_date date DEFAULT NULL,
  website tinyint(1) NOT NULL DEFAULT 0,
  legacy tinyint(1) NOT NULL DEFAULT 0,
  suggested_revisions tinyint(1) NOT NULL DEFAULT 0,
  non_payment tinyint(1) NOT NULL DEFAULT 0,
  disable_notification tinyint(1) NOT NULL DEFAULT 0,
  show_prices tinyint(1) NOT NULL DEFAULT 1,
  data_sharing_approved tinyint(1) DEFAULT NULL,
  cross_institution_data_access tinyint(1) NOT NULL DEFAULT 1,
  note text DEFAULT NULL,
  chair_note text DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_identifier (identifier),
  UNIQUE KEY uq_data_directory (data_directory),
  KEY fk_user_id (user_id),
  KEY fk_language_id (language_id),
  KEY dk_state (state),
  KEY fk_deadline_id (deadline_id),
  KEY fk_reqn_type_id (reqn_type_id),
  KEY dk_state_date (state_date),
  KEY fk_trainee_user_id (trainee_user_id),
  KEY fk_designate_user_id (designate_user_id),
  KEY fk_special_fee_waiver_id (special_fee_waiver_id),
  CONSTRAINT fk_reqn_deadline_id
    FOREIGN KEY (deadline_id)
    REFERENCES deadline (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_reqn_designate_user_id
    FOREIGN KEY (designate_user_id)
    REFERENCES cenozo_mg.user (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_reqn_language_id
    FOREIGN KEY (language_id)
    REFERENCES cenozo_mg.language (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_reqn_special_fee_waiver_id
    FOREIGN KEY (special_fee_waiver_id)
    REFERENCES special_fee_waiver (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_reqn_trainee_user_id
    FOREIGN KEY (trainee_user_id)
    REFERENCES cenozo_mg.user (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_reqn_type_id
    FOREIGN KEY (reqn_type_id)
    REFERENCES reqn_type (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_reqn_user_id
    FOREIGN KEY (user_id)
    REFERENCES cenozo_mg.user (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;