SELECT "Creating new keyword table" AS "";

CREATE TABLE IF NOT EXISTS keyword (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL,
  create_timestamp TIMESTAMP NOT NULL,
  requisition_id INT UNSIGNED NOT NULL,
  word VARCHAR(45) NOT NULL,
  PRIMARY KEY (id),
  INDEX fk_requisition_id (requisition_id ASC),
  UNIQUE INDEX uq_requisition_id_word (requisition_id ASC, word ASC),
  CONSTRAINT fk_keyword_requisition_id
    FOREIGN KEY (requisition_id)
    REFERENCES requisition (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;
