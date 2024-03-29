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
    return 'data_option_list' == $this->get_argument( 'file' ) ?
      array( 'text/csv' ) :
      array( 'application/octet-stream', 'application/pdf' );
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
    else if( 'indigenous1_filename' == $file ) return $db_reqn_version->indigenous1_filename;
    else if( 'indigenous2_filename' == $file ) return $db_reqn_version->indigenous2_filename;
    else if( 'indigenous3_filename' == $file ) return $db_reqn_version->indigenous3_filename;
    else if( 'indigenous4_filename' == $file ) return $db_reqn_version->indigenous4_filename;
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
    else if( 'data_option_list' == $file )
    {
      return sprintf(
        'Data Options %s version %s%d.csv',
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
    if( 'coapplicant_agreement_filename' == $file )
      return sprintf( '%s/%s', COAPPLICANT_AGREEMENT_PATH, $db_reqn_version->id );
    else if( 'peer_review_filename' == $file )
      return sprintf( '%s/%s', PEER_REVIEW_PATH, $db_reqn_version->id );
    else if( 'funding_filename' == $file )
      return sprintf( '%s/%s', FUNDING_LETTER_PATH, $db_reqn_version->id );
    else if( 'ethics_filename' == $file )
      return sprintf( '%s/%s', ETHICS_LETTER_PATH, $db_reqn_version->id );
    else if( 'data_sharing_filename' == $file )
      return sprintf( '%s/%s', DATA_SHARING_LETTER_PATH, $db_reqn_version->id );
    else if( 'indigenous1_filename' == $file )
      return sprintf( '%s/%s_1', INDIGENOUS_FILE_PATH, $db_reqn_version->id );
    else if( 'indigenous2_filename' == $file )
      return sprintf( '%s/%s_2', INDIGENOUS_FILE_PATH, $db_reqn_version->id );
    else if( 'indigenous3_filename' == $file )
      return sprintf( '%s/%s_3', INDIGENOUS_FILE_PATH, $db_reqn_version->id );
    else if( 'indigenous4_filename' == $file )
      return sprintf( '%s/%s_4', INDIGENOUS_FILE_PATH, $db_reqn_version->id );
    else if( 'agreement_filename' == $file )
      return sprintf( '%s/%s', AGREEMENT_LETTER_PATH, $db_reqn_version->id );
    else 
    {
      $temp_file_list = [
        'coapplicant_agreement_template',
        'checklist',
        'application',
        'application_and_checklist',
        'data_option_list'
      ];
      if( in_array( $file, $temp_file_list ) )
      {
        return sprintf(
          '%s/%s_%d.%s',
          TEMP_PATH,
          $file,
          $db_reqn_version->id,
          'data_option_list' == $file ? 'csv' : 'pdf'
        );
      }
    }

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
    if( in_array( $file, ['application', 'checklist', 'application_and_checklist'] ) )
      $db_reqn_version->generate_pdf_forms();
    else if( 'data_option_list' == $file ) $db_reqn_version->generate_data_option_list_csv();
    else if( 'coapplicant_agreement_template' == $file )
      $db_reqn_version->generate_coapplicant_agreement_template_form();
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

  /**
   * Extend parent method
   */
  public function finish()
  {
    parent::finish();

    // clean up by deleting temporary files
    $db_reqn_version = $this->get_leaf_record();
    $file = $this->get_argument( 'file', NULL );
    if( in_array( $file, ['application', 'checklist', 'application_and_checklist'] ) )
    {
      // these three files are generated together
      $filename = sprintf( '%s/checklist_%s.pdf', TEMP_PATH, $db_reqn_version->id );
      if( file_exists( $filename ) ) unlink( $filename );

      $filename = sprintf( '%s/application_%s.pdf', TEMP_PATH, $db_reqn_version->id );
      if( file_exists( $filename ) ) unlink( $filename );

      $filename = sprintf( '%s/application_and_checklist_%s.pdf', TEMP_PATH, $db_reqn_version->id );
      if( file_exists( $filename ) ) unlink( $filename );
    }
    else if( 'coapplicant_agreement_template' == $file )
    {
      $filename = sprintf( '%s/coapplicant_agreement_template_%s.pdf', TEMP_PATH, $db_reqn_version->id );
      if( file_exists( $filename ) ) unlink( $filename );
    }
    else if( 'data_option_list' == $file )
    {
      $filename = sprintf( '%s/data_option_list_%s.csv', TEMP_PATH, $db_reqn_version->id );
      if( file_exists( $filename ) ) unlink( $filename );
    }
  }
}
