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

    $module = $this->get_module( 'requisition' );
    if( !is_null( $module ) )
    {
      if( $module->has_action( 'view' ) ) $module->add_action( 'view', '/{identifier}?{t0}&{t1}&{t2}' );
      $module->add_child( 'progress_report' );
    }

    $module = $this->get_module( 'progress_report' );
    if( !is_null( $module ) )
      if( $module->has_action( 'view' ) ) $module->add_action( 'view', '/{identifier}?{t}' );
  }

  /**
   * Extends the sparent method
   */
  protected function build_listitem_list()
  {
    parent::build_listitem_list();

    $db_role = lib::create( 'business\session' )->get_role();

    $this->add_listitem( 'Requisitions', 'requisition' );

    $this->remove_listitem( 'Availability Types' );
    $this->remove_listitem( 'Consent Types' );
    $this->remove_listitem( 'Event Types' );
    $this->remove_listitem( 'Languages' );
    $this->remove_listitem( 'States' );
      
    if( 'applicant' == $db_role->name || 'reviewer' == $db_role->name )
      $this->remove_listitem( 'Users' );
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

    if( array_key_exists( 'User Overview', $list ) )
      if( 'applicant' == $db_role->name || 'reviewer' == $db_role->name )
        unset( $list['User Overview'] );
      
    return $list;
  }
}
