SELECT "Creating new reference table" AS "";

CREATE TABLE IF NOT EXISTS reference (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL,
  create_timestamp TIMESTAMP NOT NULL,
  requisition_id INT UNSIGNED NOT NULL,
  rank INT UNSIGNED NOT NULL,
  reference VARCHAR(512) NOT NULL,
  PRIMARY KEY (id),
  INDEX fk_requisition_id (requisition_id ASC),
  UNIQUE INDEX uq_requisition_id_rank (requisition_id ASC, rank ASC),
  UNIQUE INDEX uq_requisition_id_reference (requisition_id ASC, reference ASC),
  CONSTRAINT fk_reference_requisition_id
    FOREIGN KEY (requisition_id)
    REFERENCES requisition (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;
