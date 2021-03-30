<?php
/**
 * get.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\service\reqn_version;
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
    return array( 'application/octet-stream', 'application/pdf' );
  }

  /**
   * Replace parent method
   */
  protected function get_downloadable_public_name()
  {
    $file = $this->get_argument( 'file', NULL );
    $db_reqn_version = $this->get_leaf_record();
    $db_reqn = $db_reqn_version->get_reqn();
    if( 'coapplicant_agreement_filename' == $file ) return $db_reqn_version->coapplicant_agreement_filename;
    else if( 'peer_review_filename' == $file ) return $db_reqn_version->peer_review_filename;
    else if( 'funding_filename' == $file ) return $db_reqn_version->funding_filename;
    else if( 'ethics_filename' == $file ) return $db_reqn_version->ethics_filename;
    else if( 'data_sharing_filename' == $file ) return $db_reqn_version->data_sharing_filename;
    else if( 'agreement_filename' == $file ) return $db_reqn_version->agreement_filename;
    else if( 'coapplicant_agreement_template' == $file )
    {
      return sprintf(
        'Co-Applicant Agreement %s version %s%d.pdf',
        $db_reqn->identifier,
        '.' == $db_reqn_version->amendment ? '' : $db_reqn_version->amendment,
        $db_reqn_version->version
      );
    }
    else if( 'checklist' == $file )
    {
      return sprintf(
        'Data Checklist %s version %s%d.pdf',
        $db_reqn->identifier,
        '.' == $db_reqn_version->amendment ? '' : $db_reqn_version->amendment,
        $db_reqn_version->version
      );
    }
    else if( 'application' == $file )
    {
      return sprintf(
        'Data Application %s version %s%d.pdf',
        $db_reqn->identifier,
        '.' == $db_reqn_version->amendment ? '' : $db_reqn_version->amendment,
        $db_reqn_version->version
      );
    }
    else if( 'application_and_checklist' == $file )
    {
      return sprintf(
        'Data Application and Checklist %s version %s%d.pdf',
        $db_reqn->identifier,
        '.' == $db_reqn_version->amendment ? '' : $db_reqn_version->amendment,
        $db_reqn_version->version
      );
    }

    throw lib::create( 'exception\argument', 'file', $file, __METHOD__ );
  }

  /**
   * Replace parent method
   */
  protected function get_downloadable_file_path()
  {
    $file = $this->get_argument( 'file', NULL );
    $db_reqn_version = $this->get_leaf_record();
    if( 'coapplicant_agreement_filename' == $file ) return sprintf( '%s/%s', COAPPLICANT_AGREEMENT_PATH, $db_reqn_version->id );
    else if( 'peer_review_filename' == $file ) return sprintf( '%s/%s', PEER_REVIEW_PATH, $db_reqn_version->id );
    else if( 'funding_filename' == $file ) return sprintf( '%s/%s', FUNDING_LETTER_PATH, $db_reqn_version->id );
    else if( 'ethics_filename' == $file ) return sprintf( '%s/%s', ETHICS_LETTER_PATH, $db_reqn_version->id );
    else if( 'data_sharing_filename' == $file ) return sprintf( '%s/%s', DATA_SHARING_LETTER_PATH, $db_reqn_version->id );
    else if( 'agreement_filename' == $file ) return sprintf( '%s/%s', AGREEMENT_LETTER_PATH, $db_reqn_version->id );
    else if( 'coapplicant_agreement_template' == $file )
      return sprintf( '%s/%s.pdf', COAPPLICANT_AGREEMENT_TEMPLATE_PATH, $db_reqn_version->id );
    else if( 'checklist' == $file ) return sprintf( '%s/%s.pdf', DATA_CHECKLIST_PATH, $db_reqn_version->id );
    else if( 'application' == $file ) return sprintf( '%s/%s.pdf', DATA_APPLICATION_PATH, $db_reqn_version->id );
    else if( 'application_and_checklist' == $file )
      return sprintf( '%s/%s.pdf', DATA_APPLICATION_AND_CHECKLIST_PATH, $db_reqn_version->id );

    throw lib::create( 'exception\argument', 'file', $file, __METHOD__ );
  }

  /**
   * Extend parent method
   */
  public function prepare()
  {
    parent::prepare();

    $mime_type = $this->get_mime_type();

    // if requesting the reqn_version's application, checklist, or coapplicant agreement PDF file then create it first
    $db_reqn_version = $this->get_leaf_record();
    $file = $this->get_argument( 'file', NULL );
    if( in_array( $file, ['application', 'checklist', 'application_and_checklist'] ) ) $db_reqn_version->generate_pdf_forms();
    else if( 'coapplicant_agreement_template' == $file ) $db_reqn_version->generate_coapplicant_agreement_template_form();
  }

  /**
   * Extend parent method
   */
  public function execute()
  {
    if( 'application/json' == $this->get_mime_type() && $this->get_argument( 'file', false ) )
    {
      $db_reqn_version = $this->get_leaf_record();
      $path = $this->get_downloadable_file_path();
      if( !is_null( $db_reqn_version ) && file_exists( $path ) ) $this->set_data( stat( $path )['size'] );
    }
    else
    {
      parent::execute();
    }
  }
}
