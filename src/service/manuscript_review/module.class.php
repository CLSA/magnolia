<?php
/**
 * module.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\service\manuscript_review;
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
    $db_role = $session->get_role();

    // restrict some manuscript review types to certain roles
    if( $this->service->may_continue() )
    {
      $db_manuscript_review = $this->get_resource();
      if( !is_null( $db_manuscript_review ) )
      {
        $manuscript_review_type = $this->get_resource()->get_manuscript_review_type()->name;

        if( 'PATCH' == $this->get_method() )
        {
          if( 'administrator' != $db_role->name )
          {
            if( 'Admin' == $manuscript_review_type ) $this->get_status()->set_code( 403 );
            else if( 'dao' != $db_role->name ) $this->get_status()->set_code( 403 );
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

    $modifier->join(
      'manuscript_review_type',
      'manuscript_review.manuscript_review_type_id',
      'manuscript_review_type.id'
    );
    $modifier->left_join( 'user', 'manuscript_review.user_id', 'user.id' );
    $modifier->left_join(
      'recommendation_type',
      'manuscript_review.manuscript_recommendation_type_id',
      'recommendation_type.id'
    );
    $modifier->join( 'manuscript', 'manuscript_review.manuscript_id', 'manuscript.id' );
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

    $join_mod = lib::create( 'database\modifier' );
    $join_mod->where( 'manuscript.id', '=', 'manuscript_stage.manuscript_id', false );
    $join_mod->where( 'manuscript_stage.datetime', '=', NULL );
    $modifier->join_modifier( 'manuscript_stage', $join_mod );
    $modifier->join(
      'manuscript_stage_type',
      'manuscript_stage.manuscript_stage_type_id',
      'manuscript_stage_type.id'
    );

    if( !is_null( $this->get_resource() ) )
    {
      // include the user first/last/name as supplemental data
      $select->add_column(
        'CONCAT( user.first_name, " ", user.last_name, " (", user.name, ")" )',
        'formatted_user_id',
        false
      );
    }

    if( $select->has_column( 'user_full_name' ) )
      $select->add_column( 'CONCAT( user.first_name, " ", user.last_name )', 'user_full_name', false );

    if( $select->has_column( 'editable' ) )
    {
      $join_mod = lib::create( 'database\modifier' );
      $join_mod->where(
        'manuscript_review_type.id',
        '=',
        'role_has_manuscript_review_type.manuscript_review_type_id',
        false
      );
      $join_mod->where( 'role_has_manuscript_review_type.role_id', '=', $db_role->id );
      $modifier->join_modifier( 'role_has_manuscript_review_type', $join_mod, 'left' );

      $column = 'role_has_manuscript_review_type.role_id IS NOT NULL';
      $select->add_column( $column, 'editable', false, 'boolean' );
    }
  }
}
