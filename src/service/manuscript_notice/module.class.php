<?php
/**
 * module.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\service\manuscript_notice;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * Performs operations which effect how this module is used in a service
 */
class module extends \cenozo\service\module
{
  /**
   * Extend parent method
   */
  public function pre_write( $record )
  {
    if( is_null( $record->datetime ) ) $record->datetime = util::get_datetime_object();
  }

  /**
   * Extend parent method
   */
  public function prepare_read( $select, $modifier )
  {
    parent::prepare_read( $select, $modifier );

    if( 'manuscript' == $this->get_parent_subject() )
    {
      $db_user = lib::create( 'business\session' )->get_user();
      $db_manuscript = $this->get_parent_resource();
      $db_reqn = $db_manuscript->get_reqn();
      $user_type = NULL;
      if( $db_user->id == $db_reqn->user_id ) $user_type = 'primary';
      else if( $db_user->id == $db_reqn->trainee_user_id ) $user_type = 'trainee';
      else if( $db_user->id == $db_reqn->designate_user_id )$user_type = 'designate';

      if( !is_null( $user_type ) ) $db_manuscript->mark_manuscript_notices_as_read( $user_type );
    }

    if( $select->has_column( 'viewed_by_user' ) )
    {
      // we can't use parent::add_count_column() since it doesn't quite match our use case
      $join_sel = lib::create( 'database\select' );
      $join_sel->from( 'manuscript_notice' );
      $join_sel->add_column( 'id', 'manuscript_notice_id' );
      $join_sel->add_column( 'manuscript_notice_has_user.user_id IS NOT NULL', 'has_user', false );

      $join_mod = lib::create( 'database\modifier' );
      $join_mod->join( 'manuscript', 'manuscript_notice.manuscript_id', 'manuscript.id' );
      $join_mod->join( 'reqn', 'manuscript.reqn_id', 'reqn.id' );
      $sub_mod = lib::create( 'database\modifier' );
      $sub_mod->where( 'manuscript_notice.id', '=', 'manuscript_notice_has_user.manuscript_notice_id', false );
      $sub_mod->where( 'reqn.user_id', '=', 'manuscript_notice_has_user.user_id', false );
      $join_mod->join_modifier( 'manuscript_notice_has_user', $sub_mod, 'left' );
      $join_mod->group( 'manuscript_notice.id' );

      $modifier->left_join(
        sprintf( '( %s %s ) AS manuscript_notice_join_user', $join_sel->get_sql(), $join_mod->get_sql() ),
        'manuscript_notice.id',
        'manuscript_notice_join_user.manuscript_notice_id' );
      $select->add_column( 'has_user', 'viewed_by_user', false, 'boolean' );
    }

    if( $select->has_column( 'viewed_by_trainee_user' ) )
    {
      // we can't use parent::add_count_column() since it doesn't quite match our use case
      $join_sel = lib::create( 'database\select' );
      $join_sel->from( 'manuscript_notice' );
      $join_sel->add_column( 'id', 'manuscript_notice_id' );
      $join_sel->add_column( 'manuscript_notice_has_user.user_id IS NOT NULL', 'has_trainee_user', false );

      $join_mod = lib::create( 'database\modifier' );
      $join_mod->join( 'manuscript', 'manuscript_notice.manuscript_id', 'manuscript.id' );
      $join_mod->join( 'reqn', 'manuscript.reqn_id', 'reqn.id' );
      $sub_mod = lib::create( 'database\modifier' );
      $sub_mod->where( 'manuscript_notice.id', '=', 'manuscript_notice_has_user.manuscript_notice_id', false );
      $sub_mod->where( 'reqn.trainee_user_id', '=', 'manuscript_notice_has_user.user_id', false );
      $join_mod->join_modifier( 'manuscript_notice_has_user', $sub_mod, 'left' );
      $join_mod->group( 'manuscript_notice.id' );

      $modifier->left_join(
        sprintf( '( %s %s ) AS manuscript_notice_join_trainee_user', $join_sel->get_sql(), $join_mod->get_sql() ),
        'manuscript_notice.id',
        'manuscript_notice_join_trainee_user.manuscript_notice_id' );
      $select->add_column( 'has_trainee_user', 'viewed_by_trainee_user', false, 'boolean' );
    }

    if( $select->has_column( 'viewed_by_designate_user' ) )
    {
      // we can't use parent::add_count_column() since it doesn't quite match our use case
      $join_sel = lib::create( 'database\select' );
      $join_sel->from( 'manuscript_notice' );
      $join_sel->add_column( 'id', 'manuscript_notice_id' );
      $join_sel->add_column( 'manuscript_notice_has_user.user_id IS NOT NULL', 'has_designate_user', false );

      $join_mod = lib::create( 'database\modifier' );
      $join_mod->join( 'manuscript', 'manuscript_notice.manuscript_id', 'manuscript.id' );
      $join_mod->join( 'reqn', 'manuscript.reqn_id', 'reqn.id' );
      $sub_mod = lib::create( 'database\modifier' );
      $sub_mod->where( 'manuscript_notice.id', '=', 'manuscript_notice_has_user.manuscript_notice_id', false );
      $sub_mod->where( 'reqn.designate_user_id', '=', 'manuscript_notice_has_user.user_id', false );
      $join_mod->join_modifier( 'manuscript_notice_has_user', $sub_mod, 'left' );
      $join_mod->group( 'manuscript_notice.id' );

      $modifier->left_join(
        sprintf( '( %s %s ) AS manuscript_notice_join_designate_user', $join_sel->get_sql(), $join_mod->get_sql() ),
        'manuscript_notice.id',
        'manuscript_notice_join_designate_user.manuscript_notice_id' );
      $select->add_column( 'has_designate_user', 'viewed_by_designate_user', false, 'boolean' );
    }
  }
}
