CREATE TABLE reqn (
  id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  reqn_type_id INT(10) UNSIGNED NOT NULL,
  user_id INT(10) UNSIGNED NOT NULL,
  trainee_user_id INT(10) UNSIGNED NULL DEFAULT NULL,
  designate_user_id INT(10) UNSIGNED NULL DEFAULT NULL,
  language_id INT(10) UNSIGNED NOT NULL,
  deadline_id INT(10) UNSIGNED NULL DEFAULT NULL,
  special_fee_waiver_id INT(10) UNSIGNED NULL DEFAULT NULL,
  identifier VARCHAR(45) NOT NULL,
  state ENUM('deferred', 'inactive', 'abandoned') NULL DEFAULT NULL,
  state_date DATE NULL DEFAULT NULL,
  data_directory VARCHAR(45) NULL DEFAULT NULL,
  data_expiry_date DATE NULL DEFAULT NULL,
  instruction_filename VARCHAR(255) NULL DEFAULT NULL,
  website TINYINT(1) NOT NULL DEFAULT 0,
  legacy TINYINT(1) NOT NULL DEFAULT 0,
  suggested_revisions TINYINT(1) NOT NULL DEFAULT 0,
  non_payment TINYINT(1) NOT NULL DEFAULT 0,
  disable_notification TINYINT(1) NOT NULL DEFAULT 0,
  show_prices TINYINT(1) NOT NULL DEFAULT 1,
  data_sharing_approved TINYINT(1) NULL DEFAULT NULL,
  cross_institution_data_access TINYINT(1) NOT NULL DEFAULT 1,
  note TEXT NULL DEFAULT NULL,
  chair_note TEXT NULL DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX uq_identifier (identifier ASC),
  UNIQUE INDEX uq_data_directory (data_directory ASC),
  INDEX fk_user_id (user_id ASC),
  INDEX fk_language_id (language_id ASC),
  INDEX dk_state (state ASC),
  INDEX fk_deadline_id (deadline_id ASC),
  INDEX fk_reqn_type_id (reqn_type_id ASC),
  INDEX dk_state_date (state_date ASC),
  INDEX fk_trainee_user_id (trainee_user_id ASC),
  INDEX fk_designate_user_id (designate_user_id ASC),
  INDEX fk_special_fee_waiver_id (special_fee_waiver_id ASC),
  CONSTRAINT fk_reqn_deadline_id
    FOREIGN KEY (deadline_id)
    REFERENCES magnolia.deadline (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_reqn_designate_user_id
    FOREIGN KEY (designate_user_id)
    REFERENCES cenozo.user (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_reqn_language_id
    FOREIGN KEY (language_id)
    REFERENCES cenozo.language (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_reqn_trainee_user_id
    FOREIGN KEY (trainee_user_id)
    REFERENCES cenozo.user (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_reqn_type_id
    FOREIGN KEY (reqn_type_id)
    REFERENCES magnolia.reqn_type (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_reqn_user_id
    FOREIGN KEY (user_id)
    REFERENCES cenozo.user (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_reqn_special_fee_waiver_id
    FOREIGN KEY (special_fee_waiver_id)
    REFERENCES magnolia.special_fee_waiver (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;
