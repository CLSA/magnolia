<?php
/**
 * module.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\service\manuscript;
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

    if( $this->service->may_continue() )
    {
      $db_manuscript = $this->get_resource();
      if( !is_null( $db_manuscript ) )
      {
        $db_reqn = $db_manuscript->get_reqn();

        // make sure to restrict applicants to their own requisitions which are not abandoned
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
        // typist can only see legacy requisitions
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
    $manuscript_stage_type_class_name = lib::get_class_name( 'database\manuscript_stage_type' );

    parent::prepare_read( $select, $modifier );

    $session = lib::create( 'business\session' );
    $db_user = $session->get_user();
    $db_role = $session->get_role();

    $modifier->join(
      'manuscript_current_manuscript_version',
      'manuscript.id',
      'manuscript_current_manuscript_version.manuscript_id'
    );
    $modifier->join(
      'manuscript_version',
      'manuscript_current_manuscript_version.manuscript_version_id',
      'manuscript_version.id'
    );
    $modifier->join( 'reqn', 'manuscript.reqn_id', 'reqn.id' );
    $modifier->join( 'language', 'reqn.language_id', 'languange.id' );
    $modifier->join( 'user', 'reqn.user_id', 'user.id' );
    $modifier->left_join( 'user', 'reqn.trainee_user_id', 'trainee_user.id', 'trainee_user' );
    $modifier->left_join( 'user', 'reqn.designate_user_id', 'designate_user.id', 'designate_user' );

    $join_mod = lib::create( 'database\modifier' );
    $join_mod->where( 'manuscript.id', '=', 'manuscript_stage.manuscript_id', false );
    $join_mod->where( 'manuscript_stage.datetime', '=', NULL );
    $modifier->join_modifier( 'manuscript_stage', $join_mod );
    $modifier->join(
      'manuscript_stage_type',
      'manuscript_stage.manuscript_stage_type_id',
      'manuscript_stage_type.id'
    );

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

    if( in_array( $db_role->name, ['applicant', 'designate'] ) )
    {
      // only show applicants their own manuscripts which aren't abandoned
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
    }
    else if( 'typist' == $db_role->name )
    {
      // typists can only see legacy reqns
      $modifier->where( 'reqn.legacy', '=', true );
    }

    if( $select->has_table_columns( 'manuscript_stage_type' ) )
    {
      if( $select->has_table_column( 'manuscript_stage_type', 'status' ) )
      {
        $select->add_table_column(
          'manuscript_stage_type',
          'IF( '."\n".
            '"deferred" = state, "Action Required",'."\n".
            'IF'."\n".
              'state IS NOT NULL,'."\n".
              'CONCAT( UPPER( SUBSTRING( state, 1, 1 ) ), SUBSTRING( state, 2 ) ),'."\n".
              'manuscript_stage_type.status'."\n".
            ')'."\n".
          ')',
          'status',
          false
        );
      }
    }

    $db_manuscript = $this->get_resource();
    if( $db_manuscript )
    {
      if( $select->has_column( 'next_manuscript_stage_type' ) )
      {
        $db_next_manuscript_stage_type = $db_manuscript->get_next_manuscript_stage_type();
        $select->add_constant(
          is_null( $db_next_manuscript_stage_type ) ? NULL : $db_next_manuscript_stage_type->name,
          'next_manuscript_stage_type'
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
    }
  }
}
