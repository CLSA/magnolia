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

    $agreement_stage_type_id = $stage_type_class_name::get_unique_record( 'name', 'Agreement' )->id;
    $dm_stage_type_id = $stage_type_class_name::get_unique_record( 'name', 'Decision Made' )->id;

    $data = array();

    $select = lib::create( 'database\select' );
    $modifier = lib::create( 'database\modifier' );

    $select->from( 'reqn' );

    // join to the base "." amendment
    $join_mod = lib::create( 'database\modifier' );
    $join_mod->where( 'reqn.id', '=', 'amendment.reqn_id', false );
    $join_mod->where( 'amendment.name', '=', '.' );
    $modifier->join_modifier( 'amendment', $join_mod );

    // determine whether the reqn_type includes the decision made stage
    $modifier->join( 'reqn_type', 'reqn.reqn_type_id', 'reqn_type.id' );
    $join_mod = lib::create( 'database\modifier' );
    $join_mod->where( 'reqn_type.id', '=', 'reqn_type_has_stage_type.reqn_type_id', false );
    $join_mod->where( 'reqn_type_has_stage_type.stage_type_id', '=', $dm_stage_type_id );
    $modifier->join_modifier( 'reqn_type_has_stage_type', $join_mod, 'left' );
    $modifier->join_current_reqn_version();

    // join to the current stage type
    $modifier->join_current_stage( 'reqn.id', 'current_stage' );
    $modifier->join(
      'stage_type',
      'current_stage.stage_type_id',
      'current_stage_type.id',
      '',
      'current_stage_type'
    );

    // do not include reqns not currently in the review or active phase
    $modifier->where( 'current_stage_type.phase', 'IN', ['review', 'active'] );

    // determine whether the reqn has reached a non-amendment agreement stage type
    $join_mod = lib::create( 'database\modifier' );
    $join_mod->where( 'amendment.id', '=', 'agreement_stage.amendment_id', false );
    $join_mod->where( 'agreement_stage.stage_type_id', '=', $agreement_stage_type_id );
    $join_mod->where( 'agreement_stage.amendment_id', '=', 'amendment.id', false );
    $modifier->join_modifier( 'stage', $join_mod, 'left', 'agreement_stage' );

    // determine whether the reqn has reached a non-amendment decision made stage type
    $join_mod = lib::create( 'database\modifier' );
    $join_mod->where( 'amendment.id', '=', 'dm_stage.amendment_id', false );
    $join_mod->where( 'dm_stage.stage_type_id', '=', $dm_stage_type_id );
    $join_mod->where( 'dm_stage.amendment_id', '=', 'amendment.id', false );
    $modifier->join_modifier( 'stage', $join_mod, 'left', 'dm_stage' );

    $modifier->where_bracket( true );

    // reqn types that do not have a decision made stage type must have reached the agreement stage
    $modifier->where_bracket( true );
    $modifier->where( 'reqn_type_has_stage_type.stage_type_id', '=', NULL );
    $modifier->where( 'agreement_stage.id', '!=', NULL );
    $modifier->where_bracket( false );

    // reqn types that have a decision made stage type must have reached it
    $modifier->where_bracket( true, true );
    $modifier->where( 'reqn_type_has_stage_type.stage_type_id', '!=', NULL );
    $modifier->where( 'dm_stage.id', '!=', NULL );
    $modifier->where_bracket( false );

    $modifier->where_bracket( false );

    $modifier->group( 'reqn.id' );

    // join to tables that include columns in the report
    $modifier->join( 'user', 'reqn.user_id', 'user.id' );
    $modifier->join( 'user', 'reqn.trainee_user_id', 'trainee_user.id', 'left', 'trainee_user' );
    $modifier->join( 'user', 'reqn.designate_user_id', 'designate_user.id', 'left', 'designate_user' );
    $modifier->order( 'reqn.identifier' );

    $select->add_column( 'Identifier', 'Identifier' );
    $select->add_column( 'reqn_version.title', 'Title', false );
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

    // make sure the reqn includes the data release if interest
    $modifier->join( 'data_release', 'reqn.id', 'data_release.reqn_id' );
    foreach( $this->get_restriction_list() as $restriction )
      if( 'data_version' == $restriction['name'] )
        $modifier->where( 'data_release.data_version_id', '=', $restriction['value'] );

    $this->add_table_from_select( NULL, $reqn_class_name::select( $select, $modifier ) );
  }
}
