<?php
/**
 * reference.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\business\report;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * Call history report
 */
class reference extends \cenozo\business\report\base_report
{
  /**
   * Build the report
   * @access protected
   */
  protected function build()
  {
    $reqn_class_name = lib::get_class_name( 'database\reqn' );
    $review_type_class_name = lib::get_class_name( 'database\review_type' );
    $recommendation_type_class_name = lib::get_class_name( 'database\recommendation_type' );
    $stage_type_class_name = lib::get_class_name( 'database\stage_type' );
    $coapplicant_class_name = lib::get_class_name( 'database\coapplicant' );

    // get various review types, recommendation type and stage type records
    $db_second_ec_review_type = $review_type_class_name::get_unique_record( 'name', 'Second EC' );
    $db_second_chair_review_type = $review_type_class_name::get_unique_record( 'name', 'Second Chair' );
    $db_ec_review_type = $review_type_class_name::get_unique_record( 'name', 'EC' );
    $db_chair_review_type = $review_type_class_name::get_unique_record( 'name', 'Chair' );
    $db_approved_recommendation_type = $recommendation_type_class_name::get_unique_record( 'name', 'Approved' );
    $db_not_approved_recommendation_type = $recommendation_type_class_name::get_unique_record( 'name', 'Not Approved' );
    $db_admin_review_stage_type = $stage_type_class_name::get_unique_record( 'name', 'Admin Review' );
    $db_decision_made_stage_type = $stage_type_class_name::get_unique_record( 'name', 'Decision Made' );
    $db_data_release_stage_type = $stage_type_class_name::get_unique_record( 'name', 'Data Release' );
    $db_active_stage_type = $stage_type_class_name::get_unique_record( 'name', 'Active' );

    $approved = NULL;
    foreach( $this->get_restriction_list() as $restriction )
      if( 'approved' == $restriction['name'] ) $approved = $restriction['value'];

    $modifier = lib::create( 'database\modifier' );
    $modifier->join( 'reqn_type', 'reqn.reqn_type_id', 'reqn_type.id' );
    $modifier->join( 'reqn_current_reqn_version', 'reqn.id', 'reqn_current_reqn_version.reqn_id' );
    $modifier->join( 'reqn_version', 'reqn_current_reqn_version.reqn_version_id', 'reqn_version.id' );
    $modifier->join( 'user', 'reqn.user_id', 'user.id' );
    $modifier->left_join( 'user', 'reqn.trainee_user_id', 'trainee_user.id', 'trainee_user' );
    $modifier->order( 'reqn.identifier' );

    // join to the second EC review
    $join_mod = lib::create( 'database\modifier' );
    $join_mod->where( 'reqn.id', '=', 'second_ec_review.reqn_id', false );
    $join_mod->where( 'second_ec_review.review_type_id', '=', $db_second_ec_review_type->id );
    $modifier->join_modifier( 'review', $join_mod, 'left', 'second_ec_review' );

    // join to the second chair review
    $join_mod = lib::create( 'database\modifier' );
    $join_mod->where( 'reqn.id', '=', 'second_chair_review.reqn_id', false );
    $join_mod->where( 'second_chair_review.review_type_id', '=', $db_second_chair_review_type->id );
    $modifier->join_modifier( 'review', $join_mod, 'left', 'second_chair_review' );

    // join to the EC review
    $join_mod = lib::create( 'database\modifier' );
    $join_mod->where( 'reqn.id', '=', 'ec_review.reqn_id', false );
    $join_mod->where( 'ec_review.review_type_id', '=', $db_ec_review_type->id );
    $modifier->join_modifier( 'review', $join_mod, 'left', 'ec_review' );

    // join to the chair review
    $join_mod = lib::create( 'database\modifier' );
    $join_mod->where( 'reqn.id', '=', 'chair_review.reqn_id', false );
    $join_mod->where( 'chair_review.review_type_id', '=', $db_chair_review_type->id );
    $modifier->join_modifier( 'review', $join_mod, 'left', 'chair_review' );

    // join to the admin review stage
    $join_mod = lib::create( 'database\modifier' );
    $join_mod->where( 'reqn.id', '=', 'admin_review_stage.reqn_id', false );
    $join_mod->where( 'admin_review_stage.stage_type_id', '=', $db_admin_review_stage_type->id );
    $modifier->join_modifier( 'stage', $join_mod, 'left', 'admin_review_stage' );

    // join to the decision made stage
    $join_mod = lib::create( 'database\modifier' );
    $join_mod->where( 'reqn.id', '=', 'decision_made_stage.reqn_id', false );
    $join_mod->where( 'decision_made_stage.stage_type_id', '=', $db_decision_made_stage_type->id );
    $modifier->join_modifier( 'stage', $join_mod, 'left', 'decision_made_stage' );

    // join to the data release stage
    $join_mod = lib::create( 'database\modifier' );
    $join_mod->where( 'reqn.id', '=', 'data_release_stage.reqn_id', false );
    $join_mod->where( 'data_release_stage.stage_type_id', '=', $db_data_release_stage_type->id );
    $modifier->join_modifier( 'stage', $join_mod, 'left', 'data_release_stage' );

    // join to the active stage
    $join_mod = lib::create( 'database\modifier' );
    $join_mod->where( 'reqn.id', '=', 'active_stage.reqn_id', false );
    $join_mod->where( 'active_stage.stage_type_id', '=', $db_active_stage_type->id );
    $modifier->join_modifier( 'stage', $join_mod, 'left', 'active_stage' );

    // join to the current stage
    $join_mod = lib::create( 'database\modifier' );
    $join_mod->where( 'reqn.id', '=', 'stage.reqn_id', false );
    $join_mod->where( 'stage.datetime', '=', NULL );
    $modifier->join_modifier( 'stage', $join_mod );
    $modifier->join( 'stage_type', 'stage.stage_type_id', 'stage_type.id' );

    // join to the recommendation_type
    $join_mod = lib::create( 'database\modifier' );
    $join_mod->where(
      'IF( '.
        // use the second EC review if it was done
        'second_ec_review.id IS NOT NULL, second_ec_review.recommendation_type_id, '.
        'IF( '.
          // if not then use the second chair review if it was done
          'second_chair_review.id IS NOT NULL, second_chair_review.recommendation_type_id, '.
          'IF( '.
            // if not then use the first EC review if it was done, otherwise use the first char review
            'ec_review.id IS NOT NULL, '.
            'ec_review.recommendation_type_id, '.
            'chair_review.recommendation_type_id '.
          ') '.
        ') '.
      ')',
      '=',
      'recommendation_type.id',
      false
    );
    $modifier->join_modifier( 'recommendation_type', $join_mod, 'left' );

    // make sure the reqn is not inactive or abandoned
    $modifier->where( 'IFNULL( reqn.state, "deferred" )', '=', 'deferred' );

    if( 'Not Approved' != $approved )
    {
      $modifier->where_bracket( true );
      // is a catalyst grant and has reached the admin review stage
      $modifier->where( 'reqn_type.name', '=', 'Catalyst Grant' );
      $modifier->where( 'admin_review_stage.id', '!=', NULL );
      $modifier->where_bracket( false );
      // OR
      $modifier->where_bracket( true, true );
      // must have reached the release or active stage
      $modifier->where( 'data_release_stage.id', '!=', NULL );
      $modifier->or_where( 'active_stage.id', '!=', NULL );
      // OR
      $modifier->where_bracket( true, true );
      // reached the decision made stage and...
      $modifier->where( 'decision_made_stage.id', '!=', NULL );

      if( 'Approved' == $approved )
      {
        // the reqn was approved
        $modifier->where( 'recommendation_type.id', '=', $db_approved_recommendation_type->id );
      }
      else
      {
        // the reqn can either be approved or not approved
        $modifier->where(
          'recommendation_type.id',
          'IN',
          [ $db_approved_recommendation_type->id, $db_not_approved_recommendation_type->id ]
        );
      }
      $modifier->where_bracket( false );
      $modifier->where_bracket( false );
    }
    else
    {
      // the reqn must have not been approved
      $modifier->where( 'recommendation_type.id', '=', $db_not_approved_recommendation_type->id );
    }

    $modifier->group( 'reqn.id' );

    $select = lib::create( 'database\select' );
    $select->from( 'reqn' );
    $select->add_table_column( 'reqn_version', 'id', 'reqn_version_id' );
    $select->add_column( 'identifier', 'Identifier' );
    $select->add_column( 'stage_type.name', 'Current Stage', false );
    $select->add_column( 'IFNULL( recommendation_type.name, "N/A" )', 'Approval', false );
    $select->add_column( 'IF( reqn.website, "Y", "N" )', 'Website', false );
    $select->add_column( 'reqn_type.name', 'Type', false );
    $select->add_column( 'IF( legacy, "Yes", "No" )', 'Legacy', false );
    $select->add_column( 'reqn_version.title', 'Title', false );
    $select->add_column( 'CONCAT_WS( " ", user.first_name, user.last_name )', 'Primary Applicant', false );
    $select->add_column( 'user.email', 'Email', false );
    $select->add_column( 'reqn_version.applicant_affiliation', 'Institution', false );
    $select->add_column( 'CONCAT_WS( " ", trainee_user.first_name, trainee_user.last_name )', 'Trainee', false );
    $select->add_column( 'reqn_version.lay_summary', 'Lay Summary', false );
    $select->add_column( 'reqn_version.keywords', 'Keywords', false );

    // before adding coapplicant data we need to know the maximum number of coapplicants
    $max_sel = lib::create( 'database\select' );
    $max_sel->from( 'reqn' );
    $max_sel->add_column( 'COUNT( DISTINCT coapplicant.id )', 'total', false );
    $max_mod = lib::create( 'database\modifier' );
    $max_mod = clone $modifier;
    $max_mod->join( 'coapplicant', 'reqn_version.id', 'coapplicant.reqn_version_id' );
    $max_coapplicants = $reqn_class_name::db()->get_one( sprintf(
      'SELECT MAX( total ) FROM ( %s%s ) AS temp',
      $max_sel->get_sql(),
      $max_mod->get_sql()
    ) );
    
    // now add the coapplicant data
    $reqn_list = $reqn_class_name::select( $select, $modifier );
    foreach( $reqn_list as $index => $reqn )
    {
      $reqn_version_id = $reqn['reqn_version_id'];
      unset( $reqn_list[$index]['reqn_version_id'] );
      for( $c = 1; $c <= $max_coapplicants; $c++ )
      {
        $reqn_list[$index][sprintf( 'Coapplicant %d', $c )] = '';
        $reqn_list[$index][sprintf( 'Position %d', $c )] = '';
        $reqn_list[$index][sprintf( 'Institution %d', $c )] = '';
        $reqn_list[$index][sprintf( 'Email %d', $c )] = '';
        $reqn_list[$index][sprintf( 'Role %d', $c )] = '';
        $reqn_list[$index][sprintf( 'Data Access %d', $c )] = '';
      }
      
      $coapplicant_sel = lib::create( 'database\select' );
      $coapplicant_sel->add_column( 'name' );
      $coapplicant_sel->add_column( 'position' );
      $coapplicant_sel->add_column( 'affiliation' );
      $coapplicant_sel->add_column( 'email' );
      $coapplicant_sel->add_column( 'role' );
      $coapplicant_sel->add_column( 'access' );
      $coapplicant_mod = lib::create( 'database\modifier' );
      $coapplicant_mod->where( 'reqn_version_id', '=', $reqn_version_id );
      $coapplicant_mod->order( 'id' );
      
      $c = 1;
      foreach( $coapplicant_class_name::select( $coapplicant_sel, $coapplicant_mod ) as $coapplicant )
      {
        $reqn_list[$index][sprintf( 'Coapplicant %d', $c )] = $coapplicant['name'];
        $reqn_list[$index][sprintf( 'Position %d', $c )] = $coapplicant['position'];
        $reqn_list[$index][sprintf( 'Institution %d', $c )] = $coapplicant['affiliation'];
        $reqn_list[$index][sprintf( 'Email %d', $c )] = $coapplicant['email'];
        $reqn_list[$index][sprintf( 'Role %d', $c )] = $coapplicant['role'];
        $reqn_list[$index][sprintf( 'Data Access %d', $c )] = $coapplicant['access'] ? 'Yes' : 'No';
        $c++;
      }
    }

    $this->add_table_from_select( NULL, $reqn_list );
  }
}
