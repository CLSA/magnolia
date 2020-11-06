DROP PROCEDURE IF EXISTS patch_role_has_service;
DELIMITER //
CREATE PROCEDURE patch_role_has_service()
  BEGIN

    -- determine the cenozo database name
    SET @cenozo = (
      SELECT unique_constraint_schema
      FROM information_schema.referential_constraints
      WHERE constraint_schema = DATABASE()
      AND constraint_name = "fk_access_site_id"
    );

    SET @sql = CONCAT(
      "INSERT IGNORE INTO role_has_service( role_id, service_id ) ",
      "SELECT role.id, service.id ",
      "FROM ", @cenozo, ".role, service ",
      "WHERE role.name IN( 'administrator', 'applicant' ) ",
      "AND service.subject = 'ethics_approval' ",
      "AND service.restricted = 1"
    );
    PREPARE statement FROM @sql;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;

    SET @sql = CONCAT(
      "INSERT IGNORE INTO role_has_service( role_id, service_id ) ",
      "SELECT role.id, service.id ",
      "FROM ", @cenozo, ".role, service ",
      "WHERE role.name = 'administrator' ",
      "AND service.subject = 'pdf_form' ",
      "AND service.restricted = 1"
    );
    PREPARE statement FROM @sql;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;

    SET @sql = CONCAT(
      "INSERT IGNORE INTO role_has_service( role_id, service_id ) ",
      "SELECT role.id, service.id ",
      "FROM ", @cenozo, ".role, service ",
      "WHERE role.name = 'typist' AND ( ",
        "( service.subject IN( 'coapplicant', 'reference' ) ) OR",
        "( service.subject = 'reqn' AND service.method != 'DELETE' ) OR",
        "( service.subject = 'reqn_version' AND service.method = 'PATCH' ) OR",
        "( service.subject = 'deadline' AND service.method = 'GET' ) ",
      ") AND service.restricted = 1"
    );
    PREPARE statement FROM @sql;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;

  END //
DELIMITER ;

CALL patch_role_has_service();
DROP PROCEDURE IF EXISTS patch_role_has_service;
