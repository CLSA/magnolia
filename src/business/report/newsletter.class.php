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
    $stage_type_class_name = lib::get_class_name( 'database\stage_type' );
    $user_class_name = lib::get_class_name( 'database\user' );

    $db_new_stage_type = $stage_type_class_name::get_unique_record( 'name', 'New' );

    $modifier = lib::create( 'database\modifier' );
    $modifier->join( 'applicant', 'user.id', 'applicant.user_id' );
    $join_mod = lib::create( 'database\modifier' );
    $join_mod->where( 'user.id', '=', 'reqn.user_id', false );
    $join_mod->or_where( 'user.id', '=', 'reqn.trainee_user_id', false );
    $modifier->join_modifier( 'reqn', $join_mod, 'left' );
    $join_mod = lib::create( 'database\modifier' );
    $join_mod->where( 'reqn.id', '=', 'stage.reqn_id', false );
    $join_mod->where( 'stage.stage_type_id', '!=', $db_new_stage_type->id );
    $join_mod->where( 'stage.datetime', '=', NULL );
    $modifier->join_modifier( 'stage', $join_mod, 'left' );
    $modifier->group( 'user.id' );
    $modifier->order( 'user.last_name' );
    $modifier->order( 'user.first_name' );

    $select = lib::create( 'database\select' );
    $select->from( 'user' );
    $select->add_column( 'first_name', 'First Name' );
    $select->add_column( 'last_name', 'Last Name' );
    $select->add_column( 'email', 'Email' );
    $select->add_column( 'SUM( IF( stage.id, 1, 0 ) )', 'Submitted Requisitions', false );
    $select->add_column( 'IF( applicant.newsletter, "Yes", "No" )', 'Newsletter', false );

    $this->add_table_from_select( NULL, $user_class_name::select( $select, $modifier ) );
  }
}
