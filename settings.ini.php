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
$SETTINGS['general']['version'] = '2.7';
$SETTINGS['general']['build'] = 'ef8b7c8';

// the location of magnolia internal path
$SETTINGS['path']['APPLICATION'] = str_replace( '/settings.ini.php', '', __FILE__ );

// the location of data application forms (defaults to magnolia/doc/data_application)
$SETTINGS['path']['DATA_APPLICATION'] = str_replace( 'settings.ini.php', 'doc/data_application', __FILE__ );

// the location of data checklist forms (defaults to magnolia/doc/data_checklist)
$SETTINGS['path']['DATA_CHECKLIST'] = str_replace( 'settings.ini.php', 'doc/data_checklist', __FILE__ );

// the location of data application forms (defaults to magnolia/doc/data_application)
$SETTINGS['path']['DATA_APPLICATION_AND_CHECKLIST'] = str_replace( 'settings.ini.php', 'doc/data_application_and_checklist', __FILE__ );

// the location of data checklist forms (defaults to magnolia/doc/data_checklist)
$SETTINGS['path']['DATA_OPTION_LIST'] = str_replace( 'settings.ini.php', 'doc/data_option_list', __FILE__ );

// the location of data reviews forms (defaults to magnolia/doc/data_reviews)
$SETTINGS['path']['DATA_REVIEWS'] = str_replace( 'settings.ini.php', 'doc/data_reviews', __FILE__ );

// the location of coapplicant agreements (defaults to magnolia/doc/coapplicant_agreement)
$SETTINGS['path']['COAPPLICANT_AGREEMENT'] = str_replace( 'settings.ini.php', 'doc/coapplicant_agreement', __FILE__ );

// the location of coapplicant agreement templates (defaults to magnolia/doc/coapplicant_agreement_template)
$SETTINGS['path']['COAPPLICANT_AGREEMENT_TEMPLATE'] = str_replace( 'settings.ini.php', 'doc/coapplicant_agreement_template', __FILE__ );

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

// the location of agreement letters (defaults to magnolia/doc/agreement_letter)
$SETTINGS['path']['AGREEMENT_LETTER'] = str_replace( 'settings.ini.php', 'doc/agreement_letter', __FILE__ );

// the location of requisition instructions (defaults to magnolia/doc/data_instruction)
$SETTINGS['path']['INSTRUCTION_FILE'] = str_replace( 'settings.ini.php', 'doc/data_instruction', __FILE__ );

// the location of requisition output sources (defaults to magnolia/doc/output_source)
$SETTINGS['path']['OUTPUT_SOURCE'] = str_replace( 'settings.ini.php', 'doc/output_source', __FILE__ );

// the location of final report forms (defaults to magnolia/doc/final_report)
$SETTINGS['path']['FINAL_REPORT'] = str_replace( 'settings.ini.php', 'doc/final_report', __FILE__ );

// the location of PDF form templates (defaults to magnolia/doc/pdf_form)
$SETTINGS['path']['PDF_FORM'] = str_replace( 'settings.ini.php', 'doc/pdf_form', __FILE__ );

// the location of supplemental files (defaults to magnolia/doc/supplemental)
$SETTINGS['path']['SUPPLEMENTAL_FILE'] = str_replace( 'settings.ini.php', 'doc/supplemental', __FILE__ );

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

// how many days that study data remains available to the user
$SETTINGS['general']['study_data_expiry'] = 7;
