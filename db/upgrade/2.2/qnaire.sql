SELECT "Creating new qnaire table" AS "";

CREATE TABLE IF NOT EXISTS qnaire (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL,
  create_timestamp TIMESTAMP NOT NULL,
  section ENUM('baseline', 'mcq') NOT NULL,
  rank INT UNSIGNED NOT NULL,
  category VARCHAR(45) NULL,
  name VARCHAR(45) NOT NULL,
  cohort ENUM('comprehensive', 'tracking') NOT NULL,
  replacement VARCHAR(45) NULL,
  note VARCHAR(1023) NULL,
  PRIMARY KEY (id),
  INDEX uq_section_rank (section ASC, rank ASC))
ENGINE = InnoDB;
