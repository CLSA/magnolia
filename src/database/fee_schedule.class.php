<?php
/**
 * fee_schedule.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\database;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * fee_schedule: record
 */
class fee_schedule extends \cenozo\database\record
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
      $modifier = lib::create( 'database\modifier' );
      $modifier->order( 'amendment.reqn_id' );
      $modifier->order( 'amendment.name' );
      foreach( $this->get_amendment_object_list( $modifier ) as $db_amendment )
        $db_amendment->update_fee();
    }
  }

  /**
   * Returns the current fee schedule based on datetime
   * @return database\fee_schedule
   * @static
   */
  public static function get_current()
  {
    $select = lib::create( 'database\select' );
    $select->add_column( 'id' );
    $select->from( 'fee_schedule' );
    $modifier = lib::create( 'database\modifier' );
    $modifier->where( 'datetime', '<', util::get_datetime_object() );
    $modifier->order_desc( 'datetime' );
    $modifier->limit( 1 );
    $id = static::db()->get_one( sprintf( '%s %s', $select->get_sql(), $modifier->get_sql() ) );

    if( is_null( $id ) )
    {
      throw lib::create( 'exception\runtime',
        'Unable to get current fee schedule as none have been created.',
        __METHOD__
      );
    }

    return lib::create( 'database\fee_schedule', $id );
  }
}
