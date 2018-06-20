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

    // add the total number of reqns
    if( $select->has_column( 'reqn_count' ) )
    {
      $join_sel = lib::create( 'database\select' );
      $join_sel->from( 'reqn_last_stage' );
      $join_sel->add_table_column( 'stage', 'stage_type_id' );
      $join_sel->add_column(
        'IF( stage.reqn_id IS NOT NULL, COUNT(*), 0 )',
        'reqn_count',
        false
      );

      $join_mod = lib::create( 'database\modifier' );
      $join_mod->join( 'stage', 'reqn_last_stage.stage_id', 'stage.id' );
      $join_mod->group( 'stage.stage_type_id' );

      $modifier->left_join(
        sprintf( '( %s %s ) AS stage_type_join_reqn', $join_sel->get_sql(), $join_mod->get_sql() ),
        'stage_type.id',
        'stage_type_join_reqn.stage_type_id' );
      $select->add_column( 'IFNULL( reqn_count, 0 )', 'reqn_count', false );
    }
  }
}
