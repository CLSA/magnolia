SELECT "Creating new reference table" AS "";

CREATE TABLE IF NOT EXISTS reference (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL,
  create_timestamp TIMESTAMP NOT NULL,
  reqn_id INT UNSIGNED NOT NULL,
  rank INT UNSIGNED NOT NULL,
  reference VARCHAR(512) NOT NULL,
  PRIMARY KEY (id),
  INDEX fk_reqn_id (reqn_id ASC),
  UNIQUE INDEX uq_reqn_id_rank (reqn_id ASC, rank ASC),
  CONSTRAINT fk_reference_reqn_id
    FOREIGN KEY (reqn_id)
    REFERENCES reqn (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;
