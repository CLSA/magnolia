DROP PROCEDURE IF EXISTS patch_dsac_review;
DELIMITER //
CREATE PROCEDURE patch_dsac_review()
  BEGIN

    -- determine the @cenozo database name
    SET @cenozo = ( SELECT REPLACE( DATABASE(), "magnolia", "cenozo" ) );

    SELECT "Creating new reqn table" AS "";

    SET @sql = CONCAT(
      "CREATE TABLE IF NOT EXISTS dsac_review ( ",
        "id INT UNSIGNED NOT NULL AUTO_INCREMENT, ",
        "update_timestamp TIMESTAMP NOT NULL, ",
        "create_timestamp TIMESTAMP NOT NULL, ",
        "reqn_id INT UNSIGNED NOT NULL, ",
        "user_id INT UNSIGNED NOT NULL, ",
        "recommendation ENUM('Approved', 'Revise', 'Not Approved') NULL DEFAULT NULL, ",
        "note TEXT NULL DEFAULT NULL, ",
        "PRIMARY KEY (id), ",
        "INDEX fk_reqn_id (reqn_id ASC), ",
        "INDEX fk_user_id (user_id ASC), ",
        "UNIQUE INDEX uq_reqn_id_user_id (reqn_id ASC, user_id ASC), ",
        "CONSTRAINT fk_dsac_review_reqn_id ",
          "FOREIGN KEY (reqn_id) ",
          "REFERENCES reqn (id) ",
          "ON DELETE NO ACTION ",
          "ON UPDATE NO ACTION, ",
        "CONSTRAINT fk_dsac_review_user_id ",
          "FOREIGN KEY (user_id) ",
          "REFERENCES ", @cenozo, ".user (id) ",
          "ON DELETE CASCADE ",
          "ON UPDATE CASCADE) ",
      "ENGINE = InnoDB" );
    PREPARE statement FROM @sql;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;

  END //
DELIMITER ;

CALL patch_dsac_review();
DROP PROCEDURE IF EXISTS patch_dsac_review;
