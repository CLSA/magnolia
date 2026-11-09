-- Patch to upgrade database to version 3.0

SET AUTOCOMMIT=0;

SOURCE reqn.sql
SOURCE reqn_version.sql
SOURCE amendment.sql
SOURCE output_type.sql
SOURCE data_category_study_phase.sql

SOURCE service.sql
SOURCE role_has_service.sql

SOURCE update_version_number.sql

COMMIT;
