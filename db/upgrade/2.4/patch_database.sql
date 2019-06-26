-- Patch to upgrade database to version 2.4

SET AUTOCOMMIT=0;

SOURCE role.sql
SOURCE application_type_has_role.sql
SOURCE role_has_review_type.sql
SOURCE stage.sql
SOURCE stage_type.sql
SOURCE stage_type_has_stage_type.sql
SOURCE reqn_type.sql
SOURCE reqn_type_has_stage_type.sql
SOURCE graduate.sql
SOURCE reqn_version.sql
SOURCE reqn_version2.sql
SOURCE reqn.sql
SOURCE reqn2.sql
SOURCE reqn_current_reqn_version.sql
SOURCE update_reqn_current_reqn_version.sql
SOURCE coapplicant.sql
SOURCE reference.sql
SOURCE reqn_data_option.sql
SOURCE service.sql
SOURCE role_has_service.sql
SOURCE report_type.sql
SOURCE report_restriction.sql
SOURCE application_type_has_report_type.sql
SOURCE role_has_report_type.sql
SOURCE notification_type.sql
SOURCE notification_email.sql
SOURCE notification.sql
SOURCE user_has_graduate.sql
SOURCE data_option.sql
SOURCE data_option_category.sql
SOURCE data_option_detail.sql
SOURCE data_option_has_study_phase.sql
SOURCE review.sql

SOURCE update_version_number.sql

SELECT "TO COMPLETE THE INSTALLATION: you must now run the 'convert_agreement_filenames.php' script" AS "";

COMMIT;

