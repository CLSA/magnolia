<?php
/**
 * module.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\service\amendment;
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

    $modifier->join( 'reqn', 'amendment.reqn_id', 'reqn.id' );

    if( $select->has_column( 'formatted_name' ) )
      $select->add_column( 'IF("." = amendment.name, "(N/A)", amendment.name)', 'formatted_name', false );
  }
}
