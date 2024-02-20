DROP PROCEDURE IF EXISTS patch_role_has_review_type;
  DELIMITER //
  CREATE PROCEDURE patch_role_has_review_type()
  BEGIN

    -- determine the cenozo database name
    SET @cenozo = (
      SELECT unique_constraint_schema
      FROM information_schema.referential_constraints
      WHERE constraint_schema = DATABASE()
      AND constraint_name = "fk_access_site_id"
    );

    SELECT "Adding DAO role to Feasibility review type" AS "";

    SET @sql = CONCAT(
      "INSERT IGNORE INTO role_has_review_type( role_id, review_type_id ) ",
      "SELECT role.id, review_type.id ",
      "FROM ", @cenozo, ".role, review_type ",
      "WHERE role.name = 'dao' ",
      "AND review_type.name = 'Feasibility'" );
    PREPARE statement FROM @sql;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;

  END //
DELIMITER ;

-- now call the procedure and remove the procedure
CALL patch_role_has_review_type();
DROP PROCEDURE IF EXISTS patch_role_has_review_type;
