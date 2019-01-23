<?php
/**
 * module.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\service\user;
use cenozo\lib, cenozo\log, util;

/**
 * Performs operations which effect how this module is used in a service
 */
class module extends \cenozo\service\user\module
{
  /**
   * Extend parent method
   */
  public function prepare_read( $select, $modifier )
  {
    parent::prepare_read( $select, $modifier );

    if( $select->has_column( 'newsletter' ) )
    {
      $modifier->left_join( 'applicant', 'user.id', 'applicant.user_id' );
      $select->add_column( 'IFNULL( applicant.newsletter, false )', 'newsletter', false );
    }

    if( $select->has_column( 'supervisor' ) )
    {
      $modifier->left_join( 'graduate', 'user.id', 'graduate.graduate_user_id' );
      $modifier->left_join( 'user', 'graduate.user_id', 'supervisor.id', 'supervisor' );
      $select->add_column(
        'IF( supervisor.id IS NULL, "(none)", CONCAT( supervisor.first_name, " ", supervisor.last_name ) )',
        'supervisor',
        false
      );
    }

    if( $this->get_argument( 'reviewer_only', false ) )
    {
      $join_sel = lib::create( 'database\select' );
      $join_sel->from( 'access' );
      $join_sel->add_column( 'user_id' );

      $join_mod = lib::create( 'database\modifier' );
      $join_mod->join( 'role', 'access.role_id', 'role.id' );
      $join_mod->where( 'role.name', '=', 'reviewer' );
      $join_mod->group( 'user_id' );

      $modifier->join(
        sprintf( '( %s %s ) AS user_join_reviewer', $join_sel->get_sql(), $join_mod->get_sql() ),
        'user.id',
        'user_join_reviewer.user_id'
      );
    }
  }
}
