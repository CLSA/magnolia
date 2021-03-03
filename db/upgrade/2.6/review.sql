DROP PROCEDURE IF EXISTS patch_review;
DELIMITER //
CREATE PROCEDURE patch_review()
  BEGIN

    SELECT "Replacing date with datetime column" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "review"
    AND column_name = "date";

    IF @test = 1 THEN
      ALTER TABLE review CHANGE COLUMN date datetime DATETIME NOT NULL;

      -- add a few seconds to each review in order to make old date data sort by stage-type correctly
      UPDATE review
      JOIN review_type ON review.review_type_id = review_type.id
      JOIN stage_type ON review_type.stage_type_id = stage_type.id
      SET review.datetime = review.datetime + INTERVAL stage_type.rank SECOND;
    END IF;

  END //
DELIMITER ;

CALL patch_review();
DROP PROCEDURE IF EXISTS patch_review;

DROP TRIGGER IF EXISTS review_BEFORE_INSERT;

DELIMITER $$

CREATE DEFINER=CURRENT_USER TRIGGER review_BEFORE_INSERT BEFORE INSERT ON review FOR EACH ROW
BEGIN
  IF !NEW.datetime THEN 
    SET NEW.datetime = UTC_TIMESTAMP();
  END IF;
END$$

DELIMITER ;
