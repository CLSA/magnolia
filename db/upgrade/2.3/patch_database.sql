-- Patch to upgrade database to version 2.3

SET AUTOCOMMIT=0;

SOURCE reqn.sql
SOURCE applicant.sql
SOURCE recommendation_type.sql
SOURCE review_type_has_recommendation_type.sql
SOURCE review.sql
SOURCE service.sql
SOURCE stage_type.sql
SOURCE stage_type_has_stage_type.sql
SOURCE notification_type.sql

SOURCE update_version_number.sql

COMMIT;
