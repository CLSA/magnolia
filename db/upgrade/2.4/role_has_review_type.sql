DROP PROCEDURE IF EXISTS patch_role_has_review_type;
  DELIMITER //
  CREATE PROCEDURE patch_role_has_review_type()
  BEGIN

    -- determine the @cenozo database name
    SET @cenozo = ( SELECT REPLACE( DATABASE(), "magnolia", "cenozo" ) );

    SELECT "Adding missing roles to review types" AS "";

    SET @sql = CONCAT(
      "INSERT IGNORE INTO role_has_review_type( role_id, review_type_id ) ",
      "SELECT role.id, review_type.id ",
      "FROM ", @cenozo, ".role, review_type ",
      "WHERE role.name = 'sac' ",
      "AND review_type.name = 'SAC'" );
    PREPARE statement FROM @sql;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;

    SET @sql = CONCAT(
      "INSERT IGNORE INTO role_has_review_type( role_id, review_type_id ) ",
      "SELECT role.id, review_type.id ",
      "FROM ", @cenozo, ".role, review_type ",
      "WHERE role.name = 'chair' ",
      "AND review_type.name LIKE 'Reviewer %'" );
    PREPARE statement FROM @sql;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;

  END //
DELIMITER ;

-- now call the procedure and remove the procedure
CALL patch_role_has_review_type();
DROP PROCEDURE IF EXISTS patch_role_has_review_type;
