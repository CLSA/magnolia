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

SOURCE service.sql
SOURCE role_has_service.sql

SOURCE update_version_number.sql

COMMIT;
