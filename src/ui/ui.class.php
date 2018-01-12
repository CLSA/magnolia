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
  protected function build_listitem_list()
  {
    parent::build_listitem_list();

    $this->add_listitem( 'Requisitions', 'requisition' );

    $this->remove_listitem( 'Availability Types' );
    $this->remove_listitem( 'Consent Types' );
    $this->remove_listitem( 'Event Types' );
    $this->remove_listitem( 'Languages' );
    $this->remove_listitem( 'States' );
  }

  /**
   * Extend the parent method
   */
  protected function get_utility_items()
  {
    // remove export
    $list = parent::get_utility_items();
    if( array_key_exists( 'Participant Export', $list ) ) unset( $list['Participant Export'] );
    if( array_key_exists( 'Participant Multiedit', $list ) ) unset( $list['Participant Multiedit'] );
    if( array_key_exists( 'Participant Search', $list ) ) unset( $list['Participant Search'] );
    if( array_key_exists( 'Tracing', $list ) ) unset( $list['Tracing'] );
    return $list;
  }
}
