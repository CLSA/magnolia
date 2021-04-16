-- Patch to upgrade database to version 2.7

SET AUTOCOMMIT=0;

SOURCE reqn_last_version_with_agreement.sql
SOURCE update_reqn_last_reqn_version_with_agreement.sql
SOURCE reqn_version.sql
SOURCE report_type.sql
SOURCE report_restriction.sql
SOURCE application_type_has_report_type.sql
SOURCE role_has_report_type.sql

SOURCE update_version_number.sql

COMMIT;
