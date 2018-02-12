SELECT "Creating new coapplicant table" AS "";

CREATE TABLE IF NOT EXISTS coapplicant (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL,
  create_timestamp TIMESTAMP NOT NULL,
  requisition_id INT UNSIGNED NOT NULL,
  name VARCHAR(255) NOT NULL,
  position VARCHAR(255) NOT NULL,
  affiliation VARCHAR(255) NOT NULL,
  email VARCHAR(127) NOT NULL,
  role VARCHAR(45) NOT NULL,
  access TINYINT(1) NOT NULL,
  PRIMARY KEY (id),
  INDEX fk_requisition_id (requisition_id ASC),
  CONSTRAINT fk_coapplicant_requisition_id
    FOREIGN KEY (requisition_id)
    REFERENCES requisition (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;
