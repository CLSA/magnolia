<?php
/**
 * review_summary.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\business\report;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * Call history report
 */
class review_summary extends \cenozo\business\report\base_report
{
  /**
   * Build the report
   * @access protected
   */
  protected function build()
  {
    $reqn_class_name = lib::get_class_name( 'database\reqn' );

    // set up a temporary table to help combine questions with reviews
    $review_details_sel = lib::create( 'database\select' );
    $review_details_sel->from( 'review' );
    $review_details_sel->add_column( 'id', 'review_id' );
    $review_details_sel->add_table_column( 'review_type', 'name', 'review_type_name' );
    $review_details_sel->add_table_column( 'recommendation_type', 'name', 'recommendation_type_name' );
    $review_details_sel->add_column(
      'GROUP_CONCAT( '.
        'CONCAT( '.
          'review_type_question.rank, ") ", '.
          'review_type_question.question, " ", '.
          'IFNULL( IF( review_answer.answer, "Yes", "No" ), "(no answer)" ), "\\n", '.
          'IFNULL( review_answer.comment, "(no comment)" ) '.
        ') '.
        'ORDER BY review_type_question.rank '.
        'SEPARATOR "\\n" '.
      ')',
      'questions',
      false
    );

    $review_details_mod = lib::create( 'database\modifier' );
    $review_details_mod->join( 'review_type', 'review.review_type_id', 'review_type.id' );
    $review_details_mod->join( 'recommendation_type', 'review.recommendation_type_id', 'recommendation_type.id' );
    $review_details_mod->left_join( 'review_type_question', 'review_type.id', 'review_type_question.review_type_id' );
    $join_mod = lib::create( 'database\modifier' );
    $join_mod->where( 'review.id', '=', 'review_answer.review_id', false );
    $join_mod->where( 'review_type_question.id', '=', 'review_answer.review_type_question_id', false );
    $review_details_mod->join_modifier( 'review_answer', $join_mod, 'left' );
    $review_details_mod->group( 'review.id' );

    $reqn_class_name::db()->execute( sprintf(
      'CREATE TEMPORARY TABLE review_details %s %s',
      $review_details_sel->get_sql(),
      $review_details_mod->get_sql()
    ) );

    // now create the report's main select and modifier objects
    $select = lib::create( 'database\select' );
    $select->from( 'reqn' );
    $select->add_column( 'identifier', 'Identifier' );
    $select->add_column( 'CONCAT_WS( " ", user.first_name, user.last_name )', 'Applicant', false );
    $select->add_column( 'CONCAT_WS( " ", trainee_user.first_name, trainee_user.last_name )', 'Trainee', false );
    $select->add_column( 'reqn_version.applicant_affiliation', 'Affiliation', false );
    $select->add_column( 'reqn_version.title', 'Title', false );
    $select->add_column( 'reqn_version.lay_summary', 'Lay Summary', false );
    $select->add_column(
      "GROUP_CONCAT( ".
        "CONCAT( ".
          "review_details.review_type_name, ".
          "': ', ".
          "review_details.recommendation_type_name, ".
          "'\\n', ".
          "IFNULL( CONCAT( review_details.questions, '\\n' ), '' ), ".
          "IFNULL( review.note, '(no note)' ) ".
        ") ".
        "SEPARATOR '\\n\\n' ".
      ")",
      'Reviews',
      false
    );

    $modifier = lib::create( 'database\modifier' );
    $modifier->join( 'user', 'reqn.user_id', 'user.id' );
    $modifier->left_join( 'user', 'reqn.trainee_user_id', 'trainee_user.id', 'trainee_user' );
    $modifier->join( 'reqn_current_reqn_version', 'reqn.id', 'reqn_current_reqn_version.reqn_id' );
    $modifier->join( 'reqn_version', 'reqn_current_reqn_version.reqn_version_id', 'reqn_version.id' );
    $modifier->join( 'review', 'reqn.id', 'review.reqn_id' );
    $modifier->join( 'review_details', 'review.id', 'review_details.review_id' );
    $modifier->group( 'reqn.id' );
    $modifier->order( 'reqn.identifier' );
      
    foreach( $this->get_restriction_list() as $restriction )
    {
      if( 'stage_type' == $restriction['name'] && !is_null( $restriction['value'] ) )
      {
        $join_mod = lib::create( 'database\modifier' );
        $join_mod->where( 'reqn.id', '=', 'stage.reqn_id', false );
        $join_mod->where( 'stage.datetime', '=', NULL );
        $modifier->join_modifier( 'stage', $join_mod );
        $modifier->where( 'stage.stage_type_id', '=', $restriction['value'] );
      }
    }
    
    $this->add_table_from_select( NULL, $reqn_class_name::select( $select, $modifier ) );
  }
}
