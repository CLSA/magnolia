SELECT "Adding triggers to review table" AS "";

DROP TRIGGER IF EXISTS review_AFTER_INSERT;

DELIMITER $$

CREATE DEFINER = CURRENT_USER TRIGGER review_AFTER_INSERT AFTER INSERT ON review FOR EACH ROW
BEGIN
  -- create all review_answer records
  INSERT INTO review_answer( review_id, review_type_question_id )
  SELECT NEW.id, review_type_question.id
  FROM review_type_question
  WHERE review_type_id = NEW.review_type_id;
END$$

DELIMITER ;
