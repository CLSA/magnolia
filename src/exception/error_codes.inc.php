<?php
/**
 * error_codes.inc.php
 * 
 * This file is where all error codes are defined.
 * All error code are named after the class and function they occur in.
 */

/**
 * Error number category defines.
 */
define( 'ARGUMENT_MAGNOLIA_BASE_ERRNO',   190000 );
define( 'DATABASE_MAGNOLIA_BASE_ERRNO',   290000 );
define( 'LDAP_MAGNOLIA_BASE_ERRNO',       390000 );
define( 'NOTICE_MAGNOLIA_BASE_ERRNO',     490000 );
define( 'PERMISSION_MAGNOLIA_BASE_ERRNO', 590000 );
define( 'RUNTIME_MAGNOLIA_BASE_ERRNO',    690000 );
define( 'SYSTEM_MAGNOLIA_BASE_ERRNO',     790000 );

/**
 * "argument" error codes
 */
define( 'ARGUMENT__MAGNOLIA_DATABASE_REFERENCE__SAVE__ERRNO',
        ARGUMENT_MAGNOLIA_BASE_ERRNO + 1 );
define( 'ARGUMENT__MAGNOLIA_DATABASE_REQN__GET_FILENAME__ERRNO',
        ARGUMENT_MAGNOLIA_BASE_ERRNO + 2 );
define( 'ARGUMENT__MAGNOLIA_DATABASE_REQN__PROCEED_TO_NEXT_STAGE__ERRNO',
        ARGUMENT_MAGNOLIA_BASE_ERRNO + 3 );
define( 'ARGUMENT__MAGNOLIA_DATABASE_REQN__GET_STUDY_DATA_PATH__ERRNO',
        ARGUMENT_MAGNOLIA_BASE_ERRNO + 4 );
define( 'ARGUMENT__MAGNOLIA_DATABASE_REQN_VERSION__GET_FILENAME__ERRNO',
        ARGUMENT_MAGNOLIA_BASE_ERRNO + 5 );
define( 'ARGUMENT__MAGNOLIA_DATABASE_SUPPLEMENTAL_FILE__GET_FILENAME__ERRNO',
        ARGUMENT_MAGNOLIA_BASE_ERRNO + 6 );
define( 'ARGUMENT__MAGNOLIA_SERVICE_DATA_AGREEMENT_GET__GET_DOWNLOADABLE_PUBLIC_NAME__ERRNO',
        ARGUMENT_MAGNOLIA_BASE_ERRNO + 7 );
define( 'ARGUMENT__MAGNOLIA_SERVICE_DATA_AGREEMENT_GET__GET_DOWNLOADABLE_FILE_PATH__ERRNO',
        ARGUMENT_MAGNOLIA_BASE_ERRNO + 8 );
define( 'ARGUMENT__MAGNOLIA_SERVICE_DATA_AGREEMENT_PATCH__SETUP__ERRNO',
        ARGUMENT_MAGNOLIA_BASE_ERRNO + 9 );
define( 'ARGUMENT__MAGNOLIA_SERVICE_ETHICS_APPROVAL_GET__GET_DOWNLOADABLE_PUBLIC_NAME__ERRNO',
        ARGUMENT_MAGNOLIA_BASE_ERRNO + 10 );
define( 'ARGUMENT__MAGNOLIA_SERVICE_ETHICS_APPROVAL_GET__GET_DOWNLOADABLE_FILE_PATH__ERRNO',
        ARGUMENT_MAGNOLIA_BASE_ERRNO + 11 );
define( 'ARGUMENT__MAGNOLIA_SERVICE_FINAL_REPORT_OUTPUT_PATCH__EXECUTE__ERRNO',
        ARGUMENT_MAGNOLIA_BASE_ERRNO + 12 );
define( 'ARGUMENT__MAGNOLIA_SERVICE_OUTPUT_OUTPUT_SOURCE_PATCH__EXECUTE__ERRNO',
        ARGUMENT_MAGNOLIA_BASE_ERRNO + 13 );
define( 'ARGUMENT__MAGNOLIA_SERVICE_OUTPUT_SOURCE_GET__GET_DOWNLOADABLE_PUBLIC_NAME__ERRNO',
        ARGUMENT_MAGNOLIA_BASE_ERRNO + 14 );
define( 'ARGUMENT__MAGNOLIA_SERVICE_OUTPUT_SOURCE_GET__GET_DOWNLOADABLE_FILE_PATH__ERRNO',
        ARGUMENT_MAGNOLIA_BASE_ERRNO + 15 );
define( 'ARGUMENT__MAGNOLIA_SERVICE_OUTPUT_SOURCE_PATCH__EXECUTE__ERRNO',
        ARGUMENT_MAGNOLIA_BASE_ERRNO + 16 );
