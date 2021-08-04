-- Patch to upgrade database to version 2.7

SET AUTOCOMMIT=0;

SOURCE data_option_justification.sql
SOURCE amendment_justification.sql
SOURCE reqn.sql
SOURCE reqn_last_version_with_agreement.sql
SOURCE update_reqn_last_reqn_version_with_agreement.sql
SOURCE reqn_version.sql
SOURCE notification_type.sql
SOURCE role.sql
SOURCE application_type_has_role.sql
SOURCE service.sql
SOURCE role_has_service.sql
SOURCE reqn_version_data_option.sql
SOURCE reqn_version_has_amendment_type.sql
SOURCE review_type_question.sql
SOURCE review_answer.sql
SOURCE review.sql
SOURCE data_option.sql
SOURCE data_option_has_study_phase.sql
SOURCE applicant.sql

SOURCE report_type.sql
SOURCE report_restriction.sql
SOURCE application_type_has_report_type.sql
SOURCE role_has_report_type.sql

SOURCE update_version_number.sql

COMMIT;
