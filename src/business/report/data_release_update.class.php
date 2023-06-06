<?php
/**
 * data_release_update.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\business\report;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * Call history report
 */
class data_release_update extends \cenozo\business\report\base_report
{
  /**
   * Build the report
   * @access protected
   */
  protected function build()
  {
    $reqn_class_name = lib::get_class_name( 'database\reqn' );
    $stage_type_class_name = lib::get_class_name( 'database\stage_type' );

    $data = array();

    $select = lib::create( 'database\select' );
    $modifier = lib::create( 'database\modifier' );

    $select->from( 'reqn' );

    // only display reqns that have not reached the final report
    $db_stage_type = $stage_type_class_name::get_unique_record( 'name', 'Report Required' );

    $modifier->join( 'data_release', 'reqn.id', 'data_release.reqn_id' );
    $join_mod = lib::create( 'database\modifier' );
    $join_mod->where( 'reqn.id', '=', 'stage.reqn_id', false );
    $join_mod->where( 'stage.stage_type_id', '=', $db_stage_type->id );
    $modifier->join_modifier( 'stage', $join_mod, 'left' );
    $modifier->where( 'stage.id', '=', NULL );

    // join to tables that include columns in the report
    $modifier->join( 'user', 'reqn.user_id', 'user.id' );
    $modifier->join( 'user', 'reqn.trainee_user_id', 'trainee_user.id', 'left', 'trainee_user' );
    $modifier->join( 'user', 'reqn.designate_user_id', 'designate_user.id', 'left', 'designate_user' );
    $modifier->group( 'reqn.id' );
    $modifier->order( 'reqn.identifier' );

    $select->add_column( 'Identifier', 'Identifier' );
    $select->add_column( 'CONCAT_WS( " ", user.first_name, user.last_name )', 'Applicant Name', false );
    $select->add_column( 'user.email', 'Applicant Email', false );
    $select->add_column(
      'CONCAT_WS( " ", trainee_user.first_name, trainee_user.last_name )',
      'Trainee Name',
      false
    );
    $select->add_column( 'trainee_user.email', 'Trainee Email', false );
    $select->add_column(
      'CONCAT_WS( " ", designate_user.first_name, designate_user.last_name )',
      'Designate Name',
      false
    );
    $select->add_column( 'designate_user.email', 'Designate Email', false );
      
    // set up requirements
    $this->apply_restrictions( $modifier );

    foreach( $this->get_restriction_list() as $restriction )
      if( 'data_version' == $restriction['name'] )
        $modifier->where( 'data_release.data_version_id', '=', $restriction['value'] );

    $this->add_table_from_select( NULL, $reqn_class_name::select( $select, $modifier ) );
  }
}