define( 'ARGUMENT__MAGNOLIA_SERVICE_PDF_FORM_GET__GET_DOWNLOADABLE_PUBLIC_NAME__ERRNO',
        ARGUMENT_MAGNOLIA_BASE_ERRNO + 17 );
define( 'ARGUMENT__MAGNOLIA_SERVICE_PDF_FORM_GET__GET_DOWNLOADABLE_FILE_PATH__ERRNO',
        ARGUMENT_MAGNOLIA_BASE_ERRNO + 18 );
define( 'ARGUMENT__MAGNOLIA_SERVICE_PDF_FORM_TYPE_PDF_FORM_PATCH__SETUP__ERRNO',
        ARGUMENT_MAGNOLIA_BASE_ERRNO + 19 );
define( 'ARGUMENT__MAGNOLIA_SERVICE_REQN_ETHICS_APPROVAL_PATCH__EXECUTE__ERRNO',
        ARGUMENT_MAGNOLIA_BASE_ERRNO + 20 );
define( 'ARGUMENT__MAGNOLIA_SERVICE_REQN_GET__GET_DOWNLOADABLE_PUBLIC_NAME__ERRNO',
        ARGUMENT_MAGNOLIA_BASE_ERRNO + 21 );
define( 'ARGUMENT__MAGNOLIA_SERVICE_REQN_GET__GET_DOWNLOADABLE_FILE_PATH__ERRNO',
        ARGUMENT_MAGNOLIA_BASE_ERRNO + 22 );
define( 'ARGUMENT__MAGNOLIA_SERVICE_REQN_OUTPUT_PATCH__EXECUTE__ERRNO',
        ARGUMENT_MAGNOLIA_BASE_ERRNO + 23 );
define( 'ARGUMENT__MAGNOLIA_SERVICE_REQN_VERSION_GET__GET_DOWNLOADABLE_PUBLIC_NAME__ERRNO',
        ARGUMENT_MAGNOLIA_BASE_ERRNO + 24 );
define( 'ARGUMENT__MAGNOLIA_SERVICE_REQN_VERSION_GET__GET_DOWNLOADABLE_FILE_PATH__ERRNO',
        ARGUMENT_MAGNOLIA_BASE_ERRNO + 25 );
define( 'ARGUMENT__MAGNOLIA_SERVICE_SUPPLEMENTAL_FILE_GET__GET_DOWNLOADABLE_PUBLIC_NAME__ERRNO',
        ARGUMENT_MAGNOLIA_BASE_ERRNO + 26 );
define( 'ARGUMENT__MAGNOLIA_SERVICE_SUPPLEMENTAL_FILE_GET__GET_DOWNLOADABLE_FILE_PATH__ERRNO',
        ARGUMENT_MAGNOLIA_BASE_ERRNO + 27 );
define( 'ARGUMENT__MAGNOLIA_SERVICE_SUPPLEMENTAL_FILE_PATCH__EXECUTE__ERRNO',
        ARGUMENT_MAGNOLIA_BASE_ERRNO + 28 );

/**
 * "database" error codes
 * 
 * Since database errors already have codes this list is likely to stay empty.
 */

/**
 * "ldap" error codes
 * 
 * Since ldap errors already have codes this list is likely to stay empty.
 */

/**
 * "notice" error codes
 */
define( 'NOTICE__MAGNOLIA_DATABASE_REQN__PROCEED_TO_NEXT_STAGE__ERRNO',
        NOTICE_MAGNOLIA_BASE_ERRNO + 1 );
define( 'NOTICE__MAGNOLIA_SERVICE_ETHICS_APPROVAL_DELETE__VALIDATE__ERRNO',
        NOTICE_MAGNOLIA_BASE_ERRNO + 2 );
define( 'NOTICE__MAGNOLIA_SERVICE_REQN_DELETE__VALIDATE__ERRNO',
        NOTICE_MAGNOLIA_BASE_ERRNO + 3 );
define( 'NOTICE__MAGNOLIA_SERVICE_REQN_PATCH__VALIDATE__ERRNO',
        NOTICE_MAGNOLIA_BASE_ERRNO + 4 );
define( 'NOTICE__MAGNOLIA_SERVICE_REQN_VERSION_REFERENCE_POST__EXECUTE__ERRNO',
        NOTICE_MAGNOLIA_BASE_ERRNO + 5 );

/**
 * "permission" error codes
 */

/**
 * "runtime" error codes
 */
define( 'RUNTIME__MAGNOLIA_DATABASE_FINAL_REPORT__GENERATE_PDF_FORM__ERRNO',
        RUNTIME_MAGNOLIA_BASE_ERRNO + 1 );
