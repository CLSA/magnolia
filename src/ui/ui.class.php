<?php
/**
 * ui.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\ui;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * Application extension to ui class
 */
class ui extends \cenozo\ui\ui
{
  /**
   * Extends the sparent method
   */
  protected function build_module_list()
  {
    parent::build_module_list();

    $module = $this->get_module( 'data_category' );
    if( !is_null( $module ) )
    {
      $module->add_choose( 'study_phase' );
      $module->add_child( 'data_option' );
    }

    $module = $this->get_module( 'data_option' );
    if( !is_null( $module ) )
    {
      $module->add_child( 'data_selection' );
      $module->add_child( 'reqn' );
    }

    $module = $this->get_module( 'data_selection' );
    if( !is_null( $module ) )
    {
      $module->add_child( 'data_selection' );
    }

    $module = $this->get_module( 'data_version' );
    if( !is_null( $module ) ) $module->add_child( 'data_release' );

    $module = $this->get_module( 'deadline' );
    if( !is_null( $module ) ) $module->add_child( 'reqn' );

    $module = $this->get_module( 'reqn' );
    if( !is_null( $module ) )
    {
      $module->add_child( 'final_report' );
      $module->add_child( 'reqn_version' );
      $module->add_child( 'review' );
      $module->add_child( 'stage' );
      $module->add_child( 'data_release' );
      $module->add_child( 'notice' );
      $module->add_child( 'ethics_approval' );
      $module->add_child( 'notification' );
      $module->add_child( 'output' );
    }

    $module = $this->get_module( 'reqn_type' );
    if( !is_null( $module ) )
    {
      $module->add_child( 'reqn' );
      $module->add_child( 'stage_type' );
    }

    $module = $this->get_module( 'reqn_version' );
    if( !is_null( $module ) ) $module->append_action_query( 'view', '?{t0}&{t1}&{t2}&{c}' );

    $module = $this->get_module( 'notification_type' );
    if( !is_null( $module ) )
    {
      $module->add_child( 'notification' );
      $module->add_child( 'notification_type_email' );
      $module->add_child( 'stage_type' );
    }

    $module = $this->get_module( 'output' );
    if( !is_null( $module ) )
    {
      $module->add_child( 'output_source' );
      // origin helps to define reqn vs final-report context
      $module->append_action_query( 'add', '?{origin}' );
      $module->append_action_query( 'view', '?{origin}' );
    }

    $module = $this->get_module( 'output_source' );
    if( !is_null( $module ) )
    {
      // origin helps to define reqn vs final-report context
      $module->append_action_query( 'add', '?{origin}' );
      $module->append_action_query( 'view', '?{origin}' );
    }

    $module = $this->get_module( 'output_type' );
    if( !is_null( $module ) ) $module->add_child( 'output' );

    $module = $this->get_module( 'pdf_form_type' );
    if( !is_null( $module ) ) $module->add_child( 'pdf_form' );

    $module = $this->get_module( 'final_report' );
    if( !is_null( $module ) )
    {
      $module->add_child( 'output' );
      $module->append_action_query( 'view', '?{t}&{c}' );
    }

    $module = $this->get_module( 'stage_type' );
    if( !is_null( $module ) ) $module->add_child( 'reqn' );

    $module = $this->get_module( 'review' );
    // make sure the review module exists even if there is no access to it (this is needed by web/app/root/module.extend.js)
    if( is_null( $module ) ) $module = $this->assert_module( 'review' );
    $module->add_child( 'review_answer' );

    $module = $this->get_module( 'review_type' );
    if( !is_null( $module ) )
    {
      $module->add_child( 'review_type_question' );
      $module->add_choose( 'role' );
    }

    $module = $this->get_module( 'user' );
    if( !is_null( $module ) )
    {
      $module->add_child( 'reqn', 'access' );
      $module->add_child( 'applicant', 'access' );
    }
  }

  /**
   * Extends the sparent method
   */
  protected function build_listitem_list()
  {
    parent::build_listitem_list();

    $db_role = lib::create( 'business\session' )->get_role();

    if( 'typist' != $db_role->name )
    {
      $this->add_listitem( 'Amendment Types', 'amendment_type' );
      $this->add_listitem( 'Data Versions', 'data_version' );
      $this->add_listitem( 'Deadlines', 'deadline' );
      $this->add_listitem( 'Notification Types', 'notification_type' );
      $this->add_listitem( 'PDF Form Templates', 'pdf_form_type' );
      $this->add_listitem( 'Reviews', 'review' );
      $this->add_listitem( 'Review Types', 'review_type' );
      $this->add_listitem( 'Stage Types', 'stage_type' );
      $this->add_listitem( 'Supplemental Files', 'supplemental_file' );
    }

    $this->add_listitem( 'Requisitions', 'reqn' );

    $this->remove_listitem( 'Availability Types' );
    $this->remove_listitem( 'Consent Types' );
    $this->remove_listitem( 'Event Types' );
    $this->remove_listitem( 'Languages' );
    $this->remove_listitem( 'Settings' );
    $this->remove_listitem( 'Sites' );

    if( in_array( $db_role->name, ['applicant', 'designate'] ) )
    {
      $this->remove_listitem( 'Amendment Types' );
      $this->remove_listitem( 'Requisitions' );
    }

    if( 'administrator' != $db_role->name ) $this->remove_listitem( 'Users' );
    if( 'administrator' == $db_role->name )
    {
      $this->add_listitem( 'Data Categories', 'data_category' );
      $this->add_listitem( 'Output Types', 'output_type' );
    }
    if( in_array( $db_role->name, ['administrator', 'readonly'] ) ) $this->add_listitem( 'Requisition Types', 'reqn_type' );
  }

  /**
   * Extend the parent method
   */
  protected function get_utility_items()
  {
    $db_role = lib::create( 'business\session' )->get_role();

    // remove export
    $list = parent::get_utility_items();
    if( array_key_exists( 'Participant Export', $list ) ) unset( $list['Participant Export'] );
    if( array_key_exists( 'Participant Multiedit', $list ) ) unset( $list['Participant Multiedit'] );
    if( array_key_exists( 'Participant Search', $list ) ) unset( $list['Participant Search'] );
    if( array_key_exists( 'Tracing', $list ) ) unset( $list['Tracing'] );

    if( 'administrator' == $db_role->name ) $list['Manage CANUE Approvals'] = array(
      'subject' => 'reqn',
      'action' => 'data_sharing'
    );

    if( array_key_exists( 'User Overview', $list ) )
      if( in_array( $db_role->name, ['applicant', 'designate', 'reviewer'] ) )
        unset( $list['User Overview'] );

    return $list;
  }
}
