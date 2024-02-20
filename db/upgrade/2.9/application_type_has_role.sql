DROP PROCEDURE IF EXISTS patch_application_type_has_role;
DELIMITER //
CREATE PROCEDURE patch_application_type_has_role()
  BEGIN

    -- determine the @cenozo database name
    SET @cenozo = (
      SELECT unique_constraint_schema
      FROM information_schema.referential_constraints
      WHERE constraint_schema = DATABASE()
      AND constraint_name = "fk_access_site_id"
    );

    SELECT "Adding new dao role to the magnolia application_type" AS "";

    SET @sql = CONCAT(
      "INSERT IGNORE INTO ", @cenozo, ".application_type_has_role( application_type_id, role_id ) ",
      "SELECT application_type.id, role.id ",
      "FROM ", @cenozo, ".application_type, ", @cenozo, ".role ",
      "WHERE application_type.name = 'magnolia' ",
      "AND role.name = 'dao'"
    );
    PREPARE statement FROM @sql;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;

  END //
DELIMITER ;

CALL patch_application_type_has_role();
DROP PROCEDURE IF EXISTS patch_application_type_has_role;
