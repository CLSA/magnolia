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

    // get review type, recommendation type and stage type records
    $db_review_type = $review_type_class_name::get_unique_record( 'name', 'SMT' );
    $db_approved_recommendation_type = $recommendation_type_class_name::get_unique_record( 'name', 'Approved' );
    $db_revise_recommendation_type = $recommendation_type_class_name::get_unique_record( 'name', 'Revise' );
    $db_stage_type = $stage_type_class_name::get_unique_record( 'name', 'Agreement' );

    $modifier = lib::create( 'database\modifier' );
    $modifier->join( 'reqn_current_reqn_version', 'reqn.id', 'reqn_current_reqn_version.reqn_id' );
    $modifier->join( 'reqn_version', 'reqn_current_reqn_version.reqn_version_id', 'reqn_version.id' );
    $modifier->join( 'user', 'reqn.user_id', 'user.id' );
    $modifier->left_join( 'graduate', 'reqn.graduate_id', 'graduate.id' );
    $modifier->left_join( 'user', 'graduate.graduate_user_id', 'graduate_user.id', 'graduate_user' );
    $modifier->order( 'reqn.identifier' );

    // join to the SMT review
    $join_mod = lib::create( 'database\modifier' );
    $join_mod->where( 'reqn.id', '=', 'review.reqn_id', false );
    $join_mod->where( 'review.review_type_id', '=', $db_review_type->id );
    $join_mod->where(
      'review.recommendation_type_id',
      'IN',
      array( $db_approved_recommendation_type->id, $db_revise_recommendation_type->id )
    );
    $modifier->join_modifier( 'review', $join_mod, 'left' );

    // join to the agreement stage
    $join_mod = lib::create( 'database\modifier' );
    $join_mod->where( 'reqn.id', '=', 'stage.reqn_id', false );
    $join_mod->where( 'stage.stage_type_id', '=', $db_stage_type->id );
    $modifier->join_modifier( 'stage', $join_mod, 'left' );

    // must have an Approved or Revise SMT review or be in the agreement stage
    $modifier->where_bracket( true );
    $modifier->where( 'review.id', '!=', NULL );
    $modifier->or_where( 'stage.id', '!=', NULL );
    $modifier->where_bracket( false );

    $select = lib::create( 'database\select' );
    $select->from( 'reqn' );
    $select->add_column( 'Identifier', 'Identifier' );
    $select->add_column( 'reqn_version.title', 'Title', false );
    $select->add_column( 'CONCAT_WS( " ", user.first_name, user.last_name )', 'Primary Applicant', false );
    $select->add_column( 'user.email', 'Email', false );
    $select->add_column( 'reqn_version.applicant_affiliation', 'Institution', false );
    $select->add_column( 'CONCAT_WS( " ", graduate_user.first_name, graduate_user.last_name )', 'Graduate', false );
    $select->add_column( 'reqn_version.lay_summary', 'Lay Summary', false );
    $select->add_column( 'reqn_version.keywords', 'Keywords', false );

    $this->add_table_from_select( NULL, $reqn_class_name::select( $select, $modifier ) );
  }
}
