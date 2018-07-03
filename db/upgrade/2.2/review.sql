DROP PROCEDURE IF EXISTS patch_review;
DELIMITER //
CREATE PROCEDURE patch_review()
  BEGIN

    -- determine the @cenozo database name
    SET @cenozo = ( SELECT REPLACE( DATABASE(), "magnolia", "cenozo" ) );

    SELECT "Creating new review table" AS "";

    SET @sql = CONCAT(

      "CREATE TABLE IF NOT EXISTS review ( ",
        "id INT UNSIGNED NOT NULL AUTO_INCREMENT, ",
        "update_timestamp TIMESTAMP NOT NULL, ",
        "create_timestamp TIMESTAMP NOT NULL, ",
        "reqn_id INT UNSIGNED NOT NULL, ",
        "user_id INT UNSIGNED NULL DEFAULT NULL, ",
        "type ENUM('Admin', 'SAC', 'Reviewer 1', 'Reviewer 2', 'Chair') NOT NULL, ",
        "recommendation ENUM('Approved', 'Revise', 'Not Approved') NULL DEFAULT NULL, ",
        "note TEXT NULL DEFAULT NULL, ",
        "PRIMARY KEY (id), ",
        "INDEX fk_reqn_id (reqn_id ASC), ",
        "INDEX fk_user_id (user_id ASC), ",
        "UNIQUE INDEX `uq_reqn_id_type` (`reqn_id` ASC, `type` ASC), ",
        "CONSTRAINT fk_review_reqn_id ",
          "FOREIGN KEY (reqn_id) ",
          "REFERENCES reqn (id) ",
          "ON DELETE CASCADE ",
          "ON UPDATE CASCADE, ",
        "CONSTRAINT fk_review_user_id ",
          "FOREIGN KEY (user_id) ",
          "REFERENCES ", @cenozo, ".user (id) ",
          "ON DELETE NO ACTION ",
          "ON UPDATE NO ACTION) ",
      "ENGINE = InnoDB" );
    PREPARE statement FROM @sql;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;

  END //
DELIMITER ;

CALL patch_review();
DROP PROCEDURE IF EXISTS patch_review;
