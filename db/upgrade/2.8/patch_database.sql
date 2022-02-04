-- Patch to upgrade database to version 2.8

SET AUTOCOMMIT=0;

SOURCE table_character_sets.sql
SOURCE reqn.sql
SOURCE deadline.sql
SOURCE report_type.sql
SOURCE report_restriction.sql

SOURCE update_version_number.sql

COMMIT;
