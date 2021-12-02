<?php
/**
 * module.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\service\reqn;
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

    $session = lib::create( 'business\session' );
    $db_user = $session->get_user();
    $db_role = $session->get_role();

    if( 300 > $this->get_status()->get_code() )
    {
      $db_reqn = $this->get_resource();
      if( !is_null( $db_reqn ) )
      {
        // make sure to restrict applicants to their own reqns which are not abandoned
        if( in_array( $db_role->name, ['applicant', 'designate'] ) )
        {
          $trainee = 'applicant' == $db_role->name && $db_reqn->trainee_user_id == $db_user->id;
          $designate = 'designate' == $db_role->name && $db_reqn->designate_user_id == $db_user->id;
          if( ( $db_reqn->user_id != $db_user->id && !$trainee && !$designate ) || 'abandoned' == $db_reqn->state )
          {
            $this->get_status()->set_code( 404 );
            return;
          }
        }
        // typist can only see legacy reqns
        else if( 'typist' == $db_role->name )
        {
          if( !$db_reqn->legacy )
          {
            $this->get_status()->set_code( 403 );
            return;
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
    $stage_type_class_name = lib::get_class_name( 'database\stage_type' );

    parent::prepare_read( $select, $modifier );

    $session = lib::create( 'business\session' );
    $db_user = $session->get_user();
    $db_role = $session->get_role();

    $modifier->join( 'reqn_type', 'reqn.reqn_type_id', 'reqn_type.id' );
    $modifier->join( 'reqn_current_reqn_version', 'reqn.id', 'reqn_current_reqn_version.reqn_id' );
    $modifier->join( 'reqn_version', 'reqn_current_reqn_version.reqn_version_id', 'reqn_version.id' );
    $modifier->join( 'reqn_current_final_report', 'reqn.id', 'reqn_current_final_report.reqn_id' );
    $modifier->left_join( 'final_report', 'reqn_current_final_report.final_report_id', 'final_report.id' );
    $modifier->left_join( 'deadline', 'reqn.deadline_id', 'deadline.id' );
    $modifier->join( 'user', 'reqn.user_id', 'user.id' );
    $modifier->left_join( 'user', 'reqn.trainee_user_id', 'trainee_user.id', 'trainee_user' );
    $modifier->left_join( 'user', 'reqn.designate_user_id', 'designate_user.id', 'designate_user' );

    $join_mod = lib::create( 'database\modifier' );
    $join_mod->where( 'reqn.id', '=', 'stage.reqn_id', false );
    $join_mod->where( 'stage.datetime', '=', NULL );
    $modifier->join_modifier( 'stage', $join_mod );
    $modifier->join( 'stage_type', 'stage.stage_type_id', 'stage_type.id' );

    // restrict the list to reqns who have selected linked data
    if( $this->get_argument( 'data_sharing', false ) || $select->has_column( 'has_linked_data' ) )
    {
      // get a list of all linked-data data-options
      $category_sel = lib::create( 'database\select' );
      $category_sel->from( 'data_selection' );
      $category_sel->add_column( 'id' );
      $category_mod = lib::create( 'database\modifier' );
      $category_mod->join( 'data_option', 'data_selection.data_option_id', 'data_option.id' );
      $category_mod->join( 'data_category', 'data_option.data_category_id', 'data_category.id' );
      $category_mod->where( 'data_category.name_en', '=', 'Linked Data' );
      $linked_data_sql = sprintf( '( %s %s )', $category_sel->get_sql(), $category_mod->get_sql() );

      $join_sel = lib::create( 'database\select' );
      $join_sel->from( 'reqn' );
      $join_sel->add_column( 'id', 'reqn_id' );
      $join_sel->add_column( 'reqn_version_has_data_selection.reqn_version_id IS NOT NULL', 'selected', false );

      $join_mod = lib::create( 'database\modifier' );
      $join_mod->join( 'reqn_current_reqn_version', 'reqn.id', 'reqn_current_reqn_version.reqn_id' );
      
      $sub_mod = lib::create( 'database\modifier' );
      $sub_mod->where( 'reqn_current_reqn_version.reqn_version_id', '=', 'reqn_version_has_data_selection.reqn_version_id', false );
      $sub_mod->where( 'reqn_version_has_data_selection.data_selection_id', 'IN', $linked_data_sql, false );
      $join_mod->join_modifier( 'reqn_version_has_data_selection', $sub_mod, 'left' );
      $join_mod->group( 'reqn.id' );

      $modifier->join(
        sprintf( '( %s %s ) AS linked_data', $join_sel->get_sql(), $join_mod->get_sql() ),
        'reqn.id',
        'linked_data.reqn_id'
      );
      $select->add_column( 'linked_data.selected', 'has_linked_data', false, 'boolean' );

      if( $this->get_argument( 'data_sharing', false ) )
      {
        $db_agreement_stage_type = $stage_type_class_name::get_unique_record( 'name', 'Agreement' );
        $modifier->where( 'stage_type.rank', '<=', $db_agreement_stage_type->rank );
        $modifier->where( 'linked_data.selected', '=', true );
      }
    }

    if( $select->has_column( 'has_data_sharing_filename' ) )
      $select->add_column( '( reqn_version.data_sharing_filename IS NOT NULL )', 'has_data_sharing_filename', false, 'boolean' );

    if( $select->has_column( 'state_days' ) )
      $select->add_column( 'DATEDIFF( NOW(), state_date )', 'state_days', false, 'integer' );

    if( $select->has_column( 'user_full_name' ) )
    {
      $select->add_table_column(
        'user', 'CONCAT_WS( " ", user.first_name, user.last_name )', 'user_full_name', false );
    }

    if( $select->has_column( 'trainee_full_name' ) )
    {
      $select->add_table_column(
        'trainee_user',
        'IF( trainee_user.id IS NULL, NULL, CONCAT_WS( " ", trainee_user.first_name, trainee_user.last_name ) )',
        'trainee_full_name',
        false
      );
    }

    if( $select->has_column( 'designate_full_name' ) )
    {
      $select->add_table_column(
        'designate_user',
        'IF( designate_user.id IS NULL, NULL, CONCAT_WS( " ", designate_user.first_name, designate_user.last_name ) )',
        'designate_full_name',
        false
      );
    }

    if( $select->has_column( 'amendment_version' ) )
    {
      $select->add_column(
        'CONCAT( REPLACE( reqn_version.amendment, ".", "" ), reqn_version.version )',
        'amendment_version',
        false
      );
    }

    if( $select->has_table_columns( 'ethics_approval' ) )
    {
      $modifier->join( 'reqn_last_ethics_approval', 'reqn.id', 'reqn_last_ethics_approval.reqn_id' );
      $modifier->left_join( 'ethics_approval', 'reqn_last_ethics_approval.ethics_approval_id', 'ethics_approval.id' );
    }

    if( $select->has_column( 'reviewers_completed' ) )
    {
      $join_sel = lib::create( 'database\select' );
      $join_sel->from( 'reqn' );
      $join_sel->add_column( 'id', 'reqn_id' );
      $join_sel->add_column( 'IF( review.id IS NULL, 0, COUNT(*) )', 'total', false );

      $join_mod = lib::create( 'database\modifier' );
      $sub_mod = lib::create( 'database\modifier' );
      $sub_mod->where( 'reqn.id', '=', 'review.reqn_id', false );
      $sub_mod->where( 'review.review_type_id', 'IN', 'SELECT id FROM review_type WHERE name LIKE "Reviewer %"', false );
      $sub_mod->where( 'review.recommendation_type_id', '!=', NULL );
      $join_mod->join_modifier( 'review', $sub_mod, 'left' );
      $join_mod->group( 'reqn.id' );

      $modifier->join(
        sprintf( '( %s %s ) AS reviewers_completed', $join_sel->get_sql(), $join_mod->get_sql() ),
        'reqn.id',
        'reviewers_completed.reqn_id'
      );
      $select->add_column( 'reviewers_completed.total', 'reviewers_completed', false );
    }

    if( in_array( $db_role->name, ['applicant', 'designate'] ) )
    {
      // only show applicants their own reqns which aren't abandoned
      if( 'designate' == $db_role->name )
      {
        $modifier->where( 'reqn.designate_user_id', '=', $db_user->id );
      }
      else
      {
        $modifier->where_bracket( true );
        $modifier->where( 'reqn.user_id', '=', $db_user->id );
        $modifier->or_where( 'reqn.trainee_user_id', '=', $db_user->id );
        $modifier->where_bracket( false );
      }

      $modifier->where( 'IFNULL( reqn.state, "" )', '!=', 'abandoned' );

      // do not show legacy reqns which are still in the new phase
      $modifier->where_bracket( true );
      $modifier->where( 'reqn.legacy', '=', false );
      $modifier->or_where( 'stage_type.phase', '!=', 'new' );
      $modifier->where_bracket( false );

      // don't show applicants the deferral notes unless the reqn is deferred
      if( $select->has_column( 'deferral_note_amendment' ) )
        $select->add_column( 'IF( "deferred" = reqn.state, deferral_note_amendment, NULL )', 'deferral_note_amendment', false );
      if( $select->has_column( 'deferral_note_1a' ) )
        $select->add_column( 'IF( "deferred" = reqn.state, deferral_note_1a, NULL )', 'deferral_note_1a', false );
      if( $select->has_column( 'deferral_note_1b' ) )
        $select->add_column( 'IF( "deferred" = reqn.state, deferral_note_1b, NULL )', 'deferral_note_1b', false );
      if( $select->has_column( 'deferral_note_1c' ) )
        $select->add_column( 'IF( "deferred" = reqn.state, deferral_note_1c, NULL )', 'deferral_note_1c', false );
      if( $select->has_column( 'deferral_note_1d' ) )
        $select->add_column( 'IF( "deferred" = reqn.state, deferral_note_1d, NULL )', 'deferral_note_1d', false );
      if( $select->has_column( 'deferral_note_1e' ) )
        $select->add_column( 'IF( "deferred" = reqn.state, deferral_note_1e, NULL )', 'deferral_note_1e', false );
      if( $select->has_column( 'deferral_note_1f' ) )
        $select->add_column( 'IF( "deferred" = reqn.state, deferral_note_1f, NULL )', 'deferral_note_1f', false );
      if( $select->has_column( 'deferral_note_2a' ) )
        $select->add_column( 'IF( "deferred" = reqn.state, deferral_note_2a, NULL )', 'deferral_note_2a', false );
      if( $select->has_column( 'deferral_note_2b' ) )
        $select->add_column( 'IF( "deferred" = reqn.state, deferral_note_2b, NULL )', 'deferral_note_2b', false );
      if( $select->has_column( 'deferral_note_2c' ) )
        $select->add_column( 'IF( "deferred" = reqn.state, deferral_note_2c, NULL )', 'deferral_note_2c', false );
      if( $select->has_column( 'deferral_note_2d' ) )
        $select->add_column( 'IF( "deferred" = reqn.state, deferral_note_2d, NULL )', 'deferral_note_2d', false );
      if( $select->has_column( 'deferral_note_2e' ) )
        $select->add_column( 'IF( "deferred" = reqn.state, deferral_note_2e, NULL )', 'deferral_note_2e', false );
      if( $select->has_column( 'deferral_note_report1' ) )
        $select->add_column( 'IF( "deferred" = reqn.state, deferral_note_report1, NULL )', 'deferral_note_report1', false );
      if( $select->has_column( 'deferral_note_report2' ) )
        $select->add_column( 'IF( "deferred" = reqn.state, deferral_note_report2, NULL )', 'deferral_note_report2', false );
      if( $select->has_column( 'deferral_note_report3' ) )
        $select->add_column( 'IF( "deferred" = reqn.state, deferral_note_report3, NULL )', 'deferral_note_report3', false );
    }
    else if( 'reviewer' == $db_role->name )
    {
      // restrict reviewers to seeing reqns in the DSAC Review stage only
      $modifier->where( 'stage_type.name', '=', 'DSAC Review' );
    }
    else if( 'typist' == $db_role->name )
    {
      // typists can only see legacy reqns
      $modifier->where( 'reqn.legacy', '=', true );
    }

    if( $select->has_table_columns( 'stage_type' ) )
    {
      if( $select->has_table_column( 'stage_type', 'status' ) )
      {
        // show admin stages before deadline as waiting for review
        $select->add_table_column(
          'stage_type',
          'IF( '."\n".
          '  "deferred" = state, "Action Required", '."\n".
          '  IF( state IS NOT NULL, CONCAT( UPPER( SUBSTRING( state, 1, 1 ) ), SUBSTRING( state, 2 ) ), '."\n".
          '    IF( '."\n".
          '      "review" = stage_type.phase AND IFNULL( deadline.date, 0 ) > DATE( UTC_TIMESTAMP() ), '."\n".
          '      "Waiting for Review", '."\n".
          '      stage_type.status '."\n".
          '    )'."\n".
          '  )'."\n".
          ')',
          'status',
          false
        );
      }
    }

    $db_reqn = $this->get_resource();
    if( $db_reqn )
    {
      if( $select->has_column( 'next_stage_type' ) )
      {
        $db_next_stage_type = $db_reqn->get_next_stage_type();
        $select->add_constant(
          is_null( $db_next_stage_type ) ? NULL : $db_next_stage_type->name,
          'next_stage_type'
        );
      }

      if( $select->has_column( 'has_ethics_approval_list' ) )
      {
        $select->add_constant(
          $db_reqn->has_ethics_approval_list(),
          'has_ethics_approval_list',
          'boolean'
        );
      }

      // include the user first/last/name as supplemental data
      $select->add_column(
        'CONCAT( user.first_name, " ", user.last_name, " (", user.name, ")" )',
        'formatted_user_id',
        false
      );

      $select->add_column(
        'CONCAT( trainee_user.first_name, " ", trainee_user.last_name, " (", trainee_user.name, ")" )',
        'formatted_trainee_user_id',
        false
      );

      $select->add_column(
        'CONCAT( designate_user.first_name, " ", designate_user.last_name, " (", designate_user.name, ")" )',
        'formatted_designate_user_id',
        false
      );

      if( $select->has_column( 'has_agreements' ) )
      {
        $reqn_version_mod = lib::create( 'database\modifier' );
        $reqn_version_mod->where( 'agreement_filename', '!=', NULL );
        $select->add_constant( 0 < $db_reqn->get_reqn_version_count( $reqn_version_mod ), 'has_agreements' );
      }
    }
  }

  /**
   * Extend parent method
   */
  public function pre_write( $record )
  {
    parent::pre_write( $record );

    $reqn_class_name = lib::get_class_name( 'database\reqn' );
    $reqn_type_class_name = lib::get_class_name( 'database\reqn_type' );
    $language_class_name = lib::get_class_name( 'database\language' );

    // if no type has been selected then assume standard
    if( is_null( $record->reqn_type_id ) )
    {
      $db_reqn_type = $reqn_type_class_name::get_unique_record( 'name', 'Standard' );
      $record->reqn_type_id = $db_reqn_type->id;
    }

    // generate a random identifier if none exists
    if( is_null( $record->identifier ) ) $record->identifier = $reqn_class_name::get_temporary_identifier();

    // if the language_id isn't set then default to English
    if( is_null( $record->language_id ) )
      $record->language_id = $language_class_name::get_unique_record( 'code', 'en' )->id;

    // if the current user has a supervisor then make them the owner
    $db_applicant = $record->get_user()->get_applicant();
    if( !is_null( $db_applicant->supervisor_user_id ) )
    {
      $record->user_id = $db_applicant->supervisor_user_id;
      $record->trainee_user_id = $db_applicant->user_id;
    }
  }
}
