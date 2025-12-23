<?php
/**
 * additional_fee_fee_schedule.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\database;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * additional_fee_fee_schedule: record
 */
class additional_fee_fee_schedule extends \cenozo\database\record
{
  /**
   * Override the parent method
   */
  public function save()
  {
    $fees_changed = $this->has_column_changed( 'fee' );

    parent::save();

    if( $fees_changed )
    {
      // we need to update the fees for all amendments using this fee_schedule
      $select = lib::create( 'database\select' );
      $select->add_table_column( 'amendment', 'id', 'amendment_id' );
      $modifier = lib::create( 'database\modifier' );
      $modifier->join( 'amendment', 'reqn.id', 'amendment.reqn_id' );
      $modifier->order( 'amendment.reqn_id' );
      $modifier->order( 'amendment.name' );
      foreach( $this->get_additional_fee()->get_reqn_list( $select, $modifier ) as $row )
      {
        $db_amendment = lib::create( 'database\amendment', $row['amendment_id'] );
        $db_amendment->update_fee();
      }
    }
  }
}
