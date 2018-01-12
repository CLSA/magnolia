SELECT "Creating new biomarker table" AS "";

CREATE TABLE IF NOT EXISTS biomarker (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL,
  create_timestamp TIMESTAMP NOT NULL,
  rank INT NOT NULL,
  name VARCHAR(45) NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX uq_rank (rank ASC))
ENGINE = InnoDB;
