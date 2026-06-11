CREATE TABLE reqn_version (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  new_user_id int(10) unsigned DEFAULT NULL,
  new_trainee_user_id int(10) unsigned DEFAULT NULL,
  amendment_id int(10) unsigned NOT NULL,
  version int(10) unsigned NOT NULL DEFAULT 1,
  datetime datetime NOT NULL,
  applicant_position varchar(255) DEFAULT NULL,
  applicant_early_career tinyint(1) DEFAULT NULL,
  applicant_affiliation varchar(255) DEFAULT NULL,
  applicant_address varchar(511) DEFAULT NULL,
  applicant_country_id int(10) unsigned DEFAULT NULL,
  applicant_phone varchar(45) DEFAULT NULL,
  trainee_program varchar(255) DEFAULT NULL,
  trainee_institution varchar(255) DEFAULT NULL,
  trainee_address varchar(511) DEFAULT NULL,
  trainee_country_id int(10) unsigned DEFAULT NULL,
  trainee_phone varchar(45) DEFAULT NULL,
  coapplicant_agreement_filename varchar(255) DEFAULT NULL,
  start_date date DEFAULT NULL,
  duration enum('2 years','3 years','2 years + 1 additional year','2 years + 2 additional years','2 years + 3 additional years','3 years + 1 additional year','3 years + 2 additional years','3 years + 3 additional years') DEFAULT NULL,
  title varchar(511) DEFAULT NULL,
  keywords varchar(255) DEFAULT NULL,
  lay_summary varchar(2047) DEFAULT NULL,
  background text DEFAULT NULL,
  objectives text DEFAULT NULL,
  methodology text DEFAULT NULL,
  analysis text DEFAULT NULL,
  peer_review tinyint(1) DEFAULT NULL,
  peer_review_filename varchar(255) DEFAULT NULL,
  funding enum('yes','no','requested') DEFAULT NULL,
  funding_filename varchar(255) DEFAULT NULL,
  funding_agency varchar(255) DEFAULT NULL,
  grant_number varchar(45) DEFAULT NULL,
  ethics enum('yes','no','exempt') DEFAULT NULL,
  ethics_date date DEFAULT NULL,
  ethics_filename varchar(255) DEFAULT NULL,
  trainee_project tinyint(1) DEFAULT NULL,
  waiver enum('graduate','postdoc','clinical','none') DEFAULT NULL,
  comprehensive tinyint(1) DEFAULT NULL,
  tracking tinyint(1) DEFAULT NULL,
  longitudinal tinyint(1) DEFAULT NULL,
  last_identifier char(10) DEFAULT NULL,
  indigenous_first_nation tinyint(1) DEFAULT NULL,
  indigenous_metis tinyint(1) DEFAULT NULL,
  indigenous_inuit tinyint(1) DEFAULT NULL,
  indigenous_description text DEFAULT NULL,
  indigenous1_filename varchar(255) DEFAULT NULL,
  indigenous2_filename varchar(255) DEFAULT NULL,
  indigenous3_filename varchar(255) DEFAULT NULL,
  indigenous4_filename varchar(255) DEFAULT NULL,
  data_sharing_filename varchar(255) DEFAULT NULL,
  agreement_filename varchar(255) DEFAULT NULL,
  agreement_start_date date DEFAULT NULL,
  agreement_end_date date DEFAULT NULL,
  data_agreement_id int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_amendment_id_version (amendment_id,version),
  KEY fk_new_user_id (new_user_id),
  KEY fk_applicant_country_id (applicant_country_id),
  KEY fk_trainee_country_id (trainee_country_id),
  KEY fk_data_agreement_id (data_agreement_id),
  KEY fk_new_trainee_user_id (new_trainee_user_id),
  KEY fk_amendment_id (amendment_id),
  CONSTRAINT fk_reqn_version_amendment_id
    FOREIGN KEY (amendment_id)
    REFERENCES amendment (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_reqn_version_applicant_country_id
    FOREIGN KEY (applicant_country_id)
    REFERENCES cenozo_mg.country (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_reqn_version_data_agreement_id
    FOREIGN KEY (data_agreement_id)
    REFERENCES data_agreement (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_reqn_version_new_trainee_user_id
    FOREIGN KEY (new_trainee_user_id)
    REFERENCES cenozo_mg.user (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_reqn_version_new_user_id
    FOREIGN KEY (new_user_id)
    REFERENCES cenozo_mg.user (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_reqn_version_trainee_country_id
    FOREIGN KEY (trainee_country_id)
    REFERENCES cenozo_mg.country (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;