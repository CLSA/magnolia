-- Patch to upgrade database to version 2.9

SET AUTOCOMMIT=0;

SOURCE reqn_current_final_report.sql

SOURCE update_version_number.sql

COMMIT;
