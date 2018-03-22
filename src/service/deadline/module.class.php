<?php
/**
 * module.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\service\deadline;
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
    // add the total number of reqns
    if( $select->has_column( 'reqn_count' ) )
    {
      $join_sel = lib::create( 'database\select' );
      $join_sel->from( 'reqn' );
      $join_sel->add_column( 'deadline_id' );
      $join_sel->add_column( 'COUNT(*)', 'reqn_count', false );

      $join_mod = lib::create( 'database\modifier' );
      $join_mod->group( 'deadline_id' );

      $modifier->left_join(
        sprintf( '( %s %s ) AS deadline_join_reqn', $join_sel->get_sql(), $join_mod->get_sql() ),
        'deadline.id',
        'deadline_join_reqn.deadline_id' );
      $select->add_column( 'IFNULL( reqn_count, 0 )', 'reqn_count', false );
    }
  }
}
