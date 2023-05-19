<?php
/**
 * module.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\service\pdf_form;
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

    $modifier->join( 'pdf_form_type', 'pdf_form.pdf_form_type_id', 'pdf_form_type.id' );

    $db_pdf_form = $this->get_resource();
    if( !is_null( $db_pdf_form ) )
    {
      if( $select->has_column( 'filename' ) )
      {
        $select->add_constant(
          basename( $db_pdf_form->get_data_filename() ),
          'filename'
        );
      }
    }
  }
}
