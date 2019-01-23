DROP PROCEDURE IF EXISTS patch_user_has_graduate;
DELIMITER //
CREATE PROCEDURE patch_user_has_graduate()
  BEGIN

    -- determine the @cenozo database name
    SET @cenozo = ( SELECT REPLACE( DATABASE(), "magnolia", "cenozo" ) );

    SELECT "Creating new user_has_graduate table" AS "";

    -- administrator
    SET @sql = CONCAT(
      "CREATE TABLE IF NOT EXISTS user_has_graduate ( ",
        "user_id INT UNSIGNED NOT NULL, ",
        "graduate_user_id INT UNSIGNED NOT NULL, ",
        "update_timestamp TIMESTAMP NOT NULL, ",
        "create_timestamp TIMESTAMP NOT NULL, ",
        "PRIMARY KEY (user_id, graduate_user_id), ",
        "INDEX fk_graduate_user_id (graduate_user_id ASC), ",
        "INDEX fk_user_id (user_id ASC), ",
        "CONSTRAINT fk_user_has_graduate_user_id ",
          "FOREIGN KEY (user_id) ",
          "REFERENCES ", @cenozo, ".user (id) ",
          "ON DELETE NO ACTION ",
          "ON UPDATE NO ACTION, ",
        "CONSTRAINT fk_user_has_graduate_graduate_user_id ",
          "FOREIGN KEY (graduate_user_id) ",
          "REFERENCES ", @cenozo, ".user (id) ",
          "ON DELETE NO ACTION ",
          "ON UPDATE NO ACTION) ",
      "ENGINE = InnoDB" );
    PREPARE statement FROM @sql;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;

  END //
DELIMITER ;

CALL patch_user_has_graduate();
DROP PROCEDURE IF EXISTS patch_user_has_graduate;
