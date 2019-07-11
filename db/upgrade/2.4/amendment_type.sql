SELECT "Creating new amendment_type table" AS "";

CREATE TABLE IF NOT EXISTS amendment_type (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL,
  create_timestamp TIMESTAMP NOT NULL,
  reason_en VARCHAR(255) NOT NULL,
  reason_fr VARCHAR(255) NOT NULL,
  PRIMARY KEY (id))
ENGINE = InnoDB;
