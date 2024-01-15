<?php
/**
 * module.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\service\deferral_note;
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

    $modifier->join( 'reqn', 'deferral_note.reqn_id', 'reqn.id' );

    if( $select->has_column( 'form_title' ) )
      $select->add_column( 'REPLACE(form, "_", " ")', 'form_title', false );
    if( $select->has_column( 'page_title' ) )
      $select->add_column( 'REPLACE(page, "_", " ")', 'page_title', false );
  }
}
