<?php
/**
 * destruction_report.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\database;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * destruction_report: record
 */
class destruction_report extends \cenozo\database\record
{
  /**
   * Override parent method
   */
  public static function get_record_from_identifier( $identifier )
  {
    $util_class_name = lib::get_class_name( 'util' );
    $reqn_class_name = lib::get_class_name( 'database\reqn' ); 

    // convert reqn identifier to reqn_id
    if( !$util_class_name::string_matches_int( $identifier ) && false === strpos( 'identifier=', $identifier ) )
    {
      $regex = '/identifier=([0-9]+)/';
      $matches = array();
      if( preg_match( $regex, $identifier, $matches ) )
      {
        $db_reqn = $reqn_class_name::get_unique_record( 'identifier', $matches[1] );
        if( !is_null( $db_reqn ) ) $identifier = preg_replace( $regex, sprintf( 'reqn_id=%d', $db_reqn->id ), $identifier );
      }
    }

    return parent::get_record_from_identifier( $identifier );
  }

  /**
   * Override parent method
   */
  public function get_record_list( $record_type, $select = NULL, $modifier = NULL, $return_alternate = '', $distinct = false )
  {
    // when selecting data_destroys get the records from the parent reqn
    return 'data_destroy' == $record_type ?
      $this->get_reqn()->get_record_list( $record_type, $select, $modifier, $return_alternate, $distinct ) :
      parent::get_record_list( $record_type, $select, $modifier, $return_alternate, $distinct );
  }

  /**
   * Generates a PDF form version of the reqn (overwritting the previous version)
   * 
   * @access public
   */
  public function generate_pdf_form()
  {
    $pdf_form_type_class_name = lib::get_class_name( 'database\pdf_form_type' );
    $db_user = $this->get_reqn()->get_user();

    // get the data application
    $db_pdf_form_type = $pdf_form_type_class_name::get_unique_record( 'name', 'Destruction Report' );
    $db_pdf_form = $db_pdf_form_type->get_active_pdf_form();
    if( is_null( $db_pdf_form ) )
      throw lib::create( 'exception\runtime',
        'Cannot generate PDF form since there is no active Destruction Report PDF form.', __METHOD__ );

    $db_reqn = $this->get_reqn();
    $db_user = $db_reqn->get_user();
    $db_trainee_user = $db_reqn->get_trainee_user();
    $db_reqn_version = $db_reqn->get_current_reqn_version();
    $data = array(
      'identifier' => $db_reqn->identifier,
      'version' => $this->version
    );

    $data['applicant_name'] = sprintf( '%s %s', $db_user->first_name, $db_user->last_name );
    if( !is_null( $db_reqn_version->applicant_affiliation ) )
      $data['applicant_affiliation'] = $db_reqn_version->applicant_affiliation;
    if( !is_null( $db_reqn_version->applicant_address ) )
      $data['applicant_address'] = $db_reqn_version->applicant_address;
    if( !is_null( $db_reqn_version->applicant_phone ) )
      $data['applicant_phone'] = $db_reqn_version->applicant_phone;
    if( !is_null( $db_reqn_version->title ) ) $data['title'] = $db_reqn_version->title;

    $data_destroy_mod = lib::create( 'database\modifier' );
    $data_destroy_mod->order( 'name' );

    $last_data_destroy_type_id = NULL;
    foreach( $this->get_data_destroy_object_list( $data_destroy_mod ) as $index => $db_data_destroy )
    {
      $data[sprintf( 'name_%d', $index+1 )] = $db_data_destroy->name;

      $datetime_obj = $db_data_destroy->datetime;
      if( !is_null( $datetime_obj ) )
      {
        $datetime_obj->setTimezone( $db_user->get_timezone_object() );
        $data[sprintf( 'datetime_%d', $index+1 )] = $datetime_obj->format( 'Y-m-d H:i T' );
      }
    }

    $filename = sprintf( '%s/destruction_report_%s.pdf', TEMP_PATH, $this->id );
    $error = $db_pdf_form->fill_and_write_form( $data, $filename );
    if( $error )
    {
      throw lib::create( 'exception\runtime',
        sprintf(
          'Failed to generate PDF form "%s" for requisition %s%s',
          $filename,
          $this->identifier,
          "\n".$error
        ),
        __METHOD__
      );
    }
  }
}
