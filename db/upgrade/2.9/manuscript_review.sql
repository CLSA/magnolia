DROP PROCEDURE IF EXISTS patch_manuscript_review;
DELIMITER //
CREATE PROCEDURE patch_manuscript_review()
  BEGIN

    -- determine the cenozo database name
    SET @cenozo = (
      SELECT unique_constraint_schema
      FROM information_schema.referential_constraints
      WHERE constraint_schema = DATABASE()
      AND constraint_name = "fk_access_site_id"
    );

    SELECT "Creating new manuscript_review table" AS "";

    SET @sql = CONCAT(
      "CREATE TABLE IF NOT EXISTS manuscript_review ( ",
        "id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT, ",
        "update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(), ",
        "create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(), ",
        "manuscript_id INT(10) UNSIGNED NOT NULL, ",
        "manuscript_review_type_id INT(10) UNSIGNED NOT NULL, ",
        "user_id INT(10) UNSIGNED NULL DEFAULT NULL, ",
        "datetime DATETIME NOT NULL, ",
        "manuscript_recommendation_type_id INT(10) UNSIGNED NULL DEFAULT NULL, ",
        "note TEXT NULL DEFAULT NULL, ",
        "PRIMARY KEY (id), ",
        "INDEX fk_user_id (user_id ASC), ",
        "INDEX fk_manuscript_review_type_id (manuscript_review_type_id ASC), ",
        "INDEX fk_manuscript_recommendation_type_id (manuscript_recommendation_type_id ASC), ",
        "UNIQUE INDEX uq_manuscript_id_manuscript_review_type_id (manuscript_id ASC, manuscript_review_type_id ASC), ",
        "INDEX fk_manuscript_id (manuscript_id ASC), ",
        "CONSTRAINT fk_manuscript_review_manuscript_recommendation_type_id ",
          "FOREIGN KEY (manuscript_recommendation_type_id) ",
          "REFERENCES manuscript_recommendation_type (id) ",
          "ON DELETE NO ACTION ",
          "ON UPDATE NO ACTION, ",
        "CONSTRAINT fk_manuscript_review_manuscript_review_type_id ",
          "FOREIGN KEY (manuscript_review_type_id) ",
          "REFERENCES manuscript_review_type (id) ",
          "ON DELETE NO ACTION ",
          "ON UPDATE NO ACTION, ",
        "CONSTRAINT fk_manuscript_review_user_id ",
          "FOREIGN KEY (user_id) ",
          "REFERENCES ", @cenozo, ".user (id) ",
          "ON DELETE NO ACTION ",
          "ON UPDATE NO ACTION, ",
        "CONSTRAINT fk_manuscript_review_manuscript_id ",
          "FOREIGN KEY (manuscript_id) ",
          "REFERENCES manuscript (id) ",
          "ON DELETE CASCADE ",
          "ON UPDATE CASCADE) ",
      "ENGINE = InnoDB"
    );
    PREPARE statement FROM @sql;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;

  END //
DELIMITER ;

CALL patch_manuscript_review();
DROP PROCEDURE IF EXISTS patch_manuscript_review;


DELIMITER $$

DROP TRIGGER IF EXISTS manuscript_review_BEFORE_INSERT$$
CREATE DEFINER=CURRENT_USER TRIGGER manuscript_review_BEFORE_INSERT BEFORE INSERT ON manuscript_review FOR EACH ROW
BEGIN
  IF !NEW.datetime THEN
    SET NEW.datetime = UTC_TIMESTAMP();
  END IF;
END$$

DELIMITER ;
