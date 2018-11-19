<?php
/**
 * get.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\service\supplemental_file;
use cenozo\lib, cenozo\log, magnolia\util;

class get extends \cenozo\service\downloadable
{
  /**
   * Replace parent method
   * 
   * Letters use octet-stream, supplemental_file forms use pdf
   */
  protected function get_downloadable_mime_type_list()
  {
    return array( 'application/octet-stream', 'application/pdf', 'text/plain' );
  }

  /**
   * Replace parent method
   */
  protected function get_downloadable_public_name()
  {
    $file = $this->get_argument( 'file', NULL );
    $db_supplemental_file = $this->get_leaf_record();
    if( 'filename_en' == $file ) return $db_supplemental_file->filename_en;
    else if( 'filename_fr' == $file ) return $db_supplemental_file->filename_fr;

    throw lib::create( 'exception\argument', 'file', $file, __METHOD__ );
  }

  /**
   * Replace parent method
   */
  protected function get_downloadable_file_path()
  {
    $file = $this->get_argument( 'file', NULL );
    $db_supplemental_file = $this->get_leaf_record();
    if( 'filename_en' == $file ) return $db_supplemental_file->get_filename( 'en' );
    else if( 'filename_fr' == $file ) return $db_supplemental_file->get_filename( 'fr' );

    throw lib::create( 'exception\argument', 'file', $file, __METHOD__ );
  }

  /**
   * Extend parent method
   */
  public function execute()
  {
    if( 'application/json' == $this->get_mime_type() && $this->get_argument( 'file', false ) )
    {
      $db_supplemental_file = $this->get_leaf_record();
      $path = $this->get_downloadable_file_path();
      if( !is_null( $db_supplemental_file ) && file_exists( $path ) ) $this->set_data( stat( $path )['size'] );
    }
    else
    {
      parent::execute();
    }
  }
}
