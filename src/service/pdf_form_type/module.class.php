<?php
/**
 * module.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\service\pdf_form_type;
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

    $join_mod = lib::create( 'database\modifier' );
    $join_mod->where( 'pdf_form_type.id', '=', 'active_pdf_form.pdf_form_type_id', false );
    $join_mod->where( 'active_pdf_form.active', '=', true );
    $modifier->join_modifier( 'pdf_form', $join_mod, 'left', 'active_pdf_form' );
  }
}
