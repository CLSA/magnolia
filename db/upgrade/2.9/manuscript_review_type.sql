SELECT "Creating new manuscript_review_type table" AS "";

CREATE TABLE IF NOT EXISTS manuscript_review_type (
  id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  name VARCHAR(45) NOT NULL,
  manuscript_stage_type_id INT(10) UNSIGNED NOT NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX uq_name (name ASC),
  INDEX fk_manuscript_stage_type_id (manuscript_stage_type_id ASC),
  CONSTRAINT fk_manuscript_review_type_manuscript_stage_type_id
    FOREIGN KEY (manuscript_stage_type_id)
    REFERENCES manuscript_stage_type (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

INSERT IGNORE INTO manuscript_review_type (name, manuscript_stage_type_id)
SELECT "Admin", id FROM manuscript_stage_type WHERE name = "Admin Review" UNION
SELECT "DAO", id FROM manuscript_stage_type WHERE name = "DAO Review";
