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
    return array( 'application/octet-stream', 'application/pdf', 'text/plain' );
  }

  /**
   * Replace parent method
   */
  protected function get_downloadable_public_name()
  {
    $file = $this->get_argument( 'file', NULL );
    $db_reqn = $this->get_leaf_record();
    if( 'agreement_filename' == $file ) return $db_reqn->agreement_filename;
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
    if( 'agreement_filename' == $file ) return sprintf( '%s/%s', AGREEMENT_LETTER_PATH, $db_reqn->id );
    else if( 'instruction_filename' == $file ) return sprintf( '%s/%s', INSTRUCTION_FILE_PATH, $db_reqn->id );
    else if( 'reviews' == $file ) return sprintf( '%s/%s.txt', DATA_REVIEWS_PATH, $db_reqn->id );

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
    if( 'text/plain' == $mime_type )
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
    else
    {
      parent::execute();

      if( !$this->get_argument( 'download', false ) )
      {
        // add the next stage type
        $db_reqn = $this->get_leaf_record();
        $db_next_stage_type = $db_reqn->get_next_stage_type();

        $data = $this->data;
        $data['next_stage_type'] = is_null( $db_next_stage_type ) ? NULL : $db_next_stage_type->name;
        $this->set_data( $data );
      }
    }
  }
}
