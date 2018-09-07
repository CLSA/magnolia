SELECT "Creating new pdf_form_type table" AS "";

CREATE TABLE IF NOT EXISTS pdf_form_type (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL,
  create_timestamp TIMESTAMP NOT NULL,
  name VARCHAR(45) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX uq_name (name ASC))
ENGINE = InnoDB;

INSERT IGNORE INTO pdf_form_type( name )
VALUES( "Data Application" ), ( "Data Checklist" ), ( "Final Report" );
