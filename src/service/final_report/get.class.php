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
   * When the client calls for a file we return the final_report's ethics letter
   */
  protected function get_downloadable_file_path()
  {
    return sprintf( '%s/%s.pdf', REQN_PATH, $this->get_leaf_record()->id );
  }

  /**
   * Extend parent method
   */
  public function prepare()
  {
    parent::prepare();

    // create the PDF file
    $this->get_leaf_record()->generate_pdf_form();
  }
}
