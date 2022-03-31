SELECT "Adding new 'Revise - minor' to review types" AS "";

SELECT id INTO @id FROM recommendation_type WHERE name = "Revise - minor";

INSERT IGNORE INTO review_type_has_recommendation_type( review_type_id, recommendation_type_id )
SELECT review_type_id, @id
FROM review_type_has_recommendation_type
JOIN recommendation_type ON review_type_has_recommendation_type.recommendation_type_id = recommendation_type.id
WHERE recommendation_type.name = "Revise - major";
