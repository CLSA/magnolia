-- Patch to upgrade database to version 2.8

SET AUTOCOMMIT=0;

SOURCE table_character_sets.sql
SOURCE data_agreement.sql
SOURCE data_category.sql
SOURCE reqn.sql
SOURCE reqn_version.sql
SOURCE deadline.sql
SOURCE applicant.sql
SOURCE role.sql
SOURCE service.sql
SOURCE role_has_service.sql
SOURCE notification_type.sql
SOURCE recommendation_type.sql
SOURCE review_type.sql
SOURCE review_type_has_recommendation_type.sql
SOURCE data_option.sql
SOURCE data_category_has_study_phase.sql
SOURCE data_selection.sql
SOURCE data_detail.sql
SOURCE amendment_type.sql
SOURCE final_report.sql
SOURCE stage_type.sql
SOURCE stage_type_has_stage_type.sql
SOURCE reqn_type_has_stage_type.sql

SOURCE report_type.sql
SOURCE report_restriction.sql
SOURCE report_has_report_restriction.sql
SOURCE application_type_has_report_type.sql
SOURCE role_has_report_type.sql

SOURCE update_version_number.sql

COMMIT;
