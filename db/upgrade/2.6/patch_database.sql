-- Patch to upgrade database to version 2.5

SET AUTOCOMMIT=0;

SOURCE role.sql
SOURCE application_type_has_role.sql
SOURCE service.sql
SOURCE role_has_service.sql
SOURCE ethics_approval.sql
SOURCE reqn_last_ethics_approval.sql
SOURCE update_reqn_last_ethics_approval.sql
SOURCE ethics_approval_2.sql
SOURCE reqn.sql
SOURCE notification_type.sql
SOURCE pdf_form.sql
SOURCE stage.sql
SOURCE data_option.sql
SOURCE data_option_category.sql
SOURCE notice_has_user.sql
SOURCE final_report.sql
SOURCE update_reqn_current_final_report.sql
SOURCE reqn_current_final_report.sql
SOURCE production_type.sql
SOURCE production.sql

SOURCE update_version_number.sql

COMMIT;
