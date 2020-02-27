-- Patch to upgrade database to version 2.5

SET AUTOCOMMIT=0;

SOURCE role.sql
SOURCE role_has_service.sql
SOURCE review_type.sql
SOURCE reqn.sql
SOURCE reqn_version.sql
SOURCE pdf_form_type.sql
SOURCE pdf_form.sql
SOURCE stage_type.sql
SOURCE notification_type.sql

SOURCE update_version_number.sql

COMMIT;
