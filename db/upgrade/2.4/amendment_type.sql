SELECT "Creating new amendment_type table" AS "";

CREATE TABLE IF NOT EXISTS amendment_type (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL,
  create_timestamp TIMESTAMP NOT NULL,
  reason_en VARCHAR(127) NOT NULL,
  reason_fr VARCHAR(127) NOT NULL,
  justification_prompt_en TEXT NULL DEFAULT NULL,
  justification_prompt_fr TEXT NULL DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX uq_reason_en (reason_en ASC),
  UNIQUE INDEX uq_reason_fr (reason_fr ASC))
ENGINE = InnoDB;

INSERT IGNORE INTO amendment_type( reason_en, reason_fr ) VALUES
( "Amendment to Primary Applicant Information", "Modification des informations sur le demandeur principal" ),
( "Changes to Co-Applicants and Support Personnel", "Modifications des codemandeurs et du personnel de soutien" ),
( "Changes to the Approved Project Title, Lay Summary and/or Objectives", "Modifications du titre, du résumé non scientifique et/ou des objectifs du projet approuvé" ),
( "Changes to the Project Timeline", "Modification de la chronologie du projet" ),
( "Changes to the Data Checklist.", "Modifications de la liste des données demandées" );
