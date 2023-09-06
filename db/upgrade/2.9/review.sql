DROP PROCEDURE IF EXISTS patch_review;
DELIMITER //
CREATE PROCEDURE patch_review()
  BEGIN

    SELECT "Adding unique key to review table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.KEY_COLUMN_USAGE
    WHERE constraint_schema = DATABASE()
    AND constraint_name = "uq_reqn_id_amendment_review_type_id";

    IF @test = 0 THEN
      ALTER TABLE review
      ADD UNIQUE INDEX guq_reqn_id_amendment_review_type_id (reqn_id ASC, amendment ASC, review_type_id ASC);
    END IF;

  END //
DELIMITER ;

CALL patch_review();
DROP PROCEDURE IF EXISTS patch_review;
