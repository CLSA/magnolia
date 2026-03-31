CREATE TABLE manuscript_version (
  id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  manuscript_id INT(10) UNSIGNED NOT NULL,
  version INT(10) UNSIGNED NULL DEFAULT 1,
  authors VARCHAR(1023) NULL DEFAULT NULL,
  authors_check TINYINT(1) NULL DEFAULT NULL,
  date DATE NOT NULL,
  journal VARCHAR(511) NULL DEFAULT NULL,
  clsa_title TINYINT(1) NULL DEFAULT NULL,
  clsa_title_justification TEXT NULL DEFAULT NULL,
  clsa_keyword TINYINT(1) NULL DEFAULT NULL,
  clsa_keyword_justification TEXT NULL DEFAULT NULL,
  clsa_reference TINYINT(1) NULL DEFAULT NULL,
  clsa_reference_number VARCHAR(45) NULL DEFAULT NULL,
  clsa_reference_justification TEXT NULL DEFAULT NULL,
  genomics TINYINT(1) NULL DEFAULT NULL,
  genomics_number VARCHAR(45) NULL DEFAULT NULL,
  acknowledgment TEXT NULL DEFAULT NULL,
  dataset_version TINYINT(1) NULL DEFAULT NULL,
  trainee TINYINT(1) NULL DEFAULT NULL,
  seroprevalence TINYINT(1) NULL DEFAULT NULL,
  covid TINYINT(1) NULL DEFAULT NULL,
  disclaimer TINYINT(1) NULL DEFAULT NULL,
  disclaimer_justification TEXT NULL DEFAULT NULL,
  statement ENUM("yes", "no", "nr") NULL DEFAULT NULL,
  statement_justification TEXT NULL DEFAULT NULL,
  conditions TINYINT(1) NULL DEFAULT NULL,
  indigenous TINYINT(1) NULL DEFAULT NULL,
  objectives TEXT NULL DEFAULT NULL,
  PRIMARY KEY (id),
  INDEX fk_manuscript_id (manuscript_id ASC),
  CONSTRAINT fk_manuscript_version_manuscript_id
    FOREIGN KEY (manuscript_id)
    REFERENCES magnolia.manuscript (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;
