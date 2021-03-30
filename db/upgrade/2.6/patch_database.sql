-- Patch to upgrade database to version 2.6

SET AUTOCOMMIT=0;

SOURCE role.sql
SOURCE application_type_has_role.sql
SOURCE service.sql
SOURCE role_has_service.sql
SOURCE ethics_approval.sql
SOURCE reqn_last_ethics_approval.sql
SOURCE update_reqn_last_ethics_approval.sql
SOURCE ethics_approval_2.sql
SOURCE data_option_category.sql
SOURCE data_option.sql
SOURCE data_option_has_study_phase.sql
SOURCE data_option_detail.sql
SOURCE reqn.sql
SOURCE reqn_version_comment.sql
SOURCE reqn_version_justification.sql
SOURCE reqn_version.sql
SOURCE reqn_version_data_option.sql
SOURCE notification_type.sql
SOURCE pdf_form.sql
SOURCE stage.sql
SOURCE notice_has_user.sql
SOURCE final_report.sql
SOURCE update_reqn_current_final_report.sql
SOURCE reqn_current_final_report.sql
SOURCE production_type.sql
SOURCE production.sql
SOURCE publication.sql
SOURCE output.sql
SOURCE output_source.sql
SOURCE review.sql
SOURCE recommendation_type.sql

SOURCE update_version_number.sql

COMMIT;
