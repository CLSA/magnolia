SELECT "Creating new coapplicant table" AS "";

CREATE TABLE IF NOT EXISTS coapplicant (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL,
  create_timestamp TIMESTAMP NOT NULL,
  reqn_id INT UNSIGNED NOT NULL,
  name VARCHAR(63) NOT NULL,
  position VARCHAR(255) NOT NULL,
  affiliation VARCHAR(255) NOT NULL,
  email VARCHAR(127) NOT NULL,
  role VARCHAR(45) NOT NULL,
  access TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  INDEX fk_reqn_id (reqn_id ASC),
  UNIQUE INDEX uq_reqn_id_name (reqn_id ASC, name ASC),
  CONSTRAINT fk_coapplicant_reqn_id
    FOREIGN KEY (reqn_id)
    REFERENCES reqn (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;
