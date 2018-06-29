<?php
/**
 * module.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\service\dsac_review;
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

    $modifier->left_join( 'user', 'dsac_review.user_id', 'user.id' );

    if( !is_null( $this->get_resource() ) )
    {
      // include the requisition identifier and user first/last/name as supplemental data
      $select->add_column( 'reqn.identifier', 'formatted_reqn_id', false );
      $select->add_column( 'CONCAT( user.first_name, " ", user.last_name, " (", user.name, ")" )', 'formatted_user_id', false );
    }

    if( $select->has_column( 'user_full_name' ) )
      $select->add_column( 'CONCAT( user.first_name, " ", user.last_name )', 'user_full_name', false );
  }
}
