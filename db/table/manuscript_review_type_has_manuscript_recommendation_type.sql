CREATE TABLE manuscript_review_type_has_manuscript_recommendation_type (
  manuscript_review_type_id INT(10) UNSIGNED NOT NULL,
  manuscript_recommendation_type_id INT(10) UNSIGNED NOT NULL,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  PRIMARY KEY (manuscript_review_type_id, manuscript_recommendation_type_id),
  INDEX fk_manuscript_recommendation_type_id (manuscript_recommendation_type_id ASC),
  INDEX fk_manuscript_review_type_id (manuscript_review_type_id ASC),
  CONSTRAINT fk_mrt_has_mrt_manuscript_recommendation_type_id
    FOREIGN KEY (manuscript_recommendation_type_id)
    REFERENCES magnolia.manuscript_recommendation_type (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_mrt_has_mrt_manuscript_review_type_id
    FOREIGN KEY (manuscript_review_type_id)
    REFERENCES magnolia.manuscript_review_type (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;
