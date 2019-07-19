SELECT "Creating new amendment_type table" AS "";

CREATE TABLE IF NOT EXISTS amendment_type (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL,
  create_timestamp TIMESTAMP NOT NULL,
  reason_en VARCHAR(255) NOT NULL,
  reason_fr VARCHAR(255) NOT NULL,
  PRIMARY KEY (id))
ENGINE = InnoDB;

INSERT IGNORE INTO amendment_type( reason_en, reason_fr ) VALUES
( "Amendment to Primary Applicant Information", "TRANSLATION REQUIRED" ),
( "Changes to Co-Applicants and Support Personnel", "TRANSLATION REQUIRED" ),
( "Changes to the Approved Project Title, Lay Summary and/or Objectives", "TRANSLATION REQUIRED" ),
( "Changes to the Project Timeline", "TRANSLATION REQUIRED" ),
( "Changes to the Data Checklist.", "TRANSLATION REQUIRED" );
