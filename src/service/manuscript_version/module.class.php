<?php
/**
 * module.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\service\manuscript_version;
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
    // do not allow access to a suspended applicant
    $session = lib::create( 'business\session' );
    $db_user = $session->get_user();
    $db_role = $session->get_role();

    if( $db_user->get_suspended() && in_array( $db_role->name, ['applicant', 'designate'] ) )
    {
      $this->get_status()->set_code( 403 );
      return;
    }

    parent::validate();

    $session = lib::create( 'business\session' );
    $db_user = $session->get_user();
    $db_role = $session->get_role();

    if( $this->service->may_continue() )
    {
      if( 'PATCH' == $this->get_method() && 'dao' == $db_role->name )
      {
        $this->get_status()->set_code( 403 );
        return;
      }

      // make sure to restrict applicants to their own manuscripts which are not abandoned
      $db_manuscript_version = $this->get_resource();
      if( !is_null( $db_manuscript_version ) )
      {
        $db_manuscript = $db_manuscript_version->get_manuscript();
        if( in_array( $db_role->name, ['applicant', 'designate'] ) && !is_null( $db_manuscript ) )
        {
          $db_reqn = $db_manuscript->get_reqn();
          $trainee = 'applicant' == $db_role->name && $db_reqn->trainee_user_id == $db_user->id;
          $designate = 'designate' == $db_role->name && $db_reqn->designate_user_id == $db_user->id;
          if( ( $db_reqn->user_id != $db_user->id && !$trainee && !$designate ) || 'abandoned' == $db_reqn->state )
          {
            $this->get_status()->set_code( 404 );
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
    $manuscript_version_class_name = lib::get_class_name( 'database\manuscript_version' );
    $language_class_name = lib::get_class_name( 'database\language' );

    parent::prepare_read( $select, $modifier );

    $modifier->join( 'manuscript', 'manuscript_version.manuscript_id', 'manuscript.id' );
    $modifier->join( 'reqn', 'manuscript.reqn_id', 'reqn.id' );
    $modifier->join( 'user', 'reqn.user_id', 'user.id' );
    $modifier->left_join( 'user', 'reqn.trainee_user_id', 'trainee_user.id', 'trainee_user' );
    $modifier->left_join( 'user', 'reqn.designate_user_id', 'designate_user.id', 'designate_user' );
    $modifier->join( 'language', 'reqn.language_id', 'language.id' );

    if( $select->has_table_columns( 'manuscript_stage' ) || $select->has_table_columns( 'manuscript_stage_type' ) )
    {
      $join_mod = lib::create( 'database\modifier' );
      $join_mod->where( 'manuscript.id', '=', 'manuscript_stage.manuscript_id', false );
      $join_mod->where( 'manuscript_stage.datetime', '=', NULL );
      $modifier->join_modifier( 'manuscript_stage', $join_mod );
      $modifier->join(
        'manuscript_stage_type',
        'manuscript_stage.manuscript_stage_type_id',
        'manuscript_stage_type.id'
      );
    }

    if( $select->has_column( 'is_current_version' ) )
    {
      $modifier->join(
        'manuscript_current_manuscript_version',
        'manuscript.id',
        'manuscript_current_manuscript_version.manuscript_id'
      );
      $modifier->join(
        'manuscript_version',
        'manuscript_current_manuscript_version.manuscript_version_id',
        'current_manuscript_version.id',
        '',
        'current_manuscript_version'
      );
      $select->add_column(
        'manuscript_version.version = current_manuscript_version.version',
        'is_current_version',
        false,
        'boolean'
      );
    }

    $db_manuscript_version = $this->get_resource();
    if( !is_null( $db_manuscript_version ) )
    {
      if( $select->has_column( 'has_unread_notice' ) )
      {
        // check if the most recent notice does not include the current user
        $notice_mod = lib::create( 'database\modifier' );
        $notice_mod->order_desc( 'datetime' );
        $notice_mod->limit( 1 );
        $notice_list = $db_manuscript_version->get_manuscript()->get_manuscript_notice_object_list( $notice_mod );

        $unread = false;
        if( 0 < count( $notice_list ) )
        {
          $db_user = lib::create( 'business\session' )->get_user();
          $db_manuscript_notice = current( $notice_list );
          $user_mod = lib::create( 'database\modifier' );
          $user_mod->where( 'user.id', '=', $db_user->id );
          if( 0 == $db_manuscript_notice->get_user_count( $user_mod ) ) $unread = true;
        }

        $select->add_constant( $unread, 'has_unread_notice', 'boolean' );
      }

      if( $select->has_column( 'has_changed' ) )
        $select->add_constant( $db_manuscript_version->has_changed(), 'has_changed', 'boolean' );
    }
  }
}
