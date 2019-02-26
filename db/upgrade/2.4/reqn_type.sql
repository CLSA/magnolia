SELECT "Creating new reqn_type table" AS "";

CREATE TABLE IF NOT EXISTS reqn_type (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL,
  create_timestamp TIMESTAMP NOT NULL,
  name VARCHAR(45) NOT NULL,
  available TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  UNIQUE INDEX uq_name (name ASC))
ENGINE = InnoDB;

INSERT IGNORE INTO reqn_type( name, available ) VALUES
( "Catalyst Grant", 0 ),
( "Consortium", 0 ),
( "Internal", 1 ),
( "Methods", 0 ),
( "Partnership", 0 ),
( "Special Project", 0 ),
( "Standard", 1 );
