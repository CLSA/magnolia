<?php
/**
 * module.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\service\reqn_version;
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
      $db_reqn_version = $this->get_resource();
      if( !is_null( $db_reqn_version ) )
      {
        $db_reqn = $db_reqn_version->get_reqn();
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
  }

  /**
   * Extend parent method
   */
  public function prepare_read( $select, $modifier )
  {
    parent::prepare_read( $select, $modifier );
    $modifier->join( 'reqn', 'reqn_version.reqn_id', 'reqn.id' );
    $modifier->join( 'user', 'reqn.user_id', 'user.id' );
    $modifier->left_join( 'graduate', 'reqn.graduate_id', 'graduate.id' );
    $modifier->left_join( 'user', 'graduate.graduate_user_id', 'graduate_user.id', 'graduate_user' );
    $modifier->join( 'language', 'reqn.language_id', 'language.id' );
    $modifier->left_join( 'deadline', 'reqn.deadline_id', 'deadline.id' );

    $select->add_column(
      'CONCAT( REPLACE( reqn_version.amendment, ".", "" ), reqn_version.version )',
      'amendment_version',
      false
    );
    $select->add_column( 'CONCAT_WS( " ", user.first_name, user.last_name )', 'applicant_name', false );
    $select->add_column( 'user.email', 'applicant_email', false );
    $select->add_column( 'CONCAT_WS( " ", graduate_user.first_name, graduate_user.last_name )', 'graduate_name', false );
    $select->add_column( 'graduate_user.email', 'graduate_email', false );

    if( $select->has_columns( 'has_agreement_filename' ) )
      $select->add_column( 'agreement_filename IS NOT NULL', 'has_agreement_filename', true, 'boolean' );

    if( $select->has_table_columns( 'stage' ) || $select->has_table_columns( 'stage_type' ) ) 
    {
      $join_mod = lib::create( 'database\modifier' );
      $join_mod->where( 'reqn.id', '=', 'stage.reqn_id', false );
      $join_mod->where( 'stage.datetime', '=', NULL );
      $modifier->join_modifier( 'stage', $join_mod );
      $modifier->join( 'stage_type', 'stage.stage_type_id', 'stage_type.id' );
    }

    if( $select->has_column( 'is_current_version' ) )
    {
      $modifier->join( 'reqn_current_reqn_version', 'reqn.id', 'reqn_current_reqn_version.reqn_id' );
      $modifier->join(
        'reqn_version',
        'reqn_current_reqn_version.reqn_version_id',
        'current_reqn_version.id',
        '',
        'current_reqn_version'
      );
      $select->add_column(
        'reqn_version.amendment = current_reqn_version.amendment AND reqn_version.version = current_reqn_version.version',
        'is_current_version',
        false,
        'boolean'
      );
    }

    $db_reqn_version = $this->get_resource();
    if( !is_null( $db_reqn_version ) )
    {
      if( $select->has_column( 'has_changed' ) )
      {
        $select->add_constant( $db_reqn_version->has_changed(), 'has_changed', 'boolean' );
      }
    }
  }
}
