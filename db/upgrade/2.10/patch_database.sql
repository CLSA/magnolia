-- Patch to upgrade database to version 2.10

SET AUTOCOMMIT=0;

SOURCE reqn_current_reqn_version.sql
SOURCE update_reqn_current_reqn_version.sql
SOURCE reqn_last_reqn_version_with_agreement.sql
SOURCE update_reqn_last_reqn_version_with_agreement.sql

SOURCE fee_schedule.sql
SOURCE additional_fee_fee_schedule.sql
SOURCE amendment_type_fee_schedule.sql
SOURCE data_selection_fee_schedule.sql

SOURCE amendment.sql
SOURCE reqn_current_amendment.sql
SOURCE update_reqn_current_amendment.sql
SOURCE reqn_last_amendment_with_agreement.sql
SOURCE update_reqn_last_amendment_with_agreement.sql
SOURCE reqn_version.sql
SOURCE amendment_current_reqn_version.sql
SOURCE update_amendment_current_reqn_version.sql
SOURCE review.sql
SOURCE stage.sql
SOURCE calculate_amendment_fees.sql
SOURCE update_reqn_last_reqn_version_with_agreement.sql
SOURCE reqn.sql

SOURCE additional_fee.sql
SOURCE amendment_type.sql
SOURCE data_option.sql
SOURCE data_selection.sql
SOURCE manuscript_version.sql
SOURCE data_agreement.sql
SOURCE coapplicant.sql

SOURCE report_restriction.sql

SOURCE service.sql
SOURCE role_has_service.sql

SOURCE update_version_number.sql

COMMIT;
