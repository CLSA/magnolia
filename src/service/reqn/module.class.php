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
      // make sure to restrict applicants to their own reqns which are not abandoned
      $db_reqn = $this->get_resource();
      if( 'applicant' == $db_role->name && !is_null( $db_reqn ) )
      {
        $db_graduate = $db_reqn->get_graduate();
        $is_graduate = !is_null( $db_graduate ) && $db_graduate->graduate_user_id == $db_user->id;
        if( ( $db_reqn->user_id != $db_user->id && !$is_graduate ) || 'abandoned' == $db_reqn->state )
        {
          $this->get_status()->set_code( 404 );
          return;
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

    $modifier->join( 'reqn_type', 'reqn.reqn_type_id', 'reqn_type.id' );
    $modifier->join( 'reqn_current_reqn_version', 'reqn.id', 'reqn_current_reqn_version.reqn_id' );
    $modifier->join( 'reqn_version', 'reqn_current_reqn_version.reqn_version_id', 'reqn_version.id' );
    $modifier->left_join( 'deadline', 'reqn.deadline_id', 'deadline.id' );
    $modifier->join( 'user', 'reqn.user_id', 'user.id' );
    $modifier->left_join( 'graduate', 'reqn.graduate_id', 'graduate.id' );

    $join_mod = lib::create( 'database\modifier' );
    $join_mod->where( 'reqn.id', '=', 'stage.reqn_id', false );
    $join_mod->where( 'stage.datetime', '=', NULL );
    $modifier->join_modifier( 'stage', $join_mod );
    $modifier->join( 'stage_type', 'stage.stage_type_id', 'stage_type.id' );

    if( $select->has_column( 'state_days' ) )
      $select->add_column( 'DATEDIFF( NOW(), state_date )', 'state_days', false, 'integer' );

    if( $select->has_column( 'user_full_name' ) )
    {
      $select->add_table_column(
        'user', 'CONCAT_WS( " ", user.first_name, user.last_name )', 'user_full_name', false );
    }

    if( $select->has_column( 'graduate_full_name' ) )
    {
      $modifier->left_join( 'user', 'graduate.graduate_user_id', 'graduate_user.id', 'graduate_user' );
      $select->add_table_column(
        'graduate_user',
        'IF( graduate_user.id IS NULL, NULL, CONCAT_WS( " ", graduate_user.first_name, graduate_user.last_name ) )',
        'graduate_full_name',
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

    if( 'applicant' == $db_role->name )
    {
      // only show applicants their own reqns which aren't abandoned
      $modifier->where_bracket( true );
      $modifier->where( 'reqn.user_id', '=', $db_user->id );
      $modifier->or_where( 'graduate.graduate_user_id', '=', $db_user->id );
      $modifier->where_bracket( false );
      $modifier->where( 'IFNULL( reqn.state, "" )', '!=', 'abandoned' );

      // don't show applicants the deferral notes unless the reqn is deferred
      if( $select->has_column( 'deferral_note_1a' ) )
      {
        $select->add_column(
          'IF( "deferred" = reqn.state, deferral_note_1a, NULL )', 'deferral_note_1a', false );
        $select->add_column(
          'IF( "deferred" = reqn.state, deferral_note_1b, NULL )', 'deferral_note_1b', false );
        $select->add_column(
          'IF( "deferred" = reqn.state, deferral_note_1c, NULL )', 'deferral_note_1c', false );
        $select->add_column(
          'IF( "deferred" = reqn.state, deferral_note_1d, NULL )', 'deferral_note_1d', false );
        $select->add_column(
          'IF( "deferred" = reqn.state, deferral_note_1e, NULL )', 'deferral_note_1e', false );
        $select->add_column(
          'IF( "deferred" = reqn.state, deferral_note_1f, NULL )', 'deferral_note_1f', false );
        $select->add_column(
          'IF( "deferred" = reqn.state, deferral_note_2a, NULL )', 'deferral_note_2a', false );
        $select->add_column(
          'IF( "deferred" = reqn.state, deferral_note_2b, NULL )', 'deferral_note_2b', false );
        $select->add_column(
          'IF( "deferred" = reqn.state, deferral_note_2c, NULL )', 'deferral_note_2c', false );
      }
    }
    else if( 'reviewer' == $db_role->name )
    {
      // restrict reviewers to seeing reqns in the DSAC Review stage only
      $modifier->where( 'stage_type.name', '=', 'DSAC Review' );
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
      // include the user first/last/name as supplemental data
      $select->add_column( 'CONCAT( user.first_name, " ", user.last_name, " (", user.name, ")" )', 'formatted_user_id', false );

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
    $graduate_class_name = lib::get_class_name( 'database\graduate' );

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
    $db_graduate = $graduate_class_name::get_unique_record( 'graduate_user_id', $record->user_id );
    if( !is_null( $db_graduate ) )
    {
      $record->user_id = $db_graduate->user_id;
      $record->graduate_id = $db_graduate->id;
    }
  }
}
