SELECT "Creating new deadline table" AS "";

CREATE TABLE IF NOT EXISTS deadline (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL,
  create_timestamp TIMESTAMP NOT NULL,
  name VARCHAR(45) NOT NULL,
  date DATE NOT NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX uq_date (date ASC),
  UNIQUE INDEX uq_name (name ASC))
ENGINE = InnoDB;
