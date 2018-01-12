SELECT "Creating new requisition_has_biomarker table" AS "";

CREATE TABLE IF NOT EXISTS requisition_has_biomarker (
  requisition_id INT UNSIGNED NOT NULL,
  biomarker_id INT UNSIGNED NOT NULL,
  update_timestamp TIMESTAMP NOT NULL,
  create_timestamp TIMESTAMP NOT NULL,
  value TINYINT(1) NOT NULL,
  PRIMARY KEY (requisition_id, biomarker_id),
  INDEX fk_biomarker_id (biomarker_id ASC),
  INDEX fk_requisition_id (requisition_id ASC),
  CONSTRAINT fk_requisition_has_biomarker_requisition_id
    FOREIGN KEY (requisition_id)
    REFERENCES requisition (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_requisition_has_biomarker_biomarker_id
    FOREIGN KEY (biomarker_id)
    REFERENCES biomarker (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;
