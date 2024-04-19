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


DELIMITER $$

DROP TRIGGER IF EXISTS manuscript_stage_AFTER_INSERT$$
CREATE DEFINER=CURRENT_USER TRIGGER manuscript_stage_AFTER_INSERT AFTER INSERT ON manuscript_stage FOR EACH ROW
BEGIN
  INSERT IGNORE INTO manuscript_review( manuscript_id, manuscript_review_type_id )
  SELECT NEW.manuscript_id, manuscript_review_type.id
  FROM manuscript_review_type
  JOIN manuscript_stage_type ON manuscript_review_type.manuscript_stage_type_id = manuscript_stage_type.id
  JOIN manuscript_current_manuscript_version ON NEW.manuscript_id = manuscript_current_manuscript_version.manuscript_id
  JOIN manuscript_version ON manuscript_current_manuscript_version.manuscript_version_id = manuscript_version.id
  WHERE manuscript_stage_type.id = NEW.manuscript_stage_type_id;
END$$

DROP TRIGGER IF EXISTS manuscript_stage_AFTER_DELETE$$
CREATE DEFINER=CURRENT_USER TRIGGER manuscript_stage_AFTER_DELETE AFTER DELETE ON manuscript_stage FOR EACH ROW
BEGIN
  DELETE FROM manuscript_review
  WHERE manuscript_review_type_id IN (
    SELECT manuscript_review_type.id
    FROM manuscript_review_type
    JOIN manuscript_stage_type ON manuscript_review_type.manuscript_stage_type_id = manuscript_stage_type.id
    WHERE manuscript_stage_type.id = OLD.manuscript_stage_type_id
  )
  AND manuscript_id = OLD.manuscript_id;
END$$

DELIMITER ;
