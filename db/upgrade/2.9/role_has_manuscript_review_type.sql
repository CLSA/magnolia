DROP PROCEDURE IF EXISTS patch_manuscript_review_type;
DELIMITER //
CREATE PROCEDURE patch_manuscript_review_type()
  BEGIN

    -- determine the cenozo database name
    SET @cenozo = (
      SELECT unique_constraint_schema
      FROM information_schema.referential_constraints
      WHERE constraint_schema = DATABASE()
      AND constraint_name = "fk_access_site_id"
    );

    SELECT "Creating new role_has_manuscript_review_type table" AS "";

    SET @sql = CONCAT(
      "CREATE TABLE IF NOT EXISTS role_has_manuscript_review_type ( ",
        "role_id INT(10) UNSIGNED NOT NULL, ",
        "manuscript_review_type_id INT(10) UNSIGNED NOT NULL, ",
        "update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(), ",
        "create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(), ",
        "PRIMARY KEY (role_id, manuscript_review_type_id), ",
        "INDEX fk_manuscript_review_type_id (manuscript_review_type_id ASC), ",
        "INDEX fk_role_id (role_id ASC), ",
        "CONSTRAINT fk_role_has_manuscript_review_type_review_type_id ",
          "FOREIGN KEY (manuscript_review_type_id) ",
          "REFERENCES manuscript_review_type (id) ",
          "ON DELETE NO ACTION ",
          "ON UPDATE NO ACTION, ",
        "CONSTRAINT fk_role_has_manuscript_review_type_role_id ",
          "FOREIGN KEY (role_id) ",
          "REFERENCES ", @cenozo, ".role (id) ",
          "ON DELETE NO ACTION ",
          "ON UPDATE NO ACTION) ",
      "ENGINE = InnoDB"
    );
    PREPARE statement FROM @sql;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;

    SET @sql = CONCAT(
      "INSERT IGNORE INTO role_has_manuscript_review_type (role_id, manuscript_review_type_id) ",
      "SELECT role.id, manuscript_review_type.id ",
      "FROM ", @cenozo, ".role, manuscript_review_type ",
      "WHERE role.name = 'administrator' "
      "UNION ",
      "SELECT role.id, manuscript_review_type.id ",
      "FROM ", @cenozo, ".role, manuscript_review_type ",
      "WHERE role.name = 'dao' ",
      "AND manuscript_review_type.name = 'DAO'"
    );
    PREPARE statement FROM @sql;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;

  END //
DELIMITER ;

CALL patch_manuscript_review_type();
DROP PROCEDURE IF EXISTS patch_manuscript_review_type;
