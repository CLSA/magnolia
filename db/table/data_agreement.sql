CREATE TABLE data_agreement (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  institution VARCHAR(127) NOT NULL,
  cross_institution_data_access TINYINT(1) NOT NULL DEFAULT 1,
  start_date DATE NOT NULL,
  end_date DATE NULL DEFAULT NULL,
  filename VARCHAR(255) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX uq_institution_start_date (institution ASC, start_date ASC))
ENGINE = InnoDB;
