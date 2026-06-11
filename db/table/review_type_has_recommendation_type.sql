CREATE TABLE review_type_has_recommendation_type (
  review_type_id int(10) unsigned NOT NULL,
  recommendation_type_id int(10) unsigned NOT NULL,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (review_type_id,recommendation_type_id),
  KEY fk_recommendation_type_id (recommendation_type_id),
  KEY fk_review_type_id (review_type_id),
  CONSTRAINT fk_review_type_has_recommendation_type_recommendation_type_id
    FOREIGN KEY (recommendation_type_id)
    REFERENCES recommendation_type (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_review_type_has_recommendation_typereview_type_id
    FOREIGN KEY (review_type_id)
    REFERENCES review_type (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;