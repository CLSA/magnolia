CREATE TABLE applicant (
  id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  user_id INT(10) UNSIGNED NOT NULL,
  supervisor_user_id INT(10) UNSIGNED NULL DEFAULT NULL,
  suspended TINYINT(1) NOT NULL DEFAULT 0,
  newsletter TINYINT(1) NOT NULL DEFAULT 0,
  note TEXT NULL DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX uq_user_id (user_id ASC),
  INDEX fk_user_id (user_id ASC),
  INDEX fk_supervisor_user_id (supervisor_user_id ASC),
  CONSTRAINT fk_applicant_supervisor_user_id
    FOREIGN KEY (supervisor_user_id)
    REFERENCES cenozo.user (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT fk_applicant_user_id
    FOREIGN KEY (user_id)
    REFERENCES cenozo.user (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;
