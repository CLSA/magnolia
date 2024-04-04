SELECT "Creating new manuscript_review_type_has_manuscript_recommendation_type table" AS "";

CREATE TABLE IF NOT EXISTS manuscript_review_type_has_manuscript_recommendation_type (
  manuscript_review_type_id INT(10) UNSIGNED NOT NULL,
  manuscript_recommendation_type_id INT(10) UNSIGNED NOT NULL,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  PRIMARY KEY (manuscript_review_type_id, manuscript_recommendation_type_id),
  INDEX fk_manuscript_recommendation_type_id (manuscript_recommendation_type_id ASC),
  INDEX fk_manuscript_review_type_id (manuscript_review_type_id ASC),
  CONSTRAINT fk_mrt_has_mrt_manuscript_recommendation_type_id
    FOREIGN KEY (manuscript_recommendation_type_id)
    REFERENCES manuscript_recommendation_type (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_mrt_has_mrt_manuscript_review_type_id
    FOREIGN KEY (manuscript_review_type_id)
    REFERENCES manuscript_review_type (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;

INSERT IGNORE INTO manuscript_review_type_has_manuscript_recommendation_type (manuscript_review_type_id, manuscript_recommendation_type_id)
SELECT manuscript_review_type.id, manuscript_recommendation_type.id
FROM manuscript_review_type, manuscript_recommendation_type;
