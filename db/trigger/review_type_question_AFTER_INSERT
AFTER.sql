CREATE TRIGGER review_type_question_AFTER_INSERT
AFTER INSERT ON magnolia.review_type_question FOR EACH ROW
BEING
  INSERT INTO review_answer( review_id, review_type_question_id )
  SELECT review.id, NEW.id
  FROM review_type
  JOIN review ON review_type.id = review.review_type_id
  WHERE review_type.id = NEW.review_type_id;
END$$