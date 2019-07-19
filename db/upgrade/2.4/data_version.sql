SELECT "Creating new data_version table" AS "";

CREATE TABLE IF NOT EXISTS data_version (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL,
  create_timestamp TIMESTAMP NOT NULL,
  name VARCHAR(127) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX uq_name (name ASC))
ENGINE = InnoDB;

INSERT IGNORE INTO data_version( name ) VALUES
( "Comprehensive Follow-up 1 v1.0" ),
( "Comprehensive Baseline v4.0" ),
( "Tracking Follow-up 1 v1.0" ),
( "Tracking Baseline v3.4" ),
( "Status" ),
( "CANUE" ),
( "GWAS" );
