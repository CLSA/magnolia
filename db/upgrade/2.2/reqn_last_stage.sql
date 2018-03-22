SELECT "Creating new reqn_last_stage table" AS "";

CREATE TABLE IF NOT EXISTS reqn_last_stage (
  reqn_id INT UNSIGNED NOT NULL,
  stage_id INT UNSIGNED NULL DEFAULT NULL,
  update_timestamp TIMESTAMP NOT NULL,
  create_timestamp TIMESTAMP NOT NULL,
  PRIMARY KEY (reqn_id),
  INDEX fk_stage_id (stage_id ASC),
  CONSTRAINT fk_reqn_last_stage_reqn_id
    FOREIGN KEY (reqn_id)
    REFERENCES reqn (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_reqn_last_stage_stage_id
    FOREIGN KEY (stage_id)
    REFERENCES stage (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;
