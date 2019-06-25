<?php
/**
 * get.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\service\final_report;
use cenozo\lib, cenozo\log, magnolia\util;

class get extends \cenozo\service\downloadable
{
  /**
   * Replace parent method
   */
  protected function get_downloadable_mime_type_list()
  {
    return array( 'application/pdf' );
  }

  /**
   * Replace parent method
   */
  protected function get_downloadable_public_name()
  {
    return sprintf( 'Final Report %s.pdf', $this->get_leaf_record()->get_reqn()->identifier );
  }

  /**
   * Replace parent method
   * 
   * When the client calls for a file we return the final_report's letter
   */
  protected function get_downloadable_file_path()
  {
    return sprintf( '%s/%s.pdf', FINAL_REPORT_PATH, $this->get_leaf_record()->id );
  }

  /**
   * Extend parent method
   */
  public function prepare()
  {
    parent::prepare();

    // if requesting the final_report as a PDF file then create it first
    if( 'application/pdf' == $this->get_mime_type() ) $this->get_leaf_record()->generate_pdf_form();
  }
}