define( 'RUNTIME__MAGNOLIA_DATABASE_REQN__REVERSE_TO_LAST_STAGE__ERRNO',
        RUNTIME_MAGNOLIA_BASE_ERRNO + 2 );
define( 'RUNTIME__MAGNOLIA_DATABASE_REQN__PROCEED_TO_NEXT_STAGE__ERRNO',
        RUNTIME_MAGNOLIA_BASE_ERRNO + 3 );
define( 'RUNTIME__MAGNOLIA_DATABASE_REQN__GENERATE_AGREEMENTS_FILE__ERRNO',
        RUNTIME_MAGNOLIA_BASE_ERRNO + 4 );
define( 'RUNTIME__MAGNOLIA_DATABASE_REQN__GENERATE_REVIEWS_FILE__ERRNO',
        RUNTIME_MAGNOLIA_BASE_ERRNO + 5 );
define( 'RUNTIME__MAGNOLIA_DATABASE_REQN__GET_TEMPORARY_IDENTIFIER__ERRNO',
        RUNTIME_MAGNOLIA_BASE_ERRNO + 6 );
define( 'RUNTIME__MAGNOLIA_DATABASE_REQN__REFRESH_STUDY_DATA_FILES__ERRNO',
        RUNTIME_MAGNOLIA_BASE_ERRNO + 7 );
define( 'RUNTIME__MAGNOLIA_DATABASE_REQN__GENERATE_DATA_DIRECTORY__ERRNO',
        RUNTIME_MAGNOLIA_BASE_ERRNO + 8 );
define( 'RUNTIME__MAGNOLIA_DATABASE_REQN__ASSERT_DEADLINE__ERRNO',
        RUNTIME_MAGNOLIA_BASE_ERRNO + 9 );
define( 'RUNTIME__MAGNOLIA_DATABASE_REQN_VERSION__GENERATE_COAPPLICANT_AGREEMENT_TEMPLATE_FORM__ERRNO',
        RUNTIME_MAGNOLIA_BASE_ERRNO + 10 );
define( 'RUNTIME__MAGNOLIA_DATABASE_REQN_VERSION__GENERATE_PDF_FORMS__ERRNO',
        RUNTIME_MAGNOLIA_BASE_ERRNO + 11 );
define( 'RUNTIME__MAGNOLIA_DATABASE_REQN_VERSION__GENERATE_DATA_OPTION_LIST_CSV__ERRNO',
        RUNTIME_MAGNOLIA_BASE_ERRNO + 12 );
define( 'RUNTIME__MAGNOLIA_SERVICE_FINAL_REPORT_OUTPUT_PATCH__EXECUTE__ERRNO',
        RUNTIME_MAGNOLIA_BASE_ERRNO + 13 );
define( 'RUNTIME__MAGNOLIA_SERVICE_OUTPUT_OUTPUT_SOURCE_PATCH__EXECUTE__ERRNO',
        RUNTIME_MAGNOLIA_BASE_ERRNO + 14 );
define( 'RUNTIME__MAGNOLIA_SERVICE_OUTPUT_SOURCE_PATCH__EXECUTE__ERRNO',
        RUNTIME_MAGNOLIA_BASE_ERRNO + 15 );
define( 'RUNTIME__MAGNOLIA_SERVICE_REQN_ETHICS_APPROVAL_PATCH__EXECUTE__ERRNO',
        RUNTIME_MAGNOLIA_BASE_ERRNO + 16 );
define( 'RUNTIME__MAGNOLIA_SERVICE_REQN_OUTPUT_PATCH__EXECUTE__ERRNO',
        RUNTIME_MAGNOLIA_BASE_ERRNO + 17 );
define( 'RUNTIME__MAGNOLIA_SERVICE_REQN_PATCH__EXECUTE__ERRNO',
        RUNTIME_MAGNOLIA_BASE_ERRNO + 18 );
define( 'RUNTIME__MAGNOLIA_SERVICE_REQN_VERSION_PATCH__EXECUTE__ERRNO',
        RUNTIME_MAGNOLIA_BASE_ERRNO + 19 );
define( 'RUNTIME__MAGNOLIA_SERVICE_SUPPLEMENTAL_FILE_PATCH__EXECUTE__ERRNO',
        RUNTIME_MAGNOLIA_BASE_ERRNO + 20 );

/**
 * "system" error codes
 * 
 * Since system errors already have codes this list is likely to stay empty.
 * Note the following PHP error codes:
 *      1: error,
 *      2: warning,
 *      4: parse,
 *      8: notice,
 *     16: core error,
 *     32: core warning,
 *     64: compile error,
 *    128: compile warning,
 *    256: user error,
 *    512: user warning,
 *   1024: user notice
 */

