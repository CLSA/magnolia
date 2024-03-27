<?php
/**
 * module.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\service\coapplicant;
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
    $modifier->left_join( 'country', 'coapplicant.country_id', 'country.id' );

    $db_coapplicant = $this->get_resource();
    if( !is_null( $db_coapplicant ) )
    {
      $select->add_table_column( 'country', 'name', 'formatted_country_id' );
    }
  }
}
