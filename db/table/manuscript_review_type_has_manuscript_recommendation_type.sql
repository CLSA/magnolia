CREATE TABLE manuscript_review_type_has_manuscript_recommendation_type (
  manuscript_review_type_id int(10) unsigned NOT NULL,
  manuscript_recommendation_type_id int(10) unsigned NOT NULL,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (manuscript_review_type_id,manuscript_recommendation_type_id),
  KEY fk_manuscript_recommendation_type_id (manuscript_recommendation_type_id),
  KEY fk_manuscript_review_type_id (manuscript_review_type_id),
  CONSTRAINT fk_mrt_has_mrt_manuscript_recommendation_type_id
    FOREIGN KEY (manuscript_recommendation_type_id)
    REFERENCES manuscript_recommendation_type (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_mrt_has_mrt_manuscript_review_type_id
    FOREIGN KEY (manuscript_review_type_id)
    REFERENCES manuscript_review_type (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
