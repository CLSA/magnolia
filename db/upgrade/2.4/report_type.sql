DROP PROCEDURE IF EXISTS patch_report_type;
  DELIMITER //
  CREATE PROCEDURE patch_report_type()
  BEGIN

    -- determine the @cenozo database name
    SET @cenozo = ( SELECT REPLACE( DATABASE(), "magnolia", "cenozo" ) );

    SELECT "Adding new reports to report_type table" AS "";

    SET @sql = CONCAT(
      "INSERT IGNORE INTO ", @cenozo, ".report_type ( name, title, subject, description ) VALUES ",
      "( 'review_summary', 'Review Summary', 'reqn', ",
        "'This report provides a list of all requisitions and their reviews.' ), ",
      "( 'conflict_of_interest', 'Conflict of Interest', 'reqn', ",
        "'This report provides the primary applicant names, institution and all co-applicants for all requisitions which will be included in the current round of DSAC review.' ), ",
      "( 'requisition', 'Requisition', 'reqn', ",
        "'This report provides basic details about all requisitions which have been submitted.' ), ",
      "( 'reference', 'Reference', 'reqn', ",
        "'This report provides reference details for all requisitions which have been approved or reached the agreement stage.' )" );
    PREPARE statement FROM @sql;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;

  END //
DELIMITER ;

-- now call the procedure and remove the procedure
CALL patch_report_type();
DROP PROCEDURE IF EXISTS patch_report_type;
