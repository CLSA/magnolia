<?php
/**
 * stage_type.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\database;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * stage_type: record
 */
class stage_type extends \cenozo\database\has_rank
{
  /**
   * Returns an array of all stages which may come after this one
   * @return array( database\stage_type ) may contain 0, 1 or more stage-types
   * @access public
   */
  public function get_next_stage_type_list()
  {
    $select = lib::create( 'database\select' );
    $select->from( 'stage_type_has_stage_type' );
    $select->add_column( 'next_stage_type_id' );
    $modifier = lib::create( 'database\modifier' );
    $modifier->where( 'stage_type_id', '=', $this->id );
    $sql = sprintf( '%s %s', $select->get_sql(), $modifier->get_sql() );

    $next_stage_type_list = array();
    foreach( static::db()->get_col( $sql ) as $next_stage_type_id )
      $next_stage_type_list[] = new static( $next_stage_type_id );
    return $next_stage_type_list;
  }
}
