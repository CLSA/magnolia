<?php
/**
 * module.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\service\notification_type;
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

    // add the total number of notifications
    if( $select->has_column( 'notification_count' ) )
    {
      $join_sel = lib::create( 'database\select' );
      $join_sel->from( 'notification_type' );
      $join_sel->add_column( 'id', 'notification_type_id' );
      $join_sel->add_column( 'IF( notification.id IS NULL, 0, COUNT(*) )', 'notification_count', false );
      $join_mod = lib::create( 'database\modifier' );
      $join_mod->left_join( 'notification', 'notification_type.id', 'notification.notification_type_id' );
      $join_mod->group( 'notification_type.id' );

      $modifier->left_join(
        sprintf(
          '( %s %s ) AS notification_type_count_join_notification',
          $join_sel->get_sql(),
          $join_mod->get_sql()
        ),
        'notification_type.id',
        'notification_type_count_join_notification.notification_type_id'
      );

      $join_sel = lib::create( 'database\select' );
      $join_sel->from( 'notification_type' );
      $join_sel->add_column( 'id', 'notification_type_id' );
      $join_sel->add_column(
        'IF( manuscript_notification.id IS NULL, 0, COUNT(*) )',
        'notification_count',
        false
      );
      $join_mod = lib::create( 'database\modifier' );
      $join_mod->left_join(
        'manuscript_notification',
        'notification_type.id',
        'manuscript_notification.notification_type_id'
      );
      $join_mod->group( 'notification_type.id' );

      $modifier->left_join(
        sprintf(
          '( %s %s ) AS notification_type_count_join_manuscript_notification',
          $join_sel->get_sql(),
          $join_mod->get_sql()
        ),
        'notification_type.id',
        'notification_type_count_join_manuscript_notification.notification_type_id'
      );

      $select->add_column(
        'IFNULL( notification_type_count_join_notification.notification_count, 0 ) + '.
        'IFNULL( notification_type_count_join_manuscript_notification.notification_count, 0 )',
        'notification_count',
        false
      );
    }
  }
}
