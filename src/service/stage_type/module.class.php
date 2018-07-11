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
      $join_sel->from( 'stage_type' );
      $join_sel->add_column( 'id', 'stage_type_id' );
      $join_sel->add_column(
        'IF( stage.id IS NOT NULL, COUNT(*), 0 )',
        'reqn_count',
        false
      );

      $sub_mod = lib::create( 'database\modifier' );
      $sub_mod->where( 'stage_type.id', '=', 'stage.stage_type_id', false );
      $sub_mod->where( 'stage.datetime', '=', NULL );

      $join_mod = lib::create( 'database\modifier' );
      $join_mod->join_modifier( 'stage', $sub_mod, 'left' );
      $join_mod->group( 'stage_type.id' );

      $modifier->left_join(
        sprintf( '( %s %s ) AS stage_join', $join_sel->get_sql(), $join_mod->get_sql() ),
        'stage_type.id',
        'stage_join.stage_type_id' );
      $select->add_table_column( 'stage_join', 'reqn_count' );
    }
  }
}
