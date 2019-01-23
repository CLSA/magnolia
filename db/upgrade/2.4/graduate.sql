DROP PROCEDURE IF EXISTS patch_graduate;
DELIMITER //
CREATE PROCEDURE patch_graduate()
  BEGIN

    -- determine the @cenozo database name
    SET @cenozo = (
      SELECT unique_constraint_schema
      FROM information_schema.referential_constraints
      WHERE constraint_schema = DATABASE()
      AND constraint_name = "fk_access_site_id" );

    SELECT "Creating new graduate table" AS "";

    SET @sql = CONCAT(
      "CREATE TABLE IF NOT EXISTS graduate ( ",
        "id INT UNSIGNED NOT NULL AUTO_INCREMENT, ",
        "update_timestamp TIMESTAMP NOT NULL, ",
        "create_timestamp TIMESTAMP NOT NULL, ",
        "user_id INT UNSIGNED NOT NULL, ",
        "graduate_user_id INT UNSIGNED NOT NULL, ",
        "PRIMARY KEY (id), ",
        "INDEX fk_graduate_user_id (graduate_user_id ASC), ",
        "INDEX fk_user_id (user_id ASC), ",
        "UNIQUE INDEX uq_graduate_user_id (graduate_user_id ASC), ",
        "CONSTRAINT fk_graduate_graduate_user_id ",
          "FOREIGN KEY (graduate_user_id) ",
          "REFERENCES ", @cenozo, ".user (id) ",
          "ON DELETE NO ACTION ",
          "ON UPDATE NO ACTION, ",
        "CONSTRAINT fk_graduate_user_id ",
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

CALL patch_graduate();
DROP PROCEDURE IF EXISTS patch_graduate;
