<?php
/**
 * reqn_type.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\database;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * reqn_type: record
 */
class reqn_type extends \cenozo\database\record
{
  /**
   * Determines whether this requisition type requires a deadline
   * 
   * @access public
   * @return boolean
   */
  public function is_deadline_required()
  {
    // deadlines are only required if the type goes through the DSAC review process
    $stage_type_mod = lib::create( 'database\modifier' );
    $stage_type_mod->where( 'stage_type.name', 'LIKE', 'DSAC %' );
    return 0 < $this->get_stage_type_count( $stage_type_mod );
  }

  /**
   * Returns the next availble identifier for this reqn type (yy###CC)
   * 
   * Note that this should only be used by reqn types which do not require a deadline
   * @access public
   */
  public function get_next_identifier()
  {
    $base = sprintf(
      '%s%s',
      util::get_datetime_object()->format( 'y' ),
      strtoupper( substr( $this->name, 0, 2 ) )
    );

    $reqn_sel = lib::create( 'database\select' );
    $reqn_sel->add_column( 'identifier' );
    $reqn_mod = lib::create( 'database\modifier' );
    $reqn_mod->where( 'identifier', 'LIKE', $base.'___' );
    $reqn_mod->order_desc( 'identifier' );
    $reqn_mod->limit( 1 );
    $reqn_list = $this->get_reqn_list( $reqn_sel, $reqn_mod );

    $number = 0 < count( $reqn_list ) ? substr( $reqn_list[0]['identifier'], 4 ) + 1 : 1;
    return $base.str_pad( $number, 3, '0', STR_PAD_LEFT );
  }
}
