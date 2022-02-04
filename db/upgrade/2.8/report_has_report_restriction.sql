DROP PROCEDURE IF EXISTS patch_report_has_report_restriction;
  DELIMITER //
  CREATE PROCEDURE patch_report_has_report_restriction()
  BEGIN

    -- determine the @cenozo database name
    SET @cenozo = (
      SELECT unique_constraint_schema
      FROM information_schema.referential_constraints
      WHERE constraint_schema = DATABASE()
      AND constraint_name = "fk_access_site_id"
    );

    SELECT "Adding extra records to report_has_report_restriction based on the change to the reference report" AS "";

    SET @sql = CONCAT(
      "INSERT IGNORE INTO ", @cenozo, ".report_has_report_restriction( report_id, report_restriction_id, value ) ",
      "SELECT report.id, report_restriction.id, 'Approved' ",
      "FROM ", @cenozo, ".report_type ",
      "JOIN ", @cenozo, ".report ON report_type.id = report.report_type_id ",
      "JOIN ", @cenozo, ".report_restriction ON report_type.id = report_restriction.report_type_id ",
                                            "AND report_restriction.name = 'approved' ",
      "WHERE report_type.name = 'reference' ",
      "AND DATE( report.datetime ) <= '2022-02-04'"
    );
    PREPARE statement FROM @sql;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;

  END //
DELIMITER ;

-- now call the procedure and remove the procedure
CALL patch_report_has_report_restriction();
DROP PROCEDURE IF EXISTS patch_report_has_report_restriction;
