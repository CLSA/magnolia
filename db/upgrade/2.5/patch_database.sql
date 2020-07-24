-- Patch to upgrade database to version 2.5

SET AUTOCOMMIT=0;

SOURCE service.sql
SOURCE role.sql
SOURCE application_type_has_role.sql
SOURCE role_has_service.sql
SOURCE role_has_report_type.sql
SOURCE review_type.sql
SOURCE applicant.sql
SOURCE reqn.sql
SOURCE reqn_version.sql
SOURCE graduate.sql
SOURCE pdf_form_type.sql
SOURCE pdf_form.sql
SOURCE stage_type.sql
SOURCE notification_type.sql
SOURCE amendment_type.sql
SOURCE reqn_version_data_option.sql
SOURCE reqn_version_has_amendment_type.sql
SOURCE publication.sql

SOURCE update_version_number.sql

COMMIT;
