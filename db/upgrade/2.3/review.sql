DROP PROCEDURE IF EXISTS patch_review;
DELIMITER //
CREATE PROCEDURE patch_review()
  BEGIN

    -- determine the @cenozo database name
    SET @cenozo = ( SELECT REPLACE( DATABASE(), "magnolia", "cenozo" ) );

    SELECT "Replacing recommendation column with recommendation_type_id in review table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = "review"
    AND COLUMN_NAME = "recommendation_type_id";

    IF @test = 0 THEN
      ALTER TABLE review
      ADD COLUMN recommendation_type_id INT UNSIGNED NULL DEFAULT NULL AFTER review_type_id,
      ADD INDEX fk_recommendation_type_id ( recommendation_type_id ASC ),
      ADD CONSTRAINT fk_review_recommendation_type_id
          FOREIGN KEY (recommendation_type_id)
          REFERENCES recommendation_type (id)
          ON DELETE NO ACTION;

      UPDATE review
      JOIN review_type ON review.review_type_id = review_type.id
      JOIN recommendation_type ON ( (
        review_type.name = "Admin" AND (
          ( review.recommendation = "Not Approved" AND recommendation_type.name = "Not Satisfactory" ) OR
          ( review.recommendation != "Not Approved" AND recommendation_type.name = "Satisfactory" )
        )
      ) OR (
        review_type.name = "SAC" AND (
          ( review.recommendation = "Not Approved" AND recommendation_type.name = "Not Feasible" ) OR
          ( review.recommendation != "Not Approved" AND recommendation_type.name = "Feasible" )
        )
      ) OR (
        review_type.name != "Admin" AND review_type.name != "SAC" AND review.recommendation = recommendation_type.name 
      ) )
      SET recommendation_type_id = recommendation_type.id
      WHERE recommendation IS NOT NULL;

      ALTER TABLE review DROP COLUMN recommendation;
    END IF;

  END //
DELIMITER ;

CALL patch_review();
DROP PROCEDURE IF EXISTS patch_review;
