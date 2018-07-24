SELECT "Creating new stage_type table" AS "";

CREATE TABLE IF NOT EXISTS stage_type (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL,
  create_timestamp TIMESTAMP NOT NULL,
  phase ENUM("new", "review", "agreement", "complete") NOT NULL,
  rank INT UNSIGNED NOT NULL,
  name VARCHAR(45) NOT NULL,
  status VARCHAR(45) NOT NULL,
  decision TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  UNIQUE INDEX uq_name (name ASC),
  UNIQUE INDEX uq_rank (rank ASC))
ENGINE = InnoDB;

INSERT IGNORE INTO stage_type( phase, rank, name, status, decision ) VALUES
( "new", 1, "New", "New", 0 ),
( "review", 2, "Admin Review", "Under Review", 0 ),
( "review", 3, "SAC Review", "Under Review", 0 ),
( "review", 4, "DSAC Selection", "Under Review", 1 ),
( "review", 5, "DSAC Review", "Under Review", 1 ),
( "review", 6, "SMT Decision", "Under Review", 1 ),
( "agreement", 7, "Approved", "Agreement in Preparation", 0 ),
( "agreement", 8, "Data Release", "Preparing Data", 0 ),
( "agreement", 9, "Active", "Active", 0 ),
( "agreement", 10, "Report Required", "Report Required", 0 ),
( "complete", 11, "Not Approved", "Not Approved", 0 ),
( "complete", 12, "Complete", "Complete", 0 );
