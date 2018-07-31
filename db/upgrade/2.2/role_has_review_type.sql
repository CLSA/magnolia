DROP PROCEDURE IF EXISTS patch_role_has_review_type;
DELIMITER //
CREATE PROCEDURE patch_role_has_review_type()
  BEGIN

    -- determine the @cenozo database name
    SET @cenozo = ( SELECT REPLACE( DATABASE(), "magnolia", "cenozo" ) );

    SELECT "Creating new role_has_review_type table" AS "";

    SET @sql = CONCAT(
      "CREATE TABLE IF NOT EXISTS role_has_review_type ( ",
        "role_id INT UNSIGNED NOT NULL, ",
        "review_type_id INT UNSIGNED NOT NULL, ",
        "update_timestamp TIMESTAMP NOT NULL, ",
        "create_timestamp TIMESTAMP NOT NULL, ",
        "PRIMARY KEY (role_id, review_type_id), ",
        "INDEX fk_review_type_id (review_type_id ASC), ",
        "INDEX fk_role_id (role_id ASC), ",
        "CONSTRAINT fk_role_has_review_type_role_id ",
          "FOREIGN KEY (role_id) ",
          "REFERENCES ", @cenozo, ".role (id) ",
          "ON DELETE NO ACTION ",
          "ON UPDATE NO ACTION, ",
        "CONSTRAINT fk_role_has_review_type_review_type_id ",
          "FOREIGN KEY (review_type_id) ",
          "REFERENCES review_type (id) ",
          "ON DELETE NO ACTION ",
          "ON UPDATE NO ACTION) ",
      "ENGINE = InnoDB" );
    PREPARE statement FROM @sql;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;

    SET @sql = CONCAT(
      "INSERT IGNORE INTO role_has_review_type( role_id, review_type_id ) ",
      "SELECT role.id, review_type.id FROM ", @cenozo, ".role, review_type ",
      "WHERE role.name = 'administrator' ",
      "UNION ",
      "SELECT role.id, review_type.id FROM ", @cenozo, ".role, review_type ",
      "WHERE role.name = 'reviewer' AND review_type.name IN( 'Reviewer 1', 'Reviewer 2' ) ",
      "UNION ",
      "SELECT role.id, review_type.id FROM ", @cenozo, ".role, review_type ",
      "WHERE role.name = 'chair' AND review_type.name IN( 'Chair', 'Second Chair' ) ",
      "UNION ",
      "SELECT role.id, review_type.id FROM ", @cenozo, ".role, review_type ",
      "WHERE role.name = 'smt' AND review_type.name IN( 'SMT', 'Second SMT' )" );
    PREPARE statement FROM @sql;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;

  END //
DELIMITER ;

CALL patch_role_has_review_type();
DROP PROCEDURE IF EXISTS patch_role_has_review_type;
