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
      "WHERE role.name = 'administrator' ",
      "AND service.subject IN( ",
        "'additional_fee', 'data_destroy', 'destruction_report', 'log_entry', ",
        "'packaged_data', 'special_fee_waiver' ",
      ") ",
      "AND service.restricted = 1"
    );
    PREPARE statement FROM @sql;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;

    SET @sql = CONCAT(
      "INSERT IGNORE INTO role_has_service( role_id, service_id ) ",
      "SELECT role.id, service.id ",
      "FROM ", @cenozo, ".role, service ",
      "WHERE role.name IN( 'administrator', 'communication' ) ",
      "AND service.subject = 'deferral_note' ",
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
      "AND service.subject = 'custom_report' ",
      "AND service.method IN( 'DELETE',  'PATCH', 'POST' ) ",
      "AND service.restricted = 1"
    );
    PREPARE statement FROM @sql;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;

    SET @sql = CONCAT(
      "INSERT IGNORE INTO role_has_service( role_id, service_id ) ",
      "SELECT role.id, service.id ",
      "FROM ", @cenozo, ".role, service ",
      "WHERE role.name IN( 'administrator', 'communication' ) ",
      "AND service.subject = 'custom_report' ",
      "AND service.method = 'GET' ",
      "AND service.restricted = 1"
    );
    PREPARE statement FROM @sql;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;

    SET @sql = CONCAT(
      "INSERT IGNORE INTO role_has_service( role_id, service_id ) ",
      "SELECT role.id, service.id ",
      "FROM ", @cenozo, ".role, service ",
      "WHERE role.name = 'communication' ",
      "AND service.restricted = 1 ",
      "AND ( ",
        "( service.subject = 'final_report' AND service.method != 'POST' ) OR",
        "( service.subject IN ('output', 'output_source') ) ",
      ")"
    );
    PREPARE statement FROM @sql;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;

    SET @sql = CONCAT(
      "INSERT IGNORE INTO role_has_service( role_id, service_id ) ",
      "SELECT role.id, service.id ",
      "FROM ", @cenozo, ".role, service ",
      "WHERE role.name IN( 'applicant', 'designate' ) ",
      "AND service.subject IN( 'data_destroy', 'destruction_report' ) ",
      "AND service.restricted = 1"
    );
    PREPARE statement FROM @sql;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;

    -- dao read-only services
    SET @sql = CONCAT(
      "INSERT IGNORE INTO role_has_service( role_id, service_id ) ",
      "SELECT role.id, service.id ",
      "FROM ", @cenozo, ".role, service ",
      "WHERE role.name = 'dao' ",
      "AND service.subject IN( ",
        "'access', 'activity', 'additional_fee', 'amendment_type', 'applicant', 'application', 'coapplicant', ",
        "'custom_report', 'data_agreement', 'data_category', 'data_destroy', 'data_detail', 'data_option', ",
        "'data_release', 'data_selection', 'deadline', 'ethics_approval', 'failed_login', 'log_entry', ",
        "'notation', 'notification', 'notification_type', 'notification_type_email', 'output', 'output_source', ",
        "'output_type', 'packaged_data', 'pdf_form', 'pdf_form_type', 'publication', 'reference', 'report', ",
        "'report_restriction', 'report_schedule', 'report_type', 'reqn_type', 'review_type', ",
        "'review_type_question', 'setting', 'site', 'special_fee_waiver', 'stage', 'stage_type', 'study_phase', ",
        "'supplemental_file', 'user' ",
      ") ",
      "AND service.method = 'GET' ",
      "AND service.restricted = 1"
    );
    PREPARE statement FROM @sql;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;

    -- dao read/write services
    SET @sql = CONCAT(
      "INSERT IGNORE INTO role_has_service( role_id, service_id ) ",
      "SELECT role.id, service.id ",
      "FROM ", @cenozo, ".role, service ",
      "WHERE role.name = 'dao' ",
      "AND service.subject IN( ",
        "'data_version', 'deferral_note', 'notice', 'reqn', 'review', 'review_answer', 'system_message' ",
      ") ",
      "AND service.restricted = 1"
    );
    PREPARE statement FROM @sql;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;

  END //
DELIMITER ;

CALL patch_role_has_service();
DROP PROCEDURE IF EXISTS patch_role_has_service;
