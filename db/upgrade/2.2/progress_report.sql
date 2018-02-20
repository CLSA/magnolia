SELECT "Creating new progress_report table" AS "";

CREATE TABLE IF NOT EXISTS progress_report (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL,
  create_timestamp TIMESTAMP NOT NULL,
  requisition_id INT UNSIGNED NOT NULL,
  type ENUM('annual', 'final') NOT NULL,
  accomplished VARCHAR(45) NULL,
  thesis_title VARCHAR(45) NULL,
  thesis_status VARCHAR(45) NULL,
  date DATE NULL,
  PRIMARY KEY (id),
  INDEX fk_requisition_id (requisition_id ASC),
  UNIQUE INDEX uq_requisition_id_type (requisition_id ASC, type ASC),
  CONSTRAINT fk_progress_report_requisition_id
    FOREIGN KEY (requisition_id)
    REFERENCES requisition (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;
