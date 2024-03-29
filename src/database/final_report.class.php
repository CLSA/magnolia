<?php
/**
 * final_report.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\database;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * final_report: record
 */
class final_report extends \cenozo\database\record
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
    // when selecting outputs get the records from the parent reqn
    return 'output' == $record_type ?
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

    // get the data application
    $db_pdf_form_type = $pdf_form_type_class_name::get_unique_record( 'name', 'Final Report' );
    $db_pdf_form = $db_pdf_form_type->get_active_pdf_form();
    if( is_null( $db_pdf_form ) )
      throw lib::create( 'exception\runtime',
        'Cannot generate PDF form since there is no active Final Report PDF form.', __METHOD__ );

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
    $data['applicant_email'] = $db_user->email;
    if( !is_null( $db_reqn_version->title ) ) $data['title'] = $db_reqn_version->title;
    if( !is_null( $db_reqn_version->lay_summary ) ) $data['lay_summary'] = $db_reqn_version->lay_summary;
    if( true === $this->achieved_objectives ) $data['achieved_objectives_yes'] = 'Yes';
    if( false === $this->achieved_objectives ) $data['achieved_objectives_no'] = 'Yes';
    if( !is_null( $this->findings ) ) $data['findings'] = $this->findings;
    if( !is_null( $db_trainee_user ) ) $data['graduate_name'] =
      sprintf( '%s %s', $db_trainee_user->first_name, $db_trainee_user->last_name );
    if( !is_null( $this->thesis_title ) ) $data['thesis_title'] = $this->thesis_title;
    if( !is_null( $this->thesis_status ) ) $data['thesis_status'] = $this->thesis_status;
    if( !is_null( $this->impact ) ) $data['impact'] = $this->impact;
    if( !is_null( $this->opportunities ) ) $data['opportunities'] = $this->opportunities;
    if( !is_null( $this->dissemination ) ) $data['dissemination'] = $this->dissemination;
    $data['signature_name'] = $data['applicant_name'];
    $data['signature_date'] = util::get_datetime_object()->format( 'd-m-Y' );

    $output_sel = lib::create( 'database\select' );
    $output_sel->add_column( 'output_type_id' );
    $output_sel->add_table_column( 'output_type', 'name_en' );
    $output_sel->add_column( 'detail' );
    $output_mod = lib::create( 'database\modifier' );
    $output_mod->join( 'output_type', 'output.output_type_id', 'output_type.id' );
    $output_mod->order( 'output.output_type_id' );
    $output_mod->order( 'output.id' );

    // the form supports a limited number of output for each type
    $output_type_list = array(
      'Collaboration' => 'collaboration',
      'Conference paper and presentation' => 'conference',
      'Derived Data' => 'derived_data',
      'Invention, patent application, or license' => 'invention',
      'Mass media' => 'mass_media',
      'Peer-reviewed publication' => 'publication',
      'Website, technology, equipment or technique' => 'website'
    );

    $last_output_type_id = NULL;
    $count = NULL;
    foreach( $this->get_output_list( $output_sel, $output_mod ) as $output )
    {
      $count = $last_output_type_id == $output['output_type_id'] ? $count+1 : 1;
      $data[sprintf( '%s_%d', $output_type_list[$output['name_en']], $count )] = $output['detail'];
      $last_output_type_id = $output['output_type_id'];
    }

    $filename = sprintf( '%s/final_report_%s.pdf', TEMP_PATH, $this->id );
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

  /**
   * Determines whether there is any difference between this version and the last
   */
  public function has_changed()
  {
    $output_class_name = lib::get_class_name( 'database\output' );

    // get the two newest versions
    $version_mod = lib::create( 'database\modifier' );
    $version_mod->where( 'reqn_id', '=', $this->reqn_id );
    $version_mod->order( 'version', true );
    $version_mod->limit( 2 );
    $final_report_list = static::select_objects( $version_mod );
    if( 2 != count( $final_report_list ) ) return true;

    $db_last_final_report = $final_report_list[1];

    // check all column values except for id, version, datetime and timestamps
    $ignore_columns = array( 'id', 'version', 'update_timestamp', 'create_timestamp' );
    foreach( $this->get_column_names() as $column )
      if( !in_array( $column, $ignore_columns ) && $this->$column != $db_last_final_report->$column )
        return true;

    // now check output records
    foreach( $this->get_output_object_list() as $db_output )
    {
      $db_last_output = $output_class_name::get_unique_record(
        array( 'final_report_id', 'detail' ),
        array( $db_last_final_report->id, $db_output->detail )
      );
      if( is_null( $db_last_output ) ) return true;

      // check all column values except for id, final_report_id and timestamps
      $ignore_columns = array( 'id', 'final_report_id', 'update_timestamp', 'create_timestamp' );
      foreach( $db_output->get_column_names() as $column )
        if( !in_array( $column, $ignore_columns ) && $db_output->$column != $db_last_output->$column )
          return true;
    }

    // if we get here then everything is identical
    return false;
  }
}
