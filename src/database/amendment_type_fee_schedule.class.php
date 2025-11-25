<?php
/**
 * amendment_type_fee_schedule.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\database;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * amendment_type_fee_schedule: record
 */
class amendment_type_fee_schedule extends \cenozo\database\record
{
  /**
   * Override the parent method
   */
  public function save()
  {
    $fees_changed = $this->has_column_changed( ['fee_national', 'fee_international'] );

    parent::save();

    if( $fees_changed )
    {
      // we need to update the fees for all amendments using this fee_schedule
      $select = lib::create( 'database\select' );
      $select->add_column( 'amendment_id' );
      $select->set_distinct( true );
      $modifier = lib::create( 'database\modifier' );
      $modifier->join( 'amendment', 'reqn_version.amendment_id', 'amendment.id' );
      $modifier->order( 'amendment.reqn_id' );
      $modifier->order( 'amendment.name' );
      foreach( $this->get_amendment_type()->get_reqn_version_list( $select, $modifier ) as $row )
      {
        $db_amendment = lib::create( 'database\amendment', $row['amendment_id'] );
        $db_amendment->update_fee();
      }
    }
  }
}
