<?php
/**
 * get.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\service\manuscript_version;
use cenozo\lib, cenozo\log, magnolia\util;

class get extends \cenozo\service\downloadable
{
  /**
   * Replace parent method
   * 
   * Letters use octet-stream
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
    $file = $this->get_argument( 'file', NULL );
    $db_manuscript_version = $this->get_leaf_record();
    $db_manuscript = $db_manuscript_version->get_manuscript();
    return sprintf(
      'Manuscript Submission %s (%s) version %d.pdf',
      $db_manuscript->get_reqn()->identifier,
      $db_manuscript->title,
      $db_manuscript_version->version
    );
  }

  /**
   * Replace parent method
   */
  protected function get_downloadable_file_path()
  {
    return sprintf( '%s/manuscript_%d.pdf', TEMP_PATH, $db_manuscript_version->id );
  }

  /**
   * Extend parent method
   */
  public function prepare()
  {
    parent::prepare();

    // if requestiong the manuscript report as a PDF file then create it first
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
      $filename = $this->get_downloadable_file_path();
      if( file_exists( $filename ) ) unlink( $filename );
    }
  }
}
