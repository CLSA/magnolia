SELECT "Creating new requisition_has_physical table" AS "";

CREATE TABLE IF NOT EXISTS requisition_has_physical (
  requisition_id INT UNSIGNED NOT NULL,
  physical_id INT UNSIGNED NOT NULL,
  update_timestamp TIMESTAMP NOT NULL,
  create_timestamp TIMESTAMP NOT NULL,
  value TINYINT(1) NOT NULL,
  PRIMARY KEY (requisition_id, physical_id),
  INDEX fk_physical_id (physical_id ASC),
  INDEX fk_requisition_id (requisition_id ASC),
  CONSTRAINT fk_requisition_has_physical_requisition_id
    FOREIGN KEY (requisition_id)
    REFERENCES requisition (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_requisition_has_physical_physical_id
    FOREIGN KEY (physical_id)
    REFERENCES physical (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;
