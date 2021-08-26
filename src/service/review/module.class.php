<?php
/**
 * module.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\service\review;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * Performs operations which effect how this module is used in a service
 */
class module extends \cenozo\service\module
{
  /**
   * Extend parent method
   */
  public function validate()
  {
    parent::validate();
    $db_role = lib::create( 'business\session' )->get_role();

    // restrict some review-types to certain roles
    if( 300 > $this->get_status()->get_code() )
    {
      if( 'PATCH' == $this->get_method() )
      {
        $db_review = $this->get_resource();
        if( !is_null( $db_review ) )
        {
          $review_type = $this->get_resource()->get_review_type()->name;
          if( 'administrator' != $db_role->name )
          {
            if( 'Admin' == $review_type || 'Feasibility' == $review_type ) $this->get_status()->set_code( 403 );
            else if( 'Reviewer 1' == $review_type || 'Reviewer 2' == $review_type )
            {
              if( 'reviewer' != $db_role->name && 'chair' != $db_role->name ) $this->get_status()->set_code( 403 );
            }
            else if( 'Chair' == $review_type || 'Second Chair' == $review_type )
            {
              if( 'chair' != $db_role->name ) $this->get_status()->set_code( 403 );
            }
            else if( 'SMT' == $review_type || 'Second SMT' == $review_type )
            {
              if( 'smt' != $db_role->name ) $this->get_status()->set_code( 403 );
            }
          }

          // recommendations can only be provided once all questions have been answered
          $data = $this->get_file_as_array();
          if( array_key_exists( 'recommendation_type_id', $data ) && !is_null( $data['recommendation_type_id'] ) )
          {
            $modifier = lib::create( 'database\modifier' );
            $modifier->where( 'answer', '=', NULL );
            if( 0 < $db_review->get_review_answer_count( $modifier ) )
            {
              $this->get_status()->set_code( 306 );
              $this->set_data( 'A recommendation can only be provided after all review questions have been answered.' );
            }
          }
        }
      }
    }
  }

