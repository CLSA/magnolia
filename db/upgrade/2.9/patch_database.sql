-- Patch to upgrade database to version 2.9

SET AUTOCOMMIT=0;

SOURCE reqn.sql
SOURCE reqn_current_final_report.sql
SOURCE pdf_form.sql
SOURCE data_agreement.sql

SOURCE update_version_number.sql

COMMIT;
