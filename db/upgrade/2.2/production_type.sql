SELECT "Creating new production_type table" AS "";

CREATE TABLE IF NOT EXISTS production_type (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL,
  create_timestamp TIMESTAMP NOT NULL,
  name VARCHAR(45) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX uq_name (name ASC))
ENGINE = InnoDB;

INSERT IGNORE INTO production_type( name ) VALUES
( "publication" ),
( "conference" ),
( "mass media" ),
( "technology" ),
( "invention" ),
( "data" ),
( "collaboration" );
