SELECT "Creating new requisition_last_stage table" AS "";

CREATE TABLE IF NOT EXISTS requisition_last_stage (
  requisition_id INT UNSIGNED NOT NULL,
  stage_id INT UNSIGNED NOT NULL,
  update_timestamp TIMESTAMP NOT NULL,
  create_timestamp TIMESTAMP NOT NULL,
  PRIMARY KEY (requisition_id),
  INDEX fk_stage_id (stage_id ASC),
  CONSTRAINT fk_requisition_last_stage_requisition_id
    FOREIGN KEY (requisition_id)
    REFERENCES requisition (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_requisition_last_stage_stage_id
    FOREIGN KEY (stage_id)
    REFERENCES stage (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;
