CREATE TRIGGER review_AFTER_INSERT
AFTER INSERT ON magnolia.review FOR EACH ROW
BEGIN
  INSERT INTO review_answer( review_id, review_type_question_id )
  SELECT NEW.id, review_type_question.id
  FROM review_type_question
  WHERE review_type_id = NEW.review_type_id;
END$$