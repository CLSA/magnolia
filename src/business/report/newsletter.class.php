<?php
/**
 * newsletter.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\business\report;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * Call history report
 */
class newsletter extends \cenozo\business\report\base_report
{
  /**
   * Build the report
   * @access protected
   */
  protected function build()
  {
    $user_class_name = lib::get_class_name( 'database\user' );

    $modifier = lib::create( 'database\modifier' );
    $modifier->join( 'applicant', 'user.id', 'applicant.user_id' );
    $modifier->order( 'user.last_name' );
    $modifier->order( 'user.first_name' );

    $select = lib::create( 'database\select' );
    $select->from( 'user' );
    $select->add_column( 'first_name', 'First Name' );
    $select->add_column( 'last_name', 'Last Name' );
    $select->add_column( 'email', 'Email' );
    $select->add_column( 'IF( applicant.newsletter, "Yes", "No" )', 'Newsletter', false );

    $this->add_table_from_select( NULL, $user_class_name::select( $select, $modifier ) );
  }
}
