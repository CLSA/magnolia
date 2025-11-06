<?php
/**
 * amendment.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\database;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * amendment: record
 */
class amendment extends \cenozo\database\record
{
  /**
   * Determines the next amendment name
   */
  public function get_next_amendment_name()
  {
    $name = $this->name;
    return '.' == $name ? 'A' : ++$name;
  }

  /**
   * Update's the amendments fee by calculating it from its newest reqn_version
   */
  public function update_fee()
  {
    $reqn_version_class_name = lib::get_class_name( 'database\reqn_version' );

    // get the highest version reqn_version for this amendment
    $reqn_version_sel = lib::create( 'database\select' );
    $reqn_version_sel->add_column( 'MAX( version )', 'max_version', false );
    $reqn_version_mod = lib::create( 'database\modifier' );
    $reqn_version_mod->where( 'amendment_id', '=', $this->id );

    $max_version =
      current( $reqn_version_class_name::select( $reqn_version_sel, $reqn_version_mod ) )['max_version'];
    $fee = $reqn_version_class_name::get_unique_record(
      ['amendment_id', 'version'],
      [$this->id, $max_version]
    )->calculate_fee();

    // now subtract the total fee of all previous amendment
    $amendment_sel = lib::create( 'database\select' );
    $amendment_sel->add_column( 'IFNULL( SUM( fee ), 0 )', 'total_fee', false );
    $amendment_mod = lib::create( 'database\modifier' );
    $amendment_mod->where( 'reqn_id', '=', $this->reqn_id );
    $amendment_mod->where( 'name', '<', $this->name );
    $total_fee = current( static::select( $amendment_sel, $amendment_mod ) )['total_fee'];

    $this->fee = $fee - $total_fee;
    $this->save();
  }
}
