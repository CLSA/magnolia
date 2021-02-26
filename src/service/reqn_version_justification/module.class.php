<?php
/**
 * module.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\service\reqn_version_justification;
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

    $modifier->join( 'reqn_version', 'reqn_version_justification.reqn_version_id', 'reqn_version.id' );
    $modifier->join( 'data_option', 'reqn_version_justification.data_option_id', 'data_option.id' );
  }
}
