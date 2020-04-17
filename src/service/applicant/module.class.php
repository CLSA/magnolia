<?php
/**
 * module.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\service\applicant;
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

    $modifier->join( 'user', 'applicant.user_id', 'user.id' );
    $modifier->join( 'user', 'applicant.supervisor_user_id', 'supervisor_user.id', '', 'supervisor_user' );

    if( $select->has_column( 'user_full_name' ) )
    {
      $select->add_table_column(
        'user',
        'CONCAT_WS( " ", user.first_name, user.last_name )',
        'user_full_name',
        false
      );
    }

    if( $select->has_column( 'supervisor_full_name' ) )
    {
      $select->add_table_column(
        'supervisor_user',
        'CONCAT_WS( " ", supervisor_user.first_name, supervisor_user.last_name )',
        'supervisor_full_name',
        false
      );
    }
  }
}
