DROP PROCEDURE IF EXISTS patch_manuscript_stage;
DELIMITER //
CREATE PROCEDURE patch_manuscript_stage()
  BEGIN

    -- determine the cenozo database name
    SET @cenozo = (
      SELECT unique_constraint_schema
      FROM information_schema.referential_constraints
      WHERE constraint_schema = DATABASE()
      AND constraint_name = "fk_access_site_id"
    );

    SELECT "Creating new manuscript_stage table" AS "";

    SET @sql = CONCAT(
      "CREATE TABLE IF NOT EXISTS manuscript_stage ( ",
        "id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT, ",
        "update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(), ",
        "create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(), ",
        "manuscript_id INT(10) UNSIGNED NOT NULL, ",
        "manuscript_stage_type_id INT(10) UNSIGNED NOT NULL, ",
        "user_id INT(10) UNSIGNED NULL DEFAULT NULL, ",
        "datetime DATETIME NULL DEFAULT NULL, ",
        "PRIMARY KEY (id), ",
        "INDEX fk_manuscript_stage_manuscript_id (manuscript_id ASC), ",
        "INDEX fk_manuscript_stage_manuscript_stage_type_id (manuscript_stage_type_id ASC), ",
        "INDEX fk_manuscript_stage_user_id (user_id ASC), ",
        "CONSTRAINT fk_manuscript_stage_manuscript_id ",
          "FOREIGN KEY (manuscript_id) ",
          "REFERENCES manuscript (id) ",
          "ON DELETE CASCADE ",
          "ON UPDATE NO ACTION, ",
        "CONSTRAINT fk_manuscript_stage_manuscript_stage_type_id ",
          "FOREIGN KEY (manuscript_stage_type_id) ",
          "REFERENCES manuscript_stage_type (id) ",
          "ON DELETE NO ACTION ",
          "ON UPDATE NO ACTION, ",
        "CONSTRAINT fk_manuscript_stage_user_id ",
          "FOREIGN KEY (user_id) ",
          "REFERENCES ", @cenozo, ".user (id) ",
          "ON DELETE NO ACTION ",
          "ON UPDATE NO ACTION) ",
      "ENGINE = InnoDB"
    );
    PREPARE statement FROM @sql;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;

  END //
DELIMITER ;

CALL patch_manuscript_stage();
DROP PROCEDURE IF EXISTS patch_manuscript_stage;
