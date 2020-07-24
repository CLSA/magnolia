SELECT "Creating new publication table" AS "";

CREATE TABLE IF NOT EXISTS publication (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL,
  create_timestamp TIMESTAMP NOT NULL,
  reqn_id INT UNSIGNED NOT NULL,
  filename VARCHAR(255) NOT NULL,
  reference VARCHAR(512) NULL,
  PRIMARY KEY (id),
  INDEX fk_reqn_id1_idx (reqn_id ASC),
  CONSTRAINT fk_reqn_id1
    FOREIGN KEY (reqn_id)
    REFERENCES reqn (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;
