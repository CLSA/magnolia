-- Patch to upgrade database to version 2.2

SET AUTOCOMMIT=0;

SOURCE application_type.sql
SOURCE application_type_has_role.sql
SOURCE application.sql
SOURCE application_has_site.sql

SOURCE access.sql
SOURCE service.sql
SOURCE role_has_service.sql
SOURCE setting.sql
SOURCE writelog.sql

SOURCE requisition.sql
SOURCE coapplicant.sql
SOURCE keyword.sql
SOURCE reference.sql
SOURCE qnaire.sql
SOURCE physical.sql
SOURCE biomarker.sql
SOURCE requisition_has_qnaire.sql
SOURCE requisition_has_physical.sql
SOURCE requisition_has_biomarker.sql

SOURCE update_version_number.sql

COMMIT;
