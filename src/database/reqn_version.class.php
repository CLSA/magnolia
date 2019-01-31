<?php
/**
 * reqn.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\database;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * reqn: record
 */
class reqn_version extends \cenozo\database\record
{
  /**
   * Override the parent method
   */
  public function save()
  {
    parent::save();

    // delete files if they are being set to null
    if( is_null( $this->funding_filename ) )
    {
      $filename = $this->get_filename( 'funding' );
      if( file_exists( $filename ) ) unlink( $filename );
    }
    if( is_null( $this->ethics_filename ) )
    {
      $filename = $this->get_filename( 'ethics' );
      if( file_exists( $filename ) ) unlink( $filename );
    }
  }

  /**
   * Override the parent method
   */
  public function delete()
  {
    $file_list = array();
    if( !is_null( $this->funding_filename ) ) $file_list[] = $this->get_filename( 'funding' );
    if( !is_null( $this->ethics_filename ) ) $file_list[] = $this->get_filename( 'ethics' );

    parent::delete();

    foreach( $file_list as $file ) unlink( $file );
  }

  /**
   * Determines whether there is any difference between this version and the last
   */
  public function has_changed()
  {
    $coapplicant_class_name = lib::get_class_name( 'database\coapplicant' );
    $reference_class_name = lib::get_class_name( 'database\reference' );
    $reqn_version_data_option_class_name = lib::get_class_name( 'database\reqn_version_data_option' );

    // get the version before this one
    $db_last_reqn_version = static::get_unique_record(
      array( 'reqn_id', 'version' ),
      array( $this->reqn_id, $this->version - 1 )
    );

    // if there was no last version then this is the first (and so yes, there are changes)
    if( is_null( $db_last_reqn_version ) ) return true;

    // check all column values except for id, version, datetime and timestamps
    $ignore_columns = array( 'id', 'version', 'datetime', 'update_timestamp', 'create_timestamp' );
    foreach( $this->get_column_names() as $column )
      if( !in_array( $column, $ignore_columns ) && $this->$column != $db_last_reqn_version->$column )
        return true;

    // now check coapplicant records
    foreach( $this->get_coapplicant_object_list() as $db_coapplicant )
    {
      $db_last_coapplicant = $coapplicant_class_name::get_unique_record(
        array( 'reqn_version_id', 'name' ),
        array( $db_last_reqn_version->id, $db_coapplicant->name )
      );
      if( is_null( $db_last_coapplicant ) ) return true;

      // check all column values except for id, reqn_version_id and timestamps
      $ignore_columns = array( 'id', 'reqn_version_id', 'update_timestamp', 'create_timestamp' );
      foreach( $db_coapplicant->get_column_names() as $column )
        if( !in_array( $column, $ignore_columns ) && $db_coapplicant->$column != $db_last_coapplicant->$column )
          return true;
    }

    // now check reference records
    foreach( $this->get_reference_object_list() as $db_reference )
    {
      $db_last_reference = $reference_class_name::get_unique_record(
        array( 'reqn_version_id', 'rank' ),
        array( $db_last_reqn_version->id, $db_reference->rank )
      );
      if( is_null( $db_last_reference ) ) return true;

      // check all column values except for id, reqn_version_id and timestamps
      $ignore_columns = array( 'id', 'reqn_version_id', 'update_timestamp', 'create_timestamp' );
      foreach( $db_reference->get_column_names() as $column )
        if( !in_array( $column, $ignore_columns ) && $db_reference->$column != $db_last_reference->$column )
          return true;
    }

    // now check reqn_version_data_option records
    foreach( $this->get_reqn_version_data_option_object_list() as $db_rvdo )
    {
      $db_last_rvdo = $reqn_version_data_option_class_name::get_unique_record(
        array( 'reqn_version_id', 'data_option_id', 'study_phase_id' ),
        array( $db_last_reqn_version->id, $db_rvdo->data_option_id, $db_rvdo->study_phase_id )
      );
      if( is_null( $db_last_rvdo ) ) return true;

      // check all column values except for id, reqn_version_id and timestamps
      $ignore_columns = array( 'id', 'reqn_version_id', 'update_timestamp', 'create_timestamp' );
      foreach( $db_rvdo->get_column_names() as $column )
        if( !in_array( $column, $ignore_columns ) && $db_rvdo->$column != $db_last_rvdo->$column )
          return true;
    }

    // if we get here then everything is identical
    return false;
  }

  /**
   * Returns the path to various files associated with the reqn
   * 
   * @param string $type Should be 'funding' or 'ethics'
   * @return string
   * @access public
   */
  public function get_filename( $type )
  {
    $directory = '';
    if( 'funding' == $type ) $directory = FUNDING_LETTER_PATH;
    else if( 'ethics' == $type ) $directory = ETHICS_LETTER_PATH;
    else throw lib::create( 'exception\argument', 'type', $type, __METHOD__ );
    return sprintf( '%s/%s', $directory, $this->id );
  }

