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

  /**
   * Returns the next availble identifier for this deadline (yymm##)
   * @access public
   */
  public function get_next_identifier()
  {
    $requisition_class_name = lib::get_class_name( 'database\requisition' );
    $base = $this->date->format( 'ym' );
    $requisition_sel = lib::create( 'database\select' );
    $requisition_sel->add_column( 'identifier' );
    $requisition_mod = lib::create( 'database\modifier' );
    $requisition_mod->where( 'identifier', 'LIKE', $base.'__' );
    $requisition_mod->order_desc( 'identifier' );
    $requisition_mod->limit( 1 );
    $requisition_list = $requisition_class_name::select( $requisition_sel, $requisition_mod );
    
    $number = 0 < count( $requisition_list ) ? substr( $requisition_list[0]['identifier'], 4 ) + 1 : 1;
    return $base.str_pad( $number, 2, '0', STR_PAD_LEFT );
  }
}
