<?php
/**
 * module.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\service\stage_type;
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

    $modifier->left_join( 'notification_type', 'stage_type.notification_type_id', 'notification_type.id' );

    // add the total number of reqns
    if( $select->has_column( 'reqn_count' ) )
    {
      // we can't use parent::add_count_column() since we have to restrict to open stages
      $join_sel = lib::create( 'database\select' );
      $join_sel->from( 'stage_type' );
      $join_sel->add_column( 'id', 'stage_type_id' );
      $join_sel->add_column( 'IF( stage.reqn_id IS NOT NULL, COUNT(*), 0 )', 'reqn_count', false );

      $join_mod = lib::create( 'database\modifier' );
      $join_mod->left_join( 'stage', 'stage_type.id', 'stage.stage_type_id' );
      $join_mod->group( 'stage_type.id' );
      $join_mod->where( 'stage.datetime', '=', NULL ); // only include open stages

      $modifier->left_join(
        sprintf( '( %s %s ) AS stage_type_join_stage', $join_sel->get_sql(), $join_mod->get_sql() ),
        'stage_type.id',
        'stage_type_join_stage.stage_type_id' );
      $select->add_column( 'IFNULL( reqn_count, 0 )', 'reqn_count', false );
    }
  }
}
