<?php
/**
 * module.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\service\notification;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * Performs operations which effect how this module is used in a service
 */
class module extends \cenozo\service\module
{
  /**
   * Extend parent method
   */
  public function prepare_read( $select, $modifier )
  {
    parent::prepare_read( $select, $modifier );

    if( $select->has_column( 'emails' ) )
    {
      $join_sel = lib::create( 'database\select' );
      $join_sel->from( 'notification_email' );
      $join_sel->add_column( 'notification_id' );
      $join_sel->add_column( 'GROUP_CONCAT( email ORDER BY email SEPARATOR ", " )', 'emails', false );

      $join_mod = lib::create( 'database\modifier' );
      $join_mod->group( 'notification_id' );

      $modifier->join(
        sprintf( '( %s %s ) AS notification_join_email', $join_sel->get_sql(), $join_mod->get_sql() ),
        'notification.id',
        'notification_join_email.notification_id'
      );

      $select->add_column( 'notification_join_email.emails', 'emails', false );
    }
  }
}
