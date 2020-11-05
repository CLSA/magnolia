-- Patch to upgrade database to version 2.5

SET AUTOCOMMIT=0;

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

SOURCE update_version_number.sql

COMMIT;
