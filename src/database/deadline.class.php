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
    $reqn_class_name = lib::get_class_name( 'database\reqn' );
    $base = $this->date->format( 'ym' );
    $reqn_sel = lib::create( 'database\select' );
    $reqn_sel->add_column( 'identifier' );
    $reqn_mod = lib::create( 'database\modifier' );
    $reqn_mod->where( 'identifier', 'LIKE', $base.'__' );
    $reqn_mod->order_desc( 'identifier' );
    $reqn_mod->limit( 1 );
    $reqn_list = $reqn_class_name::select( $reqn_sel, $reqn_mod );
    
    $number = 0 < count( $reqn_list ) ? substr( $reqn_list[0]['identifier'], 4 ) + 1 : 1;
    return $base.str_pad( $number, 2, '0', STR_PAD_LEFT );
  }
}
