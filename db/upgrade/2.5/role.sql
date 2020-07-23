DROP PROCEDURE IF EXISTS patch_role;
DELIMITER //
CREATE PROCEDURE patch_role()
  BEGIN

    -- determine the cenozo database name
    SET @cenozo = (
      SELECT unique_constraint_schema
      FROM information_schema.referential_constraints
      WHERE constraint_schema = DATABASE()
      AND constraint_name = "fk_access_site_id"
    );

    SELECT "Renaming 'sac' role to 'readonly'" AS "";

    SET @sql = CONCAT(
      "UPDATE ", @cenozo, ".role ",
      "SET name = 'readonly' ",
      "WHERE name = 'sac'"
    );
    PREPARE statement FROM @sql;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;

    SELECT "Adding new 'communication' role" AS "";

    SET @sql = CONCAT(
      "INSERT IGNORE INTO ", @cenozo, ".role SET ",
      "name = 'communication', ",
      "tier = 1, ",
      "all_sites = 1"
    );
    PREPARE statement FROM @sql;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;

  END //
DELIMITER ;

CALL patch_role();
DROP PROCEDURE IF EXISTS patch_role;
