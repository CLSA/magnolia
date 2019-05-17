DROP PROCEDURE IF EXISTS patch_role_has_report_type;
  DELIMITER //
  CREATE PROCEDURE patch_role_has_report_type()
  BEGIN

    -- determine the @cenozo database name
    SET @cenozo = ( SELECT REPLACE( DATABASE(), "magnolia", "cenozo" ) );

    SELECT "Adding records to role_has_report_type table" AS "";

    SET @sql = CONCAT(
      "INSERT IGNORE INTO ", @cenozo, ".role_has_report_type( role_id, report_type_id ) ",
      "SELECT role.id, report_type.id ",
      "FROM ", @cenozo, ".role, ", @cenozo, ".report_type ",
      "WHERE role.name = 'administrator' ",
      "AND report_type.name = 'review_summary'" );
    PREPARE statement FROM @sql;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;

    SET @sql = CONCAT(
      "INSERT IGNORE INTO ", @cenozo, ".role_has_report_type( role_id, report_type_id ) ",
      "SELECT role.id, report_type.id ",
      "FROM ", @cenozo, ".role, ", @cenozo, ".report_type ",
      "WHERE role.name IN( 'administrator', 'chair', 'reviewer' ) ",
      "AND report_type.name = 'conflict_of_interest'" );
    PREPARE statement FROM @sql;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;

    SET @sql = CONCAT(
      "INSERT IGNORE INTO ", @cenozo, ".role_has_report_type( role_id, report_type_id ) ",
      "SELECT role.id, report_type.id ",
      "FROM ", @cenozo, ".role, ", @cenozo, ".report_type ",
      "WHERE role.name IN( 'administrator', 'chair' ) ",
      "AND report_type.name = 'requisition'" );
    PREPARE statement FROM @sql;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;

    SET @sql = CONCAT(
      "INSERT IGNORE INTO ", @cenozo, ".role_has_report_type( role_id, report_type_id ) ",
      "SELECT role.id, report_type.id ",
      "FROM ", @cenozo, ".role, ", @cenozo, ".report_type ",
      "WHERE role.name IN( 'administrator' ) ",
      "AND report_type.name = 'reference'" );
    PREPARE statement FROM @sql;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;

  END //
DELIMITER ;

-- now call the procedure and remove the procedure
CALL patch_role_has_report_type();
DROP PROCEDURE IF EXISTS patch_role_has_report_type;
