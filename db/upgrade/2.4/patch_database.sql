-- Patch to upgrade database to version 2.3

SET AUTOCOMMIT=0;

SOURCE reqn_version.sql
SOURCE reqn.sql
SOURCE reqn_current_reqn_version.sql
SOURCE update_reqn_current_reqn_version.sql
SOURCE coapplicant.sql
SOURCE reference.sql
SOURCE final_report.sql
SOURCE reqn_data_option.sql
SOURCE service.sql

SOURCE update_version_number.sql

COMMIT;
