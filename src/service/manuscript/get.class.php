<?php
/**
 * get.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\service\manuscript;
use cenozo\lib, cenozo\log, magnolia\util;

class get extends \cenozo\service\downloadable
{
  /**
   * Replace parent method
   * 
   * Letters use octet-stream, manuscript forms use pdf
   */
  protected function get_downloadable_mime_type_list()
  {
    return array( 'text/plain' );
  }

  /**
   * Replace parent method
   */
  protected function get_downloadable_public_name()
  {
    $file = $this->get_argument( 'file', NULL );
    $db_manuscript = $this->get_leaf_record();
    if( 'reviews' == $file ) return sprintf( 'Reviews for %s.txt', $db_manuscript->title );
  }

  /**
   * Replace parent method
   */
  protected function get_downloadable_file_path()
  {
    $file = $this->get_argument( 'file', NULL );
    $db_manuscript = $this->get_leaf_record();
    if( 'reviews' == $file ) return sprintf( '%s/manuscript_reviews_%d.txt', TEMP_PATH, $db_manuscript->id );

    throw lib::create( 'exception\argument', 'file', $file, __METHOD__ );
  }

  /**
   * Extend parent method
   */
  public function prepare()
  {
    parent::prepare();

    $mime_type = $this->get_mime_type();

    if( 'text/plain' == $mime_type )
    {
      $db_manuscript = $this->get_leaf_record();
      $file = $this->get_argument( 'file', NULL );
      if( 'reviews' == $file ) $db_manuscript->generate_reviews_file();
    }
  }

  /**
   * Extend parent method
   */
  public function execute()
  {
    if( 'application/json' == $this->get_mime_type() && $this->get_argument( 'file', false ) )
    {
      $db_manuscript = $this->get_leaf_record();
      $path = $this->get_downloadable_file_path();
      if( !is_null( $db_manuscript ) && file_exists( $path ) ) $this->set_data( stat( $path )['size'] );
    }
    else parent::execute();
  }

  /**
   * Extend parent method
   */
  public function finish()
  {
    parent::finish();

    // clean up by deleting temporary files
    $db_manuscript = $this->get_leaf_record();
    $file = $this->get_argument( 'file', NULL );
    if( 'reviews' == $file )
    {
      $filename = sprintf( '%s/manuscript_reviews_%d.txt', TEMP_PATH, $db_manuscript->id );
      if( file_exists( $filename ) ) unlink( $filename );
    }
  }
}
