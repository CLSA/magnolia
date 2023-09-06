-- Patch to upgrade database to version 2.9

SET AUTOCOMMIT=0;

SOURCE reqn.sql
SOURCE reqn_current_final_report.sql
SOURCE pdf_form.sql
SOURCE data_agreement.sql
SOURCE notification_type.sql
SOURCE amendment_type.sql
SOURCE additional_fee.sql
SOURCE reqn_has_additional_fee.sql
SOURCE data_option.sql
SOURCE reqn_version.sql
SOURCE reqn_type.sql
SOURCE reqn_type_has_stage_type.sql

SOURCE report_type.sql
SOURCE application_type_has_report_type.sql
SOURCE role_has_report_type.sql
SOURCE report_restriction.sql

SOURCE service.sql
SOURCE role_has_service.sql

SOURCE update_version_number.sql

SELECT "TO COMPLETE THE INSTALLATION: you must now run the 'stage.php' script" AS "";

COMMIT;
