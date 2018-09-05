SELECT "Creating new production table" AS "";

CREATE TABLE IF NOT EXISTS production (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL,
  create_timestamp TIMESTAMP NOT NULL,
  final_report_id INT UNSIGNED NOT NULL,
  production_type_id INT UNSIGNED NOT NULL,
  detail VARCHAR(1023) NOT NULL,
  filename VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (id),
  INDEX fk_final_report_id (final_report_id ASC),
  INDEX fk_production_type_id (production_type_id ASC),
  CONSTRAINT fk_production_final_report_id
    FOREIGN KEY (final_report_id)
    REFERENCES final_report (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_production_type_id1
    FOREIGN KEY (production_type_id)
    REFERENCES production_type (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;
