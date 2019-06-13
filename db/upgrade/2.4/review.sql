DROP PROCEDURE IF EXISTS patch_review;
DELIMITER //
CREATE PROCEDURE patch_review()
  BEGIN

    SELECT "Adding new amendment column to the review table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = "review"
    AND COLUMN_NAME = "amendment";

    IF @test = 0 THEN
      ALTER TABLE review
      ADD COLUMN amendment CHAR(1) NOT NULL DEFAULT '.' AFTER reqn_id,
      ADD UNIQUE KEY uq_reqn_id_amendment_review_type_id ( reqn_id, amendment, review_type_id ),
      DROP KEY uq_reqn_id_review_type_id;

      UPDATE review SET amendment = '.';
    END IF;

  END //
DELIMITER ;

CALL patch_review();
DROP PROCEDURE IF EXISTS patch_review;
