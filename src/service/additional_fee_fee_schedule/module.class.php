<?php
/**
 * module.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\service\additional_fee_fee_schedule;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * Performs operations which effect how this module is used in a service
 */
class module extends \cenozo\service\module
{
  /**
   * Extend parent method
   */
  public function prepare_read( $select, $modifier )
  {
    parent::prepare_read( $select, $modifier );

    $modifier->join( 'additional_fee', 'additional_fee_fee_schedule.additional_fee_id', 'additional_fee.id' );
    $modifier->join( 'fee_schedule', 'additional_fee_fee_schedule.fee_schedule_id', 'fee_schedule.id' );
  }
}
