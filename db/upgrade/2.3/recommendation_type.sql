SELECT "Creating new recommendation_type table" AS "";

CREATE TABLE IF NOT EXISTS recommendation_type (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL,
  create_timestamp TIMESTAMP NOT NULL,
  name VARCHAR(45) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX uq_name (name ASC))
ENGINE = InnoDB;

INSERT IGNORE INTO recommendation_type( name )
VALUES( "Satisfactory" ), ( "Not Satisfactory" ), ( "Feasible" ), ( "Not Feasible" ), ( "Approved" ), ( "Revise" ), ( "Not Approved" );
