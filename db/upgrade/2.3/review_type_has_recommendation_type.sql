SELECT "Creating new review_type_has_recommendation_type table" AS "";

CREATE TABLE IF NOT EXISTS review_type_has_recommendation_type (
  review_type_id INT UNSIGNED NOT NULL,
  recommendation_type_id INT UNSIGNED NOT NULL,
  update_timestamp TIMESTAMP NOT NULL,
  create_timestamp TIMESTAMP NOT NULL,
  PRIMARY KEY (review_type_id, recommendation_type_id),
  INDEX fk_recommendation_type_id (recommendation_type_id ASC),
  INDEX fk_review_type_id (review_type_id ASC),
  CONSTRAINT fk_review_type_has_recommendation_typereview_type_id
    FOREIGN KEY (review_type_id)
    REFERENCES review_type (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_review_type_has_recommendation_typerecommendation_type_id
    FOREIGN KEY (recommendation_type_id)
    REFERENCES recommendation_type (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;

INSERT IGNORE INTO review_type_has_recommendation_type( review_type_id, recommendation_type_id )
SELECT review_type.id, recommendation_type.id
FROM review_type, recommendation_type
WHERE review_type.name = "Admin"
AND recommendation_type.name IN ( "Satisfactory", "Not Satisfactory" ) UNION

SELECT review_type.id, recommendation_type.id
FROM review_type, recommendation_type
WHERE review_type.name = "SAC"
AND recommendation_type.name IN ( "Feasible", "Not Feasible" ) UNION

SELECT review_type.id, recommendation_type.id
FROM review_type, recommendation_type
WHERE review_type.name != "Admin" AND review_type.name != "SAC" AND review_type.name NOT LIKE "Second %"
AND recommendation_type.name IN ( "Approved", "Revise", "Not Approved" ) UNION

SELECT review_type.id, recommendation_type.id
FROM review_type, recommendation_type
WHERE review_type.name LIKE "Second %"
AND recommendation_type.name IN ( "Approved", "Not Approved" );
