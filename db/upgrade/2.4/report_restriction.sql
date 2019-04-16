DROP PROCEDURE IF EXISTS patch_report_restriction;
  DELIMITER //
  CREATE PROCEDURE patch_report_restriction()
  BEGIN

    -- determine the @cenozo database name
    SET @cenozo = ( SELECT REPLACE( DATABASE(), "magnolia", "cenozo" ) );

    SELECT "Adding records to report_restriction table" AS "";

    SET @sql = CONCAT(
      "INSERT IGNORE INTO ", @cenozo, ".report_restriction ( ",
        "report_type_id, rank, name, title, mandatory, null_allowed, restriction_type, custom, subject, description ) ",
      "SELECT report_type.id, 1, 'stage_type', 'Current Stage Type', 0, 0, 'table', 1, 'stage_type', ",
             "'Restrict to requisitions in a particular stage type.' ",
      "FROM ", @cenozo, ".report_type ",
      "WHERE report_type.name = 'review_summary'" );
    PREPARE statement FROM @sql;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;

    SET @sql = CONCAT(
      "INSERT IGNORE INTO ", @cenozo, ".report_restriction ( ",
        "report_type_id, rank, name, title, mandatory, null_allowed, restriction_type, custom, subject, description ) ",
      "SELECT report_type.id, 1, 'stage_type', 'Stage Type', 0, 0, 'table', 1, 'stage_type', ",
             "'Restrict to requisitions which have reached a particular stage type.' ",
      "FROM ", @cenozo, ".report_type ",
      "WHERE report_type.name = 'requisition'" );
    PREPARE statement FROM @sql;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;

  END //
DELIMITER ;

-- now call the procedure and remove the procedure
CALL patch_report_restriction();
DROP PROCEDURE IF EXISTS patch_report_restriction;
