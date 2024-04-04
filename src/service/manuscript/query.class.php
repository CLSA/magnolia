<?php
/**
 * query.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\service\manuscript;
use cenozo\lib, cenozo\log, magnolia\util;

class query extends \cenozo\service\query
{
  /**
   * Extends the parent method
   */
  protected function execute()
  {
    parent::execute();

    if( $this->get_argument( 'send_deferred_reminder_notifications', false ) )
    {
      $manuscript_class_name = lib::get_class_name( 'database\manuscript' );
      $this->set_data( $manuscript_class_name::send_deferred_reminder_notifications() );
    }
  }
}
