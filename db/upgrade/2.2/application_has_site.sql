DROP PROCEDURE IF EXISTS patch_application_has_site;
DELIMITER //
CREATE PROCEDURE patch_application_has_site()
  BEGIN

    -- determine the @cenozo database name
    SET @cenozo = ( SELECT REPLACE( DATABASE(), "magnolia", "cenozo" ) );

    SET @sql = CONCAT(
      "SELECT COUNT(*) INTO @total ",
      "FROM ", @cenozo, ".application_has_site ",
      "JOIN ", @cenozo, ".application ON application_has_site.application_id = application.id ",
      "WHERE application.name = 'magnolia'"
    );
    PREPARE statement FROM @sql;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;

    IF @total = 0 THEN
      SELECT "Adding main site to the new magnolia application" AS "";

      SET @sql = CONCAT(
        "INSERT IGNORE INTO ", @cenozo, ".application_has_site( application_id, site_id ) ",
        "SELECT application.id, site.id ",
        "FROM ", @cenozo, ".application, ", @cenozo, ".site ",
        "WHERE application.name = 'magnolia' ",
        "AND site.name = 'NCC'" );
      PREPARE statement FROM @sql;
      EXECUTE statement;
      DEALLOCATE PREPARE statement;
    END IF;

  END //
DELIMITER ;

CALL patch_application_has_site();
DROP PROCEDURE IF EXISTS patch_application_has_site;
