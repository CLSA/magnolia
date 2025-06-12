DROP PROCEDURE IF EXISTS patch_report_restriction;
  DELIMITER //
  CREATE PROCEDURE patch_report_restriction()
  BEGIN

    -- determine the @cenozo database name
    SET @cenozo = (
      SELECT unique_constraint_schema
      FROM information_schema.referential_constraints
      WHERE constraint_schema = DATABASE()
      AND constraint_name = "fk_access_site_id"
    );

    SELECT "Adding new restrictions to requisition report" AS "";

    SET @sql = CONCAT(
      "INSERT IGNORE INTO ", @cenozo, ".report_restriction ( ",
        "report_type_id, rank, name, title, restriction_type, custom, enum_list, description ",
      ") ",
      "SELECT report_type.id, 2, 'date_span_type', 'Restrict Stage By', 'enum', 1, '\"Start\",\"Finish\"', ",
             "'Restrict to requisitions whose stage either starts or finishes inside a particular date-span.' ",
      "FROM ", @cenozo, ".report_type ",
      "WHERE report_type.name = 'requisition'"
    );
    PREPARE statement FROM @sql;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;

    SET @sql = CONCAT(
      "INSERT IGNORE INTO ", @cenozo, ".report_restriction ( ",
        "report_type_id, rank, name, title, restriction_type, custom, description ",
      ") ",
      "SELECT report_type.id, 3, 'start_date', 'Minimum Date', 'date', 1, ",
             "'The earliest date the selected stage starts/finishes.' ",
      "FROM ", @cenozo, ".report_type ",
      "WHERE report_type.name = 'requisition'"
    );
    PREPARE statement FROM @sql;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;

    SET @sql = CONCAT(
      "INSERT IGNORE INTO ", @cenozo, ".report_restriction ( ",
        "report_type_id, rank, name, title, restriction_type, custom, description ",
      ") ",
      "SELECT report_type.id, 4, 'end_date', 'Maximum Date', 'date', 1, ",
             "'The latest date the selected stage starts/finishes.' ",
      "FROM ", @cenozo, ".report_type ",
      "WHERE report_type.name = 'requisition'"
    );
    PREPARE statement FROM @sql;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;

  END //
DELIMITER ;

-- now call the procedure and remove the procedure
CALL patch_report_restriction();
DROP PROCEDURE IF EXISTS patch_report_restriction;
