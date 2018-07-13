SELECT "Creating new review_type table" AS "";

CREATE TABLE IF NOT EXISTS review_type (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL,
  create_timestamp TIMESTAMP NOT NULL,
  name VARCHAR(45) NOT NULL,
  stage_type_id INT UNSIGNED NOT NULL,
  PRIMARY KEY (id),
  INDEX fk_stage_type_id (stage_type_id ASC),
  UNIQUE INDEX uq_name (name ASC),
  CONSTRAINT fk_review_type_stage_type_id
    FOREIGN KEY (stage_type_id)
    REFERENCES stage_type (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

INSERT IGNORE INTO review_type( name, stage_type_id )
SELECT "Admin", id FROM stage_type WHERE name = "Admin Review" UNION
SELECT "SAC", id FROM stage_type WHERE name = "SAC Review" UNION
SELECT "Reviewer 1", id FROM stage_type WHERE name = "DSAC Selection" UNION
SELECT "Reviewer 2", id FROM stage_type WHERE name = "DSAC Selection" UNION
SELECT "Chair", id FROM stage_type WHERE name = "DSAC Decision" UNION
SELECT "SMT", id FROM stage_type WHERE name = "SMT Decision";
