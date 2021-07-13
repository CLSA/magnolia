SELECT "Creating new review_type_question table" AS "";

CREATE TABLE IF NOT EXISTS review_type_question (
  id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL,
  create_timestamp TIMESTAMP NOT NULL,
  review_type_id INT(10) UNSIGNED NOT NULL,
  rank INT(10) UNSIGNED NOT NULL,
  question TEXT NOT NULL,
  PRIMARY KEY (id),
  INDEX fk_review_type_id (review_type_id ASC),
  UNIQUE INDEX uq_review_type_id_rank (review_type_id ASC, rank ASC),
  CONSTRAINT fk_review_type_question_review_type_id
    FOREIGN KEY (review_type_id)
    REFERENCES review_type (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SELECT "Adding triggers to review_type_question table" AS "";

DROP TRIGGER IF EXISTS review_type_question_AFTER_INSERT;

DELIMITER $$

CREATE DEFINER = CURRENT_USER TRIGGER review_type_question_AFTER_INSERT AFTER INSERT ON review_type_question FOR EACH ROW
BEGIN
  -- create all review_answer records
  INSERT INTO review_answer( review_id, review_type_question_id )
  SELECT review.id, NEW.id
  FROM review_type
  JOIN review ON review_type.id = review.review_type_id
  WHERE review_type.id = NEW.review_type_id;
END$$

DELIMITER ;
