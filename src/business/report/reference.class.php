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

    // get various review types, recommendation type and stage type records
    $db_second_smt_review_type = $review_type_class_name::get_unique_record( 'name', 'Second SMT' );
    $db_second_chair_review_type = $review_type_class_name::get_unique_record( 'name', 'Second Chair' );
    $db_smt_review_type = $review_type_class_name::get_unique_record( 'name', 'SMT' );
    $db_chair_review_type = $review_type_class_name::get_unique_record( 'name', 'Chair' );
    $db_approved_recommendation_type = $recommendation_type_class_name::get_unique_record( 'name', 'Approved' );
    $db_admin_review_stage_type = $stage_type_class_name::get_unique_record( 'name', 'Admin Review' );
    $db_decision_made_stage_type = $stage_type_class_name::get_unique_record( 'name', 'Decision Made' );
    $db_data_release_stage_type = $stage_type_class_name::get_unique_record( 'name', 'Data Release' );
    $db_active_stage_type = $stage_type_class_name::get_unique_record( 'name', 'Active' );

    $modifier = lib::create( 'database\modifier' );
    $modifier->join( 'reqn_type', 'reqn.reqn_type_id', 'reqn_type.id' );
    $modifier->join( 'reqn_current_reqn_version', 'reqn.id', 'reqn_current_reqn_version.reqn_id' );
    $modifier->join( 'reqn_version', 'reqn_current_reqn_version.reqn_version_id', 'reqn_version.id' );
    $modifier->join( 'user', 'reqn.user_id', 'user.id' );
    $modifier->left_join( 'user', 'reqn.trainee_user_id', 'trainee_user.id', 'trainee_user' );
    $modifier->order( 'reqn.identifier' );

    // join to the second SMT review
    $join_mod = lib::create( 'database\modifier' );
    $join_mod->where( 'reqn.id', '=', 'second_smt_review.reqn_id', false );
    $join_mod->where( 'second_smt_review.review_type_id', '=', $db_second_smt_review_type->id );
    $modifier->join_modifier( 'review', $join_mod, 'left', 'second_smt_review' );

    // join to the second chair review
    $join_mod = lib::create( 'database\modifier' );
    $join_mod->where( 'reqn.id', '=', 'second_chair_review.reqn_id', false );
    $join_mod->where( 'second_chair_review.review_type_id', '=', $db_second_chair_review_type->id );
    $modifier->join_modifier( 'review', $join_mod, 'left', 'second_chair_review' );

    // join to the SMT review
    $join_mod = lib::create( 'database\modifier' );
    $join_mod->where( 'reqn.id', '=', 'smt_review.reqn_id', false );
    $join_mod->where( 'smt_review.review_type_id', '=', $db_smt_review_type->id );
    $modifier->join_modifier( 'review', $join_mod, 'left', 'smt_review' );

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

    $modifier->where_bracket( true );
    $modifier->where( 'reqn.state', '=', NULL );
    $modifier->or_where( 'reqn.state', '=', 'deferred' );
    $modifier->where_bracket( false );

    $modifier->where_bracket( true );
    // is a catalyst grant and has reached the admin review stage
    $modifier->where( 'reqn_type.name', '=', 'Catalyst Grant' );
    $modifier->where( 'admin_review_stage.id', '!=', NULL );
    // OR
    $modifier->where_bracket( true, true );
    // must have reached the release or active stage
    $modifier->where( 'data_release_stage.id', '!=', NULL );
    $modifier->or_where( 'active_stage.id', '!=', NULL );
    // OR
    $modifier->where_bracket( true, true );
    // reached the decision made stage and...
    $modifier->where( 'decision_made_stage.id', '!=', NULL );
    // the reqn was approved
    $modifier->where(
      'IF( '.
        // use the second smt review if it was done
        'second_smt_review.id IS NOT NULL, second_smt_review.recommendation_type_id, '.
        'IF( '.
          // if not then use the second chair review if it was done
          'second_chair_review.id IS NOT NULL, second_chair_review.recommendation_type_id, '.
          'IF( '.
            // if not then use the first smt review if it was done, otherwise use the first char review
            'smt_review.id IS NOT NULL, '.
            'smt_review.recommendation_type_id, '.
            'chair_review.recommendation_type_id '.
          ') '.
        ') '.
      ')',
      '=',
      $db_approved_recommendation_type->id
    );
    $modifier->where_bracket( false );
    $modifier->where_bracket( false );
    $modifier->where_bracket( false );

    $modifier->group( 'reqn.id' );

    $select = lib::create( 'database\select' );
    $select->from( 'reqn' );
    $select->add_column( 'identifier', 'Identifier' );
    $select->add_column( 'IF( reqn.website, "Y", "N" )', 'Website', false );
    $select->add_column( 'reqn_type.name', 'Type', false );
    $select->add_column( 'external', 'External' );
    $select->add_column( 'reqn_version.title', 'Title', false );
    $select->add_column( 'CONCAT_WS( " ", user.first_name, user.last_name )', 'Primary Applicant', false );
    $select->add_column( 'user.email', 'Email', false );
    $select->add_column( 'reqn_version.applicant_affiliation', 'Institution', false );
    $select->add_column( 'CONCAT_WS( " ", trainee_user.first_name, trainee_user.last_name )', 'Trainee', false );
    $select->add_column( 'reqn_version.lay_summary', 'Lay Summary', false );
    $select->add_column( 'reqn_version.keywords', 'Keywords', false );

    $this->add_table_from_select( NULL, $reqn_class_name::select( $select, $modifier ) );
  }
}
