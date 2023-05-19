<?php
/**
 * get.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\service\data_agreement;
use cenozo\lib, cenozo\log, magnolia\util;

class get extends \cenozo\service\downloadable
{
  /**
   * Replace parent method
   * 
   * When the client calls for a file we return the data_agreement's file
   */
  protected function get_downloadable_mime_type_list()
  {
    return array( 'application/octet-stream' );
  }

  /**
   * Replace parent method
   * 
   * When the client calls for a file we return the data_agreement's file
   */
  protected function get_downloadable_public_name()
  {
    $file = $this->get_argument( 'file', NULL );
    if( 'filename' == $file ) return basename( $this->get_leaf_record()->get_data_filename() );

    throw lib::create( 'exception\argument', 'file', $file, __METHOD__ );
  }

  /**
   * Replace parent method
   * 
   * When the client calls for a file we return the data_agreement's file
   */
  protected function get_downloadable_file_path()
  {
    $file = $this->get_argument( 'file', NULL );
    if( 'filename' == $file )
    {
      $db_data_agreement = $this->get_leaf_record();
      $db_data_agreement->create_data_file();
      return $db_data_agreement->get_data_filename();
    }

    throw lib::create( 'exception\argument', 'file', $file, __METHOD__ );
  }

  /**
   * Extend parent method
   */
  public function execute()
  {
    if( 'application/json' == $this->get_mime_type() && $this->get_argument( 'file', false ) )
    {
      $db_data_agreement = $this->get_leaf_record();
      $path = $this->get_downloadable_file_path();
      if( !is_null( $db_data_agreement ) && file_exists( $path ) ) $this->set_data( stat( $path )['size'] );
    }
    else
    {
      parent::execute();
    }
  }

  /**
   * Extend parent method
   */
  public function finish()
  {
    parent::finish();

    // clean up by deleting temporary files
    $file = $this->get_argument( 'file', NULL );
    if( 'filename' == $file ) $this->get_leaf_record()->delete_data_file();
  }
}
