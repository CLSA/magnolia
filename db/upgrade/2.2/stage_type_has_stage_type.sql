SELECT "Creating new stage_type_has_stage_type table" AS "";

CREATE TABLE IF NOT EXISTS stage_type_has_stage_type (
  stage_type_id INT UNSIGNED NOT NULL,
  next_stage_type_id INT UNSIGNED NOT NULL,
  update_timestamp TIMESTAMP NOT NULL,
  create_timestamp TIMESTAMP NOT NULL,
  PRIMARY KEY (stage_type_id, next_stage_type_id),
  INDEX fk_next_stage_type_id (next_stage_type_id ASC),
  INDEX fk_stage_type_id (stage_type_id ASC),
  CONSTRAINT fk_stage_type_has_stage_type_stage_type_id
    FOREIGN KEY (stage_type_id)
    REFERENCES stage_type (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_stage_type_has_stage_type_next_stage_type_id
    FOREIGN KEY (next_stage_type_id)
    REFERENCES stage_type (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

INSERT IGNORE INTO stage_type_has_stage_type( stage_type_id, next_stage_type_id )
SELECT stage_type.id, next_stage_type.id
FROM stage_type
JOIN stage_type AS next_stage_type ON stage_type.rank+1 = next_stage_type.rank
WHERE stage_type.name != "Not Approved"

UNION

SELECT stage_type.id, next_stage_type.id
FROM stage_type, stage_type AS next_stage_type
WHERE stage_type.name = "DSAC Decision"
AND next_stage_type.name = "Approved"

UNION

SELECT stage_type.id, next_stage_type.id
FROM stage_type, stage_type AS next_stage_type
WHERE stage_type.name = "SMT Review"
AND next_stage_type.name IN( "Conditionally Approved", "Approved" )

UNION

SELECT stage_type.id, next_stage_type.id
FROM stage_type, stage_type AS next_stage_type
WHERE stage_type.name = "Report Required"
AND next_stage_type.name = "Active";
