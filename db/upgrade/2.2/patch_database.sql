-- Patch to upgrade database to version 2.2

SET AUTOCOMMIT=0;

SOURCE role.sql
SOURCE application_type.sql
SOURCE application_type_has_role.sql
SOURCE application.sql
SOURCE application_has_site.sql

SOURCE access.sql
SOURCE service.sql
SOURCE role_has_service.sql
SOURCE setting.sql
SOURCE writelog.sql

SOURCE pdf_form_type.sql
SOURCE pdf_form.sql
SOURCE deadline.sql
SOURCE reqn.sql
SOURCE review.sql
SOURCE dsac_review.sql
SOURCE reqn_note.sql
SOURCE notification_type.sql
SOURCE notification.sql
SOURCE coapplicant.sql
SOURCE reference.sql
SOURCE data_option_parent.sql
SOURCE data_option_subcategory.sql
SOURCE data_option.sql
SOURCE reqn_has_data_option.sql
SOURCE progress_report.sql
SOURCE production_type.sql
SOURCE production.sql
SOURCE stage_type.sql
SOURCE stage_type_has_stage_type.sql
SOURCE stage.sql
SOURCE reqn_last_stage.sql

SOURCE update_reqn_last_stage.sql
SOURCE update_version_number.sql

COMMIT;
