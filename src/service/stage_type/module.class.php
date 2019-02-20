<?php
/**
 * module.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\service\stage_type;
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

    $modifier->left_join( 'notification_type', 'stage_type.notification_type_id', 'notification_type.id' );

    // add the total number of reqns
    if( $select->has_column( 'reqn_count' ) )
      $this->add_count_column( 'reqn_count', 'reqn', $select, $modifier, 'stage' );
  }
}
