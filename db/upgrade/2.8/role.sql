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

    SELECT "Upgrading some roles to tier 2" AS "";

    SET @sql = CONCAT(
      "UPDATE ", @cenozo, ".role ",
      "SET tier = 2 ",
      "WHERE name IN ( 'chair', 'smt', 'readonly', 'communication', 'typist' )"
    );
    PREPARE statement FROM @sql;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;

  END //
DELIMITER ;

CALL patch_role();
DROP PROCEDURE IF EXISTS patch_role;
