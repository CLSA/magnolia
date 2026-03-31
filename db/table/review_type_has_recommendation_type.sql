CREATE TABLE review_type_has_recommendation_type (
  review_type_id INT(10) UNSIGNED NOT NULL,
  recommendation_type_id INT(10) UNSIGNED NOT NULL,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  PRIMARY KEY (review_type_id, recommendation_type_id),
  INDEX fk_recommendation_type_id (recommendation_type_id ASC),
  INDEX fk_review_type_id (review_type_id ASC),
  CONSTRAINT fk_review_type_has_recommendation_type_recommendation_type_id
    FOREIGN KEY (recommendation_type_id)
    REFERENCES magnolia.recommendation_type (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_review_type_has_recommendation_typereview_type_id
    FOREIGN KEY (review_type_id)
    REFERENCES magnolia.review_type (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;
