SELECT "Creating new stage_type table" AS "";

CREATE TABLE IF NOT EXISTS stage_type (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL,
  create_timestamp TIMESTAMP NOT NULL,
  phase ENUM("new", "review", "agreement", "complete") NOT NULL,
  rank INT UNSIGNED NOT NULL,
  name VARCHAR(45) NOT NULL,
  preperation_required TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  UNIQUE INDEX uq_name (name ASC),
  UNIQUE INDEX uq_rank (rank ASC))
ENGINE = InnoDB;

INSERT IGNORE INTO stage_type( phase, rank, name, preperation_required ) VALUES
( "new", 1, "New", 0 ),
( "review", 2, "Admin Review", 0 ),
( "review", 3, "SAC Review", 0 ),
( "review", 4, "DSAC Selection", 1 ),
( "review", 5, "DSAC Review", 1 ),
( "review", 6, "SMT Review", 1 ),
( "review", 7, "Not Approved", 0 ),
( "review", 8, "Conditionally Approved", 0 ),
( "agreement", 9, "Approved", 1 ),
( "agreement", 10, "Data Release", 0 ),
( "agreement", 11, "Active", 0 ),
( "agreement", 12, "Report Required", 0 ),
( "complete", 13, "Complete", 0 );
