-- Patch to upgrade database to version 2.3

SET AUTOCOMMIT=0;

SOURCE reqn.sql
SOURCE applicant.sql
SOURCE recommendation_type.sql
SOURCE review_type_has_recommendation_type.sql
SOURCE review.sql
SOURCE service.sql
SOURCE role_has_service.sql
SOURCE stage_type.sql
SOURCE stage_type_has_stage_type.sql
SOURCE notification_type.sql
SOURCE supplemental_file.sql
SOURCE reqn_data_option.sql
SOURCE reqn_has_data_option.sql
SOURCE data_option_detail.sql
SOURCE data_option_detail_has_footnote.sql
SOURCE data_option_detail_has_study_phase.sql
SOURCE data_option_has_study_phase.sql
SOURCE data_option.sql
SOURCE data_option_has_footnote.sql
SOURCE data_option_category.sql
SOURCE data_option_category_has_footnote.sql
SOURCE footnote.sql
SOURCE reqn_note.sql

SOURCE update_version_number.sql

COMMIT;
