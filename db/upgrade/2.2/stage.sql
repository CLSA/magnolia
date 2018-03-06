SELECT "Creating new stage table" AS "";

CREATE TABLE IF NOT EXISTS stage (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL,
  create_timestamp TIMESTAMP NOT NULL,
  phase ENUM("new", "review", "agreement", "complete") NOT NULL,
  rank INT UNSIGNED NOT NULL,
  name VARCHAR(45) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX uq_name (name ASC),
  UNIQUE INDEX uq_phase_rank (phase ASC, rank ASC))
ENGINE = InnoDB;

INSERT IGNORE INTO stage( phase, rank, name ) VALUES
( "new", 1, "New" ),
( "review", 1, "Admin Review" ),
( "review", 2, "SAC Review" ),
( "review", 3, "DSAC Selection" ),
( "review", 4, "DSAC Review" ),
( "review", 5, "SMT Review" ),
( "review", 6, "Not Approved" ),
( "review", 7, "Conditionally Approved" ),
( "agreement", 1, "Approved" ),
( "agreement", 2, "Data Release" ),
( "agreement", 3, "Active" ),
( "agreement", 4, "Report Required" ),
( "complete", 1, "Complete" );
