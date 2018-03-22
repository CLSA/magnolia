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
   * When the client calls for a file we return the reqn's ethics letter
   */
  protected function get_downloadable_mime_type_list()
  {
    return array( 'application/octet-stream' );
  }

  /**
   * Replace parent method
   * 
   * When the client calls for a file we return the reqn's ethics letter
   */
  protected function get_downloadable_public_name()
  {
    return $this->get_leaf_record()->ethics_filename;
  }

  /**
   * Replace parent method
   * 
   * When the client calls for a file we return the reqn's ethics letter
   */
  protected function get_downloadable_file_path()
  {
    return sprintf( '%s/%s', ETHICS_LETTER_PATH, $this->get_leaf_record()->id );
  }

  /**
   * Extend parent method
   */
  public function execute()
  {
    if( $this->get_argument( 'letter', false ) )
    {
      $data = NULL;
      $db_reqn = $this->get_leaf_record();
      if( !is_null( $db_reqn ) && file_exists( $this->get_downloadable_file_path() ) )
        $this->set_data( stat( $this->get_downloadable_file_path() )['size'] );
    }
    else
    {
      parent::execute();
    }
  }
}
