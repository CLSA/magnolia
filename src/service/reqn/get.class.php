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
    return array( 'application/octet-stream', 'application/pdf' );
  }

  /**
   * Replace parent method
   * 
   * When the client calls for a file we return the reqn's ethics letter
   */
  protected function get_downloadable_public_name()
  {
    $file = $this->get_argument( 'file', NULL );
    $db_reqn = $this->get_leaf_record();
    if( 'ethics_filename' == $file ) return $db_reqn->ethics_filename;
    else if( 'agreement_filename' == $file ) return $db_reqn->agreement_filename;
    else if( 'checklist' == $file ) return sprintf( 'Data Checklist %s.pdf', $db_reqn->identifier );
    else if( 'application' == $file ) return sprintf( 'Data Application %s.pdf', $db_reqn->identifier );

    throw lib::create( 'exception\argument', 'file', $file, __METHOD__ );
  }

  /**
   * Replace parent method
   * 
   * When the client calls for a file we return the reqn's ethics letter
   */
  protected function get_downloadable_file_path()
  {
    $file = $this->get_argument( 'file', NULL );
    $db_reqn = $this->get_leaf_record();
    if( 'ethics_filename' == $file ) return sprintf( '%s/%s', ETHICS_LETTER_PATH, $db_reqn->id );
    else if( 'agreement_filename' == $file ) return sprintf( '%s/%s', AGREEMENT_LETTER_PATH, $db_reqn->id );
    else if( 'checklist' == $file ) return sprintf( '%s/%s.pdf', DATA_CHECKLIST_PATH, $db_reqn->id );
    else if( 'application' == $file ) return sprintf( '%s/%s.pdf', DATA_APPLICATION_PATH, $db_reqn->id );

    throw lib::create( 'exception\argument', 'file', $file, __METHOD__ );
  }

  /**
   * Extend parent method
   */
  public function prepare()
  {
    parent::prepare();

    // if requesting the reqn's application or checklist PDF file then create it first
    if( 'application/pdf' == $this->get_mime_type() )
    {
      $db_reqn = $this->get_leaf_record();
      $file = $this->get_argument( 'file', NULL );
      if( 'application' == $file || 'checklist' == $file ) $db_reqn->generate_pdf_form( $file );
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
