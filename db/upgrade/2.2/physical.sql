SELECT "Creating new physical table" AS "";

CREATE TABLE IF NOT EXISTS physical (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL,
  create_timestamp TIMESTAMP NOT NULL,
  rank INT NOT NULL,
  assessment VARCHAR(45) NOT NULL,
  subcategory VARCHAR(45) NULL,
  type ENUM('data', 'image') NOT NULL,
  replacement VARCHAR(45) NULL,
  note VARCHAR(1023) NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX uq_rank (rank ASC))
ENGINE = InnoDB;
