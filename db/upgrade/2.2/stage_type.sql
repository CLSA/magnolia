SELECT "Creating new stage_type table" AS "";

CREATE TABLE IF NOT EXISTS stage_type (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL,
  create_timestamp TIMESTAMP NOT NULL,
  phase ENUM("new", "review", "agreement", "complete") NOT NULL,
  rank INT UNSIGNED NOT NULL,
  name VARCHAR(45) NOT NULL,
  status VARCHAR(45) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX uq_name (name ASC),
  UNIQUE INDEX uq_rank (rank ASC))
ENGINE = InnoDB;

INSERT IGNORE INTO stage_type( phase, rank, name, status ) VALUES
( "New", 1, "New", "New" ),
( "Review", 2, "Admin Review", "Under Review" ),
( "Review", 3, "SAC Review", "Under Review" ),
( "Review", 4, "DSAC Selection", "Under Review" ),
( "Review", 5, "DSAC Review", "Under Review" ),
( "Review", 6, "DSAC Decision", "Under Review" ),
( "Review", 7, "SMT Review", "Under Review" ),
( "Review", 8, "Not Approved", "Notice of Decision" ),
( "Review", 9, "Revise and Resubmit", "Notice of Decision" ),
( "Agreement", 10, "Approved", "Agreement in Preparation" ),
( "Agreement", 11, "Data Release", "Preparing Data" ),
( "Agreement", 12, "Active", "Active" ),
( "Agreement", 13, "Report Required", "Report Required" ),
( "Complete", 14, "Complete", "Complete" );
