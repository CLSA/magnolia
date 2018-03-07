SELECT "Creating new stage_type table" AS "";

CREATE TABLE IF NOT EXISTS stage_type (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL,
  create_timestamp TIMESTAMP NOT NULL,
  phase ENUM("new", "review", "agreement", "complete") NOT NULL,
  rank INT UNSIGNED NOT NULL,
  name VARCHAR(45) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX uq_name (name ASC),
  UNIQUE INDEX uq_rank (rank ASC))
ENGINE = InnoDB;

INSERT IGNORE INTO stage_type( phase, rank, name ) VALUES
( "new", 1, "New" ),
( "review", 2, "Admin Review" ),
( "review", 3, "SAC Review" ),
( "review", 4, "DSAC Selection" ),
( "review", 5, "DSAC Review" ),
( "review", 6, "SMT Review" ),
( "review", 7, "Not Approved" ),
( "review", 8, "Conditionally Approved" ),
( "agreement", 9, "Approved" ),
( "agreement", 10, "Data Release" ),
( "agreement", 11, "Active" ),
( "agreement", 12, "Report Required" ),
( "complete", 13, "Complete" );
