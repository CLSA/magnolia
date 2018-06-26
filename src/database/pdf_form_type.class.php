<?php
/**
 * pdf_form_type.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\database;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * pdf_form_type: record
 */
class pdf_form_type extends \cenozo\database\record
{
  /**
   * Returns the form type's active document (there should only ever be one)
   * 
   * @return database\pdf_form
   * @access public
   */
  public function get_active_pdf_form()
  {
    $modifier = lib::create( 'database\modifier' );
    $modifier->where( 'active', '=', true );
    $modifier->limit( 1 );
    $pdf_form_list = $this->get_pdf_form_object_list( $modifier );
    return 0 < count( $pdf_form_list ) ? current( $pdf_form_list ) : NULL;
  }
}
