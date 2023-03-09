SELECT "Creating new data_agreement table" AS "";

CREATE TABLE IF NOT EXISTS data_agreement (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL,
  create_timestamp TIMESTAMP NOT NULL,
  institution VARCHAR(127) NOT NULL,
  version DATE NOT NULL,
  filename VARCHAR(255) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX uq_institution_version (institution ASC, version ASC))
ENGINE = InnoDB;
