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
      // don't allow DAO to make any changes
      if( 'PATCH' == $this->get_method() && 'dao' == $db_role->name )
      {
        $this->get_status()->set_code( 403 );
        return;
      }

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
    $reqn_version_class_name = lib::get_class_name( 'database\reqn_version' );
    $language_class_name = lib::get_class_name( 'database\language' );

    parent::prepare_read( $select, $modifier );

    $modifier->join( 'reqn', 'reqn_version.reqn_id', 'reqn.id' );
    $modifier->join( 'reqn_current_final_report', 'reqn.id', 'reqn_current_final_report.reqn_id' );
    $modifier->left_join( 'final_report', 'reqn_current_final_report.final_report_id', 'final_report.id' );
    $modifier->join( 'reqn_current_destruction_report', 'reqn.id', 'reqn_current_destruction_report.reqn_id' );
    $modifier->left_join(
      'destruction_report',
      'reqn_current_destruction_report.destruction_report_id',
      'destruction_report.id'
    );
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

      if( $select->has_column( 'justification_summary_en' ) )
      {
        $db_language_en = $language_class_name::get_unique_record( 'code', 'en' );
        $select->add_constant(
          $db_reqn_version->get_justification_summary( $db_language_en ),
          'justification_summary_en'
        );
      }

      if( $select->has_column( 'justification_summary_fr' ) )
      {
        $db_language_fr = $language_class_name::get_unique_record( 'code', 'fr' );
        $select->add_constant(
          $db_reqn_version->get_justification_summary( $db_language_fr ),
          'justification_summary_fr'
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

      if( $select->has_column( 'additional_fee_total' ) )
      {
        $fee_sel = lib::create( 'database\select' );
        $fee_sel->add_column( 'SUM( cost )', 'fee_total', false );
        $fee_mod = lib::create( 'database\modifier' );
        $fee_mod->group( 'reqn.id' );
        $row = current( $db_reqn_version->get_reqn()->get_additional_fee_list( $fee_sel, $fee_mod ) );
        $select->add_constant(
          $row ? $row['fee_total'] : 0,
          'additional_fee_total',
          'integer'
        );
      }
    }
  }
}
