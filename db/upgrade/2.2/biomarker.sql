SELECT "Creating new biomarker table" AS "";

CREATE TABLE IF NOT EXISTS biomarker (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL,
  create_timestamp TIMESTAMP NOT NULL,
  rank INT NOT NULL,
  name VARCHAR(45) NOT NULL,
  note VARCHAR(1023) NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX uq_rank (rank ASC))
ENGINE = InnoDB;

INSERT IGNORE INTO biomarker( rank, name, note ) VALUES
( 1, "White blood cells", NULL ),
( 2, "Lymphocytes (relative number)", NULL ),
( 3, "Monocytes (relative number)", NULL ),
( 4, "Granulocytes (relative number)", NULL ),
( 5, "Lymphocytes (absolute number)", NULL ),
( 6, "Monocytes (absolute number)", NULL ),
( 7, "Granulocytes (absolute number)", NULL ),
( 8, "Red blood cells", NULL ),
( 9, "Hemoglobin", NULL ),
( 10, "Hematocrit", NULL ),
( 11, "Mean corpuscular volume", NULL ),
( 12, "Mean corpuscular hemoglobin", NULL ),
( 13, "Mean corpuscular hemoglobin concentration", NULL ),
( 14, "Red blood cell distribution width", NULL ),
( 15, "Platelets", NULL ),
( 16, "Mean platelet volume", NULL );
