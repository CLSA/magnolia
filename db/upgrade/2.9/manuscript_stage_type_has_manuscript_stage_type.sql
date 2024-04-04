SELECT "Creating new manuscript_stage_type_has_manuscript_stage_type table" AS "";

CREATE TABLE IF NOT EXISTS manuscript_stage_type_has_manuscript_stage_type (
  manuscript_stage_type_id INT(10) UNSIGNED NOT NULL,
  next_manuscript_stage_type_id INT(10) UNSIGNED NOT NULL,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  PRIMARY KEY (manuscript_stage_type_id, next_manuscript_stage_type_id),
  INDEX fk_manuscript_stage_type_id (next_manuscript_stage_type_id ASC),
  INDEX fk_next_manuscript_stage_type_id (manuscript_stage_type_id ASC),
  CONSTRAINT fk_mst_has_mst_manuscript_stage_type_id
    FOREIGN KEY (manuscript_stage_type_id)
    REFERENCES manuscript_stage_type (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_mst_has_mst_next_manuscript_stage_type_id
    FOREIGN KEY (next_manuscript_stage_type_id)
    REFERENCES manuscript_stage_type (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

INSERT IGNORE INTO manuscript_stage_type_has_manuscript_stage_type (manuscript_stage_type_id, next_manuscript_stage_type_id)
SELECT manuscript_stage_type.id, next_manuscript_stage_type.id
FROM manuscript_stage_type, manuscript_stage_type AS next_manuscript_stage_type
WHERE manuscript_stage_type.name = "New"
AND next_manuscript_stage_type.name = "Admin Review"

UNION

SELECT manuscript_stage_type.id, next_manuscript_stage_type.id
FROM manuscript_stage_type, manuscript_stage_type AS next_manuscript_stage_type
WHERE manuscript_stage_type.name = "Admin Review"
AND next_manuscript_stage_type.name = "DAO Review"

UNION

SELECT manuscript_stage_type.id, next_manuscript_stage_type.id
FROM manuscript_stage_type, manuscript_stage_type AS next_manuscript_stage_type
WHERE manuscript_stage_type.name = "DAO Review"
AND next_manuscript_stage_type.name = "Decision Made"

UNION

SELECT manuscript_stage_type.id, next_manuscript_stage_type.id
FROM manuscript_stage_type, manuscript_stage_type AS next_manuscript_stage_type
WHERE manuscript_stage_type.name = "Decision Made"
AND next_manuscript_stage_type.name = "Suggested Revisions"

UNION

SELECT manuscript_stage_type.id, next_manuscript_stage_type.id
FROM manuscript_stage_type, manuscript_stage_type AS next_manuscript_stage_type
WHERE manuscript_stage_type.name = "Decision Made"
AND next_manuscript_stage_type.name = "Complete"

UNION

SELECT manuscript_stage_type.id, next_manuscript_stage_type.id
FROM manuscript_stage_type, manuscript_stage_type AS next_manuscript_stage_type
WHERE manuscript_stage_type.name = "Decision Made"
AND next_manuscript_stage_type.name = "Not Approved"

UNION

SELECT manuscript_stage_type.id, next_manuscript_stage_type.id
FROM manuscript_stage_type, manuscript_stage_type AS next_manuscript_stage_type
WHERE manuscript_stage_type.name = "Suggested Revisions"
AND next_manuscript_stage_type.name = "Complete";
