SELECT "Creating new requisition_has_qnaire table" AS "";

CREATE TABLE IF NOT EXISTS requisition_has_qnaire (
  requisition_id INT UNSIGNED NOT NULL,
  qnaire_id INT UNSIGNED NOT NULL,
  update_timestamp TIMESTAMP NOT NULL,
  create_timestamp TIMESTAMP NOT NULL,
  value TINYINT(1) NOT NULL,
  PRIMARY KEY (requisition_id, qnaire_id),
  INDEX fk_qnaire_id (qnaire_id ASC),
  INDEX fk_requisition_id (requisition_id ASC),
  CONSTRAINT fk_requisition_has_qnaire_requisition_id
    FOREIGN KEY (requisition_id)
    REFERENCES requisition (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_requisition_has_qnaire_qnaire_id
    FOREIGN KEY (qnaire_id)
    REFERENCES qnaire (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;