  /**
   * Extend parent method
   */
  public function prepare_read( $select, $modifier )
  {
    parent::prepare_read( $select, $modifier );

    $session = lib::create( 'business\session' );
    $db_user = $session->get_user();
    $db_role = $session->get_role();

    $modifier->join( 'review_type', 'review.review_type_id', 'review_type.id' );
    $modifier->left_join( 'user', 'review.user_id', 'user.id' );
    $modifier->left_join( 'recommendation_type', 'review.recommendation_type_id', 'recommendation_type.id' );
    $modifier->join( 'reqn', 'review.reqn_id', 'reqn.id' );
    $modifier->join( 'reqn_current_reqn_version', 'reqn.id', 'reqn_current_reqn_version.reqn_id' );
    $modifier->join( 'reqn_version', 'reqn_current_reqn_version.reqn_version_id', 'reqn_version.id' );

    $join_mod = lib::create( 'database\modifier' );
    $join_mod->where( 'reqn.id', '=', 'stage.reqn_id', false );
    $join_mod->where( 'stage.datetime', '=', NULL );
    $modifier->join_modifier( 'stage', $join_mod );
    $modifier->join( 'stage_type', 'stage.stage_type_id', 'stage_type.id' );

    if( !is_null( $this->get_resource() ) )
    {
      // include the requisition identifier and user first/last/name as supplemental data
      $select->add_column( 'reqn.identifier', 'formatted_identifier', false );
      $select->add_column( 'CONCAT( user.first_name, " ", user.last_name, " (", user.name, ")" )', 'formatted_user_id', false );
    }

    if( $select->has_column( 'amendment' ) )
      $select->add_column( 'REPLACE( review.amendment, ".", "no" )', 'amendment', false );

    if( $select->has_column( 'user_full_name' ) )
      $select->add_column( 'CONCAT( user.first_name, " ", user.last_name )', 'user_full_name', false );

    // restrict reviewers to seeing their own "reviewer" reviews only
    if( 'reviewer' == $db_role->name )
    {
      $modifier->where( 'review_type.name', 'IN', array( 'Admin', 'Feasibility', 'Reviewer 1', 'Reviewer 2' ) );
      $modifier->where( 'stage_type.name', '=', 'DSAC Review' );
    }

    if( $select->has_column( 'editable' ) )
    {
      $join_mod = lib::create( 'database\modifier' );
      $join_mod->where( 'review_type.id', '=', 'role_has_review_type.review_type_id', false );
      $join_mod->where( 'role_has_review_type.role_id', '=', $db_role->id );
      $modifier->join_modifier( 'role_has_review_type', $join_mod, 'left' );

      $column = 'role_has_review_type.role_id IS NOT NULL';
      if( 'reviewer' == $db_role->name )
      {
        // reviewers can only edit their own reviews
        $column .= sprintf( ' AND review.user_id = %s', $db_user::db()->format_string( $db_user->id ) );
      }
      $select->add_column( $column, 'editable', false, 'boolean' );
    }

    if( $select->has_column( 'questions' ) || $select->has_column( 'answered_questions' ) )
    {
      $join_sel = lib::create( 'database\select' );
      $join_sel->from( 'review' );
      $join_sel->add_column( 'id', 'review_id' );
      $join_sel->add_column( 'COUNT(*)', 'total', false );
      $join_mod = lib::create( 'database\modifier' );
      $join_mod->join( 'review_type', 'review.review_type_id', 'review_type.id' );
      $join_mod->join( 'review_type_question', 'review_type.id', 'review_type_question.review_type_id' );
      $join_mod->group( 'review.id' );

      $modifier->left_join(
        sprintf( '( %s %s ) AS %s', $join_sel->get_sql(), $join_mod->get_sql(), 'num_questions' ),
        'review.id',
        'num_questions.review_id'
      );

      if( $select->has_column( 'questions' ) )
        $select->add_column( 'IFNULL( num_questions.total, 0 )', 'questions', false );
    }

    if( $select->has_column( 'answers' ) || $select->has_column( 'answered_questions' ) )
    {
      $join_sel = lib::create( 'database\select' );
      $join_sel->from( 'review' );
      $join_sel->add_column( 'id', 'review_id' );
      $join_sel->add_column( 'COUNT(*)', 'total', false );
      $join_mod = lib::create( 'database\modifier' );
      $join_mod->join( 'review_type', 'review.review_type_id', 'review_type.id' );
      $join_mod->join( 'review_answer', 'review.id', 'review_answer.review_id' );
      $join_mod->where( 'review_answer.answer', '!=', NULL );
      $join_mod->group( 'review.id' );

      $modifier->left_join(
        sprintf( '( %s %s ) AS %s', $join_sel->get_sql(), $join_mod->get_sql(), 'num_answers' ),
        'review.id',
        'num_answers.review_id'
      );

      if( $select->has_column( 'answers' ) )
        $select->add_column( 'IFNULL( num_answers.total, 0 )', 'answers', false );
    }

    if( $select->has_column( 'yes_answers' ) || $select->has_column( 'answered_questions' ) )
    {
      $join_sel = lib::create( 'database\select' );
      $join_sel->from( 'review' );
      $join_sel->add_column( 'id', 'review_id' );
      $join_sel->add_column( 'COUNT(*)', 'total', false );
      $join_mod = lib::create( 'database\modifier' );
      $join_mod->join( 'review_type', 'review.review_type_id', 'review_type.id' );
      $join_mod->join( 'review_answer', 'review.id', 'review_answer.review_id' );
      $join_mod->where( 'review_answer.answer', '=', true );
      $join_mod->group( 'review.id' );

      $modifier->left_join(
        sprintf( '( %s %s ) AS %s', $join_sel->get_sql(), $join_mod->get_sql(), 'num_yes_answers' ),
        'review.id',
        'num_yes_answers.review_id'
      );

      if( $select->has_column( 'yes_answers' ) )
        $select->add_column( 'IFNULL( num_yes_answers.total, 0 )', 'yes_answers', false );
    }

    if( $select->has_column( 'answered_questions' ) )
    {
      $select->add_column(
        'IF( num_questions.total = 0, "N/A", CONCAT( IFNULL( num_yes_answers.total, 0 ), " / ", IFNULL( num_answers.total, 0 ) ) )',
        'answered_questions',
        false
      );
    }
  }
}
