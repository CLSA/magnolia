<?php
/**
 * deadline.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\database;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * deadline: record
 */
class deadline extends \cenozo\database\record
{
  /**
   * Returns the next deadline
   * @static
   * @access public
   */
  public static function get_next()
  {
    $deadline_class_name = lib::get_class_name( 'database\deadline' );
    $deadline_mod = lib::create( 'database\modifier' );
    $deadline_mod->where( 'date', '>', 'DATE( UTC_TIMESTAMP() )', false );
    $deadline_mod->order( 'date' );
    $deadline_mod->limit( 1 );

    $deadline_list = static::select_objects( $deadline_mod );
    return 0 < count( $deadline_list ) ? current( $deadline_list ) : NULL;
  }
}
