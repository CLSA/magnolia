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
      // make sure to restrict applicants to their own reqns
      $db_reqn = $this->get_resource();
      if( 'applicant' == $db_role->name && !is_null( $db_reqn ) )
      {
        if( $db_reqn->user_id != $db_user->id )
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

    $modifier->join( 'deadline', 'reqn.deadline_id', 'deadline.id' );

    // only show applicants their own reqns
    if( 'applicant' == $db_role->name ) $modifier->where( 'reqn.user_id', '=', $db_user->id );

    if( $select->has_column( 'user_full_name' ) )
    {
      $modifier->join( 'user', 'reqn.user_id', 'user.id' );
      $select->add_table_column(
        'user', 'CONCAT_WS( " ", user.first_name, user.last_name )', 'user_full_name', false );
    }

    // don't show applicants the deferral notes unless the reqn is deferred
    if( 'applicant' == $db_role->name )
    {
      if( $select->has_column( 'deferral_note_part1_a1' ) )
      {
        $select->add_column(
          'IF( "deferred" = reqn.state, deferral_note_part1_a1, NULL )', 'deferral_note_part1_a1', false );
        $select->add_column(
          'IF( "deferred" = reqn.state, deferral_note_part1_a2, NULL )', 'deferral_note_part1_a2', false );
        $select->add_column(
          'IF( "deferred" = reqn.state, deferral_note_part1_a3, NULL )', 'deferral_note_part1_a3', false );
        $select->add_column(
          'IF( "deferred" = reqn.state, deferral_note_part1_a4, NULL )', 'deferral_note_part1_a4', false );
        $select->add_column(
          'IF( "deferred" = reqn.state, deferral_note_part1_a5, NULL )', 'deferral_note_part1_a5', false );
        $select->add_column(
          'IF( "deferred" = reqn.state, deferral_note_part1_a6, NULL )', 'deferral_note_part1_a6', false );
        $select->add_column(
          'IF( "deferred" = reqn.state, deferral_note_part2_a, NULL )', 'deferral_note_part2_a', false );
        $select->add_column(
          'IF( "deferred" = reqn.state, deferral_note_part2_b, NULL )', 'deferral_note_part2_b', false );
        $select->add_column(
          'IF( "deferred" = reqn.state, deferral_note_part2_c, NULL )', 'deferral_note_part2_c', false );
      }
    }

    if( $select->has_column( 'unprepared' ) )
      $select->add_column( 'IF( stage.unprepared, "Yes", "No" )', 'unprepared', false );

    if( $select->has_table_columns( 'stage_type' ) )
    {
      $modifier->join( 'reqn_last_stage', 'reqn.id', 'reqn_last_stage.reqn_id' );
      $modifier->join( 'stage', 'reqn_last_stage.stage_id', 'stage.id' );
      $modifier->join( 'stage_type', 'stage.stage_type_id', 'stage_type.id' );

      if( $select->has_table_column( 'stage_type', 'status' ) )
      {
        // show admin stages before deadline as waiting for review
        $select->add_table_column(
          'stage_type',
          'IF( '.
          '  "deferred" = state, "Action Required", '.
          '  IF( state IS NOT NULL, CONCAT( UPPER( SUBSTRING( state, 1, 1 ) ), SUBSTRING( state, 2 ) ), '.
          '    IF( '.
          '      "review" = stage_type.phase AND deadline.date > DATE( UTC_TIMESTAMP() ), '.
          '      "Waiting for Review", '.
          '      stage_type.status '.
          '    )'.
          '  )'.
          ')',
          'status',
          false
        );
      }
    }
  }
}
