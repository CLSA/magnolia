SELECT "Creating new output_source table" AS "";

CREATE TABLE IF NOT EXISTS output_source (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL,
  create_timestamp TIMESTAMP NOT NULL,
  output_id INT(10) UNSIGNED NOT NULL,
  filename VARCHAR(255) NULL DEFAULT NULL,
  url VARCHAR(1023) NULL DEFAULT NULL,
  PRIMARY KEY (id),
  INDEX fk_output_id (output_id ASC),
  CONSTRAINT fk_output_source_output_id
    FOREIGN KEY (output_id)
    REFERENCES output (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;
