SELECT "Creating new special_fee_waiver table" AS "";

CREATE TABLE IF NOT EXISTS special_fee_waiver (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL,
  create_timestamp TIMESTAMP NOT NULL,
  name VARCHAR(45) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX uq_name (name ASC))
ENGINE = InnoDB;
