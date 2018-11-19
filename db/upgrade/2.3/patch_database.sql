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
SOURCE footnote.sql
SOURCE supplemental_file.sql

SOURCE update_version_number.sql

SELECT "PLEASE NOTE: Make sure to run ./set_data_directories.php script if it hasn't already been run" AS "";

COMMIT;
