<?php
/**
 * module.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\service\data_option;
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

    $modifier->join( 'data_option_category', 'data_option.data_option_category_id', 'data_option_category.id' );

    if( $select->has_column( 'bl' ) )
    {
      $join_sel = lib::create( 'database\select' );
      $join_sel->from( 'data_option_has_study_phase' );
      $join_sel->add_column( 'data_option_id' );

      $join_mod = lib::create( 'database\modifier' );
      $join_mod->join( 'study_phase', 'data_option_has_study_phase.study_phase_id', 'study_phase.id' );
      $join_mod->where( 'study_phase.code', '=', 'bl' );
      
      $modifier->left_join(
        sprintf( '( %s %s ) AS data_option_has_bl', $join_sel->get_sql(), $join_mod->get_sql() ),
        'data_option.id',
        'data_option_has_bl.data_option_id'
      );
      $select->add_column( 'data_option_has_bl.data_option_id IS NOT NULL', 'bl', false, 'boolean' );
    }

    if( $select->has_column( 'f1' ) )
    {
      $join_sel = lib::create( 'database\select' );
      $join_sel->from( 'data_option_has_study_phase' );
      $join_sel->add_column( 'data_option_id' );

      $join_mod = lib::create( 'database\modifier' );
      $join_mod->join( 'study_phase', 'data_option_has_study_phase.study_phase_id', 'study_phase.id' );
      $join_mod->where( 'study_phase.code', '=', 'f1' );
      
      $modifier->left_join(
        sprintf( '( %s %s ) AS data_option_has_f1', $join_sel->get_sql(), $join_mod->get_sql() ),
        'data_option.id',
        'data_option_has_f1.data_option_id'
      );
      $select->add_column( 'data_option_has_f1.data_option_id IS NOT NULL', 'f1', false, 'boolean' );
    }
  }
}
