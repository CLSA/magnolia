-- Patch to upgrade database to version 2.5

SET AUTOCOMMIT=0;

SOURCE reqn.sql
SOURCE reqn_version.sql
SOURCE pdf_form.sql

SOURCE update_version_number.sql

COMMIT;
