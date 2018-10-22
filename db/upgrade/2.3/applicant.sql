DROP PROCEDURE IF EXISTS patch_applicant;
DELIMITER //
CREATE PROCEDURE patch_applicant()
  BEGIN

    -- determine the @cenozo database name
    SET @cenozo = ( SELECT REPLACE( DATABASE(), "magnolia", "cenozo" ) );

    SELECT "Creating new applicant table" AS "";

    SET @sql = CONCAT(
      "CREATE TABLE IF NOT EXISTS applicant ( ",
        "id INT UNSIGNED NOT NULL AUTO_INCREMENT, ",
        "update_timestamp TIMESTAMP NOT NULL, ",
        "create_timestamp TIMESTAMP NOT NULL, ",
        "user_id INT UNSIGNED NOT NULL, ",
        "newsletter TINYINT(1) NOT NULL DEFAULT 0, ",
        "PRIMARY KEY (id), ",
        "INDEX fk_user_id (user_id ASC), ",
        "UNIQUE INDEX uq_user_id (user_id ASC), ",
        "CONSTRAINT fk_applicant_user_id ",
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

CALL patch_applicant();
DROP PROCEDURE IF EXISTS patch_applicant;
