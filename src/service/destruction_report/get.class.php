<?php
/**
 * get.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\service\destruction_report;
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
    return sprintf( 'Destruction Report %s.pdf', $this->get_leaf_record()->get_reqn()->identifier );
  }

  /**
   * Replace parent method
   * 
   * When the client calls for a file we return the destruction_report's letter
   */
  protected function get_downloadable_file_path()
  {
    return sprintf( '%s/destruction_report_%s.pdf', TEMP_PATH, $this->get_leaf_record()->id );
  }

  /**
   * Extend parent method
   */
  public function prepare()
  {
    parent::prepare();

    // if requesting the destruction_report as a PDF file then create it first
    if( 'application/pdf' == $this->get_mime_type() ) $this->get_leaf_record()->generate_pdf_form();
  }

  /**
   * Extend parent method
   */
  public function finish()
  {
    parent::finish();

    // clean up by deleting temporary files
    if( 'application/pdf' == $this->get_mime_type() )
    {
      $db_destruction_report = $this->get_leaf_record();
      $filename = $this->get_downloadable_file_path();
      if( file_exists( $filename ) ) unlink( $filename );
    }
  }
}
