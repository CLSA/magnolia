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
    $session = lib::create( 'business\session' );

    $resource = parent::create_resource( $index );
    $resource['application']['start_date_delay'] = $setting_manager->get_setting( 'general', 'start_date_delay' );
    return $resource;
  }
}
