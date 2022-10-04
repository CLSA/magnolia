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

    if( $this->service->may_continue() )
    {
      // make sure to restrict applicants to their own reqns which are not abandoned
      $db_reqn_version = $this->get_resource();
      if( !is_null( $db_reqn_version ) )
      {
        $db_reqn = $db_reqn_version->get_reqn();
        if( in_array( $db_role->name, ['applicant', 'designate'] ) && !is_null( $db_reqn ) )
        {
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
    parent::prepare_read( $select, $modifier );
    $modifier->join( 'reqn', 'reqn_version.reqn_id', 'reqn.id' );
    $modifier->join( 'reqn_current_final_report', 'reqn.id', 'reqn_current_final_report.reqn_id' );
    $modifier->left_join( 'final_report', 'reqn_current_final_report.final_report_id', 'final_report.id' );
    $modifier->join( 'user', 'reqn.user_id', 'user.id' );
    $modifier->left_join( 'user', 'reqn.trainee_user_id', 'trainee_user.id', 'trainee_user' );
    $modifier->left_join( 'user', 'reqn.designate_user_id', 'designate_user.id', 'designate_user' );
    $modifier->join( 'language', 'reqn.language_id', 'language.id' );
    $modifier->left_join( 'deadline', 'reqn.deadline_id', 'deadline.id' );
    $modifier->left_join( 'country', 'reqn_version.applicant_country_id', 'applicant_country.id', 'applicant_country' );
    $modifier->left_join( 'country', 'reqn_version.trainee_country_id', 'trainee_country.id', 'trainee_country' );

    $select->add_column(
      'CONCAT( REPLACE( reqn_version.amendment, ".", "" ), reqn_version.version )',
      'amendment_version',
      false
    );
    $select->add_column( 'CONCAT_WS( " ", user.first_name, user.last_name )', 'applicant_name', false );
    $select->add_column( 'user.email', 'applicant_email', false );
    $select->add_column( 'CONCAT_WS( " ", trainee_user.first_name, trainee_user.last_name )', 'trainee_name', false );
    $select->add_column( 'trainee_user.email', 'trainee_email', false );
    $select->add_column( 'CONCAT_WS( " ", designate_user.first_name, designate_user.last_name )', 'designate_name', false );
    $select->add_column( 'designate_user.email', 'designate_email', false );

    if( $select->has_column( 'has_agreement_filename' ) )
      $select->add_column( 'agreement_filename IS NOT NULL', 'has_agreement_filename', true, 'boolean' );

    if( $select->has_table_columns( 'reqn_type' ) )
      $modifier->join( 'reqn_type', 'reqn.reqn_type_id', 'reqn_type.id' );

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
      // include supplemental data
      $modifier->left_join( 'user', 'reqn_version.new_user_id', 'new_user.id', 'new_user' );
      $select->add_column( 'CONCAT( new_user.first_name, " ", new_user.last_name )', 'formatted_new_user_id', false );
      $select->add_table_column( 'applicant_country', 'name', 'formatted_applicant_country_id' );
      $select->add_table_column( 'trainee_country', 'name', 'formatted_trainee_country_id' );

      if( $select->has_column( 'amendment_justification' ) )
      {
        // get a list of all amendment justifications marked as "show_in_description"
        $join_mod = lib::create( 'database\modifier' );
        $join_mod->where( 'reqn_version.id', '=', 'amendment_justification.reqn_version_id', false );

        $type_sel = lib::create( 'database\select' );
        $type_sel->from( 'amendment_type' );
        $type_sel->add_column( 'id' );
        $type_mod = lib::create( 'database\modifier' );
        $type_mod->where( 'show_in_description', '=', true );
        $join_mod->where(
          'amendment_justification.amendment_type_id',
          'IN',
          sprintf( '(%s%s)', $type_sel->get_sql(), $type_mod->get_sql() ),
          false
        );
        $modifier->join_modifier( 'amendment_justification', $join_mod, 'left' );
        $modifier->group( 'reqn_version.id' );
        $select->add_column(
          'GROUP_CONCAT( amendment_justification.description )',
          'amendment_justification',
          false
        );
      }

      if( $select->has_column( 'has_unread_notice' ) )
      {
        // check if the most recent notice does not include the current user
        $notice_mod = lib::create( 'database\modifier' );
        $notice_mod->order_desc( 'datetime' );
        $notice_mod->limit( 1 );
        $notice_list = $db_reqn_version->get_reqn()->get_notice_object_list( $notice_mod );

        $unread = false;
        if( 0 < count( $notice_list ) )
        {
          $db_user = lib::create( 'business\session' )->get_user();
          $db_notice = current( $notice_list );
          $user_mod = lib::create( 'database\modifier' );
          $user_mod->where( 'user.id', '=', $db_user->id );
          if( 0 == $db_notice->get_user_count( $user_mod ) ) $unread = true;
        }

        $select->add_constant( $unread, 'has_unread_notice', 'boolean' );
      }

      if( $select->has_column( 'has_ethics_approval_list' ) )
      {
        $select->add_constant(
          $db_reqn_version->get_reqn()->has_ethics_approval_list(),
          'has_ethics_approval_list',
          'boolean'
        );
      }

      if( $select->has_column( 'has_changed' ) )
        $select->add_constant( $db_reqn_version->has_changed(), 'has_changed', 'boolean' );
    }
  }
}
