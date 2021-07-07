<?php
/**
 * module.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\service\amendment_justification;
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

    $modifier->join( 'reqn_version', 'amendment_justification.reqn_version_id', 'reqn_version.id' );
    $modifier->join( 'amendment_type', 'amendment_justification.amendment_type_id', 'amendment_type.id' );
  }
}
