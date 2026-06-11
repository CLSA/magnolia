CREATE TABLE manuscript_version (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  manuscript_id int(10) unsigned NOT NULL,
  version int(10) unsigned DEFAULT 1,
  authors varchar(1023) DEFAULT NULL,
  authors_check tinyint(1) DEFAULT NULL,
  date date NOT NULL,
  journal varchar(511) DEFAULT NULL,
  clsa_title tinyint(1) DEFAULT NULL,
  clsa_title_justification text DEFAULT NULL,
  clsa_keyword tinyint(1) DEFAULT NULL,
  clsa_keyword_justification text DEFAULT NULL,
  clsa_reference tinyint(1) DEFAULT NULL,
  clsa_reference_number varchar(45) DEFAULT NULL,
  clsa_reference_justification text DEFAULT NULL,
  genomics tinyint(1) DEFAULT NULL,
  genomics_number varchar(45) DEFAULT NULL,
  acknowledgment text DEFAULT NULL,
  dataset_version tinyint(1) DEFAULT NULL,
  trainee tinyint(1) DEFAULT NULL,
  seroprevalence tinyint(1) DEFAULT NULL,
  covid tinyint(1) DEFAULT NULL,
  disclaimer tinyint(1) DEFAULT NULL,
  disclaimer_justification text DEFAULT NULL,
  statement enum('yes','no','nr') DEFAULT NULL,
  statement_justification text DEFAULT NULL,
  conditions tinyint(1) DEFAULT NULL,
  indigenous tinyint(1) DEFAULT NULL,
  objectives text DEFAULT NULL,
  PRIMARY KEY (id),
  KEY fk_manuscript_id (manuscript_id),
  CONSTRAINT fk_manuscript_version_manuscript_id
    FOREIGN KEY (manuscript_id)
    REFERENCES manuscript (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;