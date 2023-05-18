<?php
/**
 * get.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\service\reqn;
use cenozo\lib, cenozo\log, magnolia\util;

class get extends \cenozo\service\downloadable
{
  /**
   * Replace parent method
   * 
   * Letters use octet-stream, reqn forms use pdf
   */
  protected function get_downloadable_mime_type_list()
  {
    return array( 'application/octet-stream', 'application/pdf', 'application/zip', 'text/plain' );
  }

  /**
   * Replace parent method
   */
  protected function get_downloadable_public_name()
  {
    $file = $this->get_argument( 'file', NULL );
    $db_reqn = $this->get_leaf_record();
    if( 'agreements' == $file ) return sprintf( 'Agreements %s.zip', $db_reqn->identifier );
    else if( 'instruction_filename' == $file ) return $db_reqn->instruction_filename;
    else if( 'reviews' == $file ) return sprintf( 'Reviews %s.txt', $db_reqn->identifier );

    throw lib::create( 'exception\argument', 'file', $file, __METHOD__ );
  }

  /**
   * Replace parent method
   */
  protected function get_downloadable_file_path()
  {
    $file = $this->get_argument( 'file', NULL );
    $db_reqn = $this->get_leaf_record();
    if( 'agreements' == $file ) return sprintf( '%s/agreements_%d.zip', TEMP_PATH, $db_reqn->id );
    else if( 'instruction_filename' == $file ) return $db_reqn->get_filename( 'instruction' );
    else if( 'reviews' == $file ) return sprintf( '%s/reviews_%d.txt', TEMP_PATH, $db_reqn->id );

    throw lib::create( 'exception\argument', 'file', $file, __METHOD__ );
  }

  /**
   * Extend parent method
   */
  public function prepare()
  {
    parent::prepare();

    $mime_type = $this->get_mime_type();

    // if requesting the reqn's review list TXT file then create it first
    if( 'application/zip' == $mime_type )
    {
      $db_reqn = $this->get_leaf_record();
      $file = $this->get_argument( 'file', NULL );
      if( 'agreements' == $file ) $db_reqn->generate_agreements_file();
    }
    else if( 'text/plain' == $mime_type )
    {
      $db_reqn = $this->get_leaf_record();
      $file = $this->get_argument( 'file', NULL );
      if( 'reviews' == $file ) $db_reqn->generate_reviews_file();
    }
  }

  /**
   * Extend parent method
   */
  public function execute()
  {
    if( 'application/json' == $this->get_mime_type() && $this->get_argument( 'file', false ) )
    {
      $db_reqn = $this->get_leaf_record();
      $path = $this->get_downloadable_file_path();
      if( !is_null( $db_reqn ) && file_exists( $path ) ) $this->set_data( stat( $path )['size'] );
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
    $db_reqn = $this->get_leaf_record();
    $file = $this->get_argument( 'file', NULL );
    if( 'agreements' == $file )
    {
      $filename = sprintf( '%s/agreements_%d.zip', TEMP_PATH, $db_reqn->id );
      if( file_exists( $filename ) ) unlink( $filename );
    }
    else if( 'reviews' == $file )
    {
      $filename = sprintf( '%s/reviews_%d.txt', TEMP_PATH, $db_reqn->id );
      if( file_exists( $filename ) ) unlink( $filename );
    }
  }
}
