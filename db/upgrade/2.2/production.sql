SELECT "Creating new production table" AS "";

CREATE TABLE IF NOT EXISTS production (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL,
  create_timestamp TIMESTAMP NOT NULL,
  progress_report_id INT UNSIGNED NOT NULL,
  production_type_id INT UNSIGNED NOT NULL,
  rank INT UNSIGNED NOT NULL,
  detail VARCHAR(1023) NOT NULL,
  PRIMARY KEY (id),
  INDEX fk_progress_report_id (progress_report_id ASC),
  INDEX fk_production_type_id (production_type_id ASC),
  UNIQUE INDEX uq_progress_report_id_production_type_id_rank (progress_report_id ASC, production_type_id ASC, rank ASC),
  CONSTRAINT fk_production_progress_report_id
    FOREIGN KEY (progress_report_id)
    REFERENCES progress_report (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_production_type_id1
    FOREIGN KEY (production_type_id)
    REFERENCES production_type (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;
