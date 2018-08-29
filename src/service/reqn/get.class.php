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
    return array( 'application/octet-stream', 'application/pdf' );
  }

  /**
   * Replace parent method
   * 
   * When the client calls for a file we return the reqn's ethics letter
   */
  protected function get_downloadable_public_name()
  {
    $db_reqn = $this->get_leaf_record();
    return $this->get_argument( 'letter', false ) ?
      $db_reqn->ethics_filename :
      sprintf( '%s.pdf', $db_reqn->identifier ); 
  }

  /**
   * Replace parent method
   * 
   * When the client calls for a file we return the reqn's ethics letter
   */
  protected function get_downloadable_file_path()
  {
    $db_reqn = $this->get_leaf_record();
    return $this->get_argument( 'letter', false ) ?
      sprintf( '%s/%s', ETHICS_LETTER_PATH, $db_reqn->id ) :
      sprintf( '%s/%s.pdf', REQN_PATH, $db_reqn->id );
  }

  /**
   * Extend parent method
   */
  public function prepare()
  {
    parent::prepare();

    // if requesting the reqn as a PDF file then create it first
    if( 'application/pdf' == $this->get_mime_type() && !$this->get_argument( 'letter', false ) )
    {
      $db_reqn = $this->get_leaf_record();
      $db_reqn->generate_pdf_form();
    }
  }

  /**
   * Extend parent method
   */
  public function execute()
  {
    if( $this->get_argument( 'letter', false ) && 'application/json' == $this->get_mime_type() )
    {
      $db_reqn = $this->get_leaf_record();
      if( !is_null( $db_reqn ) && file_exists( $this->get_downloadable_file_path() ) )
        $this->set_data( stat( $this->get_downloadable_file_path() )['size'] );
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
