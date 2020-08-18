<?php
/**
 * query.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\service\reqn;
use cenozo\lib, cenozo\log, magnolia\util;

class query extends \cenozo\service\query
{
  /**
   * Extends the parent method
   */
  protected function execute()
  {
    parent::execute();

    if( $this->get_argument( 'expire_data', false ) )
    {
      $reqn_class_name = lib::get_class_name( 'database\reqn' );
      $this->set_data( $reqn_class_name::expire_data() );
    }

    if( $this->get_argument( 'send_expired_ethics_notifications', false ) )
    {
      $reqn_class_name = lib::get_class_name( 'database\reqn' );
      $this->set_data( $reqn_class_name::send_expired_ethics_notifications() );
    }
  }
}
