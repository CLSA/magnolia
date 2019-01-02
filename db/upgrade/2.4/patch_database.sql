-- Patch to upgrade database to version 2.4

SET AUTOCOMMIT=0;

SOURCE reqn_version.sql
SOURCE reqn.sql
SOURCE reqn_current_reqn_version.sql
SOURCE update_reqn_current_reqn_version.sql
SOURCE coapplicant.sql
SOURCE reference.sql
SOURCE reqn_data_option.sql
SOURCE service.sql
SOURCE role_has_service.sql
SOURCE report_type.sql
SOURCE application_type_has_report_type.sql
SOURCE role_has_report_type.sql

SOURCE update_version_number.sql

COMMIT;
