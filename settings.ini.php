<?php
/**
 * settings.ini.php
 *
 * Defines initialization settings for magnolia.
 * DO NOT edit this file, to override these settings use settings.local.ini.php instead.
 * Any changes in the local ini file will override the settings found here.
 */

global $SETTINGS;

// tagged version
$SETTINGS['general']['application_name'] = 'magnolia';
$SETTINGS['general']['instance_name'] = $SETTINGS['general']['application_name'];
$SETTINGS['general']['version'] = '2.9';
$SETTINGS['general']['build'] = '933128a';

// the location of magnolia internal path
$SETTINGS['path']['APPLICATION'] = str_replace( '/settings.ini.php', '', __FILE__ );

// the location of coapplicant agreements (defaults to magnolia/doc/coapplicant_agreement)
$SETTINGS['path']['COAPPLICANT_AGREEMENT'] = str_replace( 'settings.ini.php', 'doc/coapplicant_agreement', __FILE__ );

// the location of proof of peer review (defaults to magnolia/doc/peer_review)
$SETTINGS['path']['PEER_REVIEW'] = str_replace( 'settings.ini.php', 'doc/peer_review', __FILE__ );

// the location of funding letters (defaults to magnolia/doc/funding_letter)
$SETTINGS['path']['FUNDING_LETTER'] = str_replace( 'settings.ini.php', 'doc/funding_letter', __FILE__ );

// the location of ethics letters from the review process (defaults to magnolia/doc/ethics_letter)
$SETTINGS['path']['ETHICS_LETTER'] = str_replace( 'settings.ini.php', 'doc/ethics_letter', __FILE__ );

// the location of ethics approvals from the active stage (defaults to magnolia/doc/ethics_letter)
$SETTINGS['path']['ETHICS_APPROVAL'] = str_replace( 'settings.ini.php', 'doc/ethics_approval', __FILE__ );

// the location of data_sharing letters (defaults to magnolia/doc/data_sharing_letter)
$SETTINGS['path']['DATA_SHARING_LETTER'] = str_replace( 'settings.ini.php', 'doc/data_sharing_letter', __FILE__ );

// the location of indigenous letters of support (defaults to magnolia/doc/indigenous)
$SETTINGS['path']['INDIGENOUS_FILE'] = str_replace( 'settings.ini.php', 'doc/indigenous', __FILE__ );

// the location of agreement letters (defaults to magnolia/doc/agreement_letter)
$SETTINGS['path']['AGREEMENT_LETTER'] = str_replace( 'settings.ini.php', 'doc/agreement_letter', __FILE__ );

// the location of requisition instructions (defaults to magnolia/doc/data_instruction)
$SETTINGS['path']['INSTRUCTION_FILE'] = str_replace( 'settings.ini.php', 'doc/data_instruction', __FILE__ );

// the location of requisition output sources (defaults to magnolia/doc/output_source)
$SETTINGS['path']['OUTPUT_SOURCE'] = str_replace( 'settings.ini.php', 'doc/output_source', __FILE__ );

// the location of packaged data (defaults to mangolia/doc/packaged_data)
$SETTINGS['path']['PACKAGED_DATA'] = str_replace( 'settings.ini.php', 'doc/packaged_data', __FILE__ );

// the location of study data documents (defaults to magnolia/doc/study_data)
$SETTINGS['path']['STUDY_DATA'] = str_replace( 'settings.ini.php', 'doc/study_data', __FILE__ );

// the location of study data documents (relative to the base magnolia URL)
$SETTINGS['url']['STUDY_DATA'] = 'study_data';

// add modules used by the application
$SETTINGS['module']['pdf'] = true;

// how many months past a requisition's deadline must its start date be?
$SETTINGS['general']['start_date_delay'] = 6;

// how many months past a requisition's deadline must its start date be?
$SETTINGS['general']['max_references_per_reqn'] = 20;

// how many weeks before a notification is sent to remind of a deferrred reqn
$SETTINGS['general']['deferred_reminder'] = 6;

// how many days that study data remains available to the user
$SETTINGS['general']['study_data_expiry'] = 7;

// how many months before an unsubmitted reqn is considered expired
$SETTINGS['general']['unsubmitted_reqn_expiry'] = 18;

// how many days to try sending a scheduled notification before giving up
$SETTINGS['general']['scheduled_notification_retry_days'] = 5;
