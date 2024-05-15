<?php
/**
 * module.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\service\data_release;
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

    $modifier->join( 'data_version', 'data_release.data_version_id', 'data_version.id' );

    if( !is_null( $this->get_resource() ) )
    {
      // include the requisition identifier and user first/last/name as supplemental data
      $select->add_column( 'reqn.identifier', 'formatted_identifier', false );
    }
  }
}
