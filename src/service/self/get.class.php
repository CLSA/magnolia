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
    $setting_manager = lib::create( 'business\setting_manager' );
    $db_user = lib::create( 'business\session' )->get_user();

    $resource = parent::create_resource( $index );
    $resource['application']['start_date_delay'] = $setting_manager->get_setting( 'general', 'start_date_delay' );
    $resource['application']['max_references_per_reqn'] = $setting_manager->get_setting( 'general', 'max_references_per_reqn' );
    $resource['user']['newsletter'] = $db_user->get_newsletter();
    return $resource;
  }
}
