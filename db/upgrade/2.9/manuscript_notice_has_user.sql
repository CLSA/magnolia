DROP PROCEDURE IF EXISTS patch_manuscript_notice_has_user;
DELIMITER //
CREATE PROCEDURE patch_manuscript_notice_has_user()
  BEGIN

    -- determine the cenozo database name
    SET @cenozo = (
      SELECT unique_constraint_schema
      FROM information_schema.referential_constraints
      WHERE constraint_schema = DATABASE()
      AND constraint_name = "fk_access_site_id"
    );

    SELECT "Creating new manuscript_notice_has_user table" AS "";

    SET @sql = CONCAT(
      "CREATE TABLE IF NOT EXISTS manuscript_notice_has_user ( ",
        "manuscript_notice_id INT(10) UNSIGNED NOT NULL, ",
        "user_id INT(10) UNSIGNED NOT NULL, ",
        "update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(), ",
        "create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(), ",
        "PRIMARY KEY (manuscript_notice_id, user_id), ",
        "INDEX fk_user_id (user_id ASC), ",
        "INDEX fk_manuscript_notice_id (manuscript_notice_id ASC), ",
        "CONSTRAINT fk_manuscript_notice_has_user_manuscript_notice_id ",
          "FOREIGN KEY (manuscript_notice_id) ",
          "REFERENCES manuscript_notice (id) ",
          "ON DELETE CASCADE ",
          "ON UPDATE NO ACTION, ",
        "CONSTRAINT fk_manuscript_notice_has_user_user_id ",
          "FOREIGN KEY (user_id) ",
          "REFERENCES ", @cenozo, ".user (id) ",
          "ON DELETE CASCADE ",
          "ON UPDATE NO ACTION) ",
      "ENGINE = InnoDB"
    );
    PREPARE statement FROM @sql;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;

  END //
DELIMITER ;

CALL patch_manuscript_notice_has_user();
DROP PROCEDURE IF EXISTS patch_manuscript_notice_has_user;
