<?php
/**
 * module.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\service\manuscript_deferral_note;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * Performs operations which effect how this module is used in a service
 */
class module extends \cenozo\service\module
{
  /**
   * Extend parent method
   */
  public function prepare_read( $select, $modifier )
  {
    parent::prepare_read( $select, $modifier );

    $modifier->join( 'manuscript', 'manuscript_deferral_note.manuscript_id', 'manuscript.id' );

    if( $select->has_column( 'page_title' ) )
      $select->add_column( 'REPLACE(page, "_", " ")', 'page_title', false );
  }
}
