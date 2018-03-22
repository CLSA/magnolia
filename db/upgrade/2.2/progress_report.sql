SELECT "Creating new progress_report table" AS "";

CREATE TABLE IF NOT EXISTS progress_report (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL,
  create_timestamp TIMESTAMP NOT NULL,
  reqn_id INT UNSIGNED NOT NULL,
  type ENUM('annual', 'final') NOT NULL,
  thesis_title VARCHAR(511) NULL,
  thesis_status VARCHAR(127) NULL,
  activities TEXT NULL,
  findings TEXT NULL,
  outcomes TEXT NULL,
  date DATE NULL,
  PRIMARY KEY (id),
  INDEX fk_reqn_id (reqn_id ASC),
  UNIQUE INDEX uq_reqn_id_type (reqn_id ASC, type ASC),
  CONSTRAINT fk_progress_report_reqn_id
    FOREIGN KEY (reqn_id)
    REFERENCES reqn (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;
