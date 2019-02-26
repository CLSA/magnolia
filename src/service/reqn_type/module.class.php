<?php
/**
 * module.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\service\reqn_type;
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

    // add a list of stage types
    if( $select->has_column( 'stage_type_list' ) )
      $this->add_list_column( 'stage_type_list', 'stage_type', 'name', $select, $modifier, NULL, NULL, 'rank' );

    // add the total number of reqns
    if( $select->has_column( 'reqn_count' ) )
      $this->add_count_column( 'reqn_count', 'reqn', $select, $modifier );
  }
}
