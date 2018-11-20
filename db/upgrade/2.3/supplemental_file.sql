SELECT "Creating new supplemental_file table" AS "";

CREATE TABLE IF NOT EXISTS supplemental_file (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL,
  create_timestamp TIMESTAMP NOT NULL,
  name_en VARCHAR(127) NOT NULL,
  name_fr VARCHAR(127) NOT NULL,
  filename_en VARCHAR(255) NULL,
  filename_fr VARCHAR(255) NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX uq_name_en (name_en ASC),
  UNIQUE INDEX uq_name_fr (name_fr ASC))
ENGINE = InnoDB;
