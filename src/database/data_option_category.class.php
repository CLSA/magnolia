<?php
/**
 * data_option_category.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\database;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * data_option_category: record
 */
class data_option_category extends \cenozo\database\has_rank
{
  /**
   * Returns a list of all study phases used by all categories
   * @return array(database\study_phase)
   */
  public static function get_all_study_phase_list()
  {
    $study_phase_sel = lib::create( 'database\select' );
    $study_phase_sel->from( 'data_option_category_has_study_phase' );
    $study_phase_sel->add_table_column( 'study_phase', 'id' );
    $study_phase_sel->set_distinct( true );
    $study_phase_mod = lib::create( 'database\modifier' );
    $study_phase_mod->join( 'study_phase', 'data_option_category_has_study_phase.study_phase_id', 'study_phase.id' );
    $study_phase_mod->order( 'study_phase.rank' );

    $study_phase_list = array();
    foreach( static::db()->get_col( sprintf( '%s %s', $study_phase_sel->get_sql(), $study_phase_mod->get_sql() ) ) as $id )
      $study_phase_list[] = lib::create( 'database\study_phase', $id );

    return $study_phase_list;
  }
}