  /**
   * Override parent method
   */
  public static function get_record_from_identifier( $identifier )
  {
    $util_class_name = lib::get_class_name( 'util' );
    $reqn_class_name = lib::get_class_name( 'database\reqn' ); 

    // convert reqn identifier to reqn_version_id (always using the current version)
    if( !$util_class_name::string_matches_int( $identifier ) && false === strpos( 'identifier=', $identifier ) )
    {
      $regex = '/identifier=(.+)/';
      $matches = array();
      if( preg_match( $regex, $identifier, $matches ) )
      {
        $db_reqn = $reqn_class_name::get_unique_record( 'identifier', $matches[1] );
        if( !is_null( $db_reqn ) ) $identifier = preg_replace( $regex, $db_reqn->get_current_reqn_version()->id, $identifier );
      }
    }

    return parent::get_record_from_identifier( $identifier );
  }

  /**
   * Generates a PDF form version of the reqn (overwritting the previous version)
   * 
   * @param string $type One of "application" or "checklist" which determines which form to generate
   * @access public
   */
  public function generate_pdf_form( $type )
  {
    $pdf_form_type_class_name = lib::get_class_name( 'database\pdf_form_type' );
    $db_reqn = $this->get_reqn();
    $db_user = $db_reqn->get_user();
    $db_graduate_user = $db_reqn->get_graduate_user();

    $db_pdf_form = NULL;
    $data = array( 'identifier' => $db_reqn->identifier );
    $filename = NULL;

    $data['applicant_name'] = sprintf( '%s %s', $db_user->first_name, $db_user->last_name );
    if( !is_null( $this->title ) ) $data['title'] = $this->title;

    if( 'application' == $type )
    {
      // get the data application and filename
      $db_pdf_form_type = $pdf_form_type_class_name::get_unique_record( 'name', 'Data Application' );
      $db_pdf_form = $db_pdf_form_type->get_active_pdf_form();
      $filename = sprintf( '%s/%s.pdf', DATA_APPLICATION_PATH, $this->id );

      if( !is_null( $this->applicant_position ) ) $data['applicant_position'] = $this->applicant_position;
      if( !is_null( $this->applicant_affiliation ) ) $data['applicant_affiliation'] = $this->applicant_affiliation;
      if( !is_null( $this->applicant_address ) ) $data['applicant_address'] = $this->applicant_address;
      if( !is_null( $this->applicant_phone ) ) $data['applicant_phone'] = $this->applicant_phone;
      $data['applicant_email'] = $db_user->email;
      if( !is_null( $db_graduate_user ) )
        $data['graduate_name'] = sprintf( '%s %s', $db_graduate_user->first_name, $db_graduate_user->last_name );
      if( !is_null( $this->graduate_program ) ) $data['graduate_program'] = $this->graduate_program;
      if( !is_null( $this->graduate_institution ) ) $data['graduate_institution'] = $this->graduate_institution;
      if( !is_null( $this->graduate_address ) ) $data['graduate_address'] = $this->graduate_address;
      if( !is_null( $this->graduate_phone ) ) $data['graduate_phone'] = $this->graduate_phone;
      if( !is_null( $db_graduate_user ) ) $data['graduate_email'] = $db_graduate_user->email;
      if( !is_null( $this->start_date ) ) $data['start_date'] = $this->start_date->format( 'Y-m-d' );
      if( !is_null( $this->duration ) ) $data['duration'] = $this->duration;
      if( !is_null( $this->keywords ) ) $data['keywords'] = $this->keywords;
      if( !is_null( $this->lay_summary ) ) $data['lay_summary'] = $this->lay_summary;
      $data['word_count'] = is_null( $this->lay_summary ) ? 0 : count( explode( ' ', $this->lay_summary ) );
      if( !is_null( $this->background ) ) $data['background'] = $this->background;
      if( !is_null( $this->objectives ) ) $data['objectives'] = $this->objectives;
      if( !is_null( $this->methodology ) ) $data['methodology'] = $this->methodology;
      if( !is_null( $this->analysis ) ) $data['analysis'] = $this->analysis;

      if( !is_null( $this->funding ) )
      {
        if( 'yes' == $this->funding ) $data['funding_yes'] = 'Yes';
        else if( 'no' == $this->funding ) $data['funding_no'] = 'Yes';
        else if( 'requested' == $this->funding ) $data['funding_requested'] = 'Yes';
      }
      if( !is_null( $this->funding_agency ) ) $data['funding_agency'] = $this->funding_agency;
      if( !is_null( $this->grant_number ) ) $data['grant_number'] = $this->grant_number;
      if( !is_null( $this->ethics ) ) $data['ethics'] = $this->ethics ? 'yes' : 'no';
      if( !is_null( $this->ethics_date ) ) $data['ethics_date'] = $this->ethics_date->format( 'Y-m-d' );
      if( !is_null( $this->waiver ) )
      {
        if( 'graduate' == $this->waiver ) $data['waiver_graduate'] = 'Yes';
        else if( 'postdoc' == $this->waiver ) $data['waiver_postdoc'] = 'Yes';
      }
      $data['signature_applicant_name'] = $data['applicant_name'];

      foreach( $this->get_coapplicant_list() as $index => $coapplicant )
      {
        $data[sprintf( 'coapplicant%d_name', $index+1 )] = $coapplicant['name'];
        $data[sprintf( 'coapplicant%d_position', $index+1 )] =
          sprintf( "%s\n%s\n%s", $coapplicant['position'], $coapplicant['affiliation'], $coapplicant['email'] );
        $data[sprintf( 'coapplicant%d_role', $index+1 )] = $coapplicant['role'];
        $data[sprintf( 'coapplicant%d_%s', $index+1, $coapplicant['access'] ? 'yes' : 'no' )] = 'Yes';
      }

      $reference_list = array();
      $reference_sel = lib::create( 'database\select' );
      $reference_sel->add_column( 'rank' );
      $reference_sel->add_column( 'reference' );
      $reference_mod = lib::create( 'database\modifier' );
      $reference_mod->order( 'rank' );
      foreach( $this->get_reference_list( $reference_sel, $reference_mod ) as $reference )
        $reference_list[] = sprintf( '%s.  %s', $reference['rank'], $reference['reference'] );
      $data['references'] = implode( "\n", $reference_list );
    }
    else if( 'checklist' == $type )
    {
      // get the data application and filename
      $db_pdf_form_type = $pdf_form_type_class_name::get_unique_record( 'name', 'Data Checklist' );
      $db_pdf_form = $db_pdf_form_type->get_active_pdf_form();
      $filename = sprintf( '%s/%s.pdf', DATA_CHECKLIST_PATH, $this->id );

      if( $this->comprehensive ) $data['comprehensive'] = 'Yes';
      if( $this->tracking ) $data['tracking'] = 'Yes';
      if( !is_null( $this->part2_a_comment ) ) $data['part2_a_comment'] = $this->part2_a_comment;
      if( !is_null( $this->part2_b_comment ) ) $data['part2_b_comment'] = $this->part2_b_comment;
      if( !is_null( $this->part2_c_comment ) ) $data['part2_c_comment'] = $this->part2_c_comment;
      if( !is_null( $this->part2_d_comment ) ) $data['part2_d_comment'] = $this->part2_d_comment;
      if( !is_null( $this->part2_e_comment ) ) $data['part2_e_comment'] = $this->part2_e_comment;
      if( !is_null( $this->part2_f_comment ) ) $data['part2_f_comment'] = $this->part2_f_comment;

      $reqn_version_data_option_list = array();
      $reqn_version_data_option_sel = lib::create( 'database\select' );
      $reqn_version_data_option_sel->add_column( 'data_option_id' );
      $reqn_version_data_option_sel->add_table_column( 'study_phase', 'code' );
      $reqn_version_data_option_mod = lib::create( 'database\modifier' );
      $reqn_version_data_option_mod->join( 'study_phase', 'reqn_version_data_option.study_phase_id', 'study_phase.id' );
      $list = $this->get_reqn_version_data_option_list( $reqn_version_data_option_sel, $reqn_version_data_option_mod );
      foreach( $list as $reqn_version_data_option )
        $data[sprintf( 'data_option_%s_%s', $reqn_version_data_option['data_option_id'], $reqn_version_data_option['code'] )] = 'Yes';
    }

    if( is_null( $db_pdf_form ) )
      throw lib::create( 'exception\runtime',
        'Cannot generate PDF form since there is no active Data Application PDF form.', __METHOD__ );

    $pdf_writer = lib::create( 'business\pdf_writer' );
    $pdf_writer->set_template( sprintf( '%s/%d.pdf', PDF_FORM_PATH, $db_pdf_form->id ) );
    $pdf_writer->fill_form( $data );
    if( !$pdf_writer->save( $filename ) )
    {
      throw lib::create( 'exception\runtime',
        sprintf(
          'Failed to generate PDF form "%s" for requisition %s%s',
          $filename,
          $db_reqn->identifier,
          "\n".$pdf_writer->get_error()
        ),
        __METHOD__
      );
    }
  }
}
