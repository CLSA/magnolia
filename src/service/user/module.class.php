<?php
/**
 * module.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\service\user;
use cenozo\lib, cenozo\log, magnolia\util;

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

    if( $select->has_column( 'supervisor_user_id' ) )
    {
      $modifier->left_join( 'applicant', 'user.id', 'applicant.user_id' );
      $modifier->left_join( 'user', 'applicant.supervisor_user_id', 'supervisor_user.id', 'supervisor_user' );
      $select->add_column( 'applicant.supervisor_user_id', 'supervisor_user_id', false );
      $select->add_column(
        'IF( supervisor_user.id IS NULL, "(none)", CONCAT( supervisor_user.first_name, " ", supervisor_user.last_name ) )',
        'formatted_supervisor_user_id',
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
    \cenozo\database\database::$debug = true;
  }
}
