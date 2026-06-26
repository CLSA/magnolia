-- Patch to upgrade database to version 3.0

SET AUTOCOMMIT=0;

SOURCE reqn.sql
SOURCE amendment.sql
SOURCE output_type.sql

SOURCE update_version_number.sql

COMMIT;
