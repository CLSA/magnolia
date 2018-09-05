SELECT "Creating new final_report table" AS "";

CREATE TABLE IF NOT EXISTS final_report (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL,
  create_timestamp TIMESTAMP NOT NULL,
  reqn_id INT UNSIGNED NOT NULL,
  date DATE NOT NULL,
  activities TEXT NULL DEFAULT NULL,
  findings TEXT NULL DEFAULT NULL,
  outcomes TEXT NULL DEFAULT NULL,
  thesis_title TEXT NULL DEFAULT NULL,
  thesis_status TEXT NULL DEFAULT NULL,
  impact TEXT NULL DEFAULT NULL,
  opportunities TEXT NULL DEFAULT NULL,
  dissemination TEXT NULL DEFAULT NULL,
  PRIMARY KEY (id),
  INDEX fk_reqn_id (reqn_id ASC),
  UNIQUE INDEX uq_reqn_id (reqn_id ASC),
  CONSTRAINT fk_final_report_reqn_id
    FOREIGN KEY (reqn_id)
    REFERENCES reqn (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;
