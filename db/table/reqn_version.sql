CREATE TABLE reqn_version (
  id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  amendment_id INT(10) UNSIGNED NOT NULL,
  new_user_id INT(10) UNSIGNED NULL DEFAULT NULL,
  new_trainee_user_id INT(10) UNSIGNED NULL DEFAULT NULL,
  version INT(10) UNSIGNED NOT NULL DEFAULT 1,
  datetime DATETIME NOT NULL,
  applicant_position VARCHAR(255) NULL DEFAULT NULL,
  applicant_early_career TINYINT(1) NULL DEFAULT NULL,
  applicant_affiliation VARCHAR(255) NULL DEFAULT NULL,
  applicant_address VARCHAR(511) NULL DEFAULT NULL,
  applicant_country_id INT(10) UNSIGNED NULL DEFAULT NULL,
  applicant_phone VARCHAR(45) NULL DEFAULT NULL,
  trainee_program VARCHAR(255) NULL DEFAULT NULL,
  trainee_institution VARCHAR(255) NULL DEFAULT NULL,
  trainee_address VARCHAR(511) NULL DEFAULT NULL,
  trainee_country_id INT(10) UNSIGNED NULL DEFAULT NULL,
  trainee_phone VARCHAR(45) NULL DEFAULT NULL,
  coapplicant_agreement_filename VARCHAR(255) NULL DEFAULT NULL,
  start_date DATE NULL DEFAULT NULL,
  duration ENUM('2 years', '3 years', '2 years + 1 additional year', '2 years + 2 additional years', '2 years + 3 additional years', '3 years + 1 additional year', '3 years + 2 additional years', '3 years + 3 additional years') NULL DEFAULT NULL,
  title VARCHAR(511) NULL DEFAULT NULL,
  keywords VARCHAR(255) NULL DEFAULT NULL,
  lay_summary VARCHAR(2047) NULL DEFAULT NULL,
  background TEXT NULL DEFAULT NULL,
  objectives TEXT NULL DEFAULT NULL,
  methodology TEXT NULL DEFAULT NULL,
  analysis TEXT NULL DEFAULT NULL,
  peer_review TINYINT(1) NULL DEFAULT NULL,
  peer_review_filename VARCHAR(255) NULL DEFAULT NULL,
  funding ENUM('yes', 'no', 'requested') NULL DEFAULT NULL,
  funding_filename VARCHAR(255) NULL DEFAULT NULL,
  funding_agency VARCHAR(255) NULL DEFAULT NULL,
  grant_number VARCHAR(45) NULL DEFAULT NULL,
  ethics ENUM('yes', 'no', 'exempt') NULL DEFAULT NULL,
  ethics_date DATE NULL DEFAULT NULL,
  ethics_filename VARCHAR(255) NULL DEFAULT NULL,
  trainee_project TINYINT(1) NULL DEFAULT NULL,
  waiver ENUM('graduate', 'postdoc', 'clinical', 'none') NULL DEFAULT NULL,
  comprehensive TINYINT(1) NULL DEFAULT NULL,
  tracking TINYINT(1) NULL DEFAULT NULL,
  longitudinal TINYINT(1) NULL DEFAULT NULL,
  last_identifier CHAR(10) NULL DEFAULT NULL,
  indigenous_first_nation TINYINT(1) NULL DEFAULT NULL,
  indigenous_metis TINYINT(1) NULL DEFAULT NULL,
  indigenous_inuit TINYINT(1) NULL DEFAULT NULL,
  indigenous_description TEXT NULL DEFAULT NULL,
  indigenous1_filename VARCHAR(255) NULL DEFAULT NULL,
  indigenous2_filename VARCHAR(255) NULL DEFAULT NULL,
  indigenous3_filename VARCHAR(255) NULL DEFAULT NULL,
  indigenous4_filename VARCHAR(255) NULL DEFAULT NULL,
  data_sharing_filename VARCHAR(255) NULL DEFAULT NULL,
  agreement_filename VARCHAR(255) NULL DEFAULT NULL,
  agreement_start_date DATE NULL DEFAULT NULL,
  agreement_end_date DATE NULL DEFAULT NULL,
  data_agreement_id INT UNSIGNED NULL DEFAULT NULL,
  PRIMARY KEY (id),
  INDEX fk_new_user_id (new_user_id ASC),
  INDEX fk_applicant_country_id (applicant_country_id ASC),
  INDEX fk_trainee_country_id (trainee_country_id ASC),
  INDEX fk_data_agreement_id (data_agreement_id ASC),
  INDEX fk_new_trainee_user_id (new_trainee_user_id ASC),
  INDEX fk_amendment_id (amendment_id ASC),
  UNIQUE INDEX uq_amendment_id_version (amendment_id ASC, version ASC),
  CONSTRAINT fk_reqn_version_applicant_country_id
    FOREIGN KEY (applicant_country_id)
    REFERENCES cenozo.country (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_reqn_version_new_user_id
    FOREIGN KEY (new_user_id)
    REFERENCES cenozo.user (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_reqn_version_trainee_country_id
    FOREIGN KEY (trainee_country_id)
    REFERENCES cenozo.country (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_reqn_version_data_agreement_id
    FOREIGN KEY (data_agreement_id)
    REFERENCES magnolia.data_agreement (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_reqn_version_new_trainee_user_id
    FOREIGN KEY (new_trainee_user_id)
    REFERENCES cenozo.user (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_reqn_version_amendment_id
    FOREIGN KEY (amendment_id)
    REFERENCES magnolia.amendment (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;
