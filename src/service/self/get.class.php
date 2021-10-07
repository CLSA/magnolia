<?php
/**
 * get.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\service\self;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * Special service for handling the get meta-resource
 */
class get extends \cenozo\service\self\get
{
  /**
   * Override parent method since self is a meta-resource
   */
  protected function create_resource( $index )
  {
    $country_class_name = lib::get_class_name( 'database\country' );
    $setting_manager = lib::create( 'business\setting_manager' );

    $db_user = lib::create( 'business\session' )->get_user();
    $db_role = lib::create( 'business\session' )->get_role();
    $db_application = lib::create( 'business\session' )->get_application();
    $db_country = $country_class_name::get_unique_record( 'name', $db_application->country );

    $resource = parent::create_resource( $index );
    $resource['application']['start_date_delay'] = $setting_manager->get_setting( 'general', 'start_date_delay' );
    $resource['application']['max_references_per_reqn'] = $setting_manager->get_setting( 'general', 'max_references_per_reqn' );
    $resource['application']['study_data_expiry'] = $setting_manager->get_setting( 'general', 'study_data_expiry' );
    $resource['application']['study_data_url'] = sprintf( '%s/%s', str_replace( '/api', '', ROOT_URL ), STUDY_DATA_URL );
    $resource['application']['base_country_id'] = is_null( $db_country ) ? NULL : $db_country->id;
    $resource['user']['newsletter'] = $db_user->get_newsletter();

    return $resource;
  }
}
