SELECT "Creating new additional_fee table" AS "";

CREATE TABLE IF NOT EXISTS additional_fee (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL,
  create_timestamp TIMESTAMP NOT NULL,
  name VARCHAR(255) NOT NULL,
  cost INT UNSIGNED NOT NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX uq_name (name ASC))
ENGINE = InnoDB;
