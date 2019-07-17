SELECT "Adding new recommendation types to review types" AS "";

INSERT IGNORE INTO review_type_has_recommendation_type( review_type_id, recommendation_type_id )
SELECT review_type.id, recommendation_type.id
FROM review_type, recommendation_type
WHERE review_type.name = "SAC"
AND recommendation_type.name IN ( "Partially Feasible" );
