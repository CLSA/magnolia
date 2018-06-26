<?php
/**
 * get.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\service\pdf_form;
use cenozo\lib, cenozo\log, magnolia\util;

class get extends \cenozo\service\downloadable
{
  /**
   * Replace parent method
   * 
   * When the client calls for a file we return the pdf_form's file
   */
  protected function get_downloadable_mime_type_list()
  {
    return array( 'application/pdf' );
  }

  /**
   * Replace parent method
   * 
   * When the client calls for a file we return the pdf_form's file
   */
  protected function get_downloadable_public_name()
  {
    $db_pdf_form = $this->get_leaf_record();
    return sprintf( '%s %s.pdf', $db_pdf_form->get_pdf_form_type()->name, $db_pdf_form->version->format( 'Y-m-d' ) );
  }

  /**
   * Replace parent method
   * 
   * When the client calls for a file we return the pdf_form's file
   */
  protected function get_downloadable_file_path()
  {
    return sprintf( '%s/%d.%s.pdf', PDF_FORM_PATH, $this->get_leaf_record()->id, $this->get_argument( 'language', 'en' ) );
  }
}
