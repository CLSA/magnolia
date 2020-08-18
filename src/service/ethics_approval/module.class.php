<?php
/**
 * module.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\service\ethics_approval;
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

    if( $select->has_column( 'one_day_old' ) )
    {
      $select->add_column(
        'IFNULL( TIMESTAMPDIFF( HOUR, ethics_approval.create_timestamp, NOW() ) < 24, false )',
        'one_day_old',
        false,
        'boolean'
      );
    }
  }
}
