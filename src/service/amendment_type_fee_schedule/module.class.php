<?php
/**
 * module.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\service\amendment_type_fee_schedule;
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

    $modifier->join( 'amendment_type', 'amendment_type_fee_schedule.amendment_type_id', 'amendment_type.id' );
    $modifier->join( 'fee_schedule', 'amendment_type_fee_schedule.fee_schedule_id', 'fee_schedule.id' );
  }
}
