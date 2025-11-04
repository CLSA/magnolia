DROP PROCEDURE IF EXISTS patch_review;
DELIMITER //
CREATE PROCEDURE patch_review()
  BEGIN

    SELECT "Replacing amendment with amendment_id column in review table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "review"
    AND column_name = "amendment_id";

    IF @test = 0 THEN
      ALTER TABLE review ADD COLUMN amendment_id INT UNSIGNED NOT NULL AFTER amendment;

      UPDATE review
      JOIN amendment ON review.reqn_id = amendment.reqn_id AND review.amendment = amendment.name
      SET review.amendment_id = amendment.id;

      ALTER TABLE review ADD INDEX fk_amendment_id (amendment_id ASC);
      ALTER TABLE review ADD CONSTRAINT fk_review_amendment_id
        FOREIGN KEY (amendment_id)
        REFERENCES amendment (id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION;

      ALTER TABLE review
        DROP INDEX uq_reqn_id_amendment_review_type_id,
        DROP COLUMN amendment;
    END IF;

  END //
DELIMITER ;

CALL patch_review();
DROP PROCEDURE IF EXISTS patch_review;
